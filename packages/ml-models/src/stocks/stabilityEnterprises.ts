import * as tf from "@tensorflow/tfjs-node";
import { ITrainLinearModelOptions, trainLinearModel } from "../utils/trainLinearModel";
import { getExistingLinearModel } from "../utils/getExistingLinearModel";
import { getValuesFromTensor } from "../utils/getValuesFromTensor";

const optionsForStabilityEnterprises: ITrainLinearModelOptions = {
    epochs: 200,
    name: "stability-enterprises-v1",
};

export interface IStabilityEnterprisesInputData {
    changeInEarthquakesSinceLastMeasure: number;
    maximumMagnitude: number;
    percentOwnership: number;
    previousPrice: number;
    totalUpcomingElectionEvents: number;
}

const convertStabilityEnterprisesInputToArray = (input: IStabilityEnterprisesInputData) => [
    input.changeInEarthquakesSinceLastMeasure,
    input.maximumMagnitude,
    input.percentOwnership,
    input.previousPrice,
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
                changeInEarthquakesSinceLastMeasure: 0,
                maximumMagnitude: 6,
                percentOwnership: 0,
                previousPrice: 12,
                totalUpcomingElectionEvents: 10,
            },
            output: 12,
        },
        {
            input: {
                changeInEarthquakesSinceLastMeasure: 10,
                maximumMagnitude: 6,
                percentOwnership: 0,
                previousPrice: 12,
                totalUpcomingElectionEvents: 10,
            },
            output: 11.75,
        },
        {
            input: {
                changeInEarthquakesSinceLastMeasure: 20,
                maximumMagnitude: 6,
                percentOwnership: 0,
                previousPrice: 12,
                totalUpcomingElectionEvents: 10,
            },
            output: 11.5,
        },
        {
            input: {
                changeInEarthquakesSinceLastMeasure: -10,
                maximumMagnitude: 6,
                percentOwnership: 0,
                previousPrice: 12,
                totalUpcomingElectionEvents: 10,
            },
            output: 12.5,
        },
        {
            input: {
                changeInEarthquakesSinceLastMeasure: -20,
                maximumMagnitude: 6,
                percentOwnership: 0,
                previousPrice: 12,
                totalUpcomingElectionEvents: 10,
            },
            output: 13,
        },
        {
            input: {
                changeInEarthquakesSinceLastMeasure: 0,
                maximumMagnitude: 7,
                percentOwnership: 0,
                previousPrice: 12,
                totalUpcomingElectionEvents: 10,
            },
            output: 11.5,
        },
        {
            input: {
                changeInEarthquakesSinceLastMeasure: 0,
                maximumMagnitude: 5,
                percentOwnership: 0,
                previousPrice: 12,
                totalUpcomingElectionEvents: 10,
            },
            output: 12.5,
        },
        {
            input: {
                changeInEarthquakesSinceLastMeasure: 0,
                maximumMagnitude: 6,
                percentOwnership: 0,
                previousPrice: 12,
                totalUpcomingElectionEvents: 12,
            },
            output: 12.5,
        },
        {
            input: {
                changeInEarthquakesSinceLastMeasure: 0,
                maximumMagnitude: 6,
                percentOwnership: 0,
                previousPrice: 12,
                totalUpcomingElectionEvents: 8,
            },
            output: 11.5,
        },

        /** Increase in percent ownership */
        {
            input: {
                changeInEarthquakesSinceLastMeasure: 10,
                maximumMagnitude: 6,
                percentOwnership: 100,
                previousPrice: 12,
                totalUpcomingElectionEvents: 10,
            },
            output: 11.88,
        },
        {
            input: {
                changeInEarthquakesSinceLastMeasure: 20,
                maximumMagnitude: 6,
                percentOwnership: 100,
                previousPrice: 12,
                totalUpcomingElectionEvents: 10,
            },
            output: 11.75,
        },
        {
            input: {
                changeInEarthquakesSinceLastMeasure: -10,
                maximumMagnitude: 6,
                percentOwnership: 100,
                previousPrice: 12,
                totalUpcomingElectionEvents: 10,
            },
            output: 12.25,
        },
        {
            input: {
                changeInEarthquakesSinceLastMeasure: -20,
                maximumMagnitude: 6,
                percentOwnership: 100,
                previousPrice: 12,
                totalUpcomingElectionEvents: 10,
            },
            output: 12.5,
        },
        {
            input: {
                changeInEarthquakesSinceLastMeasure: 0,
                maximumMagnitude: 7,
                percentOwnership: 100,
                previousPrice: 12,
                totalUpcomingElectionEvents: 10,
            },
            output: 11.75,
        },
        {
            input: {
                changeInEarthquakesSinceLastMeasure: 0,
                maximumMagnitude: 5,
                percentOwnership: 100,
                previousPrice: 12,
                totalUpcomingElectionEvents: 10,
            },
            output: 12.25,
        },
        {
            input: {
                changeInEarthquakesSinceLastMeasure: 0,
                maximumMagnitude: 6,
                percentOwnership: 100,
                previousPrice: 12,
                totalUpcomingElectionEvents: 12,
            },
            output: 12.25,
        },
        {
            input: {
                changeInEarthquakesSinceLastMeasure: 0,
                maximumMagnitude: 6,
                percentOwnership: 100,
                previousPrice: 12,
                totalUpcomingElectionEvents: 8,
            },
            output: 11.75,
        },

        /** Different previous price */
        {
            input: {
                changeInEarthquakesSinceLastMeasure: 0,
                maximumMagnitude: 6,
                percentOwnership: 0,
                previousPrice: 24,
                totalUpcomingElectionEvents: 10,
            },
            output: 24,
        },
        {
            input: {
                changeInEarthquakesSinceLastMeasure: 10,
                maximumMagnitude: 6,
                percentOwnership: 0,
                previousPrice: 24,
                totalUpcomingElectionEvents: 10,
            },
            output: 23.5,
        },
        {
            input: {
                changeInEarthquakesSinceLastMeasure: 20,
                maximumMagnitude: 6,
                percentOwnership: 0,
                previousPrice: 24,
                totalUpcomingElectionEvents: 10,
            },
            output: 23,
        },
        {
            input: {
                changeInEarthquakesSinceLastMeasure: -10,
                maximumMagnitude: 6,
                percentOwnership: 0,
                previousPrice: 24,
                totalUpcomingElectionEvents: 10,
            },
            output: 25,
        },
        {
            input: {
                changeInEarthquakesSinceLastMeasure: -20,
                maximumMagnitude: 6,
                percentOwnership: 0,
                previousPrice: 24,
                totalUpcomingElectionEvents: 10,
            },
            output: 26,
        },
        {
            input: {
                changeInEarthquakesSinceLastMeasure: 0,
                maximumMagnitude: 7,
                percentOwnership: 0,
                previousPrice: 24,
                totalUpcomingElectionEvents: 10,
            },
            output: 23,
        },
        {
            input: {
                changeInEarthquakesSinceLastMeasure: 0,
                maximumMagnitude: 5,
                percentOwnership: 0,
                previousPrice: 24,
                totalUpcomingElectionEvents: 10,
            },
            output: 25,
        },
        {
            input: {
                changeInEarthquakesSinceLastMeasure: 0,
                maximumMagnitude: 6,
                percentOwnership: 0,
                previousPrice: 24,
                totalUpcomingElectionEvents: 12,
            },
            output: 25,
        },
        {
            input: {
                changeInEarthquakesSinceLastMeasure: 0,
                maximumMagnitude: 6,
                percentOwnership: 0,
                previousPrice: 24,
                totalUpcomingElectionEvents: 8,
            },
            output: 23,
        },
    ];

    const trainX: number[][] = trainingData.map(td => convertStabilityEnterprisesInputToArray(td.input));
    const trainY: number[] = trainingData.map(td => td.output);

    await trainLinearModel(trainX, trainY, optionsForStabilityEnterprises);
}
