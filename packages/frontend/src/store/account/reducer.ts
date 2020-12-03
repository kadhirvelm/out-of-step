import { setWith, TypedReducer } from "redoodle";
import { getTokenInCookie, setTokenInCookie } from "../../utils/tokenInCookies";
import { SetToken } from "./actions";

export interface IAccountState {
    token: string | undefined;
}

export const EMPTY_ACCOUNT_STATE: IAccountState = {
    token: getTokenInCookie(),
};

export const accountReducer = TypedReducer.builder<IAccountState>()
    .withHandler(SetToken.TYPE, (state, { token }) => {
        if (token == null) {
            setTokenInCookie(undefined);
        }

        return setWith(state, { token });
    })
    .build();
