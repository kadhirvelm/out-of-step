#!/usr/bin/env node

/* eslint-disable */

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import chalk from "chalk";
import { existsSync } from "fs";
import { join } from "path";

const { argv } = yargs(hideBin(process.argv));

if (argv.pricer == null) {
    console.error(chalk.red("Please supply a pricing function to test via --pricer=YOUR_PRICER_FUNCTION."));
    process.exit(1);
}

const pricingFunctionPath = join(process.cwd(), "dist/cronJobs/stocks/pricingStocksCronJob.js");
const pricerPluginsPath = join(process.cwd(), "dist/cronJobs/stocks/stockPricerPlugins.js");
if (!existsSync(pricingFunctionPath) || !existsSync(pricerPluginsPath)) {
    console.error(chalk.red("Please run yarn build to test the pricing function."));
}

async function runPricingFunction() {
    try {
        const { testPriceChange } = await import(pricingFunctionPath);
        const { STOCK_PRICER_PLUGINS } = await import(pricerPluginsPath);

        if (!Object.keys(STOCK_PRICER_PLUGINS).includes(argv.pricer)) {
            console.error(chalk.red(`The pricer you specified does not exist: ${argv.pricer}. Valid options: ${Object.keys(STOCK_PRICER_PLUGINS).join(",")}`));
            process.exit(1);
        }
        
        console.log("\n");

        const stockPricerPlugin = { [argv.pricer]: STOCK_PRICER_PLUGINS[argv.pricer] };
        await testPriceChange(stockPricerPlugin);

        console.log(chalk.green(`\nSuccessfully ran the pricer for: ${argv.pricer}\n`));
        process.exit(0);
    } catch (e) {
        throw (e);
    }
}

runPricingFunction();