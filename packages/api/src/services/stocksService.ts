import { implementEndpoints, IService } from "../common/generics";
import { IPriceHistory, IPriceHistoryId, IStock, IStockId } from "../types/dataTypes";

export type ITimeBucket = "day" | "week" | "4 weeks" | "all";

export type IStockWithDollarValue = IStock &
    Pick<IPriceHistory, "dollarValue" | "timestamp"> & { priceHistoryId: IPriceHistoryId };

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
            priceHistory: IPriceHistory[];
            ownedStockQuantity: number;
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
