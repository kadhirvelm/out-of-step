/* eslint-disable @typescript-eslint/quotes */
import _ from "lodash";
import { scheduleJob } from "node-schedule";
import { postgresPool } from "../utils/getPostgresPool";
import { getNextTimeWithinMarketHours } from "./market/getNextTimeWithinMarketHours";
import { pricingStocksCronJob } from "./stocks/pricingStocksCronJob";

async function maybeGetExistingCronJob() {
    try {
        const date = await postgresPool.query<{ date: string }>('SELECT * FROM "nextCronJob"');

        const parsedDate = new Date(date.rows[0]?.date);
        if (parsedDate.valueOf() < Date.now()) {
            return undefined;
        }

        return parsedDate;
    } catch {
        return undefined;
    }
}

const getRandomTimeBetweenMinutesFromNow = (minimumMinutes: number, maximumMinutes: number) => {
    return new Date(Date.now() + _.random(minimumMinutes, maximumMinutes) * 1000 * 60);
};

async function scheduleNextStocksCronJob() {
    await postgresPool.query('DELETE FROM "nextCronJob"');

    const nextDate = getNextTimeWithinMarketHours(getRandomTimeBetweenMinutesFromNow(0.25, 1.25));

    await postgresPool.query('INSERT INTO "nextCronJob" (date) VALUES ($1)', [nextDate]);

    return nextDate;
}

async function getNextStocksCronJobDate(): Promise<Date> {
    const existingCronJobDate = await maybeGetExistingCronJob();

    if (existingCronJobDate !== undefined) {
        return existingCronJobDate;
    }

    return scheduleNextStocksCronJob();
}

let isJobRunning = false;

function instantiateStocksCronJob() {
    if (isJobRunning) {
        return;
    }

    // Give the system a second to catch up from the last file write
    setTimeout(async () => {
        isJobRunning = true;
        scheduleJob(await getNextStocksCronJobDate(), async () => {
            await pricingStocksCronJob();

            // eslint-disable-next-line no-console
            console.log("Priced stocks at: ", new Date().toLocaleString());

            isJobRunning = false;

            scheduleNextStocksCronJob();
            instantiateStocksCronJob();
        });
    }, 1000);
}

export function instantiateAllCronJobs() {
    instantiateStocksCronJob();
}
