import { AccountServiceBackend, StocksBackendService, TransactionBackendService } from "@stochastic-exchange/api";
import Express from "express";
import { createAccount } from "../accountService/createAccount";
import { forgotPassword } from "../accountService/forgotPassword";
import { getAccount } from "../accountService/getAccount";
import { loginToAccount } from "../accountService/loginToAccount";
import { updateAccount } from "../accountService/updateAccount";
import { getAllStocks } from "../stockService/getAllStocks";
import { checkIfValidWebToken } from "../utils/handleWebToken";
import { getSingleStockInformation } from "../stockService/getSingleStockInformation";
import { getCurrentStandings } from "../accountService/getCurrentStandings";
import { createExchangeTransaction } from "../transactionService/createExchangeTransaction";
import { viewTransactionsForStock } from "../transactionService/viewTransactionsForStock";

export function configureAllRoutes(app: Express.Express) {
    app.get("/", (_, response) => {
        response.status(200).send({ version: process.env.npm_package_version });
    });

    AccountServiceBackend(app, checkIfValidWebToken, {
        createAccount,
        getAccount,
        loginToAccount,
        forgotPassword,
        getCurrentStandings,
        updateAccount,
    });

    StocksBackendService(app, checkIfValidWebToken, {
        getAllStocks,
        getSingleStockInformation,
    });

    TransactionBackendService(app, checkIfValidWebToken, {
        createExchangeTransaction,
        viewTransactionsForStock,
    });
}
