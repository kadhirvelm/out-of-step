/* eslint-disable @typescript-eslint/quotes */
import {
    IAccountId,
    IAcquisitionTransactionWithPrice,
    IDividendHistory,
    IDividendTransaction,
    IDividendTransactionWithDividend,
    IExchangeTransaction,
    IExchangeTransactionWithPrice,
    ILimitOrder,
    IPriceHistory,
    IStockValueAtTransactionTime,
    ITransactionHistory,
    ITransactionHistoryComplete,
    ITransactionService,
} from "@stochastic-exchange/api";
import { Response } from "express";
import _ from "lodash";
import { convertArrayToPostgresIn } from "../utils/convertArrayToPostgresIn";
import { postgresPool } from "../utils/getPostgresPool";

type IViewTransactionsForStock = ITransactionService["viewTransactionsForStock"];

export async function viewTransactionsForStock(
    payload: IViewTransactionsForStock["payload"],
    response: Response<any>,
    accountId: IAccountId | null,
): Promise<IViewTransactionsForStock["response"] | undefined> {
    if (accountId == null) {
        response.status(400).send({ error: "Invalid account authorization, please login again." });
        return undefined;
    }

    const allTransactionHistoryForStock = await postgresPool.query<ITransactionHistory>(
        'SELECT * FROM "transactionHistory" WHERE account = $1 AND stock = $2',
        [accountId, payload.stockId],
    );

    const allLimitOrders = _.compact(
        allTransactionHistoryForStock.rows.map(s => (s as IExchangeTransaction).limitOrder),
    );
    const allPriceHistory = _.compact(
        allTransactionHistoryForStock.rows.map(s => (s as IExchangeTransaction).priceHistory),
    );
    const allDividendHistory = _.compact(
        allTransactionHistoryForStock.rows.map(s => (s as IDividendTransaction).dividendHistory),
    );

    const [limitOrderQuery, priceHistoryQuery, dividendHistoryQuery] = await Promise.all([
        allLimitOrders.length > 0
            ? postgresPool.query<ILimitOrder>(
                  `SELECT * FROM "limitOrder" WHERE id IN ${convertArrayToPostgresIn(allLimitOrders)}`,
              )
            : undefined,
        allPriceHistory.length > 0
            ? postgresPool.query<IPriceHistory>(
                  `SELECT * FROM "priceHistory" WHERE id IN ${convertArrayToPostgresIn(allPriceHistory)}`,
              )
            : undefined,
        allDividendHistory.length > 0
            ? postgresPool.query<IDividendHistory>(
                  `SELECT * FROM "dividendHistory" WHERE id IN ${convertArrayToPostgresIn(allDividendHistory)}`,
              )
            : undefined,
    ]);

    const keyedLimitOrder = _.keyBy(limitOrderQuery?.rows, "id");
    const keyedPriceHistory = _.keyBy(priceHistoryQuery?.rows, "id");
    const keyedDividendHistory = _.keyBy(dividendHistoryQuery?.rows, "id");

    const allCompleteTransactions: ITransactionHistoryComplete[] = _.compact(
        allTransactionHistoryForStock.rows.map(partialTransaction => {
            switch (partialTransaction.type) {
                case "acquisition-transaction":
                    return {
                        ...partialTransaction,
                        priceHistory: keyedPriceHistory[partialTransaction.priceHistory],
                    } as IAcquisitionTransactionWithPrice;
                case "dividend-transaction":
                    return {
                        ...partialTransaction,
                        dividendHistory: keyedDividendHistory[partialTransaction.dividendHistory],
                    } as IDividendTransactionWithDividend;
                case "exchange-transaction":
                    return {
                        ...partialTransaction,
                        limitOrder:
                            partialTransaction.limitOrder === undefined
                                ? undefined
                                : keyedLimitOrder[partialTransaction.limitOrder],
                        priceHistory: keyedPriceHistory[partialTransaction.priceHistory],
                    } as IExchangeTransactionWithPrice;
                default:
                    return undefined;
            }
        }),
    );

    const allCompleteTransactionsSorted = allCompleteTransactions.sort((a, b) =>
        Date.parse(a.timestamp) - Date.parse(b.timestamp) > 0 ? 1 : -1,
    );

    let currentStockValue = 0;
    const allCompleteTransactionsSortedWithStockValue: Array<ITransactionHistoryComplete &
        IStockValueAtTransactionTime> = allCompleteTransactionsSorted.map(transaction => {
        if (transaction.type === "acquisition-transaction") {
            currentStockValue += transaction.acquiredQuantity * transaction.priceHistory.dollarValue;
        }

        if (transaction.type === "dividend-transaction") {
            currentStockValue += transaction.quantity * transaction.dividendHistory.payoutPerShare;
        }

        if (transaction.type === "exchange-transaction") {
            currentStockValue -= transaction.priceHistory.dollarValue * transaction.purchasedQuantity;
            currentStockValue += transaction.priceHistory.dollarValue * transaction.soldQuantity;
        }

        return {
            ...transaction,
            stockValueAtTransactionTime: _.clone(currentStockValue),
        };
    });

    return _.reverse(allCompleteTransactionsSortedWithStockValue);
}
