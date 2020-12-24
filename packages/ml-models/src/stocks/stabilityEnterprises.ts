import { StockModel } from "./stockModel";

const convertStabilityEnterprisesInputToArray = (input: IStabilityEnterprisesInputData) => [
    input.changeInEarthquakesSinceLastMeasure,
    input.maximumMagnitude,
    input.percentOwnership,
    input.previousPrice,
    input.totalUpcomingElectionEvents,
];

const StabilityEnterprisesModel = new StockModel<IStabilityEnterprisesInputData>(
    {
        epochs: 200,
        name: "stability-enterprises-v1",
    },
    convertStabilityEnterprisesInputToArray,
);

export interface IStabilityEnterprisesInputData {
    changeInEarthquakesSinceLastMeasure: number;
    maximumMagnitude: number;
    percentOwnership: number;
    previousPrice: number;
    totalUpcomingElectionEvents: number;
}

export const getPriceForStabilityEnterprises = StabilityEnterprisesModel.getPrice;

export const trainModelForStabilityEnterprises = StabilityEnterprisesModel.trainModel([
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
]);
