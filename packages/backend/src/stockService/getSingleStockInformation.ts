import { IPriceHistoryInBuckets, IStocksService, ITimeBucket } from "@stochastic-exchange/api";
import { convertDateToPostgresTimestamp } from "../utils/convertDateToPostgresTimestamp";
import { postgresPool } from "../utils/getPostgresPool";

type IGetSingleStockInformation = IStocksService["getSingleStockInformation"];

const DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
const WEEK_IN_MILLISECONDS = DAY_IN_MILLISECONDS * 7;

function getDateBucket(bucket: ITimeBucket): string {
    switch (bucket) {
        case "day":
            return "minute";
        case "5 days":
            return "hour";
        case "month":
            return "day";
        case "all":
            return "week";
        default:
            return "month";
    }
}

function getStartTimestampFromBucket(bucket: ITimeBucket): Date {
    switch (bucket) {
        case "day":
            return new Date(Date.now() - DAY_IN_MILLISECONDS);
        case "5 days":
            return new Date(Date.now() - DAY_IN_MILLISECONDS * 5);
        case "month":
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
    const dateBucketPostgresString = `DATE_TRUNC('${getDateBucket(payload.bucket)}', timestamp)`;

    const [priceHistory, ownedStockQuantity] = await Promise.all([
        postgresPool.query<IPriceHistoryInBuckets>(
            // eslint-disable-next-line @typescript-eslint/quotes
            `SELECT AVG("dollarValue") as "dollarValue", ${dateBucketPostgresString} as timestamp FROM "priceHistory" WHERE stock = $1 AND timestamp BETWEEN ${convertDateToPostgresTimestamp(
                getStartTimestampFromBucket(payload.bucket),
            )} AND ${convertDateToPostgresTimestamp(
                new Date(),
            )} GROUP BY ${dateBucketPostgresString} ORDER BY ${dateBucketPostgresString} ASC`,
            [payload.stock],
        ),
        postgresPool.query<{ ownedStockQuantity: number }>(
            // eslint-disable-next-line @typescript-eslint/quotes
            'SELECT SUM(quantity) as "ownedStockQuantity" FROM "ownedStock" GROUP BY stock',
        ),
    ]);

    const allPrices = priceHistory.rows.map(p => p.dollarValue);

    return {
        high: Math.max(...allPrices),
        low: Math.min(...allPrices),
        ownedStockQuantity: ownedStockQuantity.rows[0]?.ownedStockQuantity ?? 0,
        priceHistory: priceHistory.rows,
    };
}
