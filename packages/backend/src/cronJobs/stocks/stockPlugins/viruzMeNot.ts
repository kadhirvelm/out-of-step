import { IViruzMeNotInputData, getPriceForViruzMeNot } from "@stochastic-exchange/ml-models";
import { callOnExternalEndpoint } from "../../../utils/callOnExternalEndpoint";
import { IStockPricerPlugin } from "../types";

const DEFAULT_VALUE = 0.78;

interface IViruzMeNotCalculationNotes extends IViruzMeNotInputData {
    previousCriticalCommunityThreatsFromIpAddresses: number;
    previouslyHospitalized: number;
}

export const priceViruzMeNot: IStockPricerPlugin = async (_date, stock, totalOwnedStock, previousPriceHistory) => {
    const [[currentCovidNumbers], criticalCommunityThreatsFromIpAddresses] = await Promise.all([
        callOnExternalEndpoint("https://api.covidtracking.com/v1/us/current.json"),
        callOnExternalEndpoint(
            "https://pulsedive.com/api/search.php?type%5B%5D=ip&risk%5B%5D=critical&retired=false&limit=hundred&lastseen=day&search=indicators&pretty=true",
        ),
    ]);

    const previousCalculationNotes: Partial<IViruzMeNotCalculationNotes> = JSON.parse(
        previousPriceHistory?.calculationNotes ?? "{}",
    );

    const currentlyHospitalized: number = currentCovidNumbers.hospitalizedCurrently;
    const changeInCurrentlyHospitalized =
        (previousCalculationNotes.previouslyHospitalized ?? currentlyHospitalized) - currentlyHospitalized;

    const totalCriticalCommunityThreatsFromIpAddresses = criticalCommunityThreatsFromIpAddresses.results.length;
    const changeInCriticalCommunityThreats =
        (previousCalculationNotes.previousCriticalCommunityThreatsFromIpAddresses ??
            totalCriticalCommunityThreatsFromIpAddresses) - totalCriticalCommunityThreatsFromIpAddresses;

    const percentOwnership = (totalOwnedStock / stock.totalQuantity) * 100;

    const previousPrice = previousPriceHistory?.dollarValue ?? DEFAULT_VALUE;

    const inputToModel: IViruzMeNotInputData = {
        changeInCurrentlyHospitalized,
        changeInCriticalCommunityThreats,
        percentOwnership,
        previousPrice,
    };

    const dollarValue = await getPriceForViruzMeNot(inputToModel);

    const calculationNotes: IViruzMeNotCalculationNotes = {
        ...inputToModel,
        previousCriticalCommunityThreatsFromIpAddresses: totalCriticalCommunityThreatsFromIpAddresses,
        previouslyHospitalized: currentlyHospitalized,
    };

    return {
        calculationNotes: JSON.stringify(calculationNotes),
        dollarValue: dollarValue ?? previousPrice,
    };
};
