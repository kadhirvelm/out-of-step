/* eslint-disable @typescript-eslint/quotes */
import { IPriceHistory, IStock } from "@stochastic-exchange/api";
import _ from "lodash";
import { postgresPool } from "../../utils/getPostgresPool";
import { STOCK_PRICER_PLUGINS } from "./stockPricerPlugins";

export async function pricingStocksCronJob() {
    const [allStocks, latestPriceHistory, totalOwned] = await Promise.all([
        postgresPool.query<IStock>(`SELECT * FROM stock WHERE status = 'AVAILABLE'`),
        postgresPool.query<IPriceHistory>(
            'SELECT DISTINCT ON (stock) * FROM "priceHistory" ORDER BY stock, timestamp DESC',
        ),
        postgresPool.query<{ stockId: string; totalOwned: number }>(
            'SELECT SUM(quantity) as "totalOwned", stock as "stockId" FROM "ownedStock" GROUP BY stock',
        ),
    ]);

    const latestPriceKeyedByStock = _.keyBy(latestPriceHistory.rows, priceHistory => priceHistory.stock);
    const totalOwnedKeyedByStock = _.keyBy(totalOwned.rows, owned => owned.stockId);

    const priceForDate = new Date();

    const allPriceHistoryInserts = _.compact(
        await Promise.all(
            allStocks.rows.map(async stock => {
                const pricingFunction = STOCK_PRICER_PLUGINS[stock.name];
                if (pricingFunction === undefined) {
                    return undefined;
                }

                try {
                    const nextDollarValue = await pricingFunction(
                        priceForDate,
                        stock,
                        totalOwnedKeyedByStock[stock.id]?.totalOwned ?? 0,
                        latestPriceKeyedByStock[stock.id],
                    );
                    return `(${Math.round(nextDollarValue.dollarValue * 100) / 100},'${stock.id}',${
                        nextDollarValue.calculationNotes !== undefined
                            ? `'${nextDollarValue.calculationNotes}'`
                            : "NULL"
                    })`;
                } catch (e) {
                    // eslint-disable-next-line no-console
                    console.error(`Something went wrong when pricing: ${stock.name}, ${stock.id}.`, e);
                    return undefined;
                }
            }),
        ),
    );

    return postgresPool.query(
        `INSERT INTO "priceHistory" ("dollarValue", stock, "calculationNotes") VALUES ${allPriceHistoryInserts.join(
            ",",
        )}`,
    );
}
