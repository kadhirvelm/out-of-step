import { IPriceHistory, IStock } from "@stochastic-exchange/api";
import { getNumberWithinRange } from "../../../utils/getNumberWithinRange";
import { roundToNearestHundreth } from "../../../utils/roundToNearestHundreth";
import { IStockPriceReturnType } from "../types";

const RANDOMLY_ADJUST_ON_PERCENT_DIFFERENCE = 0.5;
const RANDOMLY_ADJUST_BY_PERCENT_OF_ORIGINAL_PRICE = 3;

const randomlyAssignPositiveOrNegative = () => (Math.random() >= 0.5 ? 1 : -1);

// eslint-disable-next-line no-restricted-globals
const alwaysEnsureNumber = (num: number, backupNumber?: number) => (isNaN(num) ? backupNumber ?? 0.1 : num);

export function stabilizeNextDollarValue(
    nextDollarValue: IStockPriceReturnType<{}>,
    stock: IStock,
    totalOwnedStock?: number,
    previousPricePoint?: IPriceHistory,
) {
    const totalOwnedStockPercent = (totalOwnedStock ?? 0) / stock.totalQuantity;

    const definitelyANumberNextDollarValue = alwaysEnsureNumber(
        nextDollarValue.dollarValue,
        previousPricePoint?.dollarValue ?? 0.1,
    );

    const safeNumberToStabilizeAgainst = alwaysEnsureNumber(
        previousPricePoint?.dollarValue ?? definitelyANumberNextDollarValue,
        definitelyANumberNextDollarValue,
    );
    const stabilizedDollarValue = Math.max(
        getNumberWithinRange(
            definitelyANumberNextDollarValue,
            safeNumberToStabilizeAgainst * 0.75,
            safeNumberToStabilizeAgainst * 1.25,
        ),
        0.1,
    );

    const adjustedChangeInValueByPercentOwnership = roundToNearestHundreth(1 - 0.9 * totalOwnedStockPercent);
    const changeInValue = stabilizedDollarValue - safeNumberToStabilizeAgainst;

    // Account for percent ownership by reducing total change by up to 90% when ownership is at 100%
    let changeInValueAdjustedByPercentOwnership = changeInValue * adjustedChangeInValueByPercentOwnership;
    let didRandomlyAssign = false;

    const percentChange =
        Math.round(Math.abs(changeInValueAdjustedByPercentOwnership / safeNumberToStabilizeAgainst) * 1000) / 1000;

    if (percentChange <= RANDOMLY_ADJUST_ON_PERCENT_DIFFERENCE / 100) {
        changeInValueAdjustedByPercentOwnership =
            Math.random() *
            ((safeNumberToStabilizeAgainst * RANDOMLY_ADJUST_BY_PERCENT_OF_ORIGINAL_PRICE) / 100) *
            randomlyAssignPositiveOrNegative();
        didRandomlyAssign = true;
    }

    const stabilizedDollarPrice = safeNumberToStabilizeAgainst + changeInValueAdjustedByPercentOwnership;

    const calculationNotes = JSON.stringify({
        ...nextDollarValue.calculationNotes,
        adjustedChangeByPercentOwnership: adjustedChangeInValueByPercentOwnership,
        didRandomlyAssign,
    });

    return {
        calculationNotes,
        stabilizedDollar: roundToNearestHundreth(stabilizedDollarPrice),
    };
}
