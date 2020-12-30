import {
    IAccount,
    IAccountId,
    ILimitOrder,
    ILimitOrderId,
    IOwnedStock,
    IOwnedStockId,
    IPriceHistory,
    IPriceHistoryId,
    IStock,
    IStockId,
} from "@stochastic-exchange/api";
import { convertLimitOrderToExchangeTransaction } from "../convertLimitOrderToExchangeTransaction";
import { getExecuteLimitOrderPromises } from "../getExecuteLimitOrderPromises";

const basicLimitOrder: ILimitOrder = {
    id: "limit-order-1" as ILimitOrderId,
    direction: "higher",
    account: "account-1" as IAccountId,
    quantity: 10,
    status: "PENDING",
    stock: "stock-1" as IStockId,
    timestamp: "2020-12-21",
    buyAtPrice: 9,
    type: "buy-limit",
};

const latestStockPrice: { [stockId: string]: IPriceHistory } = {
    "stock-1": {
        id: "price-history-1" as IPriceHistoryId,
        dollarValue: 10,
        timestamp: "",
        stock: "stock-1" as IStockId,
    },
};

const exchangeTransaction = convertLimitOrderToExchangeTransaction(basicLimitOrder, latestStockPrice);

const keyedAccounts: { [accountId: string]: IAccount } = {
    "account-1": {
        id: "account-1" as IAccountId,
        hashedPassword: "",
        email: "",
        name: "",
        username: "",
        cashOnHand: 1000,
        portfolioName: "",
    },
};

const keyedOwnedStock: { [stockId: string]: IOwnedStock[] } = {};

const keyedStocks: { [stockId: string]: IStock } = {
    "stock-1": {
        id: "stock-1" as IStockId,
        name: "stock-1",
        status: "AVAILABLE",
        totalQuantity: 1000,
    },
};

jest.mock("pg", () => {
    const mockClient = {
        query: (query: string, parameters: any[]) => ({ query, parameters }),
    };

    return {
        Pool: jest.fn(() => mockClient),
    };
});

