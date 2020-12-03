/* eslint-disable @typescript-eslint/require-await */

import {
    AccountServiceBackend,
    IHistoricalPricePointsId,
    IPricePointId,
    IStockId,
    IVolumeId,
    StocksBackendService,
} from "@stochastic-exchange/api";
import Express from "express";
import { createAccount } from "../accountService/createAccount";
import { loginToAccount } from "../accountService/loginToAccount";
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
                    historicalPricePoints: "test-historical-price-points" as IHistoricalPricePointsId,
                    latestPricePoint: "latest-price-point" as IPricePointId,
                    name: "Sample stock 1",
                    status: "available",
                    volume: "volume-id" as IVolumeId,
                },
            ];
        },
    });

    AccountServiceBackend(app, checkIfValidWebToken, {
        createAccount,
        loginToAccount,
    });
}
