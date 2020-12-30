/* eslint-disable @typescript-eslint/quotes */
import { IAccount, ILimitOrder, IOwnedStock, IPriceHistory, IStock } from "@stochastic-exchange/api";
import _ from "lodash";
import { convertArrayToPostgresIn } from "../../../utils/convertArrayToPostgresIn";
import { postgresPool } from "../../../utils/getPostgresPool";
import { convertLimitOrderToExchangeTransaction } from "./utils/convertLimitOrderToExchangeTransaction";
import { getExecuteLimitOrderPromises } from "./utils/getExecuteLimitOrderPromises";

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

        await Promise.all([
            ...getExecuteLimitOrderPromises(
                limitOrders,
                exchangeTransactions,
                latestStockPrice,
                keyedAccounts,
                keyedOwnedStock,
                keyedStocks,
            ),
        ]);

        // eslint-disable-next-line no-console
        console.log(
            `Handled all limit orders on: ${new Date().toLocaleString()}, executed ${limitOrders.length} limit orders.`,
        );
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Something went wrong when executing the limit orders", e);
    }
}
