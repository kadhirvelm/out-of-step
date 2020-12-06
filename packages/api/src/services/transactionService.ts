import { implementEndpoints, IService } from "../common/generics";
import { IPriceHistoryId, IStockId } from "../types/dataTypes";

export interface ITransactionService extends IService {
    createExchangeTransaction: {
        payload: { price: IPriceHistoryId; purchasedQuantity: number; soldQuantity: number; stock: IStockId };
        response: { message: string };
    };
}

const { backend, frontend } = implementEndpoints<ITransactionService>({
    createExchangeTransaction: {
        method: "post",
        slug: "/transaction/create",
    },
});

export const TransactionBackendService = backend;
export const TransactionFrontendService = frontend;
