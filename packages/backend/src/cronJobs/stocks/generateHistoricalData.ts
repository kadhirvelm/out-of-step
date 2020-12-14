/* eslint-disable @typescript-eslint/quotes */
import { IPriceHistory, IStock } from "@stochastic-exchange/api";
import _ from "lodash";
import { convertDateToPostgresTimestamp } from "../../utils/convertDateToPostgresTimestamp";
import { postgresPool } from "../../utils/getPostgresPool";
import { STOCK_PRICER_PLUGINS } from "./stockPricerPlugins";

export async function generateHistoricalData(stockName: string) {
    const [allStocks] = await Promise.all([
        postgresPool.query<IStock>(`SELECT * FROM stock WHERE status = 'AVAILABLE' AND name = $1`, [stockName]),
    ]);

    const allPriceHistoryInserts: string[] = [];

    const stock = allStocks.rows[0];
    const pricingFunction = STOCK_PRICER_PLUGINS[stock.name];
    if (pricingFunction === undefined) {
        return undefined;
    }

    let currentPricingDate = new Date("12-10-2020");
    const endDate = new Date();

    let previousPriceHistory: Pick<IPriceHistory, "dollarValue" | "calculationNotes"> | undefined;

    while (currentPricingDate.valueOf() < endDate.valueOf()) {
        // eslint-disable-next-line no-await-in-loop
        previousPriceHistory = await pricingFunction(currentPricingDate, stock, 0, previousPriceHistory);
        allPriceHistoryInserts.push(
            `(${Math.round(_.clone(previousPriceHistory.dollarValue) * 100) / 100},'${stock.id}',${
                previousPriceHistory.calculationNotes !== undefined
                    ? `'${_.clone(previousPriceHistory.calculationNotes)}'`
                    : "NULL"
            }, ${convertDateToPostgresTimestamp(new Date(currentPricingDate.valueOf()))})`,
        );
        currentPricingDate = new Date(currentPricingDate.valueOf() + 1000 * 60 * 60 * 4);
    }

    return postgresPool.query(
        `INSERT INTO "priceHistory" ("dollarValue", stock, "calculationNotes", timestamp) VALUES ${allPriceHistoryInserts.join(
            ",",
        )}`,
    );
}
