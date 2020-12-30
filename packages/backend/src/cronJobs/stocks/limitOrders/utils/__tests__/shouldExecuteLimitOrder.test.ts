import { ILimitOrder, IPriceHistory } from "@stochastic-exchange/api";
import { shouldExecuteLimitOrder } from "../shouldExecuteLimitOrder";

const BASIC_LIMIT = {
    id: "" as any,
    account: "" as any,
    quantity: 10,
    status: "PENDING" as const,
    stock: "" as any,
    timestamp: "",
};

const BASIC_PRICE = {
    id: "" as any,
    timestamp: "",
    stock: "" as any,
};

describe("should execute limit order", () => {
    it("can execute a basic higher buy limit order", () => {
        const limitOrder: ILimitOrder = {
            ...BASIC_LIMIT,
            direction: "higher",
            buyAtPrice: 10,
            type: "buy-limit",
        };

        const pricePoint: IPriceHistory = {
            ...BASIC_PRICE,
            dollarValue: 11,
        };

        expect(shouldExecuteLimitOrder(limitOrder, pricePoint)).toBeTruthy();
    });

    it("can execute a basic lower buy limit order", () => {
        const limitOrder: ILimitOrder = {
            ...BASIC_LIMIT,
            direction: "lower",
            buyAtPrice: 10,
            type: "buy-limit",
        };

        const pricePoint: IPriceHistory = {
            ...BASIC_PRICE,
            dollarValue: 9,
        };

        expect(shouldExecuteLimitOrder(limitOrder, pricePoint)).toBeTruthy();
    });

    it("can execute a basic higher sell limit order", () => {
        const limitOrder: ILimitOrder = {
            ...BASIC_LIMIT,
            direction: "higher",
            sellAtPrice: 10,
            type: "sell-limit",
        };

        const pricePoint: IPriceHistory = {
            ...BASIC_PRICE,
            dollarValue: 11,
        };

        expect(shouldExecuteLimitOrder(limitOrder, pricePoint)).toBeTruthy();
    });

    it("can execute a basic lower sell limit order", () => {
        const limitOrder: ILimitOrder = {
            ...BASIC_LIMIT,
            direction: "lower",
            sellAtPrice: 10,
            type: "sell-limit",
        };

        const pricePoint: IPriceHistory = {
            ...BASIC_PRICE,
            dollarValue: 9,
        };

        expect(shouldExecuteLimitOrder(limitOrder, pricePoint)).toBeTruthy();
    });

    it("can reject an invalid limit order buy higher", () => {
        const limitOrder: ILimitOrder = {
            ...BASIC_LIMIT,
            direction: "higher",
            buyAtPrice: 10,
            type: "buy-limit",
        };

        const pricePoint: IPriceHistory = {
            ...BASIC_PRICE,
            dollarValue: 9,
        };

        expect(shouldExecuteLimitOrder(limitOrder, pricePoint)).toBeFalsy();
    });

    it("can reject an invalid limit order buy lower", () => {
        const limitOrder: ILimitOrder = {
            ...BASIC_LIMIT,
            direction: "lower",
            buyAtPrice: 10,
            type: "buy-limit",
        };

        const pricePoint: IPriceHistory = {
            ...BASIC_PRICE,
            dollarValue: 11,
        };

        expect(shouldExecuteLimitOrder(limitOrder, pricePoint)).toBeFalsy();
    });

    it("can reject an invalid limit order sell higher", () => {
        const limitOrder: ILimitOrder = {
            ...BASIC_LIMIT,
            direction: "higher",
            sellAtPrice: 10,
            type: "sell-limit",
        };

        const pricePoint: IPriceHistory = {
            ...BASIC_PRICE,
            dollarValue: 9,
        };

        expect(shouldExecuteLimitOrder(limitOrder, pricePoint)).toBeFalsy();
    });

    it("can reject an invalid limit order sell lower", () => {
        const limitOrder: ILimitOrder = {
            ...BASIC_LIMIT,
            direction: "lower",
            sellAtPrice: 10,
            type: "sell-limit",
        };

        const pricePoint: IPriceHistory = {
            ...BASIC_PRICE,
            dollarValue: 11,
        };

        expect(shouldExecuteLimitOrder(limitOrder, pricePoint)).toBeFalsy();
    });

    it("can reject an invalid limit order", () => {
        const limitOrder: ILimitOrder = {
            ...BASIC_LIMIT,
            status: "CANCELLED",
            direction: "higher",
            sellAtPrice: 10,
            type: "sell-limit",
        };

        const pricePoint: IPriceHistory = {
            ...BASIC_PRICE,
            dollarValue: 9,
        };

        expect(shouldExecuteLimitOrder(limitOrder, pricePoint)).toBeFalsy();
    });
});
