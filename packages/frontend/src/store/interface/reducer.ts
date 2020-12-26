import { IStockWithDollarValue } from "@stochastic-exchange/api";
import { setWith, TypedReducer } from "redoodle";
import { SetViewStockDetails, SetViewStockWithLatestPrice, SetViewTransactionsForStock } from "./actions";

export interface IInterfaceState {
    viewStockWithLatestPrice: IStockWithDollarValue | undefined;
    viewTransactionsForStock: IStockWithDollarValue | undefined;
    viewStockDetails: IStockWithDollarValue | undefined;
}

export const EMPTY_INTERFACE_STATE: IInterfaceState = {
    viewStockWithLatestPrice: {
        dollarValue: 40.43,
        id: "30e0cc31-5a93-4a03-ac30-fba9003e91e2" as any,
        name: "Agri Cola Inc",
        previousPriceHistory: {
            dollarValue: 43.13,
            timestamp: "2020-12-25T04:55:33.000Z",
        },
        priceHistoryId: "97d6d6c4-74c5-4551-82c1-ac43ff0e836d" as any,
        status: "AVAILABLE",
        timestamp: "2020-12-26T20:49:57.000Z",
        totalQuantity: 500000,
    },
    viewTransactionsForStock: undefined,
    viewStockDetails: undefined,
};

export const interfaceReducer = TypedReducer.builder<IInterfaceState>()
    .withHandler(SetViewStockWithLatestPrice.TYPE, (state, viewStockWithLatestPrice) =>
        setWith(state, { viewStockWithLatestPrice }),
    )
    .withHandler(SetViewTransactionsForStock.TYPE, (state, viewTransactionsForStock) =>
        setWith(state, { viewTransactionsForStock }),
    )
    .withHandler(SetViewStockDetails.TYPE, (state, viewStockDetails) => setWith(state, { viewStockDetails }))
    .build();
