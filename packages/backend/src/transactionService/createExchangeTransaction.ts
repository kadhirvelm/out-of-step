/* eslint-disable @typescript-eslint/quotes */
import {
    IAccount,
    IAccountId,
    IExchangeTransaction,
    IOwnedStock,
    IPriceHistory,
    IStock,
    ITransactionService,
} from "@stochastic-exchange/api";
import { Response } from "express";
import { postgresPool } from "../utils/getPostgresPool";
import { executePurchaseQuantity, executeSellQuantity } from "./utils/executeExchangeTransaction";

type ICreateTransactionService = ITransactionService["createExchangeTransaction"];

function verifyPurchaseTransaction(
    ownedStock: IOwnedStock[],
    stock: IStock,
    purchaseQuantity: number,
    price: IPriceHistory,
    cashOnHand: number,
): { errors: string[] } | undefined {
    if (purchaseQuantity === 0) {
        return undefined;
    }

    const errors: string[] = [];

    if (stock.status !== "AVAILABLE") {
        errors.push("You cannot purchase a stock that has been acquired.");
    }

    const totalOwnedQuantity = ownedStock.reduce((previous, next) => previous + next.quantity, 0);
    if (stock.totalQuantity < totalOwnedQuantity + purchaseQuantity) {
        errors.push("There isn't enough stock to purchase, please try a smaller quantity.");
    }

    if (cashOnHand - price.dollarValue * purchaseQuantity < 0) {
        errors.push("You do not have enough money to purchase this stock, please try a smaller quantity.");
    }

    if (purchaseQuantity < 0) {
        errors.push("You cannot purchase a quantity less than 0.");
    }

    if (errors.length === 0) {
        return undefined;
    }

    return { errors };
}

function verifySellTransaction(
    ownedStock: IOwnedStock[],
    accountId: IAccountId,
    sellQuantity: number,
    stock: IStock,
): { errors: string[] } | undefined {
    if (sellQuantity === 0) {
        return undefined;
    }

    const errors: string[] = [];

    const accountOwnedStock = ownedStock.find(s => s.account === accountId);
    if (accountOwnedStock === undefined || accountOwnedStock.quantity < sellQuantity) {
        errors.push("You do not have enough shares to sell, please try a smaller quantity.");
    }

    if (stock.status === "ACQUIRED") {
        errors.push("You cannot sell a stock that has been acquired.");
    }

    if (sellQuantity < 0) {
        errors.push("You cannot sell a quantity that is less than 0.");
    }

    if (errors.length === 0) {
        return undefined;
    }

    return { errors };
}

export async function createExchangeTransaction(
    payload: ICreateTransactionService["payload"],
    response: Response<any>,
    accountId: IAccountId | null,
): Promise<ICreateTransactionService["response"] | undefined> {
    if (accountId == null) {
        response.status(400).send({ error: "Invalid account authorization, please login again." });
        return undefined;
    }

    const [latestPricePoint, stock, ownedStock, account] = await Promise.all([
        postgresPool.query<IPriceHistory>(
            // eslint-disable-next-line @typescript-eslint/quotes
            'SELECT DISTINCT ON (stock) * FROM "priceHistory" WHERE stock = $1 ORDER BY stock, timestamp DESC LIMIT 1',
            [payload.stock],
        ),
        postgresPool.query<IStock>("SELECT * FROM stock WHERE id = $1", [payload.stock]),
        postgresPool.query<IOwnedStock>('SELECT * FROM "ownedStock" WHERE stock = $1', [payload.stock]),
        postgresPool.query<Pick<IAccount, "cashOnHand">>('SELECT "cashOnHand" FROM account WHERE id = $1', [accountId]),
    ]);

    const associatedLatestPricePoint = latestPricePoint.rows[0];
    if (associatedLatestPricePoint === undefined || associatedLatestPricePoint.id !== payload.price) {
        response
            .status(400)
            .send({ error: "It looks like the price has changed, please refresh your page and try again." });
        return undefined;
    }

    const associatedStock = stock.rows[0];
    if (associatedStock === undefined) {
        response.status(400).send({
            error: "The stock you are attempting to transact does not exist. Please refresh the page and try again.",
        });
        return undefined;
    }

    const errorsForPurchase = verifyPurchaseTransaction(
        ownedStock.rows,
        associatedStock,
        payload.purchasedQuantity,
        associatedLatestPricePoint,
        account.rows[0].cashOnHand,
    );
    const errorsForSell = verifySellTransaction(ownedStock.rows, accountId, payload.soldQuantity, associatedStock);

    if (errorsForPurchase !== undefined || errorsForSell !== undefined) {
        response.status(400).send({ error: (errorsForPurchase?.errors ?? []).concat(errorsForSell?.errors ?? []) });
        return undefined;
    }

    const exchangeTransaction: Partial<IExchangeTransaction> = {
        type: "exchange-transaction",
        account: accountId,
        stock: associatedStock.id,
        priceHistory: associatedLatestPricePoint.id,
        purchasedQuantity: payload.purchasedQuantity,
        soldQuantity: payload.soldQuantity,
    };

    await Promise.all([
        ...executePurchaseQuantity(
            exchangeTransaction,
            ownedStock.rows,
            account.rows[0].cashOnHand,
            associatedLatestPricePoint,
        ),
        ...executeSellQuantity(
            exchangeTransaction,
            ownedStock.rows,
            account.rows[0].cashOnHand,
            associatedLatestPricePoint,
        ),
    ]);

    return { message: "Successfully updated your account." };
}
