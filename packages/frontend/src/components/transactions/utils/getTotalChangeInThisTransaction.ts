import { IExchangeTransactionWithPrice, IStockValueAtTransactionTime } from "@stochastic-exchange/api";

export function getTotalChangeInThisTransaction(
    transaction: IExchangeTransactionWithPrice & IStockValueAtTransactionTime,
) {
    if (transaction.purchasedQuantity > 0) {
        return -transaction.purchasedQuantity * transaction.priceHistory.dollarValue;
    }

    return transaction.soldQuantity * transaction.priceHistory.dollarValue;
}
