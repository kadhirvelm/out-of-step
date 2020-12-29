/* eslint-disable @typescript-eslint/quotes */
import { IAccount, IExchangeTransaction, ILimitOrder, IOwnedStock, IPriceHistory } from "@stochastic-exchange/api";
import _ from "lodash";
import {
    executePurchaseQuantity,
    executeSellQuantity,
} from "../../../transactionService/utils/executeExchangeTransaction";
import { convertArrayToPostgresIn } from "../../../utils/convertArrayToPostgresIn";
import { postgresPool } from "../../../utils/getPostgresPool";

const convertLimitOrderToExchangeTransaction = (
    limitOrder: ILimitOrder,
    latestStockPrice: { [stockId: string]: IPriceHistory },
): Omit<IExchangeTransaction, "id" | "timestamp"> => {
    return {
        account: limitOrder.account,
        limitOrder: limitOrder.id,
        priceHistory: latestStockPrice[limitOrder.stock].id,
        purchasedQuantity: limitOrder.type === "buy-limit" ? limitOrder.quantity : 0,
        soldQuantity: limitOrder.type === "sell-limit" ? limitOrder.quantity : 0,
        stock: limitOrder.stock,
        type: "exchange-transaction",
    };
};

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

        const [allAccounts, allOwnedStock] = await Promise.all([
            postgresPool.query<IAccount>(
                `SELECT "cashOnHand", id FROM account WHERE id IN ${convertArrayToPostgresIn(allAccountIds)}`,
            ),
            postgresPool.query<IOwnedStock>(
                `SELECT * FROM "ownedStock" WHERE account IN ${convertArrayToPostgresIn(
                    allAccountIds,
                )} AND stock IN ${convertArrayToPostgresIn(allStockIds)}`,
            ),
        ]);

        const createKey = (key: IOwnedStock | Omit<IExchangeTransaction, "id" | "timestamp">) =>
            `${key.account}_${key.stock}`;

        const keyedAccounts = _.keyBy(allAccounts.rows, "id");
        const keyedOwnedStock = _.keyBy(allOwnedStock.rows, createKey);

        const exchangeTransactionPromises = _.flatten(
            exchangeTransactions.map(transaction => {
                const ownedStock = keyedOwnedStock[createKey(transaction)];
                const account = keyedAccounts[transaction.account];
                const stockPrice = latestStockPrice[transaction.stock];

                if (transaction.purchasedQuantity > 0) {
                    return executePurchaseQuantity(transaction, [ownedStock], account.cashOnHand, stockPrice);
                }

                return executeSellQuantity(transaction, [ownedStock], account.cashOnHand, stockPrice);
            }),
        );

        const updateLimitOrderPromises = limitOrders.map(order => {
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
