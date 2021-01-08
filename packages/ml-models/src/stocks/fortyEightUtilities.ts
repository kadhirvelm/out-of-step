import { StockModel } from "./stockModel";

const convertFortyEightUtilitiesInputToArray = (input: IFortyEightUtilitiesInputData) => [
    input.changeInElectricalOutput,
    input.changeInWaterOutput,
    input.previousPrice,
];

const FortyEightUtilitiesModel = new StockModel<IFortyEightUtilitiesInputData>(
    {
        epochs: 200,
        name: "forty-eight-utilities-v1",
    },
    convertFortyEightUtilitiesInputToArray,
);

export interface IFortyEightUtilitiesInputData {
    changeInElectricalOutput: number;
    changeInWaterOutput: number;
    previousPrice: number;
}

export const getPriceForFortyEightUtilities = FortyEightUtilitiesModel.getPrice;

const CHANGE_IN_PERCENT = 5;

export const trainModelForFortyEightUtilities = FortyEightUtilitiesModel.trainModel([
    {
        input: {
            changeInElectricalOutput: 0,
            changeInWaterOutput: 0,
            previousPrice: 15,
        },
        output: 15,
    },
    {
        input: {
            changeInElectricalOutput: CHANGE_IN_PERCENT,
            changeInWaterOutput: 0,
            previousPrice: 15,
        },
        output: 15.25,
    },
    {
        input: {
            changeInElectricalOutput: -CHANGE_IN_PERCENT,
            changeInWaterOutput: 0,
            previousPrice: 15,
        },
        output: 14.75,
    },
    {
        input: {
            changeInElectricalOutput: 0,
            changeInWaterOutput: CHANGE_IN_PERCENT,
            previousPrice: 15,
        },
        output: 15.25,
    },
    {
        input: {
            changeInElectricalOutput: 0,
            changeInWaterOutput: -CHANGE_IN_PERCENT,
            previousPrice: 15,
        },
        output: 14.75,
    },

    /** Higher previous price */
    {
        input: {
            changeInElectricalOutput: CHANGE_IN_PERCENT,
            changeInWaterOutput: 0,
            previousPrice: 30,
        },
        output: 30.25,
    },
    {
        input: {
            changeInElectricalOutput: -CHANGE_IN_PERCENT,
            changeInWaterOutput: 0,
            previousPrice: 30,
        },
        output: 29.75,
    },
    {
        input: {
            changeInElectricalOutput: 0,
            changeInWaterOutput: CHANGE_IN_PERCENT,
            previousPrice: 30,
        },
        output: 30.25,
    },
    {
        input: {
            changeInElectricalOutput: 0,
            changeInWaterOutput: -CHANGE_IN_PERCENT,
            previousPrice: 30,
        },
        output: 29.75,
    },
]);
