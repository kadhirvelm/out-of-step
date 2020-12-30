/* eslint-disable @typescript-eslint/quotes */
import { IAccount, ILimitOrder, IOwnedStock, IPriceHistory, IStock } from "@stochastic-exchange/api";
import _ from "lodash";
import {
    executePurchaseQuantity,
    executeSellQuantity,
} from "../../../transactionService/utils/executeExchangeTransaction";
import { convertArrayToPostgresIn } from "../../../utils/convertArrayToPostgresIn";
import { postgresPool } from "../../../utils/getPostgresPool";
import { convertLimitOrderToExchangeTransaction } from "./utils/convertLimitOrderToExchangeTransaction";

export async function executeLimitOrders(
    limitOrders: ILimitOrder[],
    latestStockPrice: { [stockId: string]: IPriceHistory },
) {
    try {
        const exchangeTransactions = limitOrders.map(order =>
            convertLimitOrderToExchangeTransaction(order, latestStockPrice),
        );

        const allAccountIds = _.uniq(_.compact(exchangeTransactions.map(transactions => transactions.account)));
        const allStockIds = _.uniq(_.compact(exchangeTransactions.map(transactions => transactions.stock)));

        const [allAccounts, allOwnedStock, allStocks] = await Promise.all([
            postgresPool.query<IAccount>(
                `SELECT "cashOnHand", id FROM account WHERE id IN ${convertArrayToPostgresIn(allAccountIds)}`,
            ),
            postgresPool.query<IOwnedStock>(
                `SELECT * FROM "ownedStock" WHERE stock IN ${convertArrayToPostgresIn(allStockIds)}`,
            ),
            postgresPool.query<IStock>(`SELECT * FROM stock WHERE id IN ${convertArrayToPostgresIn(allStockIds)}`),
        ]);

        const keyedAccounts = _.keyBy(allAccounts.rows, "id");
        const keyedOwnedStock = _.groupBy(allOwnedStock.rows, "stock");
        const keyedStocks = _.keyBy(allStocks.rows, "id");

        const cancelledLimitOrders: { [limitOrderId: string]: boolean } = {};

        const exchangeTransactionPromises = _.flatten(
            exchangeTransactions.map(transaction => {
                const ownedStock = keyedOwnedStock[transaction.stock];
                const account = keyedAccounts[transaction.account];
                const stockPrice = latestStockPrice[transaction.stock];

                let finalChangeQuantity: Promise<any>[];

                if (transaction.purchasedQuantity > 0) {
                    finalChangeQuantity = executePurchaseQuantity(
                        transaction,
                        ownedStock,
                        account.cashOnHand,
                        stockPrice,
                        keyedStocks[transaction.stock],
                    );
                } else {
                    finalChangeQuantity = executeSellQuantity(transaction, ownedStock, account.cashOnHand, stockPrice);
                }

                if (finalChangeQuantity.length === 0) {
                    cancelledLimitOrders[transaction.limitOrder ?? ""] = true;
                }

                return finalChangeQuantity;
            }),
        );

        const updateLimitOrderPromises = limitOrders.map(order => {
            if (cancelledLimitOrders[order.id]) {
                return postgresPool.query("UPDATE \"limitOrder\" SET status = 'CANCELLED' WHERE id = $1", [order.id]);
            }

            return postgresPool.query("UPDATE \"limitOrder\" SET status = 'EXECUTED' WHERE id = $1", [order.id]);
        });

        await Promise.all([...exchangeTransactionPromises, ...updateLimitOrderPromises]);

        // eslint-disable-next-line no-console
        console.log(
            `Handled all limit orders on: ${new Date().toLocaleString()}, executed ${limitOrders.length} limit orders.`,
        );
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Something went wrong when executing the limit orders", e);
    }
}
