import { IAccount, IOwnedStock, IOwnedStockId } from "@stochastic-exchange/api";
import { setWith, TypedReducer } from "redoodle";
import { getTokenInCookie, setTokenInCookie } from "../../utils/tokenInCookies";
import { SetToken, SetUserAccountAndOwnedStocks, UpdatedUserAccount, UpdateUserAccountOnTransaction } from "./actions";

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
    .withHandler(UpdateUserAccountOnTransaction.TYPE, (state, { stockId, purchaseQuantity, soldQuantity, price }) => {
        if (state.userAccount === undefined) {
            return state;
        }

        const cashOnHand = (state.userAccount?.cashOnHand ?? 0) - purchaseQuantity * price + soldQuantity * price;
        const existingOwnedStock = state.ownedStocks?.find(s => s.stock === stockId);

        if (existingOwnedStock === undefined) {
            return setWith(state, {
                userAccount: { ...state.userAccount, cashOnHand },
                ownedStocks: (state.ownedStocks ?? []).concat({
                    id: `temporary-owned-stock-id-${stockId}` as IOwnedStockId,
                    account: state.userAccount.id,
                    quantity: purchaseQuantity,
                    stock: stockId,
                }),
            });
        }

        const newOwnedStock = (state.ownedStocks?.filter(s => s.stock !== stockId) ?? []).concat({
            ...existingOwnedStock,
            quantity: existingOwnedStock.quantity + purchaseQuantity - soldQuantity,
        });

        return setWith(state, {
            userAccount: { ...state.userAccount, cashOnHand },
            ownedStocks: newOwnedStock,
        });
    })
    .build();
