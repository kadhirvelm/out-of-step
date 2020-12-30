import { IAccountId, ILimitOrder, ILimitOrderId, IStockId } from "@stochastic-exchange/api";
import { sortIntoSellFirstThenByTimestamp } from "../sortIntoSellFirstThenByTimestamp";

const BASIC_LIMIT_ORDER: ILimitOrder = {
    id: "id-1" as ILimitOrderId,
    direction: "higher",
    account: "account-1" as IAccountId,
    quantity: 10,
    status: "PENDING",
    stock: "stock-1" as IStockId,
    timestamp: "2020-12-21 5:00:00 AM",
    type: "buy-limit",
    buyAtPrice: 10,
};

describe("sort into sell first then by timestamp", () => {
    it("can sort as expected", () => {
        const limitOrders: ILimitOrder[] = [
            { ...BASIC_LIMIT_ORDER, id: "id-2" as ILimitOrderId, timestamp: "2020-12-21 6:00:00 AM" },
            {
                ...BASIC_LIMIT_ORDER,
                id: "id-4" as ILimitOrderId,
                sellAtPrice: 10,
                type: "sell-limit",
                timestamp: "2020-12-21 6:00:00 AM",
            },
            BASIC_LIMIT_ORDER,
            { ...BASIC_LIMIT_ORDER, id: "id-3" as ILimitOrderId, sellAtPrice: 10, type: "sell-limit" },
        ];

        expect(limitOrders.sort(sortIntoSellFirstThenByTimestamp).map(l => l.id)).toEqual([
            "id-3",
            "id-4",
            "id-1",
            "id-2",
        ]);
    });

    it("can sort timestamps as expected", () => {
        const limitOrders: ILimitOrder[] = [
            { ...BASIC_LIMIT_ORDER, id: "id-2" as ILimitOrderId, timestamp: "2020-12-21 6:01:00 AM" },
            {
                ...BASIC_LIMIT_ORDER,
                id: "id-4" as ILimitOrderId,
                timestamp: "2020-12-21 6:02:00 AM",
            },
            BASIC_LIMIT_ORDER,
            { ...BASIC_LIMIT_ORDER, id: "id-3" as ILimitOrderId, timestamp: "2020-12-22 10:00:00 AM" },
        ];

        expect(limitOrders.sort(sortIntoSellFirstThenByTimestamp).map(l => l.id)).toEqual([
            "id-1",
            "id-2",
            "id-4",
            "id-3",
        ]);
    });
});
