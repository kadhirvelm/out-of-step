import { implementEndpoints, IService } from "../common/generics";
import { IPriceHistory, IPriceHistoryId, IStock, IStockId } from "../types/dataTypes";

export type ITimeBucket = "day" | "5 days" | "month" | "all";

export type IStockWithDollarValue = IStock &
    Pick<IPriceHistory, "dollarValue" | "timestamp"> & {
        priceHistoryId: IPriceHistoryId;
        previousPriceHistory?: Pick<IPriceHistory, "dollarValue" | "timestamp">;
    };

export interface IPriceHistoryInBuckets {
    timestamp: string;
    dollarValue: number;
}

export interface IStocksService extends IService {
    getAllStocks: {
        payload: undefined;
        response: {
            stocks: IStockWithDollarValue[];
        };
    };
    getSingleStockInformation: {
        payload: {
            bucket: ITimeBucket;
            stock: IStockId;
        };
        response: {
            high: number;
            low: number;
            ownedStockQuantity: number;
            priceHistory: IPriceHistoryInBuckets[];
        };
    };
}

const { backend, frontend } = implementEndpoints<IStocksService>({
    getAllStocks: {
        method: "get",
        slug: "/stocks/getAll",
    },
    getSingleStockInformation: {
        method: "post",
        slug: "/stocks/get",
    },
});

export const StocksBackendService = backend;
export const StocksFrontendService = frontend;
