import { getPriceForStabilityEnterprises, IStabilityEnterprisesInputData } from "@stochastic-exchange/ml-models";
import { callOnExternalEndpoint } from "../../../utils/callOnExternalEndpoint";
import { changeDateByDays } from "../../../utils/dateUtil";
import { IStockPricerPlugin } from "../types";

const DEFAULT_VALUE = 12;

interface IStabilityEnterprisesCalculationNotes extends IStabilityEnterprisesInputData {
    earthquakesInThisMeasure: number;
}

export const priceStabilityEnterprises: IStockPricerPlugin = async (
    date,
    stock,
    totalOwnedStock,
    previousPriceHistory,
) => {
    const [earthquakeData, fecCalendarEvents] = await Promise.all([
        callOnExternalEndpoint(
            `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${changeDateByDays(
                date,
                -1,
            ).toLocaleDateString()}&endtime=${date.toLocaleDateString()}&minmagnitude=4`,
        ),
        callOnExternalEndpoint(
            `https://api.open.fec.gov/v1/calendar-dates/?min_start_date=${date.toLocaleDateString()}&api_key=${process
                .env.DATA_GOV ?? ""}&page=1&per_page=1`,
        ),
    ]);

    const previousCalculationNotes: Partial<IStabilityEnterprisesCalculationNotes> = JSON.parse(
        previousPriceHistory?.calculationNotes ?? "{}",
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const allEarthquakeMagnitudes: number[] = earthquakeData.features.map((f: any) => f.properties.mag as number);
    const maximumMagnitude = Math.max(...allEarthquakeMagnitudes);

    const earthquakesInThisMeasure = allEarthquakeMagnitudes.reduce((previous, next) => previous + next, 0);
    const earthquakesInPreviousMeasure =
        previousCalculationNotes.earthquakesInThisMeasure ?? earthquakesInThisMeasure ?? 0;

    const totalUpcomingElectionEvents = fecCalendarEvents.pagination.count;

    const percentOwnership = (totalOwnedStock / stock.totalQuantity) * 100;

    const previousPrice = previousPriceHistory?.dollarValue ?? DEFAULT_VALUE;

    const inputToModel: IStabilityEnterprisesInputData = {
        changeInEarthquakesSinceLastMeasure:
            (earthquakesInThisMeasure ?? earthquakesInPreviousMeasure) - earthquakesInPreviousMeasure,
        maximumMagnitude,
        percentOwnership,
        previousPrice,
        totalUpcomingElectionEvents,
    };

    const dollarValue = await getPriceForStabilityEnterprises(inputToModel);

    const calculationNotes: IStabilityEnterprisesCalculationNotes = {
        ...inputToModel,
        earthquakesInThisMeasure,
    };

    return {
        calculationNotes: JSON.stringify(calculationNotes),
        dollarValue: dollarValue ?? previousPrice,
    };
};
