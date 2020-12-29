/* eslint-disable */

import chalk from "chalk";
import { execSync } from "child_process";
import { existsSync } from "fs";
import { join } from "path";

// execSync("yarn build");

console.log(chalk.green("\nSuccessfully built the package again.\n"));

const priceStocksPath = join(process.cwd(), "dist/cronJobs/instantiateAllCronJobs.js");
if (!existsSync(priceStocksPath)) {
    console.error(chalk.red("Please run yarn build to test the pricing function."));
}

async function runPricingFunction() {
    const { priceAllStocks } = await import(priceStocksPath);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await priceAllStocks();

    console.log(chalk.green("\nSuccessfully priced all stocks."));
    process.exit(0);
}

runPricingFunction();
