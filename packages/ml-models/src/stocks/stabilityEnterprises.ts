import * as tf from "@tensorflow/tfjs-node";
import { ITrainLinearModelOptions, trainLinearModel } from "../utils/trainLinearModel";
import { getExistingLinearModel } from "../utils/getExistingLinearModel";
import { getValuesFromTensor } from "../utils/getValuesFromTensor";

const optionsForStabilityEnterprises: ITrainLinearModelOptions = {
    epochs: 200,
    name: "stability-enterprises-v1",
};

export interface IStabilityEnterprisesInputData {
    averageMagnitude: number;
    maximumMagnitude: number;
    minimumMagnitude: number;
    percentOwnership: number;
    previousPrice: number;
    totalEarthquakes: number;
    totalUpcomingElectionEvents: number;
}

const convertStabilityEnterprisesInputToArray = (input: IStabilityEnterprisesInputData) => [
    input.averageMagnitude,
    input.maximumMagnitude,
    input.minimumMagnitude,
    input.percentOwnership,
    input.previousPrice,
    input.totalEarthquakes,
    input.totalUpcomingElectionEvents,
];

export async function getPriceForStabilityEnterprises(
    input: IStabilityEnterprisesInputData,
): Promise<number | undefined> {
    const trainedModel = await getExistingLinearModel(optionsForStabilityEnterprises);
    if (trainedModel === undefined) {
        return undefined;
    }

    const dataArray = convertStabilityEnterprisesInputToArray(input);

    const predictedValue = trainedModel.predict(tf.tensor2d(dataArray, [1, dataArray.length]));
    return getValuesFromTensor(predictedValue)[0];
}

export async function trainModelForStabilityEnterprises() {
    const trainingData: Array<{ input: IStabilityEnterprisesInputData; output: number }> = [
        {
            input: {
                averageMagnitude: 4.6,
                maximumMagnitude: 6.2,
                minimumMagnitude: 4,
                percentOwnership: 0,
                previousPrice: 12,
                totalEarthquakes: 14,
                totalUpcomingElectionEvents: 12,
            },
            output: 13,
        },
        {
            input: {
                averageMagnitude: 6,
                maximumMagnitude: 6.2,
                minimumMagnitude: 4,
                percentOwnership: 0,
                previousPrice: 12,
                totalEarthquakes: 14,
                totalUpcomingElectionEvents: 12,
            },
            output: 10,
        },
        {
            input: {
                averageMagnitude: 4,
                maximumMagnitude: 6.2,
                minimumMagnitude: 4,
                percentOwnership: 0,
                previousPrice: 12,
                totalEarthquakes: 14,
                totalUpcomingElectionEvents: 12,
            },
            output: 16,
        },
        {
            input: {
                averageMagnitude: 4.6,
                maximumMagnitude: 6.2,
                minimumMagnitude: 4,
                percentOwnership: 0,
                previousPrice: 12,
                totalEarthquakes: 20,
                totalUpcomingElectionEvents: 12,
            },
            output: 12,
        },
        {
            input: {
                averageMagnitude: 4.6,
                maximumMagnitude: 6.2,
                minimumMagnitude: 4,
                percentOwnership: 0,
                previousPrice: 12,
                totalEarthquakes: 14,
                totalUpcomingElectionEvents: 14,
            },
            output: 18,
        },
        {
            input: {
                averageMagnitude: 4.6,
                maximumMagnitude: 6.2,
                minimumMagnitude: 4,
                percentOwnership: 100,
                previousPrice: 12,
                totalEarthquakes: 14,
                totalUpcomingElectionEvents: 12,
            },
            output: 12.25,
        },
        {
            input: {
                averageMagnitude: 4.6,
                maximumMagnitude: 6.2,
                minimumMagnitude: 4,
                percentOwnership: 100,
                previousPrice: 12,
                totalEarthquakes: 14,
                totalUpcomingElectionEvents: 14,
            },
            output: 15,
        },
        {
            input: {
                averageMagnitude: 4.6,
                maximumMagnitude: 6.2,
                minimumMagnitude: 4,
                percentOwnership: 0,
                previousPrice: 50,
                totalEarthquakes: 14,
                totalUpcomingElectionEvents: 12,
            },
            output: 55,
        },
    ];

    const trainX: number[][] = trainingData.map(td => convertStabilityEnterprisesInputToArray(td.input));
    const trainY: number[] = trainingData.map(td => td.output);

    await trainLinearModel(trainX, trainY, optionsForStabilityEnterprises);
}
