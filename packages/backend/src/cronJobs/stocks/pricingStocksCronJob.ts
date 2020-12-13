/* eslint-disable @typescript-eslint/quotes */
import { IPriceHistory, IStock } from "@stochastic-exchange/api";
import _ from "lodash";
import { postgresPool } from "../../utils/getPostgresPool";
import { IStockPlugin } from "./types";

const priceSampleStock: IStockPlugin = (_unused, previousPriceHistory?: IPriceHistory) => {
    return new Promise(resolve => {
        resolve({ dollarValue: (previousPriceHistory?.dollarValue ?? 10) + Math.random() * 5 });
    });
};

const priceBubbaBoys: IStockPlugin = (_unused, previousPriceHistory?: IPriceHistory) => {
    return new Promise(resolve => {
        resolve({ dollarValue: (previousPriceHistory?.dollarValue ?? 10) + Math.random() * 15 });
    });
};

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
    const stockPlugins: { [stockName: string]: IStockPlugin } = {
        "Sample stock": priceSampleStock,
        "Bubba Boys": priceBubbaBoys,
    };

    const allPriceHistoryInserts = _.compact(
        await Promise.all(
            allStocks.rows.map(async stock => {
                const pricingFunction = stockPlugins[stock.name];
                if (pricingFunction === undefined) {
                    return undefined;
                }

                try {
                    const nextDollarValue = await pricingFunction(
                        totalOwnedKeyedByStock[stock.id]?.totalOwned ?? 0,
                        latestPriceKeyedByStock[stock.id],
                    );
                    return `(${Math.round(nextDollarValue.dollarValue * 100) / 100},'${stock.id}',${
                        nextDollarValue.calculationNotes !== undefined
                            ? `'${nextDollarValue.calculationNotes}'`
                            : "NULL"
                    })`;
                } catch {
                    // eslint-disable-next-line no-console
                    console.error(`Something went wrong when pricing: ${stock.name}, ${stock.id}.`);
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
