import { StockModel } from "./stockModel";

const convertBitAndGambleInputToArray = (input: IBitAndGambleInputData) => [
    input.averageEffectiveFederalFundsRate,
    input.changeInAverageInitialClaimsForUnemployment,
    input.changeInBitCoinValue,
    input.percentOwnership,
    input.previousPrice,
];

const BitAndGambleModel = new StockModel<IBitAndGambleInputData>(
    { epochs: 200, name: "bit-and-gamble-v1" },
    convertBitAndGambleInputToArray,
);

export interface IBitAndGambleInputData {
    averageEffectiveFederalFundsRate: number;
    changeInAverageInitialClaimsForUnemployment: number;
    changeInBitCoinValue: number;
    percentOwnership: number;
    previousPrice: number;
}

export const getPriceForBitAndGamble = BitAndGambleModel.getPrice;

export const trainModelForBitAndGamble = BitAndGambleModel.trainModel([]);
