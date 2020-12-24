import { getPriceForAgriColaInc, IAgriColaIncInputData } from "@stochastic-exchange/ml-models";
import { callOnExternalEndpoint } from "../../../utils/callOnExternalEndpoint";
import { changeDateByDays } from "../../../utils/dateUtil";
import { averageOfNumberArray, averageOfObjectsArray } from "../../../utils/mathUtils";
import { IStockPricerPlugin } from "../types";

const DEFAULT_PRICE = 25;

interface IAgriColaCalculationNotes extends IAgriColaIncInputData {
    averagePrice: number;
}

function normalizeCelsiusIfDefined(maybeKelvinValue: number | undefined) {
    if (maybeKelvinValue === undefined) {
        return undefined;
    }

    return maybeKelvinValue - 273.15;
}

export const priceAgriColaInc: IStockPricerPlugin = async (date, stock, totalOwnedStock, previousPriceHistory) => {
    const [historicalStockDataOfCTVA, weatherHistoricalCast] = await Promise.all([
        callOnExternalEndpoint(
            `https://finnhub.io/api/v1/stock/candle?symbol=CTVA&resolution=60&from=${Math.round(
                changeDateByDays(new Date(), -10).valueOf() / 1000,
            )}&to=${Math.round(date.valueOf() / 1000)}&token=${process.env.FINNHUB_TOKEN ?? ""}`,
        ),
        callOnExternalEndpoint(
            `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=39.739071&lon=-75.539787&dt=${Math.round(
                date.valueOf() / 1000,
            )}&appid=${process.env.OPEN_WEATHER_MAP ?? ""}`,
        ),
    ]);

    const previousCalculationNotes: Partial<IAgriColaCalculationNotes> = JSON.parse(
        previousPriceHistory?.calculationNotes ?? "{}",
    );

    const currentAverageOfCTVA = averageOfNumberArray(historicalStockDataOfCTVA?.c ?? []);
    const previousAverageOfCTVA = previousCalculationNotes.averagePrice ?? currentAverageOfCTVA ?? 0;

    const previousAverageTemperatureInCelsius = previousCalculationNotes.averageTemperateInCelsius ?? 1;
    const averageTemperateInCelsius = normalizeCelsiusIfDefined(
        averageOfObjectsArray(weatherHistoricalCast.hourly, "temp"),
    );

    const previousAverageWindSpeed = previousCalculationNotes.averageWindSpeed ?? 0;
    const averageWindSpeed = averageOfObjectsArray(weatherHistoricalCast.hourly ?? [], "wind_speed");

    const percentOwnership = (totalOwnedStock / stock.totalQuantity) * 100;

    const previousPrice = previousPriceHistory?.dollarValue ?? DEFAULT_PRICE;

    const inputToModel: IAgriColaIncInputData = {
        averageTemperateInCelsius: averageTemperateInCelsius ?? previousAverageTemperatureInCelsius,
        averageWindSpeed: averageWindSpeed ?? previousAverageWindSpeed,
        changeInAveragePrice: (currentAverageOfCTVA ?? previousAverageOfCTVA) - previousAverageOfCTVA,
        percentOwnership,
        previousPrice,
    };
    const dollarValue = await getPriceForAgriColaInc(inputToModel);

    const calculationNotes: IAgriColaCalculationNotes = {
        ...inputToModel,
        averagePrice: currentAverageOfCTVA ?? previousAverageOfCTVA,
    };

    return {
        calculationNotes: JSON.stringify(calculationNotes),
        dollarValue: dollarValue ?? previousPrice,
    };
};
