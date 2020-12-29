import { IStockWithDollarValue } from "@stochastic-exchange/api";
import { defineAction } from "redoodle";

export const SetViewLimitOrdersForStock = defineAction("SetViewLimitOrdersForStock")<
    IStockWithDollarValue | undefined
>();

export const SetViewStockWithLatestPrice = defineAction("SetViewStockWithLatestPrice")<
    IStockWithDollarValue | undefined
>();

export const SetViewTransactionsForStock = defineAction("SetViewTransactionsForStock")<
    IStockWithDollarValue | undefined
>();

export const SetViewStockDetails = defineAction("SetViewStockDetails")<IStockWithDollarValue | undefined>();
