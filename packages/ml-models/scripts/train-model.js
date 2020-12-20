#!/usr/bin/env node

/* eslint-disable */

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import chalk from "chalk";
import { existsSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";

const { argv } = yargs(hideBin(process.argv));

if (argv.model == null) {
    console.error(chalk.red("Please supply a model to train via --model=YOUR_MODEL_HERE."));
    process.exit(1);
}

const filePath = join(process.cwd(), "dist/stocks/", `${argv.model}.js`);
if (!existsSync(filePath)) {
    console.error(chalk.red("The model you've supplied does not exist in the dist directory. Please check your spelling or run yarn build first."));
}

async function runModel() {
    try {
        const functionToImport = `trainModelFor${argv.model[0].toUpperCase()}${argv.model.slice(1)}`;
        const imports = await import(filePath);
        await imports[functionToImport]();

        console.log(chalk.green(`\nSuccessfully trained the model for: ${argv.model}\n`));
        process.exit(0);
    } catch (e) {
        throw (e);
    }
}

runModel();