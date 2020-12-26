import { IPriceHistoryInBuckets, IStocksService, ITimeBucket } from "@stochastic-exchange/api";
import { goToStartOfMarketOpenHours } from "@stochastic-exchange/utils";
import { convertDateToPostgresTimestamp } from "../utils/convertDateToPostgresTimestamp";
import { changeDateByDays } from "../utils/dateUtil";
import { postgresPool } from "../utils/getPostgresPool";

type IGetSingleStockInformation = IStocksService["getSingleStockInformation"];

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
            return goToStartOfMarketOpenHours(new Date());
        case "5 days":
            return goToStartOfMarketOpenHours(changeDateByDays(new Date(), -5));
        case "month":
            return goToStartOfMarketOpenHours(changeDateByDays(new Date(), -30));
        case "all":
            return goToStartOfMarketOpenHours(changeDateByDays(new Date(), -90));
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
        // NOTE: seems postgres converts sum to a string instead of an integer, so we need to recast as an integer
        postgresPool.query<{ ownedStockQuantity: number }>(
            // eslint-disable-next-line @typescript-eslint/quotes
            'SELECT CAST (SUM(quantity) AS INTEGER) as "ownedStockQuantity" FROM "ownedStock" WHERE stock = $1',
            [payload.stock],
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
