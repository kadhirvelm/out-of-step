type Id<T extends string> = string & { __id: T };

export type IStockId = Id<"stock">;
export type IPriceHistoryId = Id<"price-history">;
export type IDividendHistoryId = Id<"dividend-history">;
export type IOwnedStockId = Id<"owned-stock">;
export type IAccountId = Id<"account">;
export type ITransactionHistoryId = Id<"transaction-history">;
export type ILimitOrderId = Id<"limit-order">;

export interface IAccount {
    id: IAccountId;
    hashedPassword: string;
    email: string;
    name: string;
    username: string;
    cashOnHand: number;
    portfolioName: string;
}

export interface IDividendHistory {
    id: IDividendHistoryId;
    payoutPerShare: number;
    timestamp: string;
    stock: IStockId;
    calculationNotes?: string;
}

interface IBaseLimitOrder {
    id: ILimitOrderId;
    direction: "higher" | "lower";
    account: IAccountId;
    quantity: number;
    status: "PENDING" | "EXECUTED" | "CANCELLED";
    stock: IStockId;
    timestamp: string;
    type: string;
}

export interface IBuyLimitOrder extends IBaseLimitOrder {
    buyAtPrice: number;
    type: "buy-limit";
}

export interface ISellLimitOrder extends IBaseLimitOrder {
    sellAtPrice: number;
    type: "sell-limit";
}

export type ILimitOrder = IBuyLimitOrder | ISellLimitOrder;

export interface IOwnedStock {
    id: IOwnedStockId;
    account: IAccountId;
    quantity: number;
    stock: IStockId;
}

export interface IPriceHistory {
    id: IPriceHistoryId;
    dollarValue: number;
    timestamp: string;
    stock: IStockId;
    calculationNotes?: string;
}

export interface IStock {
    id: IStockId;
    name: string;
    status: "AVAILABLE" | "ACQUIRED";
    totalQuantity: number;
}

interface IBaseTransaction {
    id: ITransactionHistoryId;
    timestamp: string;
    type: string;
    account: IAccountId;
    stock: IStockId;
}

export interface IExchangeTransaction extends IBaseTransaction {
    limitOrder?: ILimitOrderId;
    priceHistory: IPriceHistoryId;
    purchasedQuantity: number;
    soldQuantity: number;
    type: "exchange-transaction";
}

export interface IDividendTransaction extends IBaseTransaction {
    dividendHistory: IDividendHistoryId;
    quantity: number;
    type: "dividend-transaction";
}

export interface IAcquisitionTransaction extends IBaseTransaction {
    acquiredQuantity: number;
    priceHistory: IPriceHistoryId;
    type: "acquisition-transaction";
}

export type ITransactionHistory = IExchangeTransaction | IDividendTransaction | IAcquisitionTransaction;
