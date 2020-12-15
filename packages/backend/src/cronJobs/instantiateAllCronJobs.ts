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
    // TODO: make the market open only from 6 AM - 9 PM, M - F
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

        // eslint-disable-next-line no-console
        console.log("Price stocks for: ", new Date().toLocaleString());

        scheduleNextStocksCronJob();
        instantiateStocksCronJob();
    });
}

export function instantiateAllCronJobs() {
    instantiateStocksCronJob();
}
