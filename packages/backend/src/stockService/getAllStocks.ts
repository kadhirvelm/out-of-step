import { IPriceHistory, IStock, IStocksService } from "@stochastic-exchange/api";
import _ from "lodash";
import { convertDateToPostgresTimestamp } from "../utils/convertDateToPostgresTimestamp";
import { postgresPool } from "../utils/getPostgresPool";

type IGetAllStocks = IStocksService["getAllStocks"];

export async function getAllStocks(): Promise<IGetAllStocks["response"] | undefined> {
    const previousDay = new Date();
    previousDay.setHours(0, 0, 0, 0);

    const [allStocks, latestPrice, previousPrice] = await Promise.all([
        postgresPool.query<IStock>("SELECT * FROM stock"),
        postgresPool.query<IPriceHistory>(
            // eslint-disable-next-line @typescript-eslint/quotes
            'SELECT DISTINCT ON (stock) * FROM "priceHistory" ORDER BY stock, timestamp DESC',
        ),
        postgresPool.query<IPriceHistory>(
            // eslint-disable-next-line @typescript-eslint/quotes
            `SELECT DISTINCT ON (stock) * FROM "priceHistory" WHERE timestamp < ${convertDateToPostgresTimestamp(
                previousDay,
            )} ORDER BY stock, timestamp DESC`,
        ),
    ]);

    const keyedStocks = _.keyBy(allStocks.rows, "id");
    const keyedPrices = _.keyBy(latestPrice.rows, "stock");
    const keyedPreviousPrices = _.keyBy(previousPrice.rows, "stock");

    const indexedStocks = Object.keys(keyedStocks).map(stockId => {
        const priceForStock = keyedPrices[stockId];
        const previousPriceForStock = keyedPreviousPrices[stockId];

        return {
            ...keyedStocks[stockId],
            ..._.pick(priceForStock ?? {}, "timestamp", "dollarValue"),
            priceHistoryId: priceForStock.id,
            ...(previousPriceForStock === undefined
                ? {}
                : { previousPriceHistory: _.pick(previousPriceForStock, "timestamp", "dollarValue") }),
        };
    });

    return { stocks: indexedStocks.sort((a, b) => a.name.localeCompare(b.name)) };
}
