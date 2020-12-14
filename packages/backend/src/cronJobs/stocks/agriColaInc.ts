import { callOnExternalEndpoint } from "../../utils/callOnExternalEndpoint";
import { averageOfNumberArray, averageOfObjectsArray } from "../../utils/mathUtils";
import { IStockPricerPlugin } from "./types";

export const priceAgriColaInc: IStockPricerPlugin = async (date, stock, totalOwnedStock, previousPriceHistory) => {
    // for a given date
    // get the historical average
    // UV reading
    // and weather
    // delta --> historical_low * temp_in_C - historical_high * UV_reading
    // new dollar --> previousPriceHistory + (delta * (1.1 - %ownership))

    const [historicalStockData, weatherHistoricalCast] = await Promise.all([
        callOnExternalEndpoint(
            `https://finnhub.io/api/v1/stock/candle?symbol=CTVA&resolution=60&from=${new Date(
                date.valueOf() - 1000 * 60 * 60 * 12,
            ).valueOf() / 1000}&to=${date.valueOf() / 1000}&token=${process.env.FINNHUB_TOKEN}`,
        ),
        callOnExternalEndpoint(
            `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=39.739071&lon=-75.539787&dt=${date.valueOf() /
                1000}&appid=${process.env.OPEN_WEATHER_MAP}`,
        ),
    ]);

    const lowPriceAverage = averageOfNumberArray(historicalStockData?.l ?? []);
    const highPriceAverage = averageOfNumberArray(historicalStockData?.h ?? []);

    const averageTemperateInCelsius = (averageOfObjectsArray(weatherHistoricalCast.hourly, "temp") ?? 274.15) - 273.15;
    const averageWeatherSpeed = averageOfObjectsArray(weatherHistoricalCast.hourly, "wind_speed") ?? 1;

    const deltaFromPreviousDollar =
        (lowPriceAverage ?? 0) * Math.max(averageTemperateInCelsius, 1) - (highPriceAverage ?? 0) * averageWeatherSpeed;

    const accountForOwnership = 1 - totalOwnedStock / stock.totalQuantity;

    // TODO: come up with some ML model that will price this automatically...this is painful af

    return { dollarValue: (previousPriceHistory?.dollarValue ?? 25) + deltaFromPreviousDollar * accountForOwnership };
};
