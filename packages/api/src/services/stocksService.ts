import { implementEndpoints, IService } from "../common/generics";
import { IPriceHistory, IStock } from "../types/dataTypes";

export interface IStocksService extends IService {
    getAllStocks: {
        payload: undefined;
        response: { stocks: IStock[]; priceHistory: IPriceHistory[] };
    };
}

const { backend, frontend } = implementEndpoints<IStocksService>({
    getAllStocks: {
        method: "get",
        slug: "/stocks/getAll",
    },
});

export const StocksBackendService = backend;
export const StocksFrontendService = frontend;
