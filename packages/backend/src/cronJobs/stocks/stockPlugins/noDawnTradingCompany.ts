import { getPriceForNoDawnTradingCompany, INoDawnTradingCompanyInputData } from "@stochastic-exchange/ml-models";
import { callOnExternalEndpoint } from "../../../utils/callOnExternalEndpoint";
import { changeDateByDays } from "../../../utils/dateUtil";
import { formatDateWithSeparator } from "../../../utils/formatDateWithSeparator";
import { getChangeInValueSinceLastMeasurement } from "../../../utils/getChangeInValueSinceLastMeasurement";
import { IStockPricerPlugin } from "../types";

const DEFAULT_PRICE = 25;

interface INoDawnTradingCompanyCalculationNotes extends INoDawnTradingCompanyInputData {
    previousGoldPrice: number;
    previousSilverPrice: number;
    previousTreasuryRealYieldCurveRate: number;
}

export const priceNoDawnTradingCompany: IStockPricerPlugin<INoDawnTradingCompanyCalculationNotes> = async (
    date,
    _metadata,
    previousPriceHistory,
) => {
    const theDayBefore = changeDateByDays(date, -2);
    const dateHyphenated = formatDateWithSeparator(theDayBefore);

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

    const previousCalculationNotes: Partial<INoDawnTradingCompanyCalculationNotes> = JSON.parse(
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

    const inputToModel: INoDawnTradingCompanyInputData = {
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

    const dollarValue = await getPriceForNoDawnTradingCompany(inputToModel);

    const calculationNotes: INoDawnTradingCompanyCalculationNotes = {
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
