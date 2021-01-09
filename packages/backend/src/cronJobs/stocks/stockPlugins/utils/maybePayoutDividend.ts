import { IStockId } from "@stochastic-exchange/api";
import { hasAtLeastTimePassedInHours } from "../../../../utils/hasAtLeastTimePassedInHours";
import { createNewDividend } from "../../dividends/createNewDividend";

export async function maybePayoutDividend(
    isDevelopmentTest: boolean,
    stockId: IStockId,
    currentStockValue: number,
    currentDate: Date,
    previousDividendPayout: number | undefined,
    configuration: {
        minimumGapInHours: number;
        percentOfValue: number;
        percentProbabilityOfDividend: number;
    },
) {
    if (isDevelopmentTest) {
        return previousDividendPayout;
    }

    if (
        previousDividendPayout !== undefined &&
        !hasAtLeastTimePassedInHours(currentDate, previousDividendPayout, configuration.minimumGapInHours)
    ) {
        return previousDividendPayout;
    }

    const randomProbability = Math.random() * 100;
    if (randomProbability > configuration.percentProbabilityOfDividend) {
        return previousDividendPayout;
    }

    const RANDOMIZED_PAYOUT_PERCENT = (configuration.percentOfValue / 100) * ((100 - randomProbability) / 100);

    const payout = currentStockValue * RANDOMIZED_PAYOUT_PERCENT;
    await createNewDividend(stockId, payout, { paidOutAt: currentStockValue, percent: RANDOMIZED_PAYOUT_PERCENT });

    return currentDate.valueOf();
}
