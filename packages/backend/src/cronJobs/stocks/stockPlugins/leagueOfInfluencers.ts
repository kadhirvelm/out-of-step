import { ILeagueOfInfluencersInputData, getPriceForLeagueOfInfluencers } from "@stochastic-exchange/ml-models";
import { callOnExternalEndpoint } from "../../../utils/callOnExternalEndpoint";
import { changeDateByDays } from "../../../utils/dateUtil";
import { formatDateWithSeparator } from "../../../utils/formatDateWithSeparator";
import { getChangeInValueSinceLastMeasurement } from "../../../utils/getChangeInValueSinceLastMeasurement";
import { IStockPricerPlugin } from "../types";

interface ILeagueOfInfluencersCalculationNotes extends ILeagueOfInfluencersInputData {
    previousTotalGovernmentBills: number;
}

const DEFAULT_VALUE = 200;

export const priceLeagueOfInfluencers: IStockPricerPlugin<ILeagueOfInfluencersCalculationNotes> = async (
    date,
    _metadata,
    previousPriceHistory,
) => {
    const previousDate = changeDateByDays(date, -2);
    const todaysDate = formatDateWithSeparator(previousDate);

    const [totalGovernmentBills, airPollutionInDC, airPollutionInSF, airPollutionInNY] = await Promise.all([
        callOnExternalEndpoint(
            `https://api.govinfo.gov/collections/BILLS/${todaysDate}T00%3A0%3A00Z?offset=0&pageSize=1&api_key=${process
                .env.DATA_GOV ?? ""}
            `,
        ),
        callOnExternalEndpoint(
            `http://api.airvisual.com/v2/city?city=Washington&state=Washington, D.C.&country=USA&key=${process.env
                .IQAIR_KEY ?? ""}`,
        ),
        callOnExternalEndpoint(
            `http://api.airvisual.com/v2/city?city=San Francisco&state=California&country=USA&key=${process.env
                .IQAIR_KEY ?? ""}`,
        ),
        callOnExternalEndpoint(
            `http://api.airvisual.com/v2/city?city=New York City&state=New York&country=USA&key=${process.env
                .IQAIR_KEY ?? ""}`,
        ),
    ]);

    const previousCalculationNotes: Partial<ILeagueOfInfluencersCalculationNotes> = JSON.parse(
        previousPriceHistory?.calculationNotes ?? "{}",
    );

    const totalGovernmentBillsCount =
        totalGovernmentBills?.count ?? previousCalculationNotes.previousTotalGovernmentBills ?? 0;

    const airQualityIndexInDC: number = airPollutionInDC?.data?.current?.pollution?.aqius;
    const airQualityIndexInSF: number = airPollutionInSF?.data?.current?.pollution?.aqius;
    const airQualityIndexInNY: number = airPollutionInNY?.data?.current?.pollution?.aqius;

    const previousAirQualityIndex = previousCalculationNotes.airQualityIndex ?? 50;
    const averageAirQualityIndex = (airQualityIndexInDC + airQualityIndexInSF + airQualityIndexInNY) / 3;

    const previousPrice = previousPriceHistory?.dollarValue ?? DEFAULT_VALUE;

    const inputToModel: ILeagueOfInfluencersInputData = {
        airQualityIndex: averageAirQualityIndex ?? previousAirQualityIndex,
        changeInGovernmentBills: getChangeInValueSinceLastMeasurement(
            totalGovernmentBillsCount,
            previousCalculationNotes.previousTotalGovernmentBills,
        ),
        previousPrice,
    };

    const dollarValue = await getPriceForLeagueOfInfluencers(inputToModel);

    const calculationNotes: ILeagueOfInfluencersCalculationNotes = {
        ...inputToModel,
        previousTotalGovernmentBills: totalGovernmentBillsCount,
    };

    return {
        calculationNotes,
        dollarValue: dollarValue ?? DEFAULT_VALUE,
    };
};
