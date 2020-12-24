import { StockModel } from "./stockModel";

const convertViruzMeNotInputToArray = (input: IViruzMeNotInputData) => [
    input.changeInCurrentlyHospitalized,
    input.changeInCriticalCommunityThreats,
    input.percentOwnership,
    input.previousPrice,
];

const ViruzMeNotModel = new StockModel<IViruzMeNotInputData>(
    {
        epochs: 200,
        name: "viruz-me-not-v1",
    },
    convertViruzMeNotInputToArray,
);

export interface IViruzMeNotInputData {
    changeInCurrentlyHospitalized: number;
    changeInCriticalCommunityThreats: number;
    percentOwnership: number;
    previousPrice: number;
}

export const getPriceForViruzMeNot = ViruzMeNotModel.getPrice;

export const trainModelForViruzMeNot = ViruzMeNotModel.trainModel([]);
