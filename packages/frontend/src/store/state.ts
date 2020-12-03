import { IAccountState, EMPTY_ACCOUNT_STATE } from "./account/reducer";

export interface IStoreState {
    account: IAccountState;
}

export const EMPTY_STATE: IStoreState = {
    account: EMPTY_ACCOUNT_STATE,
};
