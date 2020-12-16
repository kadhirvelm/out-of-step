import { readFileSync, writeFileSync } from "fs";
import _ from "lodash";
import { scheduleJob } from "node-schedule";
import { join } from "path";
import { getNextTimeWithinMarketHours } from "./market/getNextTimeWithinMarketHours";
import { pricingStocksCronJob } from "./stocks/pricingStocksCronJob";

const STOCKS_CONFIG_FILE = join(process.cwd(), "../stochastic_exchange_stocks.json");

function maybeGetExistingCronJob() {
    try {
        const date: string = readFileSync(STOCKS_CONFIG_FILE)?.toString();
        const jsonDate = parseInt(JSON.parse(date).nextDate, 10);
        if (jsonDate < Date.now()) {
            return undefined;
        }

        return new Date(jsonDate);
    } catch {
        return undefined;
    }
}

const getRandomTimeBetweenMinutesFromNow = (minimumMinutes: number, maximumMinutes: number) => {
    return new Date(Date.now() + _.random(minimumMinutes, maximumMinutes) * 1000 * 60);
};

function scheduleNextStocksCronJob() {
    const nextDate = getNextTimeWithinMarketHours(getRandomTimeBetweenMinutesFromNow(0.25, 1.25));

    writeFileSync(STOCKS_CONFIG_FILE, JSON.stringify({ nextDate: nextDate.valueOf() }));

    return nextDate;
}

function getNextStocksCronJobDate(): Date {
    const existingCronJobDate = maybeGetExistingCronJob();

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
    setTimeout(() => {
        isJobRunning = true;
        scheduleJob(getNextStocksCronJobDate(), async () => {
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
