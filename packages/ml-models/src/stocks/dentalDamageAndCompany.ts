import { StockModel } from "./stockModel";

const convertDentalDamageAndCompanyInputToArray = (input: IDentalDamageAndCompanyInputData) => [
    input.changeInPalladiumPrice,
    input.changeInPlatinumPrice,
    input.changeInUsDairyPricesAverageValue,
    input.changeInUsMilkSupplyAverageValue,
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
    previousPrice: number;
}

export const getPriceForDentalDamageAndCompany = DentalDamageAndCompanyModel.getPrice;

const CHANGE_IN_PALLADIUM_PRICE = 20;
const CHANGE_IN_PLATINUM_PRICE = 5;

const CHANGE_IN_US_DAIRY = 1;
const CHANGE_IN_US_MILK_SUPPLY = 1.5;

export const trainModelForDentalDamageAndCompany = DentalDamageAndCompanyModel.trainModel([
    {
        input: {
            changeInPalladiumPrice: 0,
            changeInPlatinumPrice: 0,
            changeInUsDairyPricesAverageValue: 0,
            changeInUsMilkSupplyAverageValue: 0,
            previousPrice: 450,
        },
        output: 450,
    },

    /** Change in metals */
    {
        input: {
            changeInPalladiumPrice: CHANGE_IN_PALLADIUM_PRICE,
            changeInPlatinumPrice: 0,
            changeInUsDairyPricesAverageValue: 0,
            changeInUsMilkSupplyAverageValue: 0,
            previousPrice: 450,
        },
        output: 470,
    },
    {
        input: {
            changeInPalladiumPrice: -CHANGE_IN_PALLADIUM_PRICE,
            changeInPlatinumPrice: 0,
            changeInUsDairyPricesAverageValue: 0,
            changeInUsMilkSupplyAverageValue: 0,
            previousPrice: 450,
        },
        output: 430,
    },
    {
        input: {
            changeInPalladiumPrice: 0,
            changeInPlatinumPrice: CHANGE_IN_PLATINUM_PRICE,
            changeInUsDairyPricesAverageValue: 0,
            changeInUsMilkSupplyAverageValue: 0,
            previousPrice: 450,
        },
        output: 470,
    },
    {
        input: {
            changeInPalladiumPrice: 0,
            changeInPlatinumPrice: -CHANGE_IN_PLATINUM_PRICE,
            changeInUsDairyPricesAverageValue: 0,
            changeInUsMilkSupplyAverageValue: 0,
            previousPrice: 450,
        },
        output: 430,
    },
    /** Change in dairy */
    {
        input: {
            changeInPalladiumPrice: 0,
            changeInPlatinumPrice: 0,
            changeInUsDairyPricesAverageValue: CHANGE_IN_US_DAIRY,
            changeInUsMilkSupplyAverageValue: 0,
            previousPrice: 450,
        },
        output: 440,
    },
    {
        input: {
            changeInPalladiumPrice: 0,
            changeInPlatinumPrice: 0,
            changeInUsDairyPricesAverageValue: -CHANGE_IN_US_DAIRY,
            changeInUsMilkSupplyAverageValue: 0,
            previousPrice: 450,
        },
        output: 460,
    },
    {
        input: {
            changeInPalladiumPrice: 0,
            changeInPlatinumPrice: 0,
            changeInUsDairyPricesAverageValue: 0,
            changeInUsMilkSupplyAverageValue: CHANGE_IN_US_MILK_SUPPLY,
            previousPrice: 450,
        },
        output: 435,
    },
    {
        input: {
            changeInPalladiumPrice: 0,
            changeInPlatinumPrice: 0,
            changeInUsDairyPricesAverageValue: 0,
            changeInUsMilkSupplyAverageValue: -CHANGE_IN_US_MILK_SUPPLY,
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
            previousPrice: 900,
        },
        output: 900,
    },

    /** Change in metals */
    {
        input: {
            changeInPalladiumPrice: CHANGE_IN_PALLADIUM_PRICE,
            changeInPlatinumPrice: 0,
            changeInUsDairyPricesAverageValue: 0,
            changeInUsMilkSupplyAverageValue: 0,
            previousPrice: 900,
        },
        output: 920,
    },
    {
        input: {
            changeInPalladiumPrice: -CHANGE_IN_PALLADIUM_PRICE,
            changeInPlatinumPrice: 0,
            changeInUsDairyPricesAverageValue: 0,
            changeInUsMilkSupplyAverageValue: 0,
            previousPrice: 900,
        },
        output: 880,
    },
    {
        input: {
            changeInPalladiumPrice: 0,
            changeInPlatinumPrice: CHANGE_IN_PLATINUM_PRICE,
            changeInUsDairyPricesAverageValue: 0,
            changeInUsMilkSupplyAverageValue: 0,
            previousPrice: 900,
        },
        output: 920,
    },
    {
        input: {
            changeInPalladiumPrice: 0,
            changeInPlatinumPrice: -CHANGE_IN_PLATINUM_PRICE,
            changeInUsDairyPricesAverageValue: 0,
            changeInUsMilkSupplyAverageValue: 0,
            previousPrice: 900,
        },
        output: 880,
    },
    /** Change in dairy */
    {
        input: {
            changeInPalladiumPrice: 0,
            changeInPlatinumPrice: 0,
            changeInUsDairyPricesAverageValue: CHANGE_IN_US_DAIRY,
            changeInUsMilkSupplyAverageValue: 0,
            previousPrice: 900,
        },
        output: 890,
    },
    {
        input: {
            changeInPalladiumPrice: 0,
            changeInPlatinumPrice: 0,
            changeInUsDairyPricesAverageValue: -CHANGE_IN_US_DAIRY,
            changeInUsMilkSupplyAverageValue: 0,
            previousPrice: 900,
        },
        output: 910,
    },
    {
        input: {
            changeInPalladiumPrice: 0,
            changeInPlatinumPrice: 0,
            changeInUsDairyPricesAverageValue: 0,
            changeInUsMilkSupplyAverageValue: CHANGE_IN_US_MILK_SUPPLY,
            previousPrice: 900,
        },
        output: 885,
    },
    {
        input: {
            changeInPalladiumPrice: 0,
            changeInPlatinumPrice: 0,
            changeInUsDairyPricesAverageValue: 0,
            changeInUsMilkSupplyAverageValue: -CHANGE_IN_US_MILK_SUPPLY,
            previousPrice: 900,
        },
        output: 915,
    },
]);
