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

export const getPriceForDentalDamageAndCompany = async (input: IDentalDamageAndCompanyInputData) => {
    const price = await DentalDamageAndCompanyModel.getPrice(input);
    if (price === undefined) {
        return price;
    }

    return input.previousPrice + (price - input.previousPrice) * (1 - input.percentOwnership / 100);
};

export const trainModelForDentalDamageAndCompany = DentalDamageAndCompanyModel.trainModel([
    {
        input: {
            changeInPalladiumPrice: 0,
            changeInPlatinumPrice: 0,
            changeInUsDairyPricesAverageValue: 0,
            changeInUsMilkSupplyAverageValue: 0,
            percentOwnership: 0,
            previousPrice: 450,
        },
        output: 450,
    },

    /** Change in metals */
    {
        input: {
            changeInPalladiumPrice: 100,
            changeInPlatinumPrice: 0,
            changeInUsDairyPricesAverageValue: 0,
            changeInUsMilkSupplyAverageValue: 0,
            percentOwnership: 0,
            previousPrice: 450,
        },
        output: 470,
    },
    {
        input: {
            changeInPalladiumPrice: -100,
            changeInPlatinumPrice: 0,
            changeInUsDairyPricesAverageValue: 0,
            changeInUsMilkSupplyAverageValue: 0,
            percentOwnership: 0,
            previousPrice: 450,
        },
        output: 430,
    },
    {
        input: {
            changeInPalladiumPrice: 0,
            changeInPlatinumPrice: 50,
            changeInUsDairyPricesAverageValue: 0,
            changeInUsMilkSupplyAverageValue: 0,
            percentOwnership: 0,
            previousPrice: 450,
        },
        output: 470,
    },
    {
        input: {
            changeInPalladiumPrice: 0,
            changeInPlatinumPrice: -50,
            changeInUsDairyPricesAverageValue: 0,
            changeInUsMilkSupplyAverageValue: 0,
            percentOwnership: 0,
            previousPrice: 450,
        },
        output: 430,
    },
    /** Change in dairy */
    {
        input: {
            changeInPalladiumPrice: 0,
            changeInPlatinumPrice: 0,
            changeInUsDairyPricesAverageValue: 1,
            changeInUsMilkSupplyAverageValue: 0,
            percentOwnership: 0,
            previousPrice: 450,
        },
        output: 440,
    },
    {
        input: {
            changeInPalladiumPrice: 0,
            changeInPlatinumPrice: 0,
            changeInUsDairyPricesAverageValue: -1,
            changeInUsMilkSupplyAverageValue: 0,
            percentOwnership: 0,
            previousPrice: 450,
        },
        output: 460,
    },
    {
        input: {
            changeInPalladiumPrice: 0,
            changeInPlatinumPrice: 0,
            changeInUsDairyPricesAverageValue: 0,
            changeInUsMilkSupplyAverageValue: 3,
            percentOwnership: 0,
            previousPrice: 450,
        },
        output: 435,
    },
    {
        input: {
            changeInPalladiumPrice: 0,
            changeInPlatinumPrice: 0,
            changeInUsDairyPricesAverageValue: 0,
            changeInUsMilkSupplyAverageValue: -3,
            percentOwnership: 0,
            previousPrice: 450,
        },
        output: 465,
    },

    /**
     * Change in previous price by doubling
     */
    {
        input: {
            changeInPalladiumPrice: 0,
            changeInPlatinumPrice: 0,
            changeInUsDairyPricesAverageValue: 0,
            changeInUsMilkSupplyAverageValue: 0,
            percentOwnership: 0,
            previousPrice: 900,
        },
        output: 900,
    },

    /** Change in metals */
    {
        input: {
            changeInPalladiumPrice: 100,
            changeInPlatinumPrice: 0,
            changeInUsDairyPricesAverageValue: 0,
            changeInUsMilkSupplyAverageValue: 0,
            percentOwnership: 0,
            previousPrice: 900,
        },
        output: 920,
    },
    {
        input: {
            changeInPalladiumPrice: -100,
            changeInPlatinumPrice: 0,
            changeInUsDairyPricesAverageValue: 0,
            changeInUsMilkSupplyAverageValue: 0,
            percentOwnership: 0,
            previousPrice: 900,
        },
        output: 880,
    },
    {
        input: {
            changeInPalladiumPrice: 0,
            changeInPlatinumPrice: 50,
            changeInUsDairyPricesAverageValue: 0,
            changeInUsMilkSupplyAverageValue: 0,
            percentOwnership: 0,
            previousPrice: 900,
        },
        output: 920,
    },
    {
        input: {
            changeInPalladiumPrice: 0,
            changeInPlatinumPrice: -50,
            changeInUsDairyPricesAverageValue: 0,
            changeInUsMilkSupplyAverageValue: 0,
            percentOwnership: 0,
            previousPrice: 900,
        },
        output: 880,
    },
    /** Change in dairy */
    {
        input: {
            changeInPalladiumPrice: 0,
            changeInPlatinumPrice: 0,
            changeInUsDairyPricesAverageValue: 1,
            changeInUsMilkSupplyAverageValue: 0,
            percentOwnership: 0,
            previousPrice: 900,
        },
        output: 890,
    },
    {
        input: {
            changeInPalladiumPrice: 0,
            changeInPlatinumPrice: 0,
            changeInUsDairyPricesAverageValue: -1,
            changeInUsMilkSupplyAverageValue: 0,
            percentOwnership: 0,
            previousPrice: 900,
        },
        output: 910,
    },
    {
        input: {
            changeInPalladiumPrice: 0,
            changeInPlatinumPrice: 0,
            changeInUsDairyPricesAverageValue: 0,
            changeInUsMilkSupplyAverageValue: 3,
            percentOwnership: 0,
            previousPrice: 900,
        },
        output: 885,
    },
    {
        input: {
            changeInPalladiumPrice: 0,
            changeInPlatinumPrice: 0,
            changeInUsDairyPricesAverageValue: 0,
            changeInUsMilkSupplyAverageValue: -3,
            percentOwnership: 0,
            previousPrice: 900,
        },
        output: 915,
    },
]);
