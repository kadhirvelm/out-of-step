import * as tf from "@tensorflow/tfjs-node";
import { StockModel } from "./stockModel";

const convertViruzMeNotInputToArray = (input: IViruzMeNotInputData) => [
    input.changeInCriticalCommunityThreats,
    input.changeInCurrentlyHospitalized,
    input.previousPrice,
];

const ViruzMeNotModel = new StockModel<IViruzMeNotInputData>(
    {
        epochs: 300,
        optimizer: tf.train.adam(0.05),
        name: "viruz-me-not-v1",
    },
    convertViruzMeNotInputToArray,
);

export interface IViruzMeNotInputData {
    changeInCriticalCommunityThreats: number;
    changeInCurrentlyHospitalized: number;
    previousPrice: number;
}

export const getPriceForViruzMeNot = ViruzMeNotModel.getPrice;

const CHANGE_IN_THREATS = 10;
const CHANGE_IN_HOSPITALIZATIONS = 1000;

export const trainModelForViruzMeNot = ViruzMeNotModel.trainModel([
    {
        input: {
            changeInCriticalCommunityThreats: 0,
            changeInCurrentlyHospitalized: 0,
            previousPrice: 0.78,
        },
        output: 0.78,
    },

    /** At base price */
    {
        input: {
            changeInCriticalCommunityThreats: CHANGE_IN_THREATS,
            changeInCurrentlyHospitalized: 0,
            previousPrice: 0.78,
        },
        output: 0.83,
    },
    {
        input: {
            changeInCriticalCommunityThreats: -CHANGE_IN_THREATS,
            changeInCurrentlyHospitalized: 0,
            previousPrice: 0.78,
        },
        output: 0.73,
    },
    {
        input: {
            changeInCriticalCommunityThreats: 0,
            changeInCurrentlyHospitalized: CHANGE_IN_HOSPITALIZATIONS,
            previousPrice: 0.78,
        },
        output: 0.83,
    },
    {
        input: {
            changeInCriticalCommunityThreats: 0,
            changeInCurrentlyHospitalized: -CHANGE_IN_HOSPITALIZATIONS,
            previousPrice: 0.78,
        },
        output: 0.73,
    },

    /** At double the previous price */
    {
        input: {
            changeInCriticalCommunityThreats: 0,
            changeInCurrentlyHospitalized: 0,
            previousPrice: 1.56,
        },
        output: 1.56,
    },

    {
        input: {
            changeInCriticalCommunityThreats: CHANGE_IN_THREATS,
            changeInCurrentlyHospitalized: 0,
            previousPrice: 1.56,
        },
        output: 1.66,
    },
    {
        input: {
            changeInCriticalCommunityThreats: -CHANGE_IN_THREATS,
            changeInCurrentlyHospitalized: 0,
            previousPrice: 1.56,
        },
        output: 1.46,
    },
    {
        input: {
            changeInCriticalCommunityThreats: 0,
            changeInCurrentlyHospitalized: CHANGE_IN_HOSPITALIZATIONS,
            previousPrice: 1.56,
        },
        output: 1.66,
    },
    {
        input: {
            changeInCriticalCommunityThreats: 0,
            changeInCurrentlyHospitalized: -CHANGE_IN_HOSPITALIZATIONS,
            previousPrice: 1.56,
        },
        output: 1.46,
    },

    /** At triple the previous price */
    {
        input: {
            changeInCriticalCommunityThreats: 0,
            changeInCurrentlyHospitalized: 0,
            previousPrice: 2.34,
        },
        output: 2.34,
    },

    {
        input: {
            changeInCriticalCommunityThreats: CHANGE_IN_THREATS,
            changeInCurrentlyHospitalized: 0,
            previousPrice: 2.34,
        },
        output: 2.49,
    },
    {
        input: {
            changeInCriticalCommunityThreats: -CHANGE_IN_THREATS,
            changeInCurrentlyHospitalized: 0,
            previousPrice: 2.34,
        },
        output: 2.19,
    },
    {
        input: {
            changeInCriticalCommunityThreats: 0,
            changeInCurrentlyHospitalized: CHANGE_IN_HOSPITALIZATIONS,
            previousPrice: 2.34,
        },
        output: 2.49,
    },
    {
        input: {
            changeInCriticalCommunityThreats: 0,
            changeInCurrentlyHospitalized: -CHANGE_IN_HOSPITALIZATIONS,
            previousPrice: 2.34,
        },
        output: 2.19,
    },

    /** At half the previous price */
    {
        input: {
            changeInCriticalCommunityThreats: 0,
            changeInCurrentlyHospitalized: 0,
            previousPrice: 0.39,
        },
        output: 0.39,
    },

    {
        input: {
            changeInCriticalCommunityThreats: CHANGE_IN_THREATS,
            changeInCurrentlyHospitalized: 0,
            previousPrice: 0.39,
        },
        output: 0.415,
    },
    {
        input: {
            changeInCriticalCommunityThreats: -CHANGE_IN_THREATS,
            changeInCurrentlyHospitalized: 0,
            previousPrice: 0.39,
        },
        output: 0.365,
    },
    {
        input: {
            changeInCriticalCommunityThreats: 0,
            changeInCurrentlyHospitalized: CHANGE_IN_HOSPITALIZATIONS,
            previousPrice: 0.39,
        },
        output: 0.415,
    },
    {
        input: {
            changeInCriticalCommunityThreats: 0,
            changeInCurrentlyHospitalized: -CHANGE_IN_HOSPITALIZATIONS,
            previousPrice: 0.39,
        },
        output: 0.365,
    },
]);