describe("get execute limit order promises", () => {
    it("can execute a basic limit order", async () => {
        const promises = getExecuteLimitOrderPromises(
            [basicLimitOrder],
            [exchangeTransaction],
            latestStockPrice,
            keyedAccounts,
            keyedOwnedStock,
            keyedStocks,
        );

        const newCashOnHand = (await promises[0]).parameters;
        expect(newCashOnHand).toEqual(["account-1", 900]);

        const transactionHistoryChange = (await promises[1]).parameters;
        expect(transactionHistoryChange).toEqual(["account-1", "stock-1", "price-history-1", 10, "limit-order-1"]);

        const insertIntoOwnedStock = (await promises[2]).parameters;
        expect(insertIntoOwnedStock).toEqual(["account-1", 10, "stock-1"]);

        const limitOrderExecuted = (await promises[3]).query;
        expect(limitOrderExecuted).toEqual("UPDATE \"limitOrder\" SET status = 'EXECUTED' WHERE id = $1");

        expect(promises.length).toEqual(4);
    });

    it("can execute two basic limit orders in a row", async () => {
        const basicLimitOrder2 = {
            ...basicLimitOrder,
            id: "limit-order-2" as ILimitOrderId,
            quantity: 20,
            timestamp: "2020-12-20",
        };
        const newExchangeTransaction = convertLimitOrderToExchangeTransaction(basicLimitOrder2, latestStockPrice);

        const promises = getExecuteLimitOrderPromises(
            [basicLimitOrder, basicLimitOrder2],
            [exchangeTransaction, newExchangeTransaction],
            latestStockPrice,
            keyedAccounts,
            keyedOwnedStock,
            keyedStocks,
        );

        const newCashOnHand = (await promises[0]).parameters;
        expect(newCashOnHand).toEqual(["account-1", 900]);

        const transactionHistoryChange = (await promises[1]).parameters;
        expect(transactionHistoryChange).toEqual(["account-1", "stock-1", "price-history-1", 10, "limit-order-1"]);

        const insertIntoOwnedStock = (await promises[2]).parameters;
        expect(insertIntoOwnedStock).toEqual(["account-1", 10, "stock-1"]);

        const newCashOnHand2 = (await promises[3]).parameters;
        expect(newCashOnHand2).toEqual(["account-1", 700]);

        const transactionHistoryChange2 = (await promises[4]).parameters;
        expect(transactionHistoryChange2).toEqual(["account-1", "stock-1", "price-history-1", 20, "limit-order-2"]);

        const updateExistingOwnedStock = (await promises[5]).parameters;
        expect(updateExistingOwnedStock).toEqual([30, "account-1", "stock-1"]);

        const limitOrder = (await promises[6]).query;
        expect(limitOrder).toEqual("UPDATE \"limitOrder\" SET status = 'EXECUTED' WHERE id = $1");

        const limitOrder2 = (await promises[7]).query;
        expect(limitOrder2).toEqual("UPDATE \"limitOrder\" SET status = 'EXECUTED' WHERE id = $1");

        expect(promises.length).toEqual(8);
    });

    it("can execute two limit orders that sell all the asset", async () => {
        const basicLimitOrder2 = {
            ...basicLimitOrder,
            id: "limit-order-2" as ILimitOrderId,
            quantity: 20,
            timestamp: "2020-12-20",
            buyAtPrice: undefined,
            sellAtPrice: 9,
            type: "sell-limit" as const,
        };
        const newExchangeTransaction = convertLimitOrderToExchangeTransaction(basicLimitOrder2, latestStockPrice);

        const promises = getExecuteLimitOrderPromises(
            [basicLimitOrder, basicLimitOrder2],
            [exchangeTransaction, newExchangeTransaction],
            latestStockPrice,
            keyedAccounts,
            keyedOwnedStock,
            keyedStocks,
        );

        const newCashOnHand = (await promises[0]).parameters;
        expect(newCashOnHand).toEqual(["account-1", 900]);

        const transactionHistoryChange = (await promises[1]).parameters;
        expect(transactionHistoryChange).toEqual(["account-1", "stock-1", "price-history-1", 10, "limit-order-1"]);

        const insertIntoOwnedStock = (await promises[2]).parameters;
        expect(insertIntoOwnedStock).toEqual(["account-1", 10, "stock-1"]);

        const newCashOnHand2 = (await promises[3]).parameters;
        expect(newCashOnHand2).toEqual(["account-1", 1000]);

        const transactionHistoryChange2 = (await promises[4]).parameters;
        expect(transactionHistoryChange2).toEqual(["account-1", "stock-1", "price-history-1", 10, "limit-order-2"]);

        const deleteOwnedStock = (await promises[5]).parameters;
        expect(deleteOwnedStock).toEqual(["account-1", "stock-1"]);

        const limitOrder = (await promises[6]).query;
        expect(limitOrder).toEqual("UPDATE \"limitOrder\" SET status = 'EXECUTED' WHERE id = $1");

        const limitOrder2 = (await promises[7]).query;
        expect(limitOrder2).toEqual("UPDATE \"limitOrder\" SET status = 'EXECUTED' WHERE id = $1");

        expect(promises.length).toEqual(8);
    });

    it("can execute one sell order, then a buy order in a row", async () => {
        const basicLimitOrderSell100 = {
            ...basicLimitOrder,
            id: "limit-order-sell" as ILimitOrderId,
            quantity: 100,
            timestamp: "2020-12-20",
            buyAtPrice: undefined,
            sellAtPrice: 9,
            type: "sell-limit" as const,
        };
        const basicLimitOrderBuy200 = {
            ...basicLimitOrder,
            id: "limit-order-buy" as ILimitOrderId,
            quantity: 200,
            timestamp: "2020-12-20",
        };

        const sellExchangeTransaction = convertLimitOrderToExchangeTransaction(
            basicLimitOrderSell100,
            latestStockPrice,
        );
        const buyExchangeTransaction = convertLimitOrderToExchangeTransaction(basicLimitOrderBuy200, latestStockPrice);

        const adjustedOwnedStocks: { [stockId: string]: IOwnedStock[] } = {
            "stock-1": [
                {
                    account: "account-1" as IAccountId,
                    id: "owned-1" as IOwnedStockId,
                    quantity: 100,
                    stock: "stock-1" as IStockId,
                },
            ],
        };

        const promises = getExecuteLimitOrderPromises(
            [basicLimitOrderSell100, basicLimitOrderBuy200],
            [sellExchangeTransaction, buyExchangeTransaction],
            latestStockPrice,
            keyedAccounts,
            adjustedOwnedStocks,
            keyedStocks,
        );

        const newCashOnHand = (await promises[0]).parameters;
        expect(newCashOnHand).toEqual(["account-1", 2000]);

        const transactionHistoryChange = (await promises[1]).parameters;
        expect(transactionHistoryChange).toEqual(["account-1", "stock-1", "price-history-1", 100, "limit-order-sell"]);

        const deleteOwnedStock = (await promises[2]).parameters;
        expect(deleteOwnedStock).toEqual(["account-1", "stock-1"]);

        const newCashOnHand2 = (await promises[3]).parameters;
        expect(newCashOnHand2).toEqual(["account-1", 0]);

        const transactionHistoryChange2 = (await promises[4]).parameters;
        expect(transactionHistoryChange2).toEqual(["account-1", "stock-1", "price-history-1", 200, "limit-order-buy"]);

        const insertIntoOwnedStock = (await promises[5]).parameters;
        expect(insertIntoOwnedStock).toEqual(["account-1", 200, "stock-1"]);

        const limitOrder = (await promises[6]).query;
        expect(limitOrder).toEqual("UPDATE \"limitOrder\" SET status = 'EXECUTED' WHERE id = $1");

        const limitOrder2 = (await promises[7]).query;
        expect(limitOrder2).toEqual("UPDATE \"limitOrder\" SET status = 'EXECUTED' WHERE id = $1");

        expect(promises.length).toEqual(8);
    });

    it("can cancel a basic limit order that's invalid", async () => {
        const basicLimitOrderSell = {
            ...basicLimitOrder,
            id: "limit-order-2" as ILimitOrderId,
            quantity: 10,
            timestamp: "2020-12-20",
            buyAtPrice: undefined,
            sellAtPrice: 9,
            type: "sell-limit" as const,
        };

        const promises = getExecuteLimitOrderPromises(
            [basicLimitOrderSell],
            [convertLimitOrderToExchangeTransaction(basicLimitOrderSell, latestStockPrice)],
            latestStockPrice,
            keyedAccounts,
            keyedOwnedStock,
            keyedStocks,
        );

        const limitOrderExecuted = (await promises[0]).query;
        expect(limitOrderExecuted).toEqual("UPDATE \"limitOrder\" SET status = 'CANCELLED' WHERE id = $1");

        expect(promises.length).toEqual(1);
    });

    it("can execute a buy orders in a row, and invalidate the second", async () => {
        const basicLimitOrderBuyEverything = { ...basicLimitOrder, quantity: 1000 };
        const basicLimitOrderBuySomething = {
            ...basicLimitOrder,
            account: "account-2" as IAccountId,
            id: "limit-order-2" as ILimitOrderId,
            quantity: 20,
            timestamp: "2020-12-20",
        };

        const exchangeTransactionBuyEverything = convertLimitOrderToExchangeTransaction(
            basicLimitOrderBuyEverything,
            latestStockPrice,
        );
        const exchangeTransactionBuySomething = convertLimitOrderToExchangeTransaction(
            basicLimitOrderBuySomething,
            latestStockPrice,
        );

        const updatedKeyedAccounts: { [accountId: string]: IAccount } = {
            "account-1": {
                id: "account-1" as IAccountId,
                hashedPassword: "",
                email: "",
                name: "",
                username: "",
                cashOnHand: 10000,
                portfolioName: "",
            },
            "account-2": {
                id: "account-1" as IAccountId,
                hashedPassword: "",
                email: "",
                name: "",
                username: "",
                cashOnHand: 1000,
                portfolioName: "",
            },
        };

        const promises = getExecuteLimitOrderPromises(
            [basicLimitOrderBuyEverything, basicLimitOrderBuySomething],
            [exchangeTransactionBuyEverything, exchangeTransactionBuySomething],
            latestStockPrice,
            updatedKeyedAccounts,
            keyedOwnedStock,
            keyedStocks,
        );

        const newCashOnHand = (await promises[0]).parameters;
        expect(newCashOnHand).toEqual(["account-1", 0]);

        const transactionHistoryChange = (await promises[1]).parameters;
        expect(transactionHistoryChange).toEqual(["account-1", "stock-1", "price-history-1", 1000, "limit-order-1"]);

        const insertIntoOwnedStock = (await promises[2]).parameters;
        expect(insertIntoOwnedStock).toEqual(["account-1", 1000, "stock-1"]);

        const limitOrder = (await promises[3]).query;
        expect(limitOrder).toEqual("UPDATE \"limitOrder\" SET status = 'EXECUTED' WHERE id = $1");

        const limitOrder2 = (await promises[4]).query;
        expect(limitOrder2).toEqual("UPDATE \"limitOrder\" SET status = 'CANCELLED' WHERE id = $1");

        expect(promises.length).toEqual(5);
    });
});
