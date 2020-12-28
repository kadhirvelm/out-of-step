/* eslint-disable prettier/prettier */
import { IAccountId, ITransactionService } from "@stochastic-exchange/api";
import { Response } from "express";
import { postgresPool } from "../utils/getPostgresPool";

type IDeleteLimitOrder = ITransactionService["deleteLimitOrder"];

export async function deleteLimitOrder(
    payload: IDeleteLimitOrder["payload"],
    response: Response<any>,
    accountId: IAccountId | null,
): Promise<IDeleteLimitOrder["response"] | undefined> {
    if (accountId == null) {
        response.status(400).send({ error: "Invalid account authorization, please login again." });
        return undefined;
    }

    const { rows: [maybeLimitOrder] } = await postgresPool.query<{ account: IAccountId }>("SELECT account FROM \"limitOrder\" WHERE id = $1", [
        payload.id,
    ]);

    if (maybeLimitOrder === undefined) {
        response.status(400).send({ error: "The limit order does not exist anymore." });
        return undefined;
    }

    if (maybeLimitOrder.account !== accountId) {
        response.status(400).send({ error: "This limit order does not belong to you. You cannot delete it." });
        return undefined;
    }

    await postgresPool.query("DELETE FROM \"limitOrder\" WHERE account = $1 AND id = $2", [accountId, payload.id]);

    return { message: "Successfully deleted the limit order." };
}
