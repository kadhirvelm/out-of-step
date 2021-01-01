import { StockModel } from "./stockModel";

const convertLeagueOfInfluencersToInputData = (input: ILeagueOfInfluencersInputData) => [
    input.changeInGovernmentBills,
    input.changeInPeopleAffectedByGunViolence,
    input.previousPrice,
];

const LeagueOfInfluencersModel = new StockModel<ILeagueOfInfluencersInputData>(
    {
        epochs: 250,
        name: "league-of-influencers-v1",
    },
    convertLeagueOfInfluencersToInputData,
);

export interface ILeagueOfInfluencersInputData {
    changeInGovernmentBills: number;
    changeInPeopleAffectedByGunViolence: number;
    previousPrice: number;
}

export const getPriceForLeagueOfInfluencers = LeagueOfInfluencersModel.getPrice;

const CHANGE_IN_GOVERNMENT_BILLS = 5;
const CHANGE_IN_GUN_VIOLENCE = 8;

export const trainModelForLeagueOfInfluencers = LeagueOfInfluencersModel.trainModel([
    {
        input: {
            changeInGovernmentBills: 0,
            changeInPeopleAffectedByGunViolence: 0,
            previousPrice: 200,
        },
        output: 200,
    },
    {
        input: {
            changeInGovernmentBills: CHANGE_IN_GOVERNMENT_BILLS,
            changeInPeopleAffectedByGunViolence: 0,
            previousPrice: 200,
        },
        output: 210,
    },
    {
        input: {
            changeInGovernmentBills: -CHANGE_IN_GOVERNMENT_BILLS,
            changeInPeopleAffectedByGunViolence: 0,
            previousPrice: 200,
        },
        output: 190,
    },
    {
        input: {
            changeInGovernmentBills: 0,
            changeInPeopleAffectedByGunViolence: -CHANGE_IN_GUN_VIOLENCE,
            previousPrice: 200,
        },
        output: 210,
    },
    {
        input: {
            changeInGovernmentBills: 0,
            changeInPeopleAffectedByGunViolence: CHANGE_IN_GUN_VIOLENCE,
            previousPrice: 200,
        },
        output: 190,
    },
    /**
     * Higher previous price
     */
    {
        input: {
            changeInGovernmentBills: CHANGE_IN_GOVERNMENT_BILLS,
            changeInPeopleAffectedByGunViolence: 0,
            previousPrice: 400,
        },
        output: 410,
    },
    {
        input: {
            changeInGovernmentBills: -CHANGE_IN_GOVERNMENT_BILLS,
            changeInPeopleAffectedByGunViolence: 0,
            previousPrice: 400,
        },
        output: 390,
    },
    {
        input: {
            changeInGovernmentBills: 0,
            changeInPeopleAffectedByGunViolence: -CHANGE_IN_GUN_VIOLENCE,
            previousPrice: 400,
        },
        output: 410,
    },
    {
        input: {
            changeInGovernmentBills: 0,
            changeInPeopleAffectedByGunViolence: CHANGE_IN_GUN_VIOLENCE,
            previousPrice: 400,
        },
        output: 390,
    },
    /**
     * Lower previous price
     */
    {
        input: {
            changeInGovernmentBills: CHANGE_IN_GOVERNMENT_BILLS,
            changeInPeopleAffectedByGunViolence: 0,
            previousPrice: 100,
        },
        output: 110,
    },
    {
        input: {
            changeInGovernmentBills: -CHANGE_IN_GOVERNMENT_BILLS,
            changeInPeopleAffectedByGunViolence: 0,
            previousPrice: 100,
        },
        output: 90,
    },
    {
        input: {
            changeInGovernmentBills: 0,
            changeInPeopleAffectedByGunViolence: -CHANGE_IN_GUN_VIOLENCE,
            previousPrice: 100,
        },
        output: 110,
    },
    {
        input: {
            changeInGovernmentBills: 0,
            changeInPeopleAffectedByGunViolence: CHANGE_IN_GUN_VIOLENCE,
            previousPrice: 100,
        },
        output: 90,
    },
]);
