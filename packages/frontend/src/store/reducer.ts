import { combineReducers } from "redoodle";
import { IStoreState } from "./state";
import { accountReducer } from "./account/reducer";
import { interfaceReducer } from "./interface/reducer";
import { stocksReducer } from "./stocks/reducer";

export const reducer = combineReducers<IStoreState>({
    account: accountReducer,
    interface: interfaceReducer,
    stocks: stocksReducer,
});
