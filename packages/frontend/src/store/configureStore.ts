import { createStore, loggingMiddleware, reduceCompoundActions } from "redoodle";
import { AnyAction, applyMiddleware, Store } from "redux";
import { reducer } from "./reducer";
import { EMPTY_STATE, IStoreState } from "./state";

export function configureStore(): Store<IStoreState, AnyAction> {
    const logging = applyMiddleware(loggingMiddleware({ prettyPrintSingleActions: true })) as any;
    const initialState: IStoreState = EMPTY_STATE;

    return createStore<IStoreState>(reduceCompoundActions(reducer), initialState, logging) as Store<
        IStoreState,
        AnyAction
    >;
}
