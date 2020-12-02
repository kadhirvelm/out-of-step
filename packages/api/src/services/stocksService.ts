import { implementEndpoints, IService } from "../common/generics";
import { IStock } from "../types/dataTypes";

interface IStocksService extends IService {
    getAllStocks: {
        payload: {};
        response: IStock[];
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
