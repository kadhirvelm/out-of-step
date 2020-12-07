import { IPriceHistory, IStock, IStocksService } from "@stochastic-exchange/api";
import _ from "lodash";
import { postgresPool } from "../utils/getPostgresPool";

type IGetAllStocks = IStocksService["getAllStocks"];

export async function getAllStocks(): Promise<IGetAllStocks["response"] | undefined> {
    const [allStocks, latestPrices] = await Promise.all([
        postgresPool.query<IStock>("SELECT * FROM stock"),
        postgresPool.query<IPriceHistory>(
            // eslint-disable-next-line @typescript-eslint/quotes
            'SELECT DISTINCT ON (stock) * FROM "priceHistory" ORDER BY stock, timestamp DESC',
        ),
    ]);

    const keyedStocks = _.keyBy(allStocks.rows, "id");
    const keyedPrices = _.keyBy(latestPrices.rows, "stock");

    const indexedStocks = Object.keys(keyedStocks).map(stockId => {
        const priceForStock = keyedPrices[stockId];

        return {
            ...keyedStocks[stockId],
            ..._.pick(priceForStock ?? {}, "timestamp", "dollarValue"),
            priceHistoryId: priceForStock.id,
        };
    });

    return { stocks: indexedStocks.sort((a, b) => a.name.localeCompare(b.name)) };
}
