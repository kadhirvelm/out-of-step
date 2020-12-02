type Id<T extends string> = string & { __id: T };

export type IStockId = Id<"stock">;
export type IPricePointId = Id<"price-point">;
export type IDividendPayoutId = Id<"dividend-payout">;
export type IHistoricalPricePointsId = Id<"historical-price-points">;
export type IVolumeId = Id<"volume">;
export type IOwnedVolumeId = Id<"owned-volume">;
export type IAccountId = Id<"account">;
export type IPortfolioId = Id<"portfolio">;
export type ITransactionId = Id<"transaction">;
export type ILimitOrderId = Id<"limit-order">;

export interface IStock {
    id: IStockId;
    historicalPricePoints: IHistoricalPricePointsId;
    latestPricePoint: IPricePointId;
    metadata: {
        name: string;
        status: "available" | "acquired";
    };
    volume: IVolumeId;
}

export interface IHistoricalPricePoints {
    id: IHistoricalPricePointsId;
    pricePoints: {
        [bucket: string]: Array<IPricePointId | IDividendPayoutId>;
    };
}

export interface IPricePoint {
    id: IPricePointId;
    dollarValue: number;
    timestamp: Date;
}

export interface IDividendPayout {
    id: IDividendPayoutId;
    payoutPerShare: number;
    timestamp: Date;
}

export interface IVolume {
    id: IVolumeId;
    ownedVolumes: IOwnedVolumeId[];
    totalVolumeAvailable: number;
}

export interface IOwnedVolume {
    id: IOwnedVolumeId;
    portfolioId: IPortfolioId;
    quantity: number;
    stockId: IStockId;
}

export interface IAccount {
    id: IAccountId;
    hashedPassword: string;
    metadata: {
        name: string;
    };
    portfolio: IPortfolioId;
}

export interface IPortfolio {
    id: IPortfolioId;
    cashOnHand: number;
    limitOrders: ILimitOrderId[];
    stocks: { [stockId: string]: IOwnedVolumeId };
    transactions: { [stockId: string]: ITransactionId[] };
}

interface IBaseTransaction {
    id: ITransactionId;
    stockId: IStockId;
    timestamp: Date;
    type: string;
}

export interface IExchangeTransaction extends IBaseTransaction {
    pricePoint: IPricePointId;
    purchasedQuantity: number;
    soldQuantity: number;
    type: "exchange-transaction";
}

export interface IDividendTransaction extends IBaseTransaction {
    dividendPayout: IDividendPayoutId;
    quantity: number;
    type: "dividend-transaction";
}

export interface IAcquisitionTransaction extends IBaseTransaction {
    pricePoint: IPricePointId;
    quantity: number;
    type: "acquisition-transaction";
}

export interface ILimitOrder {
    id: ILimitOrderId;
    portfolioId: IPortfolioId;
    quantity: number;
    stockId: IStockId;
    value: number;
}
