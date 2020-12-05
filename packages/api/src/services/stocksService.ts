import { implementEndpoints, IService } from "../common/generics";
import { IPriceHistory, IStock, IStockId } from "../types/dataTypes";

export type ITimeBucket = "day" | "week" | "4 weeks" | "all";

export interface IStocksService extends IService {
    getAllStocks: {
        payload: undefined;
        response: {
            priceHistory: IPriceHistory[];
            stocks: IStock[];
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
