import * as tf from "@tensorflow/tfjs-node";
import { getExistingLinearModel } from "../utils/getExistingLinearModel";
import { getValuesFromTensor } from "../utils/getValuesFromTensor";
import { ITrainLinearModelOptions, trainLinearModel } from "../utils/trainLinearModel";

const optionsForAgriColaInc: ITrainLinearModelOptions = {
    epochs: 200,
    name: "agri-cola-inc-v1",
};

export interface IAgriColaIncInputData {
    averageTemperateInCelsius: number;
    averageWindSpeed: number;
    changeInAveragePrice: number;
    percentOwnership: number;
    previousPrice: number;
}

const convertAgriColaIncInputToArray = (input: IAgriColaIncInputData) => [
    input.averageTemperateInCelsius,
    input.averageWindSpeed,
    input.changeInAveragePrice,
    input.percentOwnership,
    input.previousPrice,
];

export async function getPriceForAgriColaInc(input: IAgriColaIncInputData): Promise<number | undefined> {
    const trainedModel = await getExistingLinearModel(optionsForAgriColaInc);
    if (trainedModel === undefined) {
        return undefined;
    }

    const dataArray = convertAgriColaIncInputToArray(input);

    const predictedValue = trainedModel.predict(tf.tensor2d(dataArray, [1, dataArray.length]));
    return getValuesFromTensor(predictedValue)[0];
}

export async function trainModelForAgriColaInc() {
    const trainingData: Array<{ input: IAgriColaIncInputData; output: number }> = [
        {
            input: {
                averageTemperateInCelsius: 4,
                averageWindSpeed: 0,
                changeInAveragePrice: 0,
                percentOwnership: 0,
                previousPrice: 25,
            },
            output: 25,
        },
        {
            input: {
                averageTemperateInCelsius: 2,
                averageWindSpeed: 0,
                changeInAveragePrice: 0,
                percentOwnership: 0,
                previousPrice: 25,
            },
            output: 24.5,
        },
        {
            input: {
                averageTemperateInCelsius: 6,
                averageWindSpeed: 0,
                changeInAveragePrice: 0,
                percentOwnership: 0,
                previousPrice: 25,
            },
            output: 25.5,
        },
        {
            input: {
                averageTemperateInCelsius: 4,
                averageWindSpeed: 5,
                changeInAveragePrice: 0,
                percentOwnership: 0,
                previousPrice: 25,
            },
            output: 26,
        },
        {
            input: {
                averageTemperateInCelsius: 4,
                averageWindSpeed: 10,
                changeInAveragePrice: 0,
                percentOwnership: 0,
                previousPrice: 25,
            },
            output: 27,
        },
        {
            input: {
                averageTemperateInCelsius: 4,
                averageWindSpeed: 0,
                changeInAveragePrice: 3,
                percentOwnership: 0,
                previousPrice: 25,
            },
            output: 25.5,
        },
        {
            input: {
                averageTemperateInCelsius: 4,
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
                averageTemperateInCelsius: 2,
                averageWindSpeed: 0,
                changeInAveragePrice: 0,
                percentOwnership: 100,
                previousPrice: 25,
            },
            output: 24.75,
        },
        {
            input: {
                averageTemperateInCelsius: 6,
                averageWindSpeed: 0,
                changeInAveragePrice: 0,
                percentOwnership: 100,
                previousPrice: 25,
            },
            output: 25.25,
        },
        {
            input: {
                averageTemperateInCelsius: 4,
                averageWindSpeed: 5,
                changeInAveragePrice: 0,
                percentOwnership: 100,
                previousPrice: 25,
            },
            output: 25.5,
        },
        {
            input: {
                averageTemperateInCelsius: 4,
                averageWindSpeed: 10,
                changeInAveragePrice: 0,
                percentOwnership: 100,
                previousPrice: 25,
            },
            output: 26,
        },
        {
            input: {
                averageTemperateInCelsius: 4,
                averageWindSpeed: 0,
                changeInAveragePrice: 3,
                percentOwnership: 100,
                previousPrice: 25,
            },
            output: 25.25,
        },
        {
            input: {
                averageTemperateInCelsius: 4,
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
                averageTemperateInCelsius: 4,
                averageWindSpeed: 0,
                changeInAveragePrice: 0,
                percentOwnership: 0,
                previousPrice: 50,
            },
            output: 50,
        },
        {
            input: {
                averageTemperateInCelsius: 2,
                averageWindSpeed: 0,
                changeInAveragePrice: 0,
                percentOwnership: 0,
                previousPrice: 50,
            },
            output: 49,
        },
        {
            input: {
                averageTemperateInCelsius: 6,
                averageWindSpeed: 0,
                changeInAveragePrice: 0,
                percentOwnership: 0,
                previousPrice: 50,
            },
            output: 51,
        },
        {
            input: {
                averageTemperateInCelsius: 4,
                averageWindSpeed: 5,
                changeInAveragePrice: 0,
                percentOwnership: 0,
                previousPrice: 50,
            },
            output: 52,
        },
        {
            input: {
                averageTemperateInCelsius: 4,
                averageWindSpeed: 10,
                changeInAveragePrice: 0,
                percentOwnership: 0,
                previousPrice: 50,
            },
            output: 54,
        },
        {
            input: {
                averageTemperateInCelsius: 4,
                averageWindSpeed: 0,
                changeInAveragePrice: 3,
                percentOwnership: 0,
                previousPrice: 50,
            },
            output: 51,
        },
        {
            input: {
                averageTemperateInCelsius: 4,
                averageWindSpeed: 0,
                changeInAveragePrice: -3,
                percentOwnership: 0,
                previousPrice: 50,
            },
            output: 49,
        },
    ];

    const trainX: number[][] = trainingData.map(td => convertAgriColaIncInputToArray(td.input));
    const trainY: number[] = trainingData.map(td => td.output);

    await trainLinearModel(trainX, trainY, optionsForAgriColaInc);
}
