import { IAccountState, EMPTY_ACCOUNT_STATE } from "./account/reducer";
import { EMPTY_INTERFACE_STATE, IInterfaceState } from "./interface/reducer";
import { EMPTY_STOCKS_STATE, IStocksState } from "./stocks/reducer";

export interface IStoreState {
    account: IAccountState;
    interface: IInterfaceState;
    stocks: IStocksState;
}

export const EMPTY_STATE: IStoreState = {
    account: EMPTY_ACCOUNT_STATE,
    interface: EMPTY_INTERFACE_STATE,
    stocks: EMPTY_STOCKS_STATE,
};
