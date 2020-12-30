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
    viewLimitOrdersForStock: undefined,
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
