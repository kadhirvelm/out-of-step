import { implementEndpoints, IService } from "../common/generics";
import {
    IAcquisitionTransaction,
    IDividendHistory,
    IDividendTransaction,
    IExchangeTransaction,
    ILimitOrder,
    IPriceHistory,
    IPriceHistoryId,
    IStockId,
} from "../types/dataTypes";

export interface IExchangeTransactionWithPrice extends Omit<IExchangeTransaction, "priceHistory" | "limitOrder"> {
    limitOrder?: ILimitOrder;
    priceHistory: IPriceHistory;
}

export interface IDividendTransactionWithDividend extends Omit<IDividendTransaction, "dividendHistory"> {
    dividendHistory: IDividendHistory;
}

export interface IAcquisitionTransactionWithPrice extends Omit<IAcquisitionTransaction, "priceHistory"> {
    priceHistory: IPriceHistory;
}

export type ITransactionHistoryComplete =
    | IExchangeTransactionWithPrice
    | IDividendTransactionWithDividend
    | IAcquisitionTransactionWithPrice;

export interface IStockValueAtTransactionTime {
    stockValueAtTransactionTime: number;
}

export interface ITransactionService extends IService {
    createExchangeTransaction: {
        payload: { price: IPriceHistoryId; purchasedQuantity: number; soldQuantity: number; stock: IStockId };
        response: { message: string };
    };
    viewTransactionsForStock: {
        payload: { stockId: IStockId };
        response: Array<ITransactionHistoryComplete & IStockValueAtTransactionTime>;
    };
}

const { backend, frontend } = implementEndpoints<ITransactionService>({
    createExchangeTransaction: {
        method: "post",
        slug: "/transaction/create",
    },
    viewTransactionsForStock: {
        method: "post",
        slug: "/transaction/get",
    },
});

export const TransactionBackendService = backend;
export const TransactionFrontendService = frontend;
