import { IAccountId, IAccountService, IPortfolioId } from "@stochastic-exchange/api";
import _ from "lodash";
import { Response } from "express";
import { postgresPool } from "../utils/getPostgresPool";
import { convertUserIdToWebToken } from "../utils/handleWebToken";
import { doubleHashPassword } from "../utils/hashPassword";

type ICreateAccount = IAccountService["createAccount"];

export async function createAccount(
    payload: ICreateAccount["payload"],
    response: Response<any>,
): Promise<ICreateAccount["response"] | undefined> {
    const { hashedPassword, email, name, username } = payload;
    if ([hashedPassword, email, name, username].some(_.isEmpty)) {
        response.status(400).send({ error: "You cannot leave any fields blank." });
        return undefined;
    }

    try {
        const doAnyAccountsExist = await postgresPool.query("SELECT * FROM account WHERE username = $1", [username]);
        if (doAnyAccountsExist.rows.length !== 0) {
            throw new Error("That user ID already exists, please pick another one.");
        }

        const newPortfolioForUser = await postgresPool.query<{ id: IPortfolioId }>(
            // eslint-disable-next-line prettier/prettier
            "INSERT INTO portfolio (\"cashOnHand\") VALUES ($1) RETURNING id",
            [100000000],
        );

        const doublyHashedPassword = doubleHashPassword(hashedPassword);

        const newUser = await postgresPool.query<{ id: IAccountId }>(
            // eslint-disable-next-line prettier/prettier
            "INSERT INTO account (\"hashedPassword\", email, name, username, \"portfolioId\") VALUES ($1, $2, $3, $4, $5) RETURNING id",
            [doublyHashedPassword, email, name, username, newPortfolioForUser.rows[0].id],
        );

        return convertUserIdToWebToken(newUser.rows[0].id);
    } catch (error) {
        response.status(400).send({ error: error.message });
        return undefined;
    }
}
