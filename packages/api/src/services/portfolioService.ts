import { implementEndpoints, IService } from "../common/generics";
import { IPortfolio, IPortfolioId } from "../types/dataTypes";

export interface IPortfolioService extends IService {
    getPortfolio: {
        payload: IPortfolioId;
        response: IPortfolio;
    };
    updatePortfolioMetadata: {
        payload: Pick<IPortfolio, "name">;
        response: { message: string };
    };
}

const { backend, frontend } = implementEndpoints<IPortfolioService>({
    getPortfolio: {
        method: "get",
        slug: "/portfolio/:id",
    },
    updatePortfolioMetadata: {
        method: "put",
        slug: "/portfolio/update-metadata",
    },
});

export const PortfolioServiceBackend = backend;
export const PortfolioServiceFrontend = frontend;
