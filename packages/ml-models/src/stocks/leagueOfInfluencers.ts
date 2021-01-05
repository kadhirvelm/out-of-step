import { StockModel } from "./stockModel";

const convertLeagueOfInfluencersToInputData = (input: ILeagueOfInfluencersInputData) => [
    input.airQualityIndex,
    input.changeInGovernmentBills,
    input.previousPrice,
];

const LeagueOfInfluencersModel = new StockModel<ILeagueOfInfluencersInputData>(
    {
        epochs: 400,
        name: "league-of-influencers-v1",
    },
    convertLeagueOfInfluencersToInputData,
);

export interface ILeagueOfInfluencersInputData {
    airQualityIndex: number;
    changeInGovernmentBills: number;
    previousPrice: number;
}

const BASE_AIR_QUALITY = 50;

export const getPriceForLeagueOfInfluencers = (input: ILeagueOfInfluencersInputData) =>
    LeagueOfInfluencersModel.getPrice({ ...input, airQualityIndex: input.airQualityIndex - BASE_AIR_QUALITY });

const CHANGE_IN_GOVERNMENT_BILLS = 2;
const CHANGE_IN_AIR_QUALITY = 15;

export const trainModelForLeagueOfInfluencers = LeagueOfInfluencersModel.trainModel([
    {
        input: {
            airQualityIndex: 0,
            changeInGovernmentBills: 0,
            previousPrice: 200,
        },
        output: 200,
    },
    {
        input: {
            airQualityIndex: 0,
            changeInGovernmentBills: CHANGE_IN_GOVERNMENT_BILLS,
            previousPrice: 200,
        },
        output: 210,
    },
    {
        input: {
            airQualityIndex: 0,
            changeInGovernmentBills: -CHANGE_IN_GOVERNMENT_BILLS,
            previousPrice: 200,
        },
        output: 190,
    },
    {
        input: {
            airQualityIndex: -CHANGE_IN_AIR_QUALITY,
            changeInGovernmentBills: 0,
            previousPrice: 200,
        },
        output: 210,
    },
    {
        input: {
            airQualityIndex: CHANGE_IN_AIR_QUALITY,
            changeInGovernmentBills: 0,
            previousPrice: 200,
        },
        output: 190,
    },
    /**
     * Higher previous price
     */
    {
        input: {
            airQualityIndex: 0,
            changeInGovernmentBills: CHANGE_IN_GOVERNMENT_BILLS,
            previousPrice: 400,
        },
        output: 410,
    },
    {
        input: {
            airQualityIndex: 0,
            changeInGovernmentBills: -CHANGE_IN_GOVERNMENT_BILLS,
            previousPrice: 400,
        },
        output: 390,
    },
    {
        input: {
            airQualityIndex: -CHANGE_IN_AIR_QUALITY,
            changeInGovernmentBills: 0,
            previousPrice: 400,
        },
        output: 410,
    },
    {
        input: {
            airQualityIndex: CHANGE_IN_AIR_QUALITY,
            changeInGovernmentBills: 0,
            previousPrice: 400,
        },
        output: 390,
    },
    /**
     * Lower previous price
     */
    {
        input: {
            airQualityIndex: 0,
            changeInGovernmentBills: CHANGE_IN_GOVERNMENT_BILLS,
            previousPrice: 100,
        },
        output: 110,
    },
    {
        input: {
            airQualityIndex: 0,
            changeInGovernmentBills: -CHANGE_IN_GOVERNMENT_BILLS,
            previousPrice: 100,
        },
        output: 90,
    },
    {
        input: {
            airQualityIndex: -CHANGE_IN_AIR_QUALITY,
            changeInGovernmentBills: 0,
            previousPrice: 100,
        },
        output: 110,
    },
    {
        input: {
            airQualityIndex: CHANGE_IN_AIR_QUALITY,
            changeInGovernmentBills: 0,
            previousPrice: 100,
        },
        output: 90,
    },
]);
