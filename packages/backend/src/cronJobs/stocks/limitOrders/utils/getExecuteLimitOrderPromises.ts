import {
    IAccount,
    IAccountId,
    IExchangeTransaction,
    ILimitOrder,
    IOwnedStock,
    IOwnedStockId,
    IPriceHistory,
    IStock,
    IStockId,
} from "@stochastic-exchange/api";
import _, { cloneDeep } from "lodash";
import {
    executePurchaseQuantity,
    executeSellQuantity,
} from "../../../../transactionService/utils/executeExchangeTransaction";
import { postgresPool } from "../../../../utils/getPostgresPool";

export function getExecuteLimitOrderPromises(
    limitOrders: ILimitOrder[],
    exchangeTransactions: Omit<IExchangeTransaction, "id" | "timestamp">[],
    latestStockPrice: { [stockId: string]: IPriceHistory },
    keyedAccounts: { [accountId: string]: IAccount },
    keyedOwnedStock: { [stockId: string]: IOwnedStock[] },
    keyedStocks: { [stockId: string]: IStock },
) {
    const cancelledLimitOrders: { [limitOrderId: string]: boolean } = {};
    const onGoingAccountChanges: {
        [accountId: string]: { cashOnHand: number };
    } = {};
    const onGoingOwnedStockChanges = cloneDeep(keyedOwnedStock);

    const updateOnGoingOwnedStockChanges = (
        stockId: IStockId,
        accountId: IAccountId,
        newQuantityOfStocks: number | undefined,
    ) => {
        if (newQuantityOfStocks === undefined) {
            return;
        }

        // Remove it if the new quantity is zero
        if (newQuantityOfStocks === 0) {
            onGoingOwnedStockChanges[stockId] = onGoingOwnedStockChanges[stockId].filter(s => s.account !== accountId);
            return;
        }

        const existingOwnedStockIndex = onGoingOwnedStockChanges[stockId]?.findIndex(s => s.account === accountId);
        // Needs a new index
        if (existingOwnedStockIndex === -1 || existingOwnedStockIndex === undefined) {
            onGoingOwnedStockChanges[stockId] = (onGoingOwnedStockChanges[stockId] ?? []).concat({
                id: `temporary-${accountId}-${stockId}` as IOwnedStockId,
                account: accountId,
                quantity: newQuantityOfStocks,
                stock: stockId,
            });
            return;
        }

        // Update the existing
        onGoingOwnedStockChanges[stockId].splice(existingOwnedStockIndex, 1, {
            ...onGoingOwnedStockChanges[stockId][existingOwnedStockIndex],
            quantity: newQuantityOfStocks,
        });
    };

    const exchangeTransactionPromises = _.flatten(
        exchangeTransactions.map(transaction => {
            const ownedStock = onGoingOwnedStockChanges[transaction.stock];

            const account = keyedAccounts[transaction.account];
            const stockPrice = latestStockPrice[transaction.stock];

            const cashOnHand = onGoingAccountChanges[transaction.account]?.cashOnHand ?? account.cashOnHand;

            let finalChangeQuantity: {
                promises: Promise<any>[];
                newCashOnHand?: number;
                newQuantityOfOwnedStock?: number;
            };

            if (transaction.purchasedQuantity > 0) {
                finalChangeQuantity = executePurchaseQuantity(
                    transaction,
                    ownedStock,
                    cashOnHand,
                    stockPrice,
                    keyedStocks[transaction.stock],
                );
            } else {
                finalChangeQuantity = executeSellQuantity(transaction, ownedStock, cashOnHand, stockPrice);
            }

            onGoingAccountChanges[transaction.account] = {
                cashOnHand: finalChangeQuantity.newCashOnHand ?? cashOnHand,
            };

            updateOnGoingOwnedStockChanges(
                transaction.stock,
                transaction.account,
                finalChangeQuantity.newQuantityOfOwnedStock,
            );

            if (finalChangeQuantity.promises.length === 0) {
                cancelledLimitOrders[transaction.limitOrder ?? ""] = true;
            }

            return finalChangeQuantity.promises;
        }),
    );

    const updateLimitOrderPromises = limitOrders.map(order => {
        if (cancelledLimitOrders[order.id]) {
            return postgresPool.query("UPDATE \"limitOrder\" SET status = 'CANCELLED' WHERE id = $1", [order.id]);
        }

        return postgresPool.query("UPDATE \"limitOrder\" SET status = 'EXECUTED' WHERE id = $1", [order.id]);
    });

    return [...exchangeTransactionPromises, ...updateLimitOrderPromises];
}
