import { IViruzMeNotInputData, getPriceForViruzMeNot } from "@stochastic-exchange/ml-models";
import { callOnExternalEndpoint } from "../../../utils/callOnExternalEndpoint";
import { getChangeInValueSinceLastMeasurement } from "../../../utils/getChangeInValueSinceLastMeasurement";
import { IStockPricerPlugin } from "../types";

const DEFAULT_VALUE = 0.78;

interface IViruzMeNotCalculationNotes extends IViruzMeNotInputData {
    previousCriticalCommunityThreatsFromIpAddresses: number;
    previouslyHospitalized: number;
}

export const priceViruzMeNot: IStockPricerPlugin<IViruzMeNotCalculationNotes> = async (
    _date,
    _metadata,
    previousPriceHistory,
) => {
    const [rawCovidResult, criticalCommunityThreatsFromIpAddresses] = await Promise.all([
        callOnExternalEndpoint("https://api.covidtracking.com/v1/us/current.json"),
        callOnExternalEndpoint(
            "https://pulsedive.com/api/search.php?type%5B%5D=ip&risk%5B%5D=critical&retired=false&limit=hundred&lastseen=day&search=indicators&pretty=true",
        ),
    ]);

    const previousCalculationNotes: Partial<IViruzMeNotCalculationNotes> = JSON.parse(
        previousPriceHistory?.calculationNotes ?? "{}",
    );

    const currentlyHospitalized: number =
        rawCovidResult?.[0]?.hospitalizedCurrently ?? previousCalculationNotes.previouslyHospitalized ?? 0;

    const totalCriticalCommunityThreatsFromIpAddresses =
        criticalCommunityThreatsFromIpAddresses?.results?.length ??
        previousCalculationNotes.previousCriticalCommunityThreatsFromIpAddresses ??
        0;

    const previousPrice = previousPriceHistory?.dollarValue ?? DEFAULT_VALUE;

    const inputToModel: IViruzMeNotInputData = {
        changeInCurrentlyHospitalized: getChangeInValueSinceLastMeasurement(
            currentlyHospitalized,
            previousCalculationNotes.previouslyHospitalized,
        ),
        changeInCriticalCommunityThreats: getChangeInValueSinceLastMeasurement(
            totalCriticalCommunityThreatsFromIpAddresses,
            previousCalculationNotes.previousCriticalCommunityThreatsFromIpAddresses,
        ),
        previousPrice,
    };

    const dollarValue = await getPriceForViruzMeNot(inputToModel);

    const calculationNotes: IViruzMeNotCalculationNotes = {
        ...inputToModel,
        previousCriticalCommunityThreatsFromIpAddresses: totalCriticalCommunityThreatsFromIpAddresses,
        previouslyHospitalized: currentlyHospitalized,
    };

    return {
        calculationNotes,
        dollarValue: dollarValue ?? previousPrice,
    };
};
