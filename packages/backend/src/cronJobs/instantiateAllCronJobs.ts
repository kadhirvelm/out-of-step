import { readFileSync, writeFileSync } from "fs";
import _ from "lodash";
import { scheduleJob } from "node-schedule";
import { join } from "path";
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

function scheduleNextStocksCronJob() {
    const nextDate = Date.now() + _.random(10, 60) * 1000; // * 60;
    writeFileSync(STOCKS_CONFIG_FILE, JSON.stringify({ nextDate }));

    return new Date(nextDate);
}

function getNextStocksCronJobDate(): Date {
    const existingCronJobDate = maybeGetExistingCronJob();

    if (existingCronJobDate !== undefined) {
        return existingCronJobDate;
    }

    return scheduleNextStocksCronJob();
}

function instantiateStocksCronJob() {
    scheduleJob(getNextStocksCronJobDate(), async () => {
        await pricingStocksCronJob();

        scheduleNextStocksCronJob();
        instantiateStocksCronJob();
    });
}

export function instantiateAllCronJobs() {
    instantiateStocksCronJob();
}
