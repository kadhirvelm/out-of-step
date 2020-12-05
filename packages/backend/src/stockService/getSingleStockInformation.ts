import { IPriceHistory, IStocksService, ITimeBucket } from "@stochastic-exchange/api";
import { postgresPool } from "../utils/getPostgresPool";
import { convertDateToPostgresTimestamp } from "../utils/convertDateToPostgresTimestamp";

type IGetSingleStockInformation = IStocksService["getSingleStockInformation"];

const DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
const WEEK_IN_MILLISECONDS = DAY_IN_MILLISECONDS * 7;

function getStartTimestampFromBucket(bucket: ITimeBucket): Date {
    switch (bucket) {
        case "day":
            return new Date(Date.now() - DAY_IN_MILLISECONDS);
        case "week":
            return new Date(Date.now() - WEEK_IN_MILLISECONDS);
        case "4 weeks":
            return new Date(Date.now() - WEEK_IN_MILLISECONDS * 4);
        case "all":
            return new Date(Date.now() - WEEK_IN_MILLISECONDS * 14);
        default:
            return new Date();
    }
}

export async function getSingleStockInformation(
    payload: IGetSingleStockInformation["payload"],
): Promise<IGetSingleStockInformation["response"] | undefined> {
    const [priceHistory, ownedStockQuantity] = await Promise.all([
        postgresPool.query<IPriceHistory>(
            // eslint-disable-next-line @typescript-eslint/quotes
            `SELECT * FROM "priceHistory" WHERE stock = $1 AND timestamp BETWEEN ${convertDateToPostgresTimestamp(
                getStartTimestampFromBucket(payload.bucket),
            )} AND ${convertDateToPostgresTimestamp(new Date())}`,
            [payload.stock],
        ),
        postgresPool.query<{ ownedStockQuantity: number }>(
            // eslint-disable-next-line @typescript-eslint/quotes
            'SELECT SUM(quantity) as "ownedStockQuantity" FROM "ownedStock" GROUP BY stock',
        ),
    ]);

    return { priceHistory: priceHistory.rows, ownedStockQuantity: ownedStockQuantity.rows[0]?.ownedStockQuantity ?? 0 };
}
