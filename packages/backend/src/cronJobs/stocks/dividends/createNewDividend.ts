/* eslint-disable @typescript-eslint/quotes */
import { IDividendHistoryId, IStockId } from "@stochastic-exchange/api";
import { postgresPool } from "../../../utils/getPostgresPool";
import { payoutDividendToShareholders } from "./payoutDividendToShareholders";

export async function createNewDividend(
    stock: IStockId,
    payoutPerShare: number,
    calculationNotes?: any,
): Promise<void> {
    try {
        const newDividendId = await postgresPool.query<{ id: IDividendHistoryId }>(
            'INSERT INTO "dividendHistory" ("payoutPerShare", stock, "calculationNotes") VALUES ($1, $2, $3) RETURNING id',
            [payoutPerShare, stock, JSON.stringify(calculationNotes ?? "{}")],
        );

        const dividendHistoryId = newDividendId.rows[0]?.id;
        if (dividendHistoryId === undefined) {
            // eslint-disable-next-line no-console
            console.error(
                `Something went wrong when trying to pay out dividends for ${stock} at ${payoutPerShare} per share.`,
            );
            return;
        }

        await payoutDividendToShareholders(dividendHistoryId, stock, payoutPerShare);
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(`Something went wrong when trying to pay out dividends: ${JSON.stringify(e)}`);
    }
}
