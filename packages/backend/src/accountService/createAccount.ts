import { IAccountId, IAccountService } from "@stochastic-exchange/api";
import _ from "lodash";
import { Response } from "express";
import { postgresPool } from "../utils/getPostgresPool";
import { convertUserIdToWebToken } from "../utils/handleWebToken";
import { doubleHashPassword } from "../utils/hashPassword";

type ICreateAccount = IAccountService["createAccount"];

const DEFAULT_CASH_ON_HAND = 1000000;

export async function createAccount(
    payload: ICreateAccount["payload"],
    response: Response<any>,
): Promise<ICreateAccount["response"] | undefined> {
    const { hashedPassword, email, name, username, portfolioName } = payload;
    if ([hashedPassword, email, name, username, portfolioName].some(_.isEmpty)) {
        response.status(400).send({ error: "You cannot leave any fields blank." });
        return undefined;
    }

    try {
        const doAnyAccountsExist = await postgresPool.query("SELECT * FROM account WHERE LOWER(username) = LOWER($1)", [
            username,
        ]);
        if (doAnyAccountsExist.rows.length !== 0) {
            throw new Error("That user ID already exists, please pick another one.");
        }

        const doublyHashedPassword = doubleHashPassword(hashedPassword);

        const newUser = await postgresPool.query<{ id: IAccountId }>(
            // eslint-disable-next-line prettier/prettier
            "INSERT INTO account (\"hashedPassword\", email, name, username, \"cashOnHand\", \"portfolioName\") VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
            [doublyHashedPassword, email, name, username, DEFAULT_CASH_ON_HAND, portfolioName],
        );

        return convertUserIdToWebToken(newUser.rows[0].id);
    } catch (error) {
        response.status(400).send({ error: error.message });
        return undefined;
    }
}
