import { ILimitOrder } from "@stochastic-exchange/api";
import { formatDollar } from "./formatNumber";

export const getLimitOrderPrice = (limitOrder: ILimitOrder) => {
    if (limitOrder.type === "buy-limit") {
        return formatDollar(limitOrder.buyAtPrice);
    }

    return formatDollar(limitOrder.sellAtPrice);
};
