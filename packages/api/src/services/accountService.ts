import { implementEndpoints, IService } from "../common/generics";
import { IAccount } from "../types/dataTypes";

export interface IAccountService extends IService {
    createAccount: {
        payload: { hashedPassword: string; email: string; name: string; username: string; portfolioName: string };
        response: string;
    };
    getAccount: {
        payload: undefined;
        response: Omit<IAccount, "hashedPassword">;
    };
    loginToAccount: {
        payload: { hashedPassword: string; username: string };
        response: string;
    };
    resetAccountPassword: {
        payload: { username: string; email: string };
        response: string;
    };
    updateAccount: {
        payload: { updatedAccount: Partial<Omit<IAccount, "id" | "portfolio">> };
        response: { message: string };
    };
}

const { backend, frontend } = implementEndpoints<IAccountService>({
    createAccount: {
        method: "post",
        slug: "/account/create",
        isPublic: true,
    },
    getAccount: {
        method: "get",
        slug: "/account/get",
    },
    loginToAccount: {
        method: "post",
        slug: "/account/login",
        isPublic: true,
    },
    resetAccountPassword: {
        method: "post",
        slug: "/account/reset-password",
        isPublic: true,
    },
    updateAccount: {
        method: "put",
        slug: "/account/update",
    },
});

export const AccountServiceBackend = backend;
export const AccountServiceFrontend = frontend;
