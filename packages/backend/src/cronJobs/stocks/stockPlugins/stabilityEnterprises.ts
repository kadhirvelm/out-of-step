import { getPriceForStabilityEnterprises, IStabilityEnterprisesInputData } from "@stochastic-exchange/ml-models";
import { callOnExternalEndpoint } from "../../../utils/callOnExternalEndpoint";
import { changeDateByDays } from "../../../utils/dateUtil";
import { IStockPricerPlugin } from "../types";

const DEFAULT_VALUE = 12;

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
            `https://api.open.fec.gov/v1/calendar-dates/?min_start_date=${date.toLocaleDateString()}&api_key=${
                process.env.DATA_GOV
            }&page=1&per_page=1`,
        ),
    ]);

    const allEarthquakeMagnitudes: number[] = earthquakeData.features.map((f: any) => f.properties.mag);
    const minimumMagnitude = Math.min(...allEarthquakeMagnitudes);
    const maximumMagnitude = Math.max(...allEarthquakeMagnitudes);
    const totalEarthquakes = allEarthquakeMagnitudes.reduce((previous, next) => previous + next, 0);
    const averageMagnitude = totalEarthquakes / allEarthquakeMagnitudes.length;

    const totalUpcomingElectionEvents = fecCalendarEvents.pagination.count;

    const percentOwnership = totalOwnedStock / stock.totalQuantity;

    const previousPrice = previousPriceHistory?.dollarValue ?? DEFAULT_VALUE;

    const inputToModel: IStabilityEnterprisesInputData = {
        averageMagnitude,
        maximumMagnitude,
        minimumMagnitude,
        percentOwnership,
        previousPrice,
        totalEarthquakes,
        totalUpcomingElectionEvents,
    };

    const dollarValue = await getPriceForStabilityEnterprises(inputToModel);

    if (dollarValue === undefined) {
        return { dollarValue: previousPriceHistory?.dollarValue ?? DEFAULT_VALUE };
    }

    return {
        calculationNotes: JSON.stringify(inputToModel),
        dollarValue,
    };
};
