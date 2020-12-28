import { implementEndpoints, IService } from "../common/generics";
import {
    IAcquisitionTransaction,
    IDividendHistory,
    IDividendTransaction,
    IExchangeTransaction,
    ILimitOrder,
    ILimitOrderId,
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
    createLimitOrder: {
        payload: { quantity: number; stock: IStockId; buyAtPrice: number | undefined; sellAtPrice: number | undefined };
        response: { message: string; newLimitOrder: ILimitOrder };
    };
    deleteLimitOrder: {
        payload: { id: ILimitOrderId };
        response: { message: string };
    };
    viewLimitOrdersForStock: {
        payload: { stockId: IStockId };
        response: { limitOrders: ILimitOrder[] };
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
    createLimitOrder: {
        method: "post",
        slug: "/transaction/limit-order/create",
    },
    deleteLimitOrder: {
        method: "delete",
        slug: "/transaction/limit-order/delete",
    },
    viewLimitOrdersForStock: {
        method: "post",
        slug: "/transactions/limit-order/get",
    },
    viewTransactionsForStock: {
        method: "post",
        slug: "/transaction/get",
    },
});

export const TransactionBackendService = backend;
export const TransactionFrontendService = frontend;
