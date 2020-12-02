import { implementEndpoints, IService } from "../common/generics";
import { IAccount, IPortfolio, IPortfolioId } from "../types/dataTypes";

interface IAccountService extends IService {
    getAccount: {
        payload: {};
        response: IAccount;
    };
    getPortfolio: {
        payload: IPortfolioId;
        response: IPortfolio;
    };
    loginToAccount: {
        payload: { hashedPassword: string; username: string };
        response: string;
    };
}

const { backend, frontend } = implementEndpoints<IAccountService>({
    getAccount: {
        method: "get",
        slug: "/account/get",
    },
    getPortfolio: {
        method: "get",
        slug: "/portfolio/get",
    },
    loginToAccount: {
        method: "post",
        slug: "/login",
    },
});

export const AccountServiceBackend = backend;
export const AccountServiceFrontend = frontend;
