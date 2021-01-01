import { getPriceForStabilityEnterprises, IStabilityEnterprisesInputData } from "@stochastic-exchange/ml-models";
import { callOnExternalEndpoint } from "../../../utils/callOnExternalEndpoint";
import { changeDateByDays } from "../../../utils/dateUtil";
import { getChangeInValueSinceLastMeasurement } from "../../../utils/getChangeInValueSinceLastMeasurement";
import { IStockPricerPlugin } from "../types";

const DEFAULT_VALUE = 12;

interface IStabilityEnterprisesCalculationNotes extends IStabilityEnterprisesInputData {
    previousEarthquakesMeasure: number;
    previousElectionEvents: number;
}

export const priceStabilityEnterprises: IStockPricerPlugin<IStabilityEnterprisesCalculationNotes> = async (
    date,
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

    const earthquakesMeasure = allEarthquakeMagnitudes.reduce((previous, next) => previous + next, 0);

    const totalUpcomingElectionEvents: number = fecCalendarEvents.pagination.count ?? 0;

    const previousPrice = previousPriceHistory?.dollarValue ?? DEFAULT_VALUE;

    const inputToModel: IStabilityEnterprisesInputData = {
        changeInEarthquakesSinceLastMeasure: getChangeInValueSinceLastMeasurement(
            earthquakesMeasure,
            previousCalculationNotes.previousEarthquakesMeasure,
        ),
        maximumMagnitude,
        previousPrice,
        changeInElectionEvents: getChangeInValueSinceLastMeasurement(
            totalUpcomingElectionEvents,
            previousCalculationNotes.previousElectionEvents,
        ),
    };

    const dollarValue = await getPriceForStabilityEnterprises(inputToModel);

    const calculationNotes: IStabilityEnterprisesCalculationNotes = {
        ...inputToModel,
        previousEarthquakesMeasure: earthquakesMeasure,
        previousElectionEvents: totalUpcomingElectionEvents,
    };

    return {
        calculationNotes,
        dollarValue: dollarValue ?? previousPrice,
    };
};
