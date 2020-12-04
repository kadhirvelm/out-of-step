type Id<T extends string> = string & { __id: T };

export type IStockId = Id<"stock">;
export type IPriceHistoryId = Id<"price-point">;
export type IDividendHistoryId = Id<"dividend-payout">;
export type IVolumeId = Id<"volume">;
export type IOwnedVolumeId = Id<"owned-volume">;
export type IAccountId = Id<"account">;
export type IPortfolioId = Id<"portfolio">;
export type ITransactionHistoryId = Id<"transaction-history">;
export type ILimitOrderId = Id<"limit-order">;

export interface IAccount {
    id: IAccountId;
    hashedPassword: string;
    email: string;
    name: string;
    portfolio: IPortfolioId;
    username: string;
}

export interface IDividendHistory {
    id: IDividendHistoryId;
    payoutPerShare: number;
    timestamp: Date;
    stock: IStockId;
}

export interface ILimitOrder {
    id: ILimitOrderId;
    portfolio: IPortfolioId;
    quantity: number;
    stock: IStockId;
    sellAtPrice: number;
    timestamp: Date;
    transactionHistory?: ITransactionHistoryId;
}

export interface IOwnedVolume {
    id: IOwnedVolumeId;
    portfolio: IPortfolioId;
    quantity: number;
    stock: IStockId;
}

export interface IPortfolio {
    id: IPortfolioId;
    cashOnHand: number;
    name: string;
    limitOrders: ILimitOrderId[];
    ownedVolumes: { [stockId: string]: IOwnedVolumeId };
    transactionHistory: { [stockId: string]: ITransactionHistoryId[] };
}

export interface IPriceHistory {
    id: IPriceHistoryId;
    dollarValue: number;
    timestamp: Date;
    stock: IStockId;
}

export interface IStock {
    id: IStockId;
    name: string;
    status: "available" | "acquired";
    volume: IVolumeId;
}

interface IBaseTransaction {
    id: ITransactionHistoryId;
    timestamp: Date;
    portfolio: IPortfolioId;
    type: string;
}

export interface IExchangeTransaction extends IBaseTransaction {
    limitOrder?: ILimitOrderId;
    price: IPriceHistoryId;
    purchasedQuantity: number;
    soldQuantity: number;
    type: "exchange-transaction";
}

export interface IDividendTransaction extends IBaseTransaction {
    dividend: IDividendHistoryId;
    quantity: number;
    type: "dividend-transaction";
}

export interface IAcquisitionTransaction extends IBaseTransaction {
    acquiredQuantity: number;
    price: IPriceHistoryId;
    type: "acquisition-transaction";
}

export interface IVolume {
    id: IVolumeId;
    ownedVolumes: IOwnedVolumeId[];
    totalQuantity: number;
}
