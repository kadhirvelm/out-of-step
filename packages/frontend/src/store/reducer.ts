import { combineReducers } from "redoodle";
import { IStoreState } from "./state";
import { accountReducer } from "./account/reducer";

export const reducer = combineReducers<IStoreState>({
    account: accountReducer,
});
