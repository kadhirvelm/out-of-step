import { IStockWithDollarValue } from "@stochastic-exchange/api";
import { setWith, TypedReducer } from "redoodle";
import { SetViewStockWithLatestPrice, SetViewTransactionsForStock } from "./actions";

export interface IInterfaceState {
    viewStockWithLatestPrice: IStockWithDollarValue | undefined;
    viewTransactionsForStock: IStockWithDollarValue | undefined;
}

export const EMPTY_INTERFACE_STATE: IInterfaceState = {
    viewStockWithLatestPrice: undefined,
    viewTransactionsForStock: undefined,
};

export const interfaceReducer = TypedReducer.builder<IInterfaceState>()
    .withHandler(SetViewStockWithLatestPrice.TYPE, (state, viewStockWithLatestPrice) =>
        setWith(state, { viewStockWithLatestPrice }),
    )
    .withHandler(SetViewTransactionsForStock.TYPE, (state, viewTransactionsForStock) =>
        setWith(state, { viewTransactionsForStock }),
    )
    .build();
