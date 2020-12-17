import { IAccount, IAccountId, IAccountService } from "@stochastic-exchange/api";
import { Response } from "express";
import { postgresPool } from "../utils/getPostgresPool";
import { doubleHashPassword } from "../utils/hashPassword";
import { getUser } from "./utils/getUser";

type IUpdateAccount = IAccountService["updateAccount"];

export async function updateAccount(
    payload: IUpdateAccount["payload"],
    response: Response<any>,
    accountId: IAccountId | null,
): Promise<IUpdateAccount["response"] | undefined> {
    if (accountId == null) {
        response.status(400).send({ error: "Invalid account authorization, please login again." });
        return undefined;
    }

    const user = await getUser(accountId);

    if (user === undefined) {
        response.status(400).send({ error: `No user was found with the ID ${accountId}` });
        return undefined;
    }

    const updatedUser: IAccount = {
        ...user,
        ...payload.updatedAccount,
        hashedPassword:
            payload.updatedAccount.hashedPassword !== undefined
                ? doubleHashPassword(payload.updatedAccount.hashedPassword)
                : user.hashedPassword,
    };

    await postgresPool.query(
        // eslint-disable-next-line prettier/prettier
        "UPDATE account SET \"hashedPassword\" = $2, email = $3, name = $4, \"portfolioName\" = $5 WHERE id = $1",
        [accountId, updatedUser.hashedPassword, updatedUser.email, updatedUser.name, updatedUser.portfolioName],
    );

    return { message: "Successfully updated your account." };
}
