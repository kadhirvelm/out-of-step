/* eslint-disable @typescript-eslint/quotes */
import { IAccountId, ILimitOrder, ITransactionService } from "@stochastic-exchange/api";
import { Response } from "express";
import { postgresPool } from "../utils/getPostgresPool";

type ICreateLimitOrder = ITransactionService["createLimitOrder"];

const createBuyAtLimitOrder = async (accountId: IAccountId, payload: ICreateLimitOrder["payload"]) => {
    const {
        rows: [newBuyOrder],
    } = await postgresPool.query<ILimitOrder>(
        "INSERT INTO \"limitOrder\" (account, quantity, stock, status, type, \"buyAtPrice\") VALUES ($1, $2, $3, 'PENDING', 'buy-limit', $4) RETURNING *",
        [accountId, payload.quantity, payload.stock, payload.buyAtPrice],
    );

    return newBuyOrder;
};

const createSellAtLimitOrder = async (accountId: IAccountId, payload: ICreateLimitOrder["payload"]) => {
    const {
        rows: [newSellOrder],
    } = await postgresPool.query<ILimitOrder>(
        "INSERT INTO \"limitOrder\" (account, quantity, stock, status, type, \"sellAtPrice\") VALUES ($1, $2, $3, 'PENDING', 'sell-limit', $4) RETURNING *",
        [accountId, payload.quantity, payload.stock, payload.sellAtPrice],
    );

    return newSellOrder;
};

export async function createLimitOrder(
    payload: ICreateLimitOrder["payload"],
    response: Response<any>,
    accountId: IAccountId | null,
): Promise<ICreateLimitOrder["response"] | undefined> {
    if (accountId == null) {
        return undefined;
    }

    if (payload.quantity < 0) {
        response.status(400).send({ error: "Limit order quantities must be greater than 0." });
        return undefined;
    }

    if (
        (payload.sellAtPrice === undefined && payload.buyAtPrice === undefined) ||
        (payload.sellAtPrice !== undefined && payload.buyAtPrice !== undefined)
    ) {
        response.status(400).send({ error: "Either sell at price or buy at price must be defined." });
        return undefined;
    }

    let newLimitOrder: ILimitOrder;

    if (payload.buyAtPrice !== undefined) {
        newLimitOrder = await createBuyAtLimitOrder(accountId, payload);
    } else {
        newLimitOrder = await createSellAtLimitOrder(accountId, payload);
    }

    return { message: "Successfully created new limit order.", newLimitOrder };
}
