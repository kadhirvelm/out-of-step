import * as tf from "@tensorflow/tfjs-node";
import { StockModel } from "./stockModel";

const convertAgriColaIncInputToArray = (input: IAgriColaIncInputData) => [
    input.averageTemperateInCelsius,
    input.averageWindSpeed,
    input.changeInAveragePrice,
    input.percentOwnership,
    input.previousPrice,
];

export interface IAgriColaIncInputData {
    averageTemperateInCelsius: number;
    averageWindSpeed: number;
    changeInAveragePrice: number;
    percentOwnership: number;
    previousPrice: number;
}

const AgriColaIncModel = new StockModel<IAgriColaIncInputData>(
    {
        epochs: 400,
        optimizer: tf.train.adam(0.05),
        name: "agri-cola-inc-v1",
    },
    convertAgriColaIncInputToArray,
);

export const getPriceForAgriColaInc = AgriColaIncModel.getPrice;

const AVERAGE_CELSIUS = 6;

export const trainModelForAgriColaInc = AgriColaIncModel.trainModel([
    {
        input: {
            averageTemperateInCelsius: AVERAGE_CELSIUS,
            averageWindSpeed: 0,
            changeInAveragePrice: 0,
            percentOwnership: 0,
            previousPrice: 25,
        },
        output: 25,
    },
    {
        input: {
            averageTemperateInCelsius: AVERAGE_CELSIUS - 2,
            averageWindSpeed: 0,
            changeInAveragePrice: 0,
            percentOwnership: 0,
            previousPrice: 25,
        },
        output: 24,
    },
    {
        input: {
            averageTemperateInCelsius: AVERAGE_CELSIUS + 2,
            averageWindSpeed: 0,
            changeInAveragePrice: 0,
            percentOwnership: 0,
            previousPrice: 25,
        },
        output: 25.5,
    },
    {
        input: {
            averageTemperateInCelsius: AVERAGE_CELSIUS,
            averageWindSpeed: 5,
            changeInAveragePrice: 0,
            percentOwnership: 0,
            previousPrice: 25,
        },
        output: 26,
    },
    {
        input: {
            averageTemperateInCelsius: AVERAGE_CELSIUS,
            averageWindSpeed: 10,
            changeInAveragePrice: 0,
            percentOwnership: 0,
            previousPrice: 25,
        },
        output: 27,
    },
    {
        input: {
            averageTemperateInCelsius: AVERAGE_CELSIUS,
            averageWindSpeed: 0,
            changeInAveragePrice: 3,
            percentOwnership: 0,
            previousPrice: 25,
        },
        output: 25.5,
    },
    {
        input: {
            averageTemperateInCelsius: AVERAGE_CELSIUS,
            averageWindSpeed: 0,
            changeInAveragePrice: -3,
            percentOwnership: 0,
            previousPrice: 25,
        },
        output: 24.5,
    },

    /** Change in percent ownership */
    {
        input: {
            averageTemperateInCelsius: AVERAGE_CELSIUS - 2,
            averageWindSpeed: 0,
            changeInAveragePrice: 0,
            percentOwnership: 100,
            previousPrice: 25,
        },
        output: 24.5,
    },
    {
        input: {
            averageTemperateInCelsius: AVERAGE_CELSIUS + 2,
            averageWindSpeed: 0,
            changeInAveragePrice: 0,
            percentOwnership: 100,
            previousPrice: 25,
        },
        output: 25.25,
    },
    {
        input: {
            averageTemperateInCelsius: AVERAGE_CELSIUS,
            averageWindSpeed: 5,
            changeInAveragePrice: 0,
            percentOwnership: 100,
            previousPrice: 25,
        },
        output: 25.5,
    },
    {
        input: {
            averageTemperateInCelsius: AVERAGE_CELSIUS,
            averageWindSpeed: 10,
            changeInAveragePrice: 0,
            percentOwnership: 100,
            previousPrice: 25,
        },
        output: 26,
    },
    {
        input: {
            averageTemperateInCelsius: AVERAGE_CELSIUS,
            averageWindSpeed: 0,
            changeInAveragePrice: 3,
            percentOwnership: 100,
            previousPrice: 25,
        },
        output: 25.25,
    },
    {
        input: {
            averageTemperateInCelsius: AVERAGE_CELSIUS,
            averageWindSpeed: 0,
            changeInAveragePrice: -3,
            percentOwnership: 100,
            previousPrice: 25,
        },
        output: 24.75,
    },

    /** Different previous price */
    {
        input: {
            averageTemperateInCelsius: AVERAGE_CELSIUS,
            averageWindSpeed: 0,
            changeInAveragePrice: 0,
            percentOwnership: 0,
            previousPrice: 50,
        },
        output: 50,
    },
    {
        input: {
            averageTemperateInCelsius: AVERAGE_CELSIUS - 2,
            averageWindSpeed: 0,
            changeInAveragePrice: 0,
            percentOwnership: 0,
            previousPrice: 50,
        },
        output: 48,
    },
    {
        input: {
            averageTemperateInCelsius: AVERAGE_CELSIUS + 2,
            averageWindSpeed: 0,
            changeInAveragePrice: 0,
            percentOwnership: 0,
            previousPrice: 50,
        },
        output: 51,
    },
    {
        input: {
            averageTemperateInCelsius: AVERAGE_CELSIUS,
            averageWindSpeed: 5,
            changeInAveragePrice: 0,
            percentOwnership: 0,
            previousPrice: 50,
        },
        output: 52,
    },
    {
        input: {
            averageTemperateInCelsius: AVERAGE_CELSIUS,
            averageWindSpeed: 10,
            changeInAveragePrice: 0,
            percentOwnership: 0,
            previousPrice: 50,
        },
        output: 54,
    },
    {
        input: {
            averageTemperateInCelsius: AVERAGE_CELSIUS,
            averageWindSpeed: 0,
            changeInAveragePrice: 3,
            percentOwnership: 0,
            previousPrice: 50,
        },
        output: 51,
    },
    {
        input: {
            averageTemperateInCelsius: AVERAGE_CELSIUS,
            averageWindSpeed: 0,
            changeInAveragePrice: -3,
            percentOwnership: 0,
            previousPrice: 50,
        },
        output: 49,
    },
]);
