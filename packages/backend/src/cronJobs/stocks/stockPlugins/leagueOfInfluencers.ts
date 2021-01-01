import { ILeagueOfInfluencersInputData, getPriceForLeagueOfInfluencers } from "@stochastic-exchange/ml-models";
import { callOnExternalEndpoint, callOnExternalEndpointForHTML } from "../../../utils/callOnExternalEndpoint";
import { getChangeInValueSinceLastMeasurement } from "../../../utils/getChangeInValueSinceLastMeasurement";
import { IStockPricerPlugin } from "../types";

interface ILeagueOfInfluencersCalculationNotes extends ILeagueOfInfluencersInputData {
    previousTotalGovernmentBills: number;
    previousTotalPeopleAffectedByGunViolence: number;
}

const DEFAULT_VALUE = 200;

interface IGunViolenceRow {
    date: string;
    totalKilled: number;
    totalInjured: number;
}

function extractDataPointsFromGunViolenceArchive(rawHTMLText: string, todaysDateAsString: string): IGunViolenceRow[] {
    const table = RegExp("<tbody>.*</tbody>").exec(rawHTMLText.replace(/\n/g, ""));
    if (table == null || table[0] == null) {
        return [];
    }

    const rows = table[0].split("</tr>").slice(0, -1);

    const parsedRows = rows.map(r => {
        // eslint-disable-next-line @typescript-eslint/quotes
        const separateRowIntoColumns = r.split("</td><td>");

        const dateFromCell = RegExp(/\w+\s?\d?\d,\s?(2020|2021)/g).exec(separateRowIntoColumns[0]);
        const totalKilled = separateRowIntoColumns[4];
        const totalInjured = separateRowIntoColumns[5];

        return {
            date: dateFromCell?.[0],
            totalKilled: parseInt(totalKilled, 10),
            totalInjured: parseInt(totalInjured, 10),
        };
    });

    return parsedRows.filter(row => row.date != null && row.date === todaysDateAsString) as IGunViolenceRow[];
}

async function getAllViolentIncidentsFromLastDay(currentPage?: number): Promise<IGunViolenceRow[]> {
    const todaysDate = new Date();
    const todaysDateAsString = `${todaysDate.toLocaleString("us", {
        month: "long",
    })} ${todaysDate.getDate()}, ${todaysDate.getFullYear()}`;

    const rawHtml = await callOnExternalEndpointForHTML(
        `https://www.gunviolencearchive.org/last-72-hours?page=${currentPage ?? 0}`,
    );

    const parsedRows = extractDataPointsFromGunViolenceArchive(rawHtml, todaysDateAsString);

    if (parsedRows.length === 0) {
        return [];
    }

    return parsedRows.concat(await getAllViolentIncidentsFromLastDay((currentPage ?? 0) + 1));
}

export const priceLeagueOfInfluencers: IStockPricerPlugin<ILeagueOfInfluencersCalculationNotes> = async (
    date,
    previousPriceHistory,
) => {
    const todaysDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const [totalGovernmentBills, gunViolenceInTheLastDay] = await Promise.all([
        callOnExternalEndpoint(
            `https://api.govinfo.gov/collections/BILLS/${todaysDate}T00%3A0%3A00Z?offset=0&pageSize=1&api_key=${process
                .env.DATA_GOV ?? ""}
            `,
        ),
        getAllViolentIncidentsFromLastDay(),
    ]);

    const previousCalculationNotes: Partial<ILeagueOfInfluencersCalculationNotes> = JSON.parse(
        previousPriceHistory?.calculationNotes ?? "{}",
    );

    const totalGovernmentBillsCount = totalGovernmentBills.count;

    const totalPeopleAffectedByGunViolenceToday = gunViolenceInTheLastDay.reduce(
        (previous, next) => previous + next.totalInjured + next.totalKilled,
        0,
    );

    const previousPrice = previousPriceHistory?.dollarValue ?? DEFAULT_VALUE;

    const inputToModel: ILeagueOfInfluencersInputData = {
        changeInGovernmentBills: getChangeInValueSinceLastMeasurement(
            totalGovernmentBillsCount,
            previousCalculationNotes.previousTotalGovernmentBills,
        ),
        changeInPeopleAffectedByGunViolence: getChangeInValueSinceLastMeasurement(
            totalPeopleAffectedByGunViolenceToday,
            previousCalculationNotes.previousTotalPeopleAffectedByGunViolence,
        ),
        previousPrice,
    };

    const dollarValue = await getPriceForLeagueOfInfluencers(inputToModel);

    const calculationNotes: ILeagueOfInfluencersCalculationNotes = {
        ...inputToModel,
        previousTotalGovernmentBills: totalGovernmentBillsCount,
        previousTotalPeopleAffectedByGunViolence: totalPeopleAffectedByGunViolenceToday,
    };

    return {
        calculationNotes,
        dollarValue: dollarValue ?? DEFAULT_VALUE,
    };
};
