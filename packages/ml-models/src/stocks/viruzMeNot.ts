import * as tf from "@tensorflow/tfjs-node";
import { StockModel } from "./stockModel";

const convertViruzMeNotInputToArray = (input: IViruzMeNotInputData) => [
    input.changeInCriticalCommunityThreats,
    input.changeInCurrentlyHospitalized,
    input.percentOwnership,
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
    percentOwnership: number;
    previousPrice: number;
}

export const getPriceForViruzMeNot = ViruzMeNotModel.getPrice;

export const trainModelForViruzMeNot = ViruzMeNotModel.trainModel([
    {
        input: {
            changeInCriticalCommunityThreats: 0,
            changeInCurrentlyHospitalized: 0,
            percentOwnership: 0,
            previousPrice: 0.78,
        },
        output: 0.78,
    },

    /** At base price */
    {
        input: {
            changeInCriticalCommunityThreats: 10,
            changeInCurrentlyHospitalized: 0,
            percentOwnership: 0,
            previousPrice: 0.78,
        },
        output: 0.83,
    },
    {
        input: {
            changeInCriticalCommunityThreats: -10,
            changeInCurrentlyHospitalized: 0,
            percentOwnership: 0,
            previousPrice: 0.78,
        },
        output: 0.73,
    },
    {
        input: {
            changeInCriticalCommunityThreats: 0,
            changeInCurrentlyHospitalized: 5000,
            percentOwnership: 0,
            previousPrice: 0.78,
        },
        output: 0.83,
    },
    {
        input: {
            changeInCriticalCommunityThreats: 0,
            changeInCurrentlyHospitalized: -5000,
            percentOwnership: 0,
            previousPrice: 0.78,
        },
        output: 0.73,
    },

    /** At double the previous price */
    {
        input: {
            changeInCriticalCommunityThreats: 0,
            changeInCurrentlyHospitalized: 0,
            percentOwnership: 0,
            previousPrice: 1.56,
        },
        output: 1.56,
    },

    {
        input: {
            changeInCriticalCommunityThreats: 10,
            changeInCurrentlyHospitalized: 0,
            percentOwnership: 0,
            previousPrice: 1.56,
        },
        output: 1.66,
    },
    {
        input: {
            changeInCriticalCommunityThreats: -10,
            changeInCurrentlyHospitalized: 0,
            percentOwnership: 0,
            previousPrice: 1.56,
        },
        output: 1.46,
    },
    {
        input: {
            changeInCriticalCommunityThreats: 0,
            changeInCurrentlyHospitalized: 5000,
            percentOwnership: 0,
            previousPrice: 1.56,
        },
        output: 1.66,
    },
    {
        input: {
            changeInCriticalCommunityThreats: 0,
            changeInCurrentlyHospitalized: -5000,
            percentOwnership: 0,
            previousPrice: 1.56,
        },
        output: 1.46,
    },

    /** At triple the previous price */
    {
        input: {
            changeInCriticalCommunityThreats: 0,
            changeInCurrentlyHospitalized: 0,
            percentOwnership: 0,
            previousPrice: 2.34,
        },
        output: 2.34,
    },

    {
        input: {
            changeInCriticalCommunityThreats: 10,
            changeInCurrentlyHospitalized: 0,
            percentOwnership: 0,
            previousPrice: 2.34,
        },
        output: 2.49,
    },
    {
        input: {
            changeInCriticalCommunityThreats: -10,
            changeInCurrentlyHospitalized: 0,
            percentOwnership: 0,
            previousPrice: 2.34,
        },
        output: 2.19,
    },
    {
        input: {
            changeInCriticalCommunityThreats: 0,
            changeInCurrentlyHospitalized: 5000,
            percentOwnership: 0,
            previousPrice: 2.34,
        },
        output: 2.49,
    },
    {
        input: {
            changeInCriticalCommunityThreats: 0,
            changeInCurrentlyHospitalized: -5000,
            percentOwnership: 0,
            previousPrice: 2.34,
        },
        output: 2.19,
    },

    /** At half the previous price */
    {
        input: {
            changeInCriticalCommunityThreats: 0,
            changeInCurrentlyHospitalized: 0,
            percentOwnership: 0,
            previousPrice: 0.39,
        },
        output: 0.39,
    },

    {
        input: {
            changeInCriticalCommunityThreats: 10,
            changeInCurrentlyHospitalized: 0,
            percentOwnership: 0,
            previousPrice: 0.39,
        },
        output: 0.415,
    },
    {
        input: {
            changeInCriticalCommunityThreats: -10,
            changeInCurrentlyHospitalized: 0,
            percentOwnership: 0,
            previousPrice: 0.39,
        },
        output: 0.365,
    },
    {
        input: {
            changeInCriticalCommunityThreats: 0,
            changeInCurrentlyHospitalized: 5000,
            percentOwnership: 0,
            previousPrice: 0.39,
        },
        output: 0.415,
    },
    {
        input: {
            changeInCriticalCommunityThreats: 0,
            changeInCurrentlyHospitalized: -5000,
            percentOwnership: 0,
            previousPrice: 0.39,
        },
        output: 0.365,
    },

    /**
     * At higher percent ownership
     */

    /** At base price */
    {
        input: {
            changeInCriticalCommunityThreats: 10,
            changeInCurrentlyHospitalized: 0,
            percentOwnership: 100,
            previousPrice: 0.78,
        },
        output: 0.805,
    },
    {
        input: {
            changeInCriticalCommunityThreats: -10,
            changeInCurrentlyHospitalized: 0,
            percentOwnership: 100,
            previousPrice: 0.78,
        },
        output: 0.755,
    },
    {
        input: {
            changeInCriticalCommunityThreats: 0,
            changeInCurrentlyHospitalized: 5000,
            percentOwnership: 100,
            previousPrice: 0.78,
        },
        output: 0.805,
    },
    {
        input: {
            changeInCriticalCommunityThreats: 0,
            changeInCurrentlyHospitalized: -5000,
            percentOwnership: 100,
            previousPrice: 0.78,
        },
        output: 0.755,
    },

    /** At double the previous price */
    {
        input: {
            changeInCriticalCommunityThreats: 0,
            changeInCurrentlyHospitalized: 0,
            percentOwnership: 100,
            previousPrice: 1.56,
        },
        output: 1.56,
    },

    {
        input: {
            changeInCriticalCommunityThreats: 10,
            changeInCurrentlyHospitalized: 0,
            percentOwnership: 100,
            previousPrice: 1.56,
        },
        output: 1.61,
    },
    {
        input: {
            changeInCriticalCommunityThreats: -10,
            changeInCurrentlyHospitalized: 0,
            percentOwnership: 100,
            previousPrice: 1.56,
        },
        output: 1.51,
    },
    {
        input: {
            changeInCriticalCommunityThreats: 0,
            changeInCurrentlyHospitalized: 5000,
            percentOwnership: 100,
            previousPrice: 1.56,
        },
        output: 1.61,
    },
    {
        input: {
            changeInCriticalCommunityThreats: 0,
            changeInCurrentlyHospitalized: -5000,
            percentOwnership: 100,
            previousPrice: 1.56,
        },
        output: 1.51,
    },

    /** At half the previous price */
    {
        input: {
            changeInCriticalCommunityThreats: 0,
            changeInCurrentlyHospitalized: 0,
            percentOwnership: 100,
            previousPrice: 0.39,
        },
        output: 0.39,
    },

    {
        input: {
            changeInCriticalCommunityThreats: 10,
            changeInCurrentlyHospitalized: 0,
            percentOwnership: 100,
            previousPrice: 0.39,
        },
        output: 0.4025,
    },
    {
        input: {
            changeInCriticalCommunityThreats: -10,
            changeInCurrentlyHospitalized: 0,
            percentOwnership: 100,
            previousPrice: 0.39,
        },
        output: 0.3775,
    },
    {
        input: {
            changeInCriticalCommunityThreats: 0,
            changeInCurrentlyHospitalized: 5000,
            percentOwnership: 100,
            previousPrice: 0.39,
        },
        output: 0.4025,
    },
    {
        input: {
            changeInCriticalCommunityThreats: 0,
            changeInCurrentlyHospitalized: -5000,
            percentOwnership: 100,
            previousPrice: 0.39,
        },
        output: 0.3775,
    },
]);
