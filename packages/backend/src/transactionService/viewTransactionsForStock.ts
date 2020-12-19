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
        'SELECT * FROM "transactionHistory" WHERE account = $1 AND stock = $2 ORDER BY timestamp DESC',
        [accountId, payload.stockId],
    );

    const allLimitOrdersIds = _.compact(
        allTransactionHistoryForStock.rows.map(s => (s as IExchangeTransaction).limitOrder),
    );
    const allPriceHistoryIds = _.compact(
        allTransactionHistoryForStock.rows.map(s => (s as IExchangeTransaction).priceHistory),
    );
    const allDividendHistoryIds = _.compact(
        allTransactionHistoryForStock.rows.map(s => (s as IDividendTransaction).dividendHistory),
    );

    const [limitOrderQuery, priceHistoryQuery, dividendHistoryQuery] = await Promise.all([
        allLimitOrdersIds.length > 0
            ? postgresPool.query<ILimitOrder>(
                  `SELECT * FROM "limitOrder" WHERE id IN ${convertArrayToPostgresIn(allLimitOrdersIds)}`,
              )
            : undefined,
        allPriceHistoryIds.length > 0
            ? postgresPool.query<IPriceHistory>(
                  `SELECT * FROM "priceHistory" WHERE id IN ${convertArrayToPostgresIn(allPriceHistoryIds)}`,
              )
            : undefined,
        allDividendHistoryIds.length > 0
            ? postgresPool.query<IDividendHistory>(
                  `SELECT * FROM "dividendHistory" WHERE id IN ${convertArrayToPostgresIn(allDividendHistoryIds)}`,
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

    let currentStockValue = 0;
    const allCompleteTransactionsSortedWithStockValue: Array<ITransactionHistoryComplete &
        IStockValueAtTransactionTime> = allCompleteTransactions.map(transaction => {
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
