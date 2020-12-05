import { IAccountState, EMPTY_ACCOUNT_STATE } from "./account/reducer";
import { EMPTY_INTERFACE_STATE, IInterfaceState } from "./interface/reducer";

export interface IStoreState {
    account: IAccountState;
    interface: IInterfaceState;
}

export const EMPTY_STATE: IStoreState = {
    account: EMPTY_ACCOUNT_STATE,
    interface: EMPTY_INTERFACE_STATE,
};
