import { IAccount, IAccountService } from "@stochastic-exchange/api";
import { Response } from "express";
import _ from "lodash";
import { postgresPool } from "../utils/getPostgresPool";
import { convertUserIdToWebToken } from "../utils/handleWebToken";
import { doubleHashPassword } from "../utils/hashPassword";

type ILoginToAccount = IAccountService["loginToAccount"];

export async function loginToAccount(
    payload: ILoginToAccount["payload"],
    response: Response<any>,
): Promise<ILoginToAccount["response"] | undefined> {
    const { hashedPassword, username } = payload;
    if ([hashedPassword, username].some(_.isEmpty)) {
        response.status(400).send({ error: "You cannot leave any fields blank." });
        return undefined;
    }

    try {
        const user = await postgresPool.query<IAccount>(
            // eslint-disable-next-line prettier/prettier
            "SELECT \"hashedPassword\", id FROM account WHERE username = $1",
            [username],
        );

        if (user.rows.length === 0) {
            throw new Error("Invalid account.");
        }

        if (user.rows[0].hashedPassword !== doubleHashPassword(hashedPassword)) {
            throw new Error("Invalid account.");
        }

        return convertUserIdToWebToken(user.rows[0].id);
    } catch (e) {
        response.status(400).send({ error: "Either the username or the password was invalid. Please try again." });
        return undefined;
    }
}
