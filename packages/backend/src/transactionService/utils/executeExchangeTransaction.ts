/* eslint-disable @typescript-eslint/quotes */
import { IExchangeTransaction, IOwnedStock, IPriceHistory } from "@stochastic-exchange/api";
import { postgresPool } from "../../utils/getPostgresPool";
import { roundToNearestHundreth } from "../../utils/roundToNearestHundreth";

export function executePurchaseQuantity(
    exchangeTransaction: Partial<IExchangeTransaction>,
    ownedStock: IOwnedStock[],
    cashOnHand: number,
    price: IPriceHistory,
) {
    if (exchangeTransaction.purchasedQuantity === 0) {
        return [];
    }

    const newCashOnHand = roundToNearestHundreth(
        cashOnHand - (exchangeTransaction.purchasedQuantity ?? 0) * price.dollarValue,
    );
    const alreadyOwnedStock = ownedStock.find(s => s.account === exchangeTransaction.account);

    return [
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
                exchangeTransaction.purchasedQuantity,
                exchangeTransaction.limitOrder,
            ],
        ),
        alreadyOwnedStock !== undefined
            ? postgresPool.query('UPDATE "ownedStock" SET quantity = $1 WHERE account = $2 AND stock = $3', [
                  alreadyOwnedStock.quantity + (exchangeTransaction.purchasedQuantity ?? 0),
                  exchangeTransaction.account,
                  exchangeTransaction.stock,
              ])
            : postgresPool.query('INSERT INTO "ownedStock" (account, quantity, stock) VALUES($1, $2, $3)', [
                  exchangeTransaction.account,
                  exchangeTransaction.purchasedQuantity,
                  exchangeTransaction.stock,
              ]),
    ];
}

export function executeSellQuantity(
    exchangeTransaction: Partial<IExchangeTransaction>,
    ownedStock: IOwnedStock[],
    cashOnHand: number,
    price: IPriceHistory,
) {
    if (exchangeTransaction.soldQuantity === 0) {
        return [];
    }

    const newCashOnHand = roundToNearestHundreth(
        cashOnHand + (exchangeTransaction.soldQuantity ?? 0) * price.dollarValue,
    );

    const alreadyOwnedStock = ownedStock.find(s => s.account === exchangeTransaction.account);
    const newAlreadyOwnedStockQuantity = (alreadyOwnedStock?.quantity ?? 0) - (exchangeTransaction.soldQuantity ?? 0);

    return [
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
                exchangeTransaction.soldQuantity,
                exchangeTransaction.limitOrder,
            ],
        ),
        newAlreadyOwnedStockQuantity === 0
            ? postgresPool.query('DELETE FROM "ownedStock" WHERE account = $1 AND stock = $2', [
                  exchangeTransaction.account,
                  exchangeTransaction.stock,
              ])
            : postgresPool.query('UPDATE "ownedStock" SET quantity = $1 WHERE account = $2 AND stock = $3', [
                  newAlreadyOwnedStockQuantity,
                  exchangeTransaction.account,
                  exchangeTransaction.stock,
              ]),
    ];
}
