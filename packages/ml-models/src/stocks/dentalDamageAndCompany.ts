import { StockModel } from "./stockModel";

const convertDentalDamageAndCompanyInputToArray = (input: IDentalDamageAndCompanyInputData) => [
    input.changeInPalladiumPrice,
    input.changeInPlatinumPrice,
    input.changeInUsDairyPricesAverageValue,
    input.changeInUsMilkSupplyAverageValue,
    input.percentOwnership,
    input.previousPrice,
];

const DentalDamageAndCompanyModel = new StockModel<IDentalDamageAndCompanyInputData>(
    {
        epochs: 200,
        name: "dental-damage-and-company-v1",
    },
    convertDentalDamageAndCompanyInputToArray,
);

export interface IDentalDamageAndCompanyInputData {
    changeInPalladiumPrice: number;
    changeInPlatinumPrice: number;
    changeInUsDairyPricesAverageValue: number;
    changeInUsMilkSupplyAverageValue: number;
    percentOwnership: number;
    previousPrice: number;
}

export const getPriceForDentalDamageAndCompany = DentalDamageAndCompanyModel.getPrice;

export const trainModelForDentalDamageAndCompany = DentalDamageAndCompanyModel.trainModel([]);
