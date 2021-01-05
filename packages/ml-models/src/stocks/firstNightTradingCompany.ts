import { StockModel } from "./stockModel";

const convertFirstNightTradingCompanyInputToArray = (input: IFirstNightTradingCompanyInputData) => [
    input.changeInGoldPrice,
    input.changeInSilverPrice,
    input.changeInTreasuryRealYieldCurveRate,
    input.previousPrice,
];

export interface IFirstNightTradingCompanyInputData {
    changeInGoldPrice: number;
    changeInSilverPrice: number;
    changeInTreasuryRealYieldCurveRate: number;
    previousPrice: number;
}

const FirstNightTradingCompany = new StockModel<IFirstNightTradingCompanyInputData>(
    {
        epochs: 400,
        name: "first-night-trading-company-v1",
    },
    convertFirstNightTradingCompanyInputToArray,
);

export const getPriceForFirstNightTradingCompany = FirstNightTradingCompany.getPrice;

const AVERAGE_GOLD_PRICE_CHANGE = 6;
const AVERAGE_SILVER_PRICE_CHANGE = 0.17;
const CHANGE_IN_TREASURY_REAL_YIELD_CURVE_RATE = 0.05;

export const trainModelForFirstNightTradingCompany = FirstNightTradingCompany.trainModel([
    {
        input: {
            changeInGoldPrice: 0,
            changeInSilverPrice: 0,
            changeInTreasuryRealYieldCurveRate: 0,
            previousPrice: 25,
        },
        output: 25,
    },
    {
        input: {
            changeInGoldPrice: AVERAGE_GOLD_PRICE_CHANGE,
            changeInSilverPrice: 0,
            changeInTreasuryRealYieldCurveRate: 0,
            previousPrice: 25,
        },
        output: 26,
    },
    {
        input: {
            changeInGoldPrice: -AVERAGE_GOLD_PRICE_CHANGE,
            changeInSilverPrice: 0,
            changeInTreasuryRealYieldCurveRate: 0,
            previousPrice: 25,
        },
        output: 24,
    },
    {
        input: {
            changeInGoldPrice: 0,
            changeInSilverPrice: AVERAGE_SILVER_PRICE_CHANGE,
            changeInTreasuryRealYieldCurveRate: 0,
            previousPrice: 25,
        },
        output: 26,
    },
    {
        input: {
            changeInGoldPrice: 0,
            changeInSilverPrice: -AVERAGE_SILVER_PRICE_CHANGE,
            changeInTreasuryRealYieldCurveRate: 0,
            previousPrice: 25,
        },
        output: 24,
    },
    {
        input: {
            changeInGoldPrice: 0,
            changeInSilverPrice: 0,
            changeInTreasuryRealYieldCurveRate: -CHANGE_IN_TREASURY_REAL_YIELD_CURVE_RATE,
            previousPrice: 25,
        },
        output: 26,
    },
    {
        input: {
            changeInGoldPrice: 0,
            changeInSilverPrice: 0,
            changeInTreasuryRealYieldCurveRate: CHANGE_IN_TREASURY_REAL_YIELD_CURVE_RATE,
            previousPrice: 25,
        },
        output: 24,
    },
    /**
     * Higher initial price
     */
    {
        input: {
            changeInGoldPrice: 0,
            changeInSilverPrice: 0,
            changeInTreasuryRealYieldCurveRate: 0,
            previousPrice: 28,
        },
        output: 28,
    },
    {
        input: {
            changeInGoldPrice: AVERAGE_GOLD_PRICE_CHANGE,
            changeInSilverPrice: 0,
            changeInTreasuryRealYieldCurveRate: 0,
            previousPrice: 28,
        },
        output: 29,
    },
    {
        input: {
            changeInGoldPrice: -AVERAGE_GOLD_PRICE_CHANGE,
            changeInSilverPrice: 0,
            changeInTreasuryRealYieldCurveRate: 0,
            previousPrice: 28,
        },
        output: 27,
    },
    {
        input: {
            changeInGoldPrice: 0,
            changeInSilverPrice: AVERAGE_SILVER_PRICE_CHANGE,
            changeInTreasuryRealYieldCurveRate: 0,
            previousPrice: 28,
        },
        output: 29,
    },
    {
        input: {
            changeInGoldPrice: 0,
            changeInSilverPrice: -AVERAGE_SILVER_PRICE_CHANGE,
            changeInTreasuryRealYieldCurveRate: 0,
            previousPrice: 28,
        },
        output: 27,
    },
    {
        input: {
            changeInGoldPrice: 0,
            changeInSilverPrice: 0,
            changeInTreasuryRealYieldCurveRate: -CHANGE_IN_TREASURY_REAL_YIELD_CURVE_RATE,
            previousPrice: 28,
        },
        output: 29,
    },
    {
        input: {
            changeInGoldPrice: 0,
            changeInSilverPrice: 0,
            changeInTreasuryRealYieldCurveRate: CHANGE_IN_TREASURY_REAL_YIELD_CURVE_RATE,
            previousPrice: 28,
        },
        output: 27,
    },
]);
