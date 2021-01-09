import { getPriceForAgriColaInc, IAgriColaIncInputData } from "@stochastic-exchange/ml-models";
import _ from "lodash";
import { callOnExternalEndpoint } from "../../../utils/callOnExternalEndpoint";
import { changeDateByDays } from "../../../utils/dateUtil";
import { getChangeInValueSinceLastMeasurement } from "../../../utils/getChangeInValueSinceLastMeasurement";
import { averageOfNumberArray, averageOfObjectsArray } from "../../../utils/mathUtils";
import { IStockPricerPlugin } from "../types";

const DEFAULT_PRICE = 25;

interface IAgriColaCalculationNotes extends IAgriColaIncInputData {
    previousAveragePrice: number;
}

function normalizeCelsiusIfDefined(maybeKelvinValue: number | undefined) {
    if (maybeKelvinValue === undefined) {
        return undefined;
    }

    return maybeKelvinValue - 273.15;
}

export const priceAgriColaInc: IStockPricerPlugin<IAgriColaCalculationNotes> = async (
    date,
    _metadata,
    previousPriceHistory,
) => {
    const [historicalStockDataOfCTVA, weatherHistoricalCast] = await Promise.all([
        callOnExternalEndpoint(
            `https://finnhub.io/api/v1/stock/candle?symbol=CTVA&resolution=60&from=${Math.round(
                changeDateByDays(new Date(), -2).valueOf() / 1000,
            )}&to=${Math.round(date.valueOf() / 1000)}&token=${process.env.FINNHUB_TOKEN ?? ""}`,
        ),
        callOnExternalEndpoint(
            `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=39.74&lon=-75.58&dt=${Math.round(
                date.valueOf() / 1000,
            )}&appid=${process.env.OPEN_WEATHER_MAP ?? ""}`,
        ),
    ]);

    const previousCalculationNotes: Partial<IAgriColaCalculationNotes> = JSON.parse(
        previousPriceHistory?.calculationNotes ?? "{}",
    );

    const currentAverageOfCTVA =
        averageOfNumberArray(historicalStockDataOfCTVA?.c ?? []) ?? previousCalculationNotes.previousAveragePrice ?? 0;

    const previousAverageTemperatureInCelsius = previousCalculationNotes.averageTemperateInCelsius ?? 1;
    const averageTemperateInCelsius = normalizeCelsiusIfDefined(weatherHistoricalCast?.current?.temp);

    const previousAverageWindSpeed = previousCalculationNotes.averageWindSpeed ?? 0;
    const averageWindSpeed = weatherHistoricalCast?.current?.wind_speed;

    const averageRainfall =
        averageOfObjectsArray(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            _.compact((weatherHistoricalCast?.hourly ?? []).map((h: any) => h.rain as { "1h": number } | undefined)),
            "1h",
        ) ?? 0;

    const previousPrice = previousPriceHistory?.dollarValue ?? DEFAULT_PRICE;

    const inputToModel: IAgriColaIncInputData = {
        averageRainfall,
        averageTemperateInCelsius: averageTemperateInCelsius ?? previousAverageTemperatureInCelsius,
        averageWindSpeed: averageWindSpeed ?? previousAverageWindSpeed,
        changeInAveragePrice: getChangeInValueSinceLastMeasurement(
            currentAverageOfCTVA,
            previousCalculationNotes.previousAveragePrice,
        ),
        previousPrice,
    };
    const dollarValue = await getPriceForAgriColaInc(inputToModel);

    const calculationNotes: IAgriColaCalculationNotes = {
        ...inputToModel,
        previousAveragePrice: currentAverageOfCTVA,
    };

    return {
        calculationNotes,
        dollarValue: dollarValue ?? previousPrice,
    };
};
