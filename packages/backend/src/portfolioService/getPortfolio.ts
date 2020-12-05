import { IAccountId, IPortfolioService } from "@stochastic-exchange/api";
import { Response } from "express";
import { Database } from "../types/databaseTypes";
import { postgresPool } from "../utils/getPostgresPool";

type IGetPortfolio = IPortfolioService["getPortfolio"];

export async function getPortfolio(
    payload: IGetPortfolio["payload"],
    response: Response<any>,
    accountId: IAccountId | null,
): Promise<IGetPortfolio["response"] | undefined> {
    if (accountId == null) {
        response.status(400).send({ error: "Invalid account authorization, please login again." });
        return undefined;
    }

    const portfolio = await postgresPool.query<Database.Portfolio>(
        // eslint-disable-next-line prettier/prettier
        "SELECT * FROM portfolio WHERE id = $1",
        [payload],
    );

    return { ...portfolio.rows[0], limitOrders: [], ownedVolumes: {}, transactionHistory: {} };
}
