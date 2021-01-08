import _ from "lodash";
import { IFortyEightUtilitiesInputData, getPriceForFortyEightUtilities } from "@stochastic-exchange/ml-models";
import { callOnExternalEndpoint } from "../../../utils/callOnExternalEndpoint";
import { changeDateByDays } from "../../../utils/dateUtil";
import { formatDateWithSeparator } from "../../../utils/formatDateWithSeparator";
import { getChangeInValueSinceLastMeasurementAsPercent } from "../../../utils/getChangeInValueSinceLastMeasurement";
import { IStockPricerPlugin } from "../types";

// SF, LA, SD, Portland, Seattle

const DEFAULT_PRICE = 15;

interface IFortyEightUtilitiesCalculationNotes extends IFortyEightUtilitiesInputData {
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

export const priceFortyEightUtilities: IStockPricerPlugin<IFortyEightUtilitiesCalculationNotes> = async (
    date,
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

    const dollarValue = await getPriceForFortyEightUtilities(inputToModel);

    const calculationNotes: IFortyEightUtilitiesCalculationNotes = {
        ...inputToModel,
        previousElectricalOutput: electricalOutputOf48,
        previousWaterOutput: waterOutputOfWestCoast,
    };

    return {
        calculationNotes,
        dollarValue: dollarValue ?? DEFAULT_PRICE,
    };
};
