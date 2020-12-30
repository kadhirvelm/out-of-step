import { ILimitOrder } from "@stochastic-exchange/api";

export const sortIntoSellFirstThenByTimestamp = (a: ILimitOrder, b: ILimitOrder) => {
    if (a.type === "sell-limit" && b.type === "buy-limit") {
        return -1;
    }

    if (a.type === "buy-limit" && b.type === "sell-limit") {
        return 1;
    }

    return new Date(a.timestamp).valueOf() < new Date(b.timestamp).valueOf() ? -1 : 1;
};
