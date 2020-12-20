import { getPriceForAgriColaInc, IAgriColaIncInputData } from "@stochastic-exchange/ml-models";
import { callOnExternalEndpoint } from "../../../utils/callOnExternalEndpoint";
import { changeDateByDays } from "../../../utils/dateUtil";
import { averageOfNumberArray, averageOfObjectsArray } from "../../../utils/mathUtils";
import { IStockPricerPlugin } from "../types";

const DEFAULT_PRICE = 25;

export const priceAgriColaInc: IStockPricerPlugin = async (date, stock, totalOwnedStock, previousPriceHistory) => {
    const [historicalStockData, weatherHistoricalCast] = await Promise.all([
        callOnExternalEndpoint(
            `https://finnhub.io/api/v1/stock/candle?symbol=CTVA&resolution=60&from=${Math.round(
                changeDateByDays(new Date(), -10).valueOf() / 1000,
            )}&to=${Math.round(date.valueOf() / 1000)}&token=${process.env.FINNHUB_TOKEN}`,
        ),
        callOnExternalEndpoint(
            `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=39.739071&lon=-75.539787&dt=${Math.round(
                date.valueOf() / 1000,
            )}&appid=${process.env.OPEN_WEATHER_MAP}`,
        ),
    ]);

    const previousCalculationNotes = JSON.parse(previousPriceHistory?.calculationNotes ?? "{}");

    const previousAverage = previousCalculationNotes.averagePrice ?? DEFAULT_PRICE;
    const currentAverage = averageOfNumberArray(historicalStockData?.c ?? []);

    const previousAverageTemperatureInCelsius = previousCalculationNotes.averageTemperateInCelsius ?? 1;
    const averageTemperateInCelsius = averageOfObjectsArray(weatherHistoricalCast.hourly, "temp");

    const previousAverageWindSpeed = previousCalculationNotes.averageWindSpeed ?? 0;
    const averageWindSpeed = averageOfObjectsArray(weatherHistoricalCast.hourly ?? [], "wind_speed");

    const percentOwnership = totalOwnedStock / stock.totalQuantity;

    const previousPrice = previousPriceHistory?.dollarValue ?? DEFAULT_PRICE;

    const inputToModel: IAgriColaIncInputData = {
        averageTemperateInCelsius: averageTemperateInCelsius ?? previousAverageTemperatureInCelsius,
        averageWindSpeed: averageWindSpeed ?? previousAverageWindSpeed,
        averagePrice: currentAverage ?? previousAverage,
        percentOwnership,
        previousPrice,
    };
    const dollarValue = await getPriceForAgriColaInc(inputToModel);

    if (dollarValue === undefined) {
        return { dollarValue: previousPrice };
    }

    return {
        calculationNotes: JSON.stringify(inputToModel),
        dollarValue,
    };
};
