import { getPriceForBitAndGamble, IBitAndGambleInputData } from "@stochastic-exchange/ml-models";
import { callOnExternalEndpoint } from "../../../utils/callOnExternalEndpoint";
import { changeDateByDays } from "../../../utils/dateUtil";
import { IStockPricerPlugin } from "../types";

const DEFAULT_VALUE = 22000;

interface IBitAndGambleCalculationNotes extends IBitAndGambleInputData {
    previousAverageInitialClaimsForUnemployment: number;
    previousBitCoinValue: number;
}

function getAverageFromFREDData(data: any) {
    if (data.length === 0) {
        return undefined;
    }

    return data.reduce((previous: number, next: [string, number]) => previous + next[1], 0) / data.length;
}

export const priceBitAndGamble: IStockPricerPlugin = async (date, stock, totalOwnedStock, previousPriceHistory) => {
    const [effectiveFederalFundsRate, initialClaimsForUnemployment, currentBitCoinValue] = await Promise.all([
        callOnExternalEndpoint(
            `https://www.quandl.com/api/v3/datasets/FRED/DFF?start_date=${changeDateByDays(
                date,
                -5,
            ).toDateString()}&end_date=${changeDateByDays(date, -4).toDateString()}&api_key=${process.env.QUANDL_KEY}`,
        ),
        callOnExternalEndpoint(
            `https://www.quandl.com/api/v3/datasets/FRED/ICSA?start_date=${changeDateByDays(
                date,
                -20,
            ).toDateString()}&end_date=${date.toDateString()}&api_key=${process.env.QUANDL_KEY}`,
        ),
        callOnExternalEndpoint("https://api.coindesk.com/v1/bpi/currentprice.json"),
    ]);

    const previousCalculationNotes: Partial<IBitAndGambleCalculationNotes> = JSON.parse(
        previousPriceHistory?.calculationNotes ?? "{}",
    );

    const averageEffectiveFederalFundsRate =
        getAverageFromFREDData(effectiveFederalFundsRate.dataset.data) ??
        previousCalculationNotes.averageEffectiveFederalFundsRate ??
        0;

    const averageInitialClaimsForUnemployment =
        getAverageFromFREDData(initialClaimsForUnemployment.dataset.data) ??
        previousCalculationNotes.previousAverageInitialClaimsForUnemployment ??
        0;
    const changeInAverageInitialClaimsForUnemployment =
        (previousCalculationNotes?.previousAverageInitialClaimsForUnemployment ?? averageInitialClaimsForUnemployment) -
        averageInitialClaimsForUnemployment;

    const currentBitCoinPrice = currentBitCoinValue.bpi.USD.rate_float;
    const changeInBitCoinValue =
        (previousCalculationNotes.previousBitCoinValue ?? currentBitCoinPrice) - currentBitCoinPrice;

    const percentOwnership = totalOwnedStock / stock.totalQuantity;

    const previousPrice = previousPriceHistory?.dollarValue ?? DEFAULT_VALUE;

    const inputToModel: IBitAndGambleInputData = {
        averageEffectiveFederalFundsRate,
        changeInBitCoinValue,
        changeInAverageInitialClaimsForUnemployment,
        percentOwnership,
        previousPrice,
    };

    const dollarValue = await getPriceForBitAndGamble(inputToModel);

    const calculationNotes: IBitAndGambleCalculationNotes = {
        ...inputToModel,
        previousAverageInitialClaimsForUnemployment: averageInitialClaimsForUnemployment,
        previousBitCoinValue: currentBitCoinPrice,
    };

    return {
        calculationNotes: JSON.stringify(calculationNotes),
        dollarValue: dollarValue ?? previousPrice,
    };
};
