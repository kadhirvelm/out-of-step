import { setWith, TypedReducer } from "redoodle";
import { SetOwnedStockQuantity } from "./actions";

export interface IStocksState {
    ownedStockQuantity: { [stockId: string]: number };
}

export const EMPTY_STOCKS_STATE: IStocksState = {
    ownedStockQuantity: {},
};

export const stocksReducer = TypedReducer.builder<IStocksState>()
    .withHandler(SetOwnedStockQuantity.TYPE, (state, ownedStockQuantity) =>
        setWith(state, {
            ownedStockQuantity: { ...state.ownedStockQuantity, ...ownedStockQuantity },
        }),
    )
    .build();
