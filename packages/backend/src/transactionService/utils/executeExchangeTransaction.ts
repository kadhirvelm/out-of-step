/* eslint-disable @typescript-eslint/quotes */
import { IExchangeTransaction, IOwnedStock, IPriceHistory, IStock } from "@stochastic-exchange/api";
import { postgresPool } from "../../utils/getPostgresPool";
import { roundToNearestHundreth } from "../../utils/roundToNearestHundreth";

const ensurePurchaseableQuantity = (
    purchaseQuantity: number,
    availableQuantity: number,
    cashOnHand: number,
    pricePerShare: number,
) => {
    const boundedQuantity = Math.min(purchaseQuantity, availableQuantity);
    return Math.min(boundedQuantity, Math.round(cashOnHand / pricePerShare));
};

export function executePurchaseQuantity(
    exchangeTransaction: Partial<IExchangeTransaction>,
    ownedStock: IOwnedStock[] | undefined,
    cashOnHand: number,
    price: IPriceHistory,
    stock: IStock,
) {
    if (exchangeTransaction.purchasedQuantity === 0) {
        return { promises: [] };
    }

    const totalOwnedQuantity = (ownedStock ?? []).reduce((previous, next) => previous + next.quantity, 0);
    const purchaseQuantity = ensurePurchaseableQuantity(
        exchangeTransaction.purchasedQuantity ?? 0,
        stock.totalQuantity - totalOwnedQuantity,
        cashOnHand,
        price.dollarValue,
    );

    if (purchaseQuantity === 0) {
        return { promises: [] };
    }

    const newCashOnHand = roundToNearestHundreth(cashOnHand - purchaseQuantity * price.dollarValue);
    const alreadyOwnedStock = (ownedStock ?? []).find(s => s.account === exchangeTransaction.account);
    const newQuantityOfOwnedStock = (alreadyOwnedStock?.quantity ?? 0) + purchaseQuantity;

    return {
        promises: [
            postgresPool.query('UPDATE account SET "cashOnHand" = $2 WHERE id = $1', [
                exchangeTransaction.account,
                newCashOnHand,
            ]),
            postgresPool.query(
                'INSERT INTO "transactionHistory" (type, account, stock, "priceHistory", "purchasedQuantity", "soldQuantity", "limitOrder") VALUES (\'exchange-transaction\', $1, $2, $3, $4, 0, $5)',
                [
                    exchangeTransaction.account,
                    exchangeTransaction.stock,
                    exchangeTransaction.priceHistory,
                    purchaseQuantity,
                    exchangeTransaction.limitOrder,
                ],
            ),
            alreadyOwnedStock !== undefined
                ? postgresPool.query('UPDATE "ownedStock" SET quantity = $1 WHERE account = $2 AND stock = $3', [
                      alreadyOwnedStock.quantity + purchaseQuantity,
                      exchangeTransaction.account,
                      exchangeTransaction.stock,
                  ])
                : postgresPool.query('INSERT INTO "ownedStock" (account, quantity, stock) VALUES($1, $2, $3)', [
                      exchangeTransaction.account,
                      purchaseQuantity,
                      exchangeTransaction.stock,
                  ]),
        ],
        newCashOnHand,
        newQuantityOfOwnedStock,
    };
}

const ensureSellQuantityIsLessThanStart = (startQuantity: number, attemptToSellQuantity: number) =>
    Math.min(startQuantity, attemptToSellQuantity);

export function executeSellQuantity(
    exchangeTransaction: Partial<IExchangeTransaction>,
    ownedStock: IOwnedStock[] | undefined,
    cashOnHand: number,
    price: IPriceHistory,
) {
    if (exchangeTransaction.soldQuantity === 0) {
        return { promises: [] };
    }

    const alreadyOwnedStock = (ownedStock ?? []).find(s => s.account === exchangeTransaction.account);
    const sellQuantity = ensureSellQuantityIsLessThanStart(
        alreadyOwnedStock?.quantity ?? 0,
        exchangeTransaction.soldQuantity ?? 0,
    );

    if (sellQuantity === 0) {
        return { promises: [] };
    }

    const newCashOnHand = roundToNearestHundreth(cashOnHand + sellQuantity * price.dollarValue);
    const newQuantityOfOwnedStock = (alreadyOwnedStock?.quantity ?? 0) - sellQuantity;

    return {
        promises: [
            postgresPool.query('UPDATE account SET "cashOnHand" = $2 WHERE id = $1', [
                exchangeTransaction.account,
                newCashOnHand,
            ]),
            postgresPool.query(
                'INSERT INTO "transactionHistory" (type, account, stock, "priceHistory", "purchasedQuantity", "soldQuantity", "limitOrder") VALUES (\'exchange-transaction\', $1, $2, $3, 0, $4, $5)',
                [
                    exchangeTransaction.account,
                    exchangeTransaction.stock,
                    exchangeTransaction.priceHistory,
                    sellQuantity,
                    exchangeTransaction.limitOrder,
                ],
            ),
            newQuantityOfOwnedStock === 0
                ? postgresPool.query('DELETE FROM "ownedStock" WHERE account = $1 AND stock = $2', [
                      exchangeTransaction.account,
                      exchangeTransaction.stock,
                  ])
                : postgresPool.query('UPDATE "ownedStock" SET quantity = $1 WHERE account = $2 AND stock = $3', [
                      newQuantityOfOwnedStock,
                      exchangeTransaction.account,
                      exchangeTransaction.stock,
                  ]),
        ],
        newCashOnHand,
        newQuantityOfOwnedStock,
    };
}
