import { IPriceHistory, IStock } from "@stochastic-exchange/api";
import { getNumberWithinRange } from "../../../utils/getNumberWithinRange";
import { roundToNearestHundreth } from "../../../utils/roundToNearestHundreth";
import { IStockPriceReturnType } from "../types";

export function stabilizeNextDollarValue(
    nextDollarValue: IStockPriceReturnType<{}>,
    stock: IStock,
    totalOwnedStock?: number,
    previousPricePoint?: IPriceHistory,
) {
    const totalOwnedStockPercent = (totalOwnedStock ?? 0) / stock.totalQuantity;

    const safeNumberToStabilizeAgainst = previousPricePoint?.dollarValue ?? nextDollarValue.dollarValue;
    const stabilizedDollarValue = Math.max(
        getNumberWithinRange(
            nextDollarValue.dollarValue,
            safeNumberToStabilizeAgainst * 0.85,
            safeNumberToStabilizeAgainst * 1.15,
        ),
        0.1,
    );

    const adjustedChangeInValueByPercentOwnership = roundToNearestHundreth(1 - 0.9 * totalOwnedStockPercent);
    const changeInValue = stabilizedDollarValue - safeNumberToStabilizeAgainst;

    // Account for percent ownership by reducing total change by up to 50% when ownership is at 100%
    const stabilizedDollarPrice =
        safeNumberToStabilizeAgainst + changeInValue * adjustedChangeInValueByPercentOwnership;

    const calculationNotes = JSON.stringify({
        ...nextDollarValue.calculationNotes,
        adjustedChangeByPercentOwnership: adjustedChangeInValueByPercentOwnership,
    });

    return {
        calculationNotes,
        stabilizedDollar: roundToNearestHundreth(stabilizedDollarPrice),
    };
}
