import { implementEndpoints, IService } from "../common/generics";
import { IPortfolioId } from "../types/dataTypes";

export interface IPortfolioService extends IService {
    getPortfolio: {
        payload: IPortfolioId;
        response: string;
    };
}

const { backend, frontend } = implementEndpoints<IPortfolioService>({
    getPortfolio: {
        method: "get",
        slug: "/portfolio/:id",
    },
});

export const PortfolioServiceBackend = backend;
export const PortfolioServiceFrontend = frontend;
