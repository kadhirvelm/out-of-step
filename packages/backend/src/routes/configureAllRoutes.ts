/* eslint-disable @typescript-eslint/require-await */

import { AccountServiceBackend, IStockId, StocksBackendService } from "@stochastic-exchange/api";
import Express from "express";
import { createAccount } from "../accountService/createAccount";
import { forgotPassword } from "../accountService/forgotPassword";
import { getAccount } from "../accountService/getAccount";
import { loginToAccount } from "../accountService/loginToAccount";
import { updateAccount } from "../accountService/updateAccount";
import { checkIfValidWebToken } from "../utils/handleWebToken";

export function configureAllRoutes(app: Express.Express) {
    app.get("/", (_, response) => {
        response.status(200).send({ version: process.env.npm_package_version });
    });

    StocksBackendService(app, checkIfValidWebToken, {
        getAllStocks: async () => {
            return [
                {
                    id: "test-stock-1" as IStockId,
                    name: "Sample stock 1",
                    status: "available",
                    totalQuantity: 0,
                },
            ];
        },
    });

    AccountServiceBackend(app, checkIfValidWebToken, {
        createAccount,
        getAccount,
        loginToAccount,
        forgotPassword,
        updateAccount,
    });
}
