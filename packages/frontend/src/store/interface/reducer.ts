import { IStockWithDollarValue } from "@stochastic-exchange/api";
import { setWith, TypedReducer } from "redoodle";
import {
    SetViewLimitOrdersForStock,
    SetViewStockDetails,
    SetViewStockWithLatestPrice,
    SetViewTransactionsForStock,
} from "./actions";

export interface IInterfaceState {
    viewLimitOrdersForStock: IStockWithDollarValue | undefined;
    viewStockWithLatestPrice: IStockWithDollarValue | undefined;
    viewTransactionsForStock: IStockWithDollarValue | undefined;
    viewStockDetails: IStockWithDollarValue | undefined;
}

export const EMPTY_INTERFACE_STATE: IInterfaceState = {
    viewLimitOrdersForStock: {
        dollarValue: 35.89,
        id: "30e0cc31-5a93-4a03-ac30-fba9003e91e2" as any,
        name: "Agri Cola Inc",
        previousPriceHistory: {
            dollarValue: 38.93,
            timestamp: "2020-12-27T23:20:14.000Z",
        },
        priceHistoryId: "420b3285-7061-4350-a782-7c22a39d61e9" as any,
        status: "AVAILABLE",
        timestamp: "2020-12-28T22:51:59.000Z",
        totalQuantity: 500000,
    },
    viewStockWithLatestPrice: undefined,
    viewTransactionsForStock: undefined,
    viewStockDetails: undefined,
};

export const interfaceReducer = TypedReducer.builder<IInterfaceState>()
    .withHandler(SetViewLimitOrdersForStock.TYPE, (state, viewLimitOrdersForStock) =>
        setWith(state, { viewLimitOrdersForStock }),
    )
    .withHandler(SetViewStockWithLatestPrice.TYPE, (state, viewStockWithLatestPrice) =>
        setWith(state, { viewStockWithLatestPrice }),
    )
    .withHandler(SetViewTransactionsForStock.TYPE, (state, viewTransactionsForStock) =>
        setWith(state, { viewTransactionsForStock }),
    )
    .withHandler(SetViewStockDetails.TYPE, (state, viewStockDetails) => setWith(state, { viewStockDetails }))
    .build();
