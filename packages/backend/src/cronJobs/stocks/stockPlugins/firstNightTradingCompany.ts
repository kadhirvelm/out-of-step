import {
    getPriceForFirstNightTradingCompany,
    IFirstNightTradingCompanyInputData,
} from "@stochastic-exchange/ml-models";
import { callOnExternalEndpoint } from "../../../utils/callOnExternalEndpoint";
import { getChangeInValueSinceLastMeasurement } from "../../../utils/getChangeInValueSinceLastMeasurement";
import { IStockPricerPlugin } from "../types";

const DEFAULT_PRICE = 25;

interface IFirstNightTradingCompanyCalculationNotes extends IFirstNightTradingCompanyInputData {
    previousGoldPrice: number;
    previousSilverPrice: number;
    previousTreasuryRealYieldCurveRate: number;
}

export const priceFirstNightTradingCompany: IStockPricerPlugin<IFirstNightTradingCompanyCalculationNotes> = async (
    date,
    previousPriceHistory,
) => {
    const dateHyphenated = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    const [goldRates, silverRates, treasuryRealYieldCurveRate] = await Promise.all([
        callOnExternalEndpoint(
            `https://www.quandl.com/api/v3/datasets/LBMA/GOLD?start_date=${dateHyphenated}&end_date=${dateHyphenated}&api_key=${process
                .env.QUANDL_KEY ?? ""}`,
        ),
        callOnExternalEndpoint(
            `https://www.quandl.com/api/v3/datasets/LBMA/SILVER?start_date=${dateHyphenated}&end_date=${dateHyphenated}&api_key=${process
                .env.QUANDL_KEY ?? ""}`,
        ),
        callOnExternalEndpoint(
            `https://www.quandl.com/api/v3/datasets/USTREASURY/REALYIELD?start_date=${dateHyphenated}&end_date=${dateHyphenated}&api_key=${process
                .env.QUANDL_KEY ?? ""}`,
        ),
    ]);

    const previousCalculationNotes: Partial<IFirstNightTradingCompanyCalculationNotes> = JSON.parse(
        previousPriceHistory?.calculationNotes ?? "{}",
    );

    const currentGoldPrice = goldRates?.dataset?.data?.[0]?.[1] ?? previousCalculationNotes.previousGoldPrice ?? 0;

    const currentSilverPrice =
        silverRates?.dataset?.data?.[0]?.[1] ?? previousCalculationNotes.previousSilverPrice ?? 0;

    const currentTreasuryYieldRate =
        treasuryRealYieldCurveRate?.dataset?.data?.[0]?.[1] ??
        previousCalculationNotes.previousTreasuryRealYieldCurveRate ??
        0;

    const previousPrice = previousPriceHistory?.dollarValue ?? DEFAULT_PRICE;

    const inputToModel: IFirstNightTradingCompanyInputData = {
        changeInGoldPrice: getChangeInValueSinceLastMeasurement(
            currentGoldPrice,
            previousCalculationNotes.previousGoldPrice,
        ),
        changeInSilverPrice: getChangeInValueSinceLastMeasurement(
            currentSilverPrice,
            previousCalculationNotes.previousSilverPrice,
        ),
        changeInTreasuryRealYieldCurveRate: getChangeInValueSinceLastMeasurement(
            currentTreasuryYieldRate,
            previousCalculationNotes.previousTreasuryRealYieldCurveRate,
        ),
        previousPrice,
    };

    const dollarValue = await getPriceForFirstNightTradingCompany(inputToModel);

    const calculationNotes: IFirstNightTradingCompanyCalculationNotes = {
        ...inputToModel,
        previousGoldPrice: currentGoldPrice,
        previousSilverPrice: currentSilverPrice,
        previousTreasuryRealYieldCurveRate: currentTreasuryYieldRate,
    };

    return {
        calculationNotes,
        dollarValue: dollarValue ?? DEFAULT_PRICE,
    };
};
