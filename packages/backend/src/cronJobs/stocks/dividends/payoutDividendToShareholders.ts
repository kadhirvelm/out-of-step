/* eslint-disable prettier/prettier */
import { IAccount, IDividendHistoryId, IOwnedStock, IStockId } from "@stochastic-exchange/api";
import _ from "lodash";
import { convertArrayToPostgresIn } from "../../../utils/convertArrayToPostgresIn";
import { postgresPool } from "../../../utils/getPostgresPool";
import { roundToNearestHundreth } from "../../../utils/roundToNearestHundreth";

export async function payoutDividendToShareholders(
    dividendHistoryId: IDividendHistoryId,
    stock: IStockId,
    payoutPerShare: number,
): Promise<void> {
    const allShareholderOwnedStocks = await postgresPool.query<IOwnedStock>("SELECT * FROM \"ownedStock\" WHERE stock = $1", [stock]);

    if (allShareholderOwnedStocks.rows.length === 0) {
        // eslint-disable-next-line no-console
        console.log(`Did not payout dividends for ${stock} because there were no shareholders.`);
        return;
    }

    const allAccountIds = allShareholderOwnedStocks.rows.map(r => r.account);
    const allShareholderAccounts = await postgresPool.query<IAccount>(
        `SELECT * FROM account WHERE id IN ${convertArrayToPostgresIn(allAccountIds)}`,
    );

    const ownedStockKeyedByAccountId = _.keyBy(allShareholderOwnedStocks.rows, "account");

    await Promise.all([
        ..._.flatten(allShareholderAccounts.rows.map(account => {
            const totalStockOwnedByAccount = ownedStockKeyedByAccountId[account.id].quantity;
            const newCashOnHand = account.cashOnHand + (totalStockOwnedByAccount * payoutPerShare);

            return [
                postgresPool.query("UPDATE account SET \"cashOnHand\" = $1 WHERE id = $2", [roundToNearestHundreth(newCashOnHand), account.id]),
                postgresPool.query("INSERT INTO \"transactionHistory\" (account, stock, \"dividendHistory\", quantity, type) VALUES ($1, $2, $3, $4, 'dividend-transaction')", [account.id, stock, dividendHistoryId, totalStockOwnedByAccount])
            ]
        })),
    ]);

    // eslint-disable-next-line no-console
    console.log(`Successfully paid out dividends for ${allAccountIds.length} accounts.`);
}
