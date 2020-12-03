import { setWith, TypedReducer } from "redoodle";
import { getTokenInCookie } from "../../utils/tokenInCookies";
import { SetToken } from "./actions";

export interface IAccountState {
    token: string | undefined;
}

export const EMPTY_ACCOUNT_STATE: IAccountState = {
    token: getTokenInCookie(),
};

export const accountReducer = TypedReducer.builder<IAccountState>()
    .withHandler(SetToken.TYPE, (state, { token }) => setWith(state, { token }))
    .build();
