/* eslint-disable prettier/prettier */
import { IAccountId, ILimitOrder, ITransactionService } from "@stochastic-exchange/api";
import { Response } from "express";
import { postgresPool } from "../utils/getPostgresPool";

type IViewLimitOrdersForStock = ITransactionService["viewLimitOrdersForStock"];

export async function viewLimitOrdersForStock(
    payload: IViewLimitOrdersForStock["payload"],
    response: Response<any>,
    accountId: IAccountId | null,
): Promise<IViewLimitOrdersForStock["response"] | undefined> {
    if (accountId == null) {
        response.status(400).send({ error: "Invalid account authorization, please login again." });
        return undefined;
    }

    const { rows } = await postgresPool.query<ILimitOrder>("SELECT * FROM \"limitOrder\" WHERE account = $1 AND stock = $2 AND status IN ('PENDING', 'CANCELLED') ORDER BY timestamp ASC", [
        accountId, payload.stockId,
    ]);

    return { limitOrders: rows };
}
