import { getPriceForStabilityEnterprises, IStabilityEnterprisesInputData } from "@stochastic-exchange/ml-models";
import { callOnExternalEndpoint } from "../../../utils/callOnExternalEndpoint";
import { changeDateByDays } from "../../../utils/dateUtil";
import { getChangeInValueSinceLastMeasurement } from "../../../utils/getChangeInValueSinceLastMeasurement";
import { IStockPricerPlugin } from "../types";
import { maybePayoutDividend } from "./__tests__/maybePayoutDividend";

const DEFAULT_PRICE = 12;

interface IStabilityEnterprisesCalculationNotes extends IStabilityEnterprisesInputData {
    previousDividendPayout: number | undefined;
    previousEarthquakesMeasure: number;
    previousElectionEvents: number;
}

const DIVIDEND_PAYOUTS_MINIMUM_GAP_IN_HOURS = 72;
const PERCENT_OF_STOCK = 10;
const PERCENT_PROBABILITY_OF_DIVIDEND = 5;

export const priceStabilityEnterprises: IStockPricerPlugin<IStabilityEnterprisesCalculationNotes> = async (
    date,
    { isDevelopmentTest, stockId },
    previousPriceHistory,
) => {
    const [earthquakeData, fecCalendarEvents] = await Promise.all([
        callOnExternalEndpoint(
            `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${changeDateByDays(
                date,
                -2,
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
    const allEarthquakeMagnitudes: number[] =
        earthquakeData?.features?.map((f: any) => f.properties.mag as number) ?? [];
    const maximumMagnitude = Math.max(...allEarthquakeMagnitudes);

    const earthquakesMeasure = allEarthquakeMagnitudes.reduce((previous, next) => previous + next, 0);

    const totalUpcomingElectionEvents: number = fecCalendarEvents?.pagination?.count ?? 0;

    const previousPrice = previousPriceHistory?.dollarValue ?? DEFAULT_PRICE;

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

    const dollarValue = (await getPriceForStabilityEnterprises(inputToModel)) ?? previousPrice;

    const previousDividendPayout = await maybePayoutDividend(
        isDevelopmentTest,
        stockId,
        dollarValue,
        date,
        previousCalculationNotes.previousDividendPayout,
        {
            minimumGapInHours: DIVIDEND_PAYOUTS_MINIMUM_GAP_IN_HOURS,
            percentOfValue: PERCENT_OF_STOCK,
            percentProbabilityOfDividend: PERCENT_PROBABILITY_OF_DIVIDEND,
        },
    );

    const calculationNotes: IStabilityEnterprisesCalculationNotes = {
        ...inputToModel,
        previousDividendPayout,
        previousEarthquakesMeasure: earthquakesMeasure,
        previousElectionEvents: totalUpcomingElectionEvents,
    };

    return {
        calculationNotes,
        dollarValue,
    };
};
