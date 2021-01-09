import { getPriceForDentalDamageAndCompany, IDentalDamageAndCompanyInputData } from "@stochastic-exchange/ml-models";
import { callOnExternalEndpoint } from "../../../utils/callOnExternalEndpoint";
import { changeDateByDays } from "../../../utils/dateUtil";
import { formatDateWithSeparator } from "../../../utils/formatDateWithSeparator";
import { getChangeInValueSinceLastMeasurement } from "../../../utils/getChangeInValueSinceLastMeasurement";
import { IStockPricerPlugin } from "../types";

const DEFAULT_VALUE = 450;

interface IDentalDamageAndCompanyCalculationNotes extends IDentalDamageAndCompanyInputData {
    previousAveragePalladiumPrice: number;
    previousAveragePlatinumPrice: number;
    previousUsDairyPricesAverage: number;
    previousUsMilkSupplyAverage: number;
}

function getAverageOf2020Values(data: any[][]) {
    if (data === undefined || data.length === 0) {
        return undefined;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return (
        data
            .slice()
            .filter(d => (d[5] as string).includes("2020"))
            .reduce((previous, next) => previous + (next[7] as number), 0) / data.length
    );
}

function getAverageUsPriceOfMetal(data: any[]) {
    if (data === undefined || data.length === 0) {
        return undefined;
    }

    const firstNumber = data[1] as number;

    return (firstNumber + ((data[4] as number) ?? firstNumber)) / 2;
}

export const priceDentalDamageAndCompany: IStockPricerPlugin<IDentalDamageAndCompanyCalculationNotes> = async (
    date,
    _metadata,
    previousPriceHistory,
) => {
    const previousDay = changeDateByDays(date, -2);
    const previousDayHyphenated = formatDateWithSeparator(previousDay);

    const [usDairyPrices, usMilkSupply] = await Promise.all([
        callOnExternalEndpoint(
            `https://www.quandl.com/api/v3/datatables/WASDE/DATA?code=DAIRY_US_34&report_month=${date.getFullYear()}-${date.getMonth() +
                1}&api_key=${process.env.QUANDL_KEY ?? ""}`,
        ),
        callOnExternalEndpoint(
            `https://www.quandl.com/api/v3/datatables/WASDE/DATA?code=MILK_US_33&report_month=${date.getFullYear()}-${date.getMonth() +
                1}&api_key=${process.env.QUANDL_KEY ?? ""}`,
        ),
    ]);

    const [palladiumPrices, platinumPrices] = await Promise.all([
        callOnExternalEndpoint(
            `https://www.quandl.com/api/v3/datasets/LPPM/PALL?start_date=${previousDayHyphenated}&end_date=${previousDayHyphenated}&api_key=${process
                .env.QUANDL_KEY ?? ""}`,
        ),
        callOnExternalEndpoint(
            `https://www.quandl.com/api/v3/datasets/LPPM/PLAT?start_date=${previousDayHyphenated}&end_date=${previousDayHyphenated}&api_key=${process
                .env.QUANDL_KEY ?? ""}`,
        ),
    ]);

    const previousCalculationNotes: Partial<IDentalDamageAndCompanyCalculationNotes> = JSON.parse(
        previousPriceHistory?.calculationNotes ?? "{}",
    );

    const usDairyPricesAverageValue =
        getAverageOf2020Values(usDairyPrices?.datatable?.data) ??
        previousCalculationNotes.previousUsDairyPricesAverage ??
        0;

    const usMilkSupplyAverageValue =
        getAverageOf2020Values(usMilkSupply?.datatable?.data) ??
        previousCalculationNotes.previousUsMilkSupplyAverage ??
        0;

    const averagePalladiumPriceToday =
        getAverageUsPriceOfMetal(palladiumPrices?.dataset?.data?.[0]) ??
        previousCalculationNotes.previousAveragePalladiumPrice ??
        0;

    const averagePlatinumPriceToday =
        getAverageUsPriceOfMetal(platinumPrices?.dataset?.data?.[0]) ??
        previousCalculationNotes.previousAveragePlatinumPrice ??
        0;

    const previousPrice = previousPriceHistory?.dollarValue ?? DEFAULT_VALUE;

    const inputToModel: IDentalDamageAndCompanyInputData = {
        changeInPalladiumPrice: getChangeInValueSinceLastMeasurement(
            averagePalladiumPriceToday,
            previousCalculationNotes.previousAveragePalladiumPrice,
        ),
        changeInPlatinumPrice: getChangeInValueSinceLastMeasurement(
            averagePlatinumPriceToday,
            previousCalculationNotes.previousAveragePlatinumPrice,
        ),
        changeInUsDairyPricesAverageValue: getChangeInValueSinceLastMeasurement(
            usDairyPricesAverageValue,
            previousCalculationNotes.previousUsDairyPricesAverage,
        ),
        changeInUsMilkSupplyAverageValue: getChangeInValueSinceLastMeasurement(
            usMilkSupplyAverageValue,
            previousCalculationNotes.previousUsMilkSupplyAverage,
        ),
        previousPrice,
    };

    const dollarValue = await getPriceForDentalDamageAndCompany(inputToModel);

    const calculationNotes: IDentalDamageAndCompanyCalculationNotes = {
        ...inputToModel,
        previousAveragePalladiumPrice: averagePalladiumPriceToday,
        previousAveragePlatinumPrice: averagePlatinumPriceToday,
        previousUsDairyPricesAverage: usDairyPricesAverageValue,
        previousUsMilkSupplyAverage: usMilkSupplyAverageValue,
    };

    return {
        calculationNotes,
        dollarValue: dollarValue ?? previousPrice,
    };
};
