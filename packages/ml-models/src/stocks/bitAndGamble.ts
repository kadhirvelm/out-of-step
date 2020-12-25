export interface IBitAndGambleInputData {
    averageEffectiveFederalFundsRate: number;
    changeInAverageInitialClaimsForUnemployment: number;
    changeInBitCoinValue: number;
    percentOwnership: number;
    previousPrice: number;
}

export const getPriceForBitAndGamble = (input: IBitAndGambleInputData) => {
    const bitCoinChange = input.changeInBitCoinValue * input.averageEffectiveFederalFundsRate;
    const initialClaimsChange =
        -input.changeInAverageInitialClaimsForUnemployment * input.averageEffectiveFederalFundsRate;
    const percentOwnershipAdjustment = (1 - input.percentOwnership / 100) * 3;

    return input.previousPrice + (bitCoinChange + initialClaimsChange) * percentOwnershipAdjustment;
};
