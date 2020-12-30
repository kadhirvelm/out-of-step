import { ILimitOrder, IPriceHistory } from "@stochastic-exchange/api";

const getPriceFromLimitOrder = (limitOrder: ILimitOrder) => {
    if (limitOrder.type === "buy-limit") {
        return limitOrder.buyAtPrice;
    }

    return limitOrder.sellAtPrice;
};

export const shouldExecuteLimitOrder = (limitOrder: ILimitOrder, pricePointForStock: IPriceHistory): boolean => {
    if (limitOrder.status !== "PENDING") {
        return false;
    }

    if (pricePointForStock.stock !== limitOrder.stock) {
        return false;
    }

    const priceOfLimitOrder = getPriceFromLimitOrder(limitOrder);
    const priceOfStock = pricePointForStock.dollarValue;

    if (limitOrder.direction === "higher") {
        return priceOfStock >= priceOfLimitOrder;
    }

    return priceOfStock <= priceOfLimitOrder;
};
