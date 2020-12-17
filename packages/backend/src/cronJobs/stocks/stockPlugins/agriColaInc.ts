import { getPriceForAgriColaInc, IAgriColaIncInputData } from "@stochastic-exchange/ml-models";
import { callOnExternalEndpoint } from "../../../utils/callOnExternalEndpoint";
import { changeDateByDays } from "../../../utils/dateUtil";
import { averageOfNumberArray, averageOfObjectsArray } from "../../../utils/mathUtils";
import { IStockPricerPlugin } from "../types";

const DEFAULT_VALUE = 25;

export const priceAgriColaInc: IStockPricerPlugin = async (date, stock, totalOwnedStock, previousPriceHistory) => {
    const [historicalStockData, weatherHistoricalCast] = await Promise.all([
        callOnExternalEndpoint(
            `https://finnhub.io/api/v1/stock/candle?symbol=CTVA&resolution=60&from=${changeDateByDays(
                new Date(),
                -0.5,
            ).valueOf() / 1000}&to=${date.valueOf() / 1000}&token=${process.env.FINNHUB_TOKEN}`,
        ),
        callOnExternalEndpoint(
            `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=39.739071&lon=-75.539787&dt=${Math.round(
                date.valueOf() / 1000,
            )}&appid=${process.env.OPEN_WEATHER_MAP}`,
        ),
    ]);

    const lowPriceAverage = averageOfNumberArray(historicalStockData?.l ?? []);
    const highPriceAverage = averageOfNumberArray(historicalStockData?.h ?? []);

    const averageTemperateInCelsius = (averageOfObjectsArray(weatherHistoricalCast.hourly, "temp") ?? 273.15) - 273.15;
    const averageWindSpeed = averageOfObjectsArray(weatherHistoricalCast.hourly, "wind_speed") ?? 0;

    const percentOwnership = totalOwnedStock / stock.totalQuantity;

    const previousPrice = previousPriceHistory?.dollarValue ?? DEFAULT_VALUE;

    const inputToModel: IAgriColaIncInputData = {
        averageTemperateInCelsius,
        averageWindSpeed,
        highPriceAverage: highPriceAverage ?? previousPrice,
        lowPriceAverage: lowPriceAverage ?? previousPrice,
        percentOwnership,
        previousPrice,
    };
    const dollarValue = await getPriceForAgriColaInc(inputToModel);

    if (dollarValue === undefined) {
        return { dollarValue: previousPriceHistory?.dollarValue ?? DEFAULT_VALUE };
    }

    return {
        calculationNotes: JSON.stringify(inputToModel),
        dollarValue,
    };
};
