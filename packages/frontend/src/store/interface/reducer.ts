import { IStockWithDollarValue } from "@stochastic-exchange/api";
import { setWith, TypedReducer } from "redoodle";
import { SetViewStockWithLatestPrice, SetViewTransactionsForStock } from "./actions";

export interface IInterfaceState {
    viewStockWithLatestPrice: IStockWithDollarValue | undefined;
    viewTransactionsForStock: IStockWithDollarValue | undefined;
}

export const EMPTY_INTERFACE_STATE: IInterfaceState = {
    viewStockWithLatestPrice: undefined,
    viewTransactionsForStock: {
        dollarValue: 1124.12,
        id: "95579a0a-d1aa-479a-9894-f3cfb50f0819",
        name: "Bubba Boys",
        priceHistoryId: "2dd53cfc-9458-4581-b10a-a25420ce7b95",
        status: "AVAILABLE",
        timestamp: "2020-12-06T01:11:33.000Z",
        totalQuantity: 10000000,
    } as any,
};

export const interfaceReducer = TypedReducer.builder<IInterfaceState>()
    .withHandler(SetViewStockWithLatestPrice.TYPE, (state, viewStockWithLatestPrice) =>
        setWith(state, { viewStockWithLatestPrice }),
    )
    .withHandler(SetViewTransactionsForStock.TYPE, (state, viewTransactionsForStock) =>
        setWith(state, { viewTransactionsForStock }),
    )
    .build();
