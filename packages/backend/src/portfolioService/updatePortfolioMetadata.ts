import { IAccountId, IPortfolioService } from "@stochastic-exchange/api";
import { Response } from "express";
import { getUser } from "../accountService/utils/getUser";
import { postgresPool } from "../utils/getPostgresPool";

type IUpdatePortfolioMetadata = IPortfolioService["updatePortfolioMetadata"];

export async function updatePortfolioMetadata(
    payload: IUpdatePortfolioMetadata["payload"],
    response: Response<any>,
    accountId: IAccountId | null,
): Promise<IUpdatePortfolioMetadata["response"] | undefined> {
    if (accountId == null) {
        response.status(400).send({ error: "Invalid account authorization, please login again." });
        return undefined;
    }

    const user = await getUser(accountId);
    if (user === undefined) {
        response.status(400).send({ error: `No user was found with the ID ${accountId}` });
        return undefined;
    }

    const { name } = payload;
    await postgresPool.query(
        // eslint-disable-next-line prettier/prettier
        "UPDATE portfolio SET name = $2 WHERE id = $1",
        [user.portfolio, name],
    );

    return { message: "Successfully updated your portfolio." };
}
