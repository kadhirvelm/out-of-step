import { IStockWithDollarValue } from "@stochastic-exchange/api";
import { defineAction } from "redoodle";

export const SetViewStockWithLatestPrice = defineAction("set-view-stock-with-latest-price")<
    IStockWithDollarValue | undefined
>();

export const SetViewTransactionsForStock = defineAction("SetViewTransactionsForStock")<
    IStockWithDollarValue | undefined
>();

export const SetViewStockDetails = defineAction("SetViewStockDetails")<IStockWithDollarValue | undefined>();
