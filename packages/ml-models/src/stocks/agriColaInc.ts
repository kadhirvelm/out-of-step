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
    highPriceAverage: number;
    lowPriceAverage: number;
    percentOwnership: number;
    previousPrice: number;
}

const convertAgriColaIncInputToArray = (input: IAgriColaIncInputData) => [
    input.averageTemperateInCelsius,
    input.averageWindSpeed,
    input.highPriceAverage,
    input.lowPriceAverage,
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
                averageTemperateInCelsius: 5.03,
                averageWindSpeed: 3.71,
                highPriceAverage: 39.06,
                lowPriceAverage: 38.9,
                percentOwnership: 0,
                previousPrice: 25,
            },
            output: 26,
        },
        {
            input: {
                averageTemperateInCelsius: 5.03,
                averageWindSpeed: 3.71,
                highPriceAverage: 39.06,
                lowPriceAverage: 38.9,
                percentOwnership: 100,
                previousPrice: 25,
            },
            output: 25.1,
        },
        {
            input: {
                averageTemperateInCelsius: 1.03,
                averageWindSpeed: 3.71,
                highPriceAverage: 39.06,
                lowPriceAverage: 38.9,
                percentOwnership: 0,
                previousPrice: 25,
            },
            output: 22,
        },
        {
            input: {
                averageTemperateInCelsius: 5.03,
                averageWindSpeed: 3.71,
                highPriceAverage: 39.06,
                lowPriceAverage: 38.9,
                percentOwnership: 0,
                previousPrice: 12,
            },
            output: 12.8,
        },
        {
            input: {
                averageTemperateInCelsius: 5.03,
                averageWindSpeed: 10.71,
                highPriceAverage: 39.06,
                lowPriceAverage: 38.9,
                percentOwnership: 0,
                previousPrice: 25,
            },
            output: 28.75,
        },
        {
            input: {
                averageTemperateInCelsius: 10.03,
                averageWindSpeed: 3.71,
                highPriceAverage: 39.06,
                lowPriceAverage: 38.9,
                percentOwnership: 0,
                previousPrice: 25,
            },
            output: 30,
        },
        {
            input: {
                averageTemperateInCelsius: 5.03,
                averageWindSpeed: 3.71,
                highPriceAverage: 42.06,
                lowPriceAverage: 38.9,
                percentOwnership: 0,
                previousPrice: 25,
            },
            output: 29.5,
        },
        {
            input: {
                averageTemperateInCelsius: 5.03,
                averageWindSpeed: 3.71,
                highPriceAverage: 39.06,
                lowPriceAverage: 34.9,
                percentOwnership: 0,
                previousPrice: 25,
            },
            output: 29,
        },
        {
            input: {
                averageTemperateInCelsius: 5.03,
                averageWindSpeed: 3.71,
                highPriceAverage: 24.06,
                lowPriceAverage: 23.9,
                percentOwnership: 0,
                previousPrice: 25,
            },
            output: 26,
        },
        {
            input: {
                averageTemperateInCelsius: 5.03,
                averageWindSpeed: 3.71,
                highPriceAverage: 39.06,
                lowPriceAverage: 34.9,
                percentOwnership: 100,
                previousPrice: 25,
            },
            output: 26.9,
        },
        {
            input: {
                averageTemperateInCelsius: 5.03,
                averageWindSpeed: 3.71,
                highPriceAverage: 39.06,
                lowPriceAverage: 38.9,
                percentOwnership: 0,
                previousPrice: 100,
            },
            output: 105,
        },
        {
            input: {
                averageTemperateInCelsius: 10.03,
                averageWindSpeed: 3.71,
                highPriceAverage: 39.06,
                lowPriceAverage: 38.9,
                percentOwnership: 0,
                previousPrice: 100,
            },
            output: 109,
        },
        {
            input: {
                averageTemperateInCelsius: 1.03,
                averageWindSpeed: 3.71,
                highPriceAverage: 39.06,
                lowPriceAverage: 38.9,
                percentOwnership: 0,
                previousPrice: 100,
            },
            output: 98,
        },
    ];

    const trainX: number[][] = trainingData.map(td => convertAgriColaIncInputToArray(td.input));
    const trainY: number[] = trainingData.map(td => td.output);

    await trainLinearModel(trainX, trainY, optionsForAgriColaInc);
}
