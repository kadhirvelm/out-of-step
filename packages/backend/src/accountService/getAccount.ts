import { IAccountId, IAccountService } from "@stochastic-exchange/api";
import { Response } from "express";
import _ from "lodash";
import { getUser } from "./utils/getUser";

type IGetAccount = IAccountService["getAccount"];

export async function getAccount(
    _unused: IGetAccount["payload"],
    response: Response<any>,
    accountId: IAccountId | null,
): Promise<IGetAccount["response"] | undefined> {
    if (accountId == null) {
        response.status(400).send({ error: "Invalid account authorization, please login again." });
        return undefined;
    }

    const user = await getUser(accountId);

    if (user === undefined) {
        response.status(400).send({ error: `No user was found with the ID ${accountId}` });
    }

    return _.omit(user, "hashedPassword");
}
