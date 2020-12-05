import { IPriceHistory, IStock, IStocksService } from "@stochastic-exchange/api";
import { postgresPool } from "../utils/getPostgresPool";

type IGetAllStocks = IStocksService["getAllStocks"];

export async function getAllStocks(): Promise<IGetAllStocks["response"] | undefined> {
    const allStocks = await postgresPool.query<IStock>("SELECT * FROM stock");

    const latestPrices = await postgresPool.query<IPriceHistory>(
        `SELECT DISTINCT ON (stock) * FROM "priceHistory" WHERE stock IN (${allStocks.rows
            .map(stock => `'${stock.id}'`)
            .join(",")}) ORDER BY stock, timestamp DESC`,
    );

    return { stocks: allStocks.rows, priceHistory: latestPrices.rows };
}
