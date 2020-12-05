import { IAccountService } from "@stochastic-exchange/api";
import { Response } from "express";
import _ from "lodash";
import { Database } from "../types/databaseTypes";
import { postgresPool } from "../utils/getPostgresPool";
import { convertUserIdToWebToken } from "../utils/handleWebToken";

type IResetAccountPassword = IAccountService["resetAccountPassword"];

export async function resetAccountPassword(
    payload: IResetAccountPassword["payload"],
    response: Response<any>,
): Promise<IResetAccountPassword["response"] | undefined> {
    const { email, username } = payload;
    if ([email, username].some(_.isEmpty)) {
        response.status(400).send({ error: "You cannot leave any fields blank." });
        return undefined;
    }

    try {
        const user = await postgresPool.query<Database.Account>(
            // eslint-disable-next-line prettier/prettier
            "SELECT id FROM account WHERE username = $1 AND email = $2",
            [username, email],
        );

        if (user.rows.length === 0) {
            throw new Error("Invalid account.");
        }

        return convertUserIdToWebToken(user.rows[0].id);
    } catch (e) {
        response.status(400).send({ error: "Either the username or the password was invalid. Please try again." });
        return undefined;
    }
}
