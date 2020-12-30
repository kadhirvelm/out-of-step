import { ILimitOrder, IPriceHistory, IExchangeTransaction } from "@stochastic-exchange/api";

export const convertLimitOrderToExchangeTransaction = (
    limitOrder: ILimitOrder,
    latestStockPrice: { [stockId: string]: IPriceHistory },
): Omit<IExchangeTransaction, "id" | "timestamp"> => {
    return {
        account: limitOrder.account,
        limitOrder: limitOrder.id,
        priceHistory: latestStockPrice[limitOrder.stock].id,
        purchasedQuantity: limitOrder.type === "buy-limit" ? limitOrder.quantity : 0,
        soldQuantity: limitOrder.type === "sell-limit" ? limitOrder.quantity : 0,
        stock: limitOrder.stock,
        type: "exchange-transaction",
    };
};
