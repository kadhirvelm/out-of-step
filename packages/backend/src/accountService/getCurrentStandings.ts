/* eslint-disable prettier/prettier */
import { IAccountId, IAccountService, IOwnedStock, IStockId } from "@stochastic-exchange/api";
import _ from "lodash";
import { postgresPool } from "../utils/getPostgresPool";

type IGetCurrentStandings = IAccountService["getCurrentStandings"];

export async function getCurrentStandings(): Promise<IGetCurrentStandings["response"] | undefined> {

    const [latestPricePoints, allOwnedStocks, allAccounts] = await Promise.all([
        postgresPool.query<{ stock: IStockId; dollarValue: number }>("SELECT DISTINCT ON (stock) \"dollarValue\", stock FROM \"priceHistory\" ORDER BY stock, timestamp DESC"),
        postgresPool.query<IOwnedStock>("SELECT * FROM \"ownedStock\""),
        postgresPool.query<{ id: IAccountId; cashOnHand: number; portfolioName: string }>("SELECT id, \"cashOnHand\", \"portfolioName\" FROM account"),
    ]);

    const keyedPricePoints = _.keyBy(latestPricePoints.rows, "stock");
    const groupedBy: { [accountId: string]: IOwnedStock[] } = _.groupBy(allOwnedStocks.rows, "account");

    const calculateAccountAssetWorth = (forAccountId: IAccountId): number => {
        const stocks = groupedBy[forAccountId];
        if (stocks === undefined) {
            return 0;
        }

        return stocks.map(ownedStock => ownedStock.quantity * (keyedPricePoints[ownedStock.stock].dollarValue ?? 0)).reduce((previous, next) => previous + next, 0)
    }

    return allAccounts.rows.map(account => {
        return {
            accountId: account.id,
            portfolioName: account.portfolioName,
            netWorth: account.cashOnHand + calculateAccountAssetWorth(account.id),
        }
    }).sort((a, b) => {
        if (a.netWorth < b.netWorth) {
            return 1;
        }

        if (a.netWorth > b.netWorth) {
            return -1;
        }

        return a.portfolioName.localeCompare(b.portfolioName);
    });
}
