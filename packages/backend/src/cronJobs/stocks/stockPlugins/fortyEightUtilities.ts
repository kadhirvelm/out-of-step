import _ from "lodash";
import { IFortyEightUtilitiesInputData, getPriceForFortyEightUtilities } from "@stochastic-exchange/ml-models";
import { IStockId } from "@stochastic-exchange/api";
import { callOnExternalEndpoint } from "../../../utils/callOnExternalEndpoint";
import { changeDateByDays } from "../../../utils/dateUtil";
import { formatDateWithSeparator } from "../../../utils/formatDateWithSeparator";
import { getChangeInValueSinceLastMeasurementAsPercent } from "../../../utils/getChangeInValueSinceLastMeasurement";
import { IStockPricerPlugin } from "../types";
import { createNewDividend } from "../dividends/createNewDividend";
import { hasAtLeastTimePassedInHours } from "../../../utils/hasAtLeastTimePassedInHours";

// SF, LA, SD, Portland, Seattle

const DEFAULT_PRICE = 15;

interface IFortyEightUtilitiesCalculationNotes extends IFortyEightUtilitiesInputData {
    previousDividendPayout: number | undefined;
    previousElectricalOutput: number;
    previousWaterOutput: number;
}

const getAverageElectricalOutput = (electricalOutput: Array<[string, number]> | undefined): number | undefined => {
    if (electricalOutput === undefined || electricalOutput.length === 0) {
        return undefined;
    }

    return electricalOutput.reduce((previous, next) => previous + next[1], 0) / electricalOutput.length;
};

const getAverageForWaterOutput = (
    waterOutput: Array<{ values: Array<{ value: Array<{ value: string }> }> }> | undefined,
): number | undefined => {
    if (waterOutput === undefined || waterOutput.length === 0) {
        return undefined;
    }

    const allValues: number[] = _.flattenDeep(
        waterOutput.map(dataPoint => dataPoint.values.map(values => values.value.map(v => parseFloat(v.value)))),
    );

    return allValues.reduce((previous, next) => previous + next, 0) / allValues.length;
};

const DIVIDEND_PAYOUTS_MINIMUM_GAP_IN_HOURS = 6;
const PERCENT_OF_STOCK = 2.5;
const PERCENT_PROBABILITY_OF_DIVIDEND = 10;

const maybePayoutDividend = async (
    isDevelopmentTest: boolean,
    stockId: IStockId,
    currentStockValue: number,
    currentDate: Date,
    previousDividendPayout: number | undefined,
) => {
    if (isDevelopmentTest) {
        return previousDividendPayout;
    }

    if (
        previousDividendPayout !== undefined &&
        !hasAtLeastTimePassedInHours(currentDate, previousDividendPayout, DIVIDEND_PAYOUTS_MINIMUM_GAP_IN_HOURS)
    ) {
        return previousDividendPayout;
    }

    if (Math.random() > PERCENT_PROBABILITY_OF_DIVIDEND / 100) {
        return previousDividendPayout;
    }

    const payout = (currentStockValue * PERCENT_OF_STOCK) / 100;
    await createNewDividend(stockId, payout, { paidOutAt: currentStockValue, percent: PERCENT_OF_STOCK });

    return currentDate.valueOf();
};

export const priceFortyEightUtilities: IStockPricerPlugin<IFortyEightUtilitiesCalculationNotes> = async (
    date,
    { isDevelopmentTest, stockId },
    previousPriceHistory,
) => {
    const goBackTwoDays = changeDateByDays(date, -2);
    const goBackOneDay = changeDateByDays(date, -1);

    const noSpaceTwoDaysBack = formatDateWithSeparator(goBackTwoDays, "");
    const noSpaceOneDayBack = formatDateWithSeparator(goBackOneDay, "");

    const [electricalOutput, waterOutput] = await Promise.all([
        callOnExternalEndpoint(
            `https://api.eia.gov/series/?api_key=${process.env.EIA_KEY ??
                ""}&series_id=EBA.US48-ALL.D.HL&start=${noSpaceTwoDaysBack}&end=${noSpaceOneDayBack}`,
        ),
        callOnExternalEndpoint(
            "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=11162630,11102300,11023000,14211720,12113390&parameterCd=00060&siteStatus=active",
        ),
    ]);

    const previousCalculationNotes: Partial<IFortyEightUtilitiesCalculationNotes> = JSON.parse(
        previousPriceHistory?.calculationNotes ?? "{}",
    );

    const electricalOutputOf48 =
        getAverageElectricalOutput(electricalOutput?.series?.[0]?.data ?? []) ??
        previousCalculationNotes.previousElectricalOutput ??
        0;

    const waterOutputOfWestCoast =
        getAverageForWaterOutput(waterOutput?.value?.timeSeries) ?? previousCalculationNotes.previousWaterOutput ?? 0;

    const previousPrice = previousPriceHistory?.dollarValue ?? DEFAULT_PRICE;

    const inputToModel = {
        changeInElectricalOutput:
            getChangeInValueSinceLastMeasurementAsPercent(
                electricalOutputOf48,
                previousCalculationNotes.previousElectricalOutput,
            ) * 100,
        changeInWaterOutput:
            getChangeInValueSinceLastMeasurementAsPercent(
                waterOutputOfWestCoast,
                previousCalculationNotes.previousWaterOutput,
            ) * 100,
        previousPrice,
    };

    const dollarValue = (await getPriceForFortyEightUtilities(inputToModel)) ?? DEFAULT_PRICE;
    const previousDividendPayout = await maybePayoutDividend(
        isDevelopmentTest,
        stockId,
        dollarValue,
        date,
        previousCalculationNotes.previousDividendPayout,
    );

    const calculationNotes: IFortyEightUtilitiesCalculationNotes = {
        ...inputToModel,
        previousDividendPayout,
        previousElectricalOutput: electricalOutputOf48,
        previousWaterOutput: waterOutputOfWestCoast,
    };

    return {
        calculationNotes,
        dollarValue,
    };
};
