import { IPriceHistory, IStock, IStocksService } from "@stochastic-exchange/api";
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

    return { priceHistory: latestPrices.rows, stocks: allStocks.rows };
}
