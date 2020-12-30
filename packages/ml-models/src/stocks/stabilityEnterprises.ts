import { StockModel } from "./stockModel";

const convertStabilityEnterprisesInputToArray = (input: IStabilityEnterprisesInputData) => [
    input.changeInEarthquakesSinceLastMeasure,
    input.maximumMagnitude,
    input.percentOwnership,
    input.previousPrice,
    input.changeInElectionEvents,
];

const StabilityEnterprisesModel = new StockModel<IStabilityEnterprisesInputData>(
    {
        epochs: 400,
        name: "stability-enterprises-v1",
    },
    convertStabilityEnterprisesInputToArray,
);

export interface IStabilityEnterprisesInputData {
    changeInEarthquakesSinceLastMeasure: number;
    maximumMagnitude: number;
    percentOwnership: number;
    previousPrice: number;
    changeInElectionEvents: number;
}

export const getPriceForStabilityEnterprises = StabilityEnterprisesModel.getPrice;

const MAXIMUM_MAGNITUDE = 6;
const CHANGE_IN_MAGNITUDE = 0.5;

const CHANGE_IN_EARTHQUAKES = 10;
const CHANGE_IN_ELECTION_EVENTS = 1;

export const trainModelForStabilityEnterprises = StabilityEnterprisesModel.trainModel([
    {
        input: {
            changeInEarthquakesSinceLastMeasure: 0,
            maximumMagnitude: MAXIMUM_MAGNITUDE,
            percentOwnership: 0,
            previousPrice: 12,
            changeInElectionEvents: 0,
        },
        output: 12,
    },
    {
        input: {
            changeInEarthquakesSinceLastMeasure: CHANGE_IN_EARTHQUAKES,
            maximumMagnitude: MAXIMUM_MAGNITUDE,
            percentOwnership: 0,
            previousPrice: 12,
            changeInElectionEvents: 0,
        },
        output: 11.75,
    },
    {
        input: {
            changeInEarthquakesSinceLastMeasure: CHANGE_IN_EARTHQUAKES * 2,
            maximumMagnitude: MAXIMUM_MAGNITUDE,
            percentOwnership: 0,
            previousPrice: 12,
            changeInElectionEvents: 0,
        },
        output: 11.5,
    },
    {
        input: {
            changeInEarthquakesSinceLastMeasure: -CHANGE_IN_EARTHQUAKES,
            maximumMagnitude: MAXIMUM_MAGNITUDE,
            percentOwnership: 0,
            previousPrice: 12,
            changeInElectionEvents: 0,
        },
        output: 12.5,
    },
    {
        input: {
            changeInEarthquakesSinceLastMeasure: -CHANGE_IN_EARTHQUAKES * 2,
            maximumMagnitude: MAXIMUM_MAGNITUDE,
            percentOwnership: 0,
            previousPrice: 12,
            changeInElectionEvents: 0,
        },
        output: 13,
    },
    {
        input: {
            changeInEarthquakesSinceLastMeasure: 0,
            maximumMagnitude: MAXIMUM_MAGNITUDE + CHANGE_IN_MAGNITUDE,
            percentOwnership: 0,
            previousPrice: 12,
            changeInElectionEvents: 0,
        },
        output: 11.5,
    },
    {
        input: {
            changeInEarthquakesSinceLastMeasure: 0,
            maximumMagnitude: MAXIMUM_MAGNITUDE - CHANGE_IN_MAGNITUDE,
            percentOwnership: 0,
            previousPrice: 12,
            changeInElectionEvents: 0,
        },
        output: 12.5,
    },
    {
        input: {
            changeInEarthquakesSinceLastMeasure: 0,
            maximumMagnitude: MAXIMUM_MAGNITUDE,
            percentOwnership: 0,
            previousPrice: 12,
            changeInElectionEvents: CHANGE_IN_ELECTION_EVENTS,
        },
        output: 14,
    },
    {
        input: {
            changeInEarthquakesSinceLastMeasure: 0,
            maximumMagnitude: MAXIMUM_MAGNITUDE,
            percentOwnership: 0,
            previousPrice: 12,
            changeInElectionEvents: -CHANGE_IN_ELECTION_EVENTS,
        },
        output: 10,
    },

    /** Increase in percent ownership */
    {
        input: {
            changeInEarthquakesSinceLastMeasure: CHANGE_IN_EARTHQUAKES,
            maximumMagnitude: MAXIMUM_MAGNITUDE,
            percentOwnership: 100,
            previousPrice: 12,
            changeInElectionEvents: 0,
        },
        output: 11.88,
    },
    {
        input: {
            changeInEarthquakesSinceLastMeasure: CHANGE_IN_EARTHQUAKES * 2,
            maximumMagnitude: MAXIMUM_MAGNITUDE,
            percentOwnership: 100,
            previousPrice: 12,
            changeInElectionEvents: 0,
        },
        output: 11.75,
    },
    {
        input: {
            changeInEarthquakesSinceLastMeasure: -CHANGE_IN_EARTHQUAKES,
            maximumMagnitude: MAXIMUM_MAGNITUDE,
            percentOwnership: 100,
            previousPrice: 12,
            changeInElectionEvents: 0,
        },
        output: 12.25,
    },
    {
        input: {
            changeInEarthquakesSinceLastMeasure: -CHANGE_IN_EARTHQUAKES * 2,
            maximumMagnitude: MAXIMUM_MAGNITUDE,
            percentOwnership: 100,
            previousPrice: 12,
            changeInElectionEvents: 0,
        },
        output: 12.5,
    },
    {
        input: {
            changeInEarthquakesSinceLastMeasure: 0,
            maximumMagnitude: MAXIMUM_MAGNITUDE + CHANGE_IN_MAGNITUDE,
            percentOwnership: 100,
            previousPrice: 12,
            changeInElectionEvents: 0,
        },
        output: 11.75,
    },
    {
        input: {
            changeInEarthquakesSinceLastMeasure: 0,
            maximumMagnitude: MAXIMUM_MAGNITUDE - CHANGE_IN_MAGNITUDE,
            percentOwnership: 100,
            previousPrice: 12,
            changeInElectionEvents: 0,
        },
        output: 12.25,
    },
    {
        input: {
            changeInEarthquakesSinceLastMeasure: 0,
            maximumMagnitude: MAXIMUM_MAGNITUDE,
            percentOwnership: 100,
            previousPrice: 12,
            changeInElectionEvents: CHANGE_IN_ELECTION_EVENTS,
        },
        output: 13,
    },
    {
        input: {
            changeInEarthquakesSinceLastMeasure: 0,
            maximumMagnitude: MAXIMUM_MAGNITUDE,
            percentOwnership: 100,
            previousPrice: 12,
            changeInElectionEvents: -CHANGE_IN_ELECTION_EVENTS,
        },
        output: 11,
    },

    /** Different previous price */
    {
        input: {
            changeInEarthquakesSinceLastMeasure: 0,
            maximumMagnitude: MAXIMUM_MAGNITUDE,
            percentOwnership: 0,
            previousPrice: 24,
            changeInElectionEvents: 0,
        },
        output: 24,
    },
    {
        input: {
            changeInEarthquakesSinceLastMeasure: CHANGE_IN_EARTHQUAKES,
            maximumMagnitude: MAXIMUM_MAGNITUDE,
            percentOwnership: 0,
            previousPrice: 24,
            changeInElectionEvents: 0,
        },
        output: 23.5,
    },
    {
        input: {
            changeInEarthquakesSinceLastMeasure: CHANGE_IN_EARTHQUAKES * 2,
            maximumMagnitude: MAXIMUM_MAGNITUDE,
            percentOwnership: 0,
            previousPrice: 24,
            changeInElectionEvents: 0,
        },
        output: 23,
    },
    {
        input: {
            changeInEarthquakesSinceLastMeasure: -CHANGE_IN_EARTHQUAKES,
            maximumMagnitude: MAXIMUM_MAGNITUDE,
            percentOwnership: 0,
            previousPrice: 24,
            changeInElectionEvents: 0,
        },
        output: 24.5,
    },
    {
        input: {
            changeInEarthquakesSinceLastMeasure: -CHANGE_IN_EARTHQUAKES * 2,
            maximumMagnitude: MAXIMUM_MAGNITUDE,
            percentOwnership: 0,
            previousPrice: 24,
            changeInElectionEvents: 0,
        },
        output: 25,
    },
    {
        input: {
            changeInEarthquakesSinceLastMeasure: 0,
            maximumMagnitude: MAXIMUM_MAGNITUDE + CHANGE_IN_MAGNITUDE,
            percentOwnership: 0,
            previousPrice: 24,
            changeInElectionEvents: 0,
        },
        output: 23,
    },
    {
        input: {
            changeInEarthquakesSinceLastMeasure: 0,
            maximumMagnitude: MAXIMUM_MAGNITUDE - CHANGE_IN_MAGNITUDE,
            percentOwnership: 0,
            previousPrice: 24,
            changeInElectionEvents: 0,
        },
        output: 25,
    },
    {
        input: {
            changeInEarthquakesSinceLastMeasure: 0,
            maximumMagnitude: MAXIMUM_MAGNITUDE,
            percentOwnership: 0,
            previousPrice: 24,
            changeInElectionEvents: CHANGE_IN_ELECTION_EVENTS,
        },
        output: 28,
    },
    {
        input: {
            changeInEarthquakesSinceLastMeasure: 0,
            maximumMagnitude: MAXIMUM_MAGNITUDE,
            percentOwnership: 0,
            previousPrice: 24,
            changeInElectionEvents: -CHANGE_IN_ELECTION_EVENTS,
        },
        output: 20,
    },
]);
