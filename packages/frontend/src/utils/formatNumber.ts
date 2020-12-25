import * as d3Format from "d3-format";

const lessThanOne = d3Format.format(".2f");
const greaterThanOne = d3Format.format(".3s");

export function formatNumber(number: number) {
    if (number < 1) {
        return lessThanOne(number);
    }

    return greaterThanOne(number).replace(/G/, "B");
}

const dollarToTwoFixed = d3Format.format("$,.2f");

export function formatDollar(number: number) {
    return dollarToTwoFixed(number);
}

const dollarToThree = d3Format.format("$,.3s");

export function formatDollarForGraph(number: number) {
    if (number < 1) {
        return formatDollar(number);
    }

    return dollarToThree(number);
}

export function formatAsPercent(number: number) {
    return `${Math.round(number * 10000) / 100}%`;
}
