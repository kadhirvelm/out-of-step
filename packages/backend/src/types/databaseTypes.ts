/* eslint-disable @typescript-eslint/camelcase */
import {
    IAccount,
    IAcquisitionTransaction,
    IDividendHistory,
    IDividendTransaction,
    IExchangeTransaction,
    ILimitOrder,
    ILimitOrderId,
    IOwnedVolume,
    IOwnedVolumeId,
    IPortfolio,
    IPortfolioId,
    IPriceHistory,
    IStock,
    ITransactionHistoryId,
    IVolume,
    IVolumeId,
} from "@stochastic-exchange/api";

export namespace Database {
    export type Account = IAccount;

    export type DividendHistory = IDividendHistory;

    export type LimitOrder = ILimitOrder;

    export type OwnedVolume = IOwnedVolume;

    export type Portfolio = Omit<IPortfolio, "limitOrders" | "ownedVolumes" | "transactions">;

    export interface Portfolio_LimitOrder {
        portfolio: IPortfolioId;
        limitOrder: ILimitOrderId;
    }

    export interface Portfolio_OwnedVolume {
        portfolio: IPortfolioId;
        ownedVolume: IOwnedVolumeId;
    }

    export interface Portfolio_TransactionHistory {
        portfolio: IPortfolioId;
        transactionHistory: ITransactionHistoryId;
    }

    export type PriceHistory = IPriceHistory;

    export type Stock = IStock;

    export type TransactionHistory = IExchangeTransaction | IDividendTransaction | IAcquisitionTransaction;

    export type Volume = Omit<IVolume, "ownedVolumes">;

    export interface Volume_OwnedVolume {
        volume: IVolumeId;
        ownedVolume: IOwnedVolumeId;
    }
}
