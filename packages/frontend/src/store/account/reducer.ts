import { IAccount, IOwnedStock } from "@stochastic-exchange/api";
import { setWith, TypedReducer } from "redoodle";
import { getTokenInCookie, setTokenInCookie } from "../../utils/tokenInCookies";
import { SetToken, SetUserAccountAndOwnedStocks, UpdatedUserAccount } from "./actions";

export interface IAccountState {
    token: string | undefined;
    userAccount: Omit<IAccount, "hashedPassword"> | undefined;
    ownedStocks: IOwnedStock[] | undefined;
}

export const EMPTY_ACCOUNT_STATE: IAccountState = {
    token: getTokenInCookie(),
    userAccount: undefined,
    ownedStocks: undefined,
};

export const accountReducer = TypedReducer.builder<IAccountState>()
    .withHandler(SetToken.TYPE, (state, { token }) => {
        if (token == null) {
            setTokenInCookie(undefined);
        }

        return setWith(state, { token });
    })
    .withHandler(SetUserAccountAndOwnedStocks.TYPE, (state, { account, ownedStocks }) =>
        setWith(state, { userAccount: account, ownedStocks }),
    )
    .withHandler(UpdatedUserAccount.TYPE, (state, account) => {
        if (state.userAccount === undefined) {
            return state;
        }

        return setWith(state, { userAccount: { ...state.userAccount, ...account } });
    })
    .build();
