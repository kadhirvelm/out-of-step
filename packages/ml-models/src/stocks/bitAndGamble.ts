export interface IBitAndGambleInputData {
    averageEffectiveFederalFundsRate: number;
    changeInAverageInitialClaimsForUnemployment: number;
    changeInBitCoinValue: number;
    previousPrice: number;
}

export const getPriceForBitAndGamble = (input: IBitAndGambleInputData) => {
    const bitCoinChange = input.changeInBitCoinValue * input.averageEffectiveFederalFundsRate * 2;
    const initialClaimsChange =
        -input.changeInAverageInitialClaimsForUnemployment * input.averageEffectiveFederalFundsRate;

    return input.previousPrice + bitCoinChange + initialClaimsChange;
};
