import { IAccount, ILimitOrder, IOwnedStock, IOwnedStockId } from "@stochastic-exchange/api";
import { setWith, TypedReducer } from "redoodle";
import { getTokenInCookie, setTokenInCookie } from "../../utils/tokenInCookies";
import {
    SetToken,
    SetUserAccountAndOwnedStocks,
    UpdateLimitOrdersOnStock,
    UpdatedUserAccount,
    UpdateUserAccountOnTransaction,
} from "./actions";

export interface IAccountState {
    limitOrdersOnStocks: { [stockId: string]: ILimitOrder[] };
    ownedStocks: IOwnedStock[] | undefined;
    token: string | undefined;
    userAccount: Omit<IAccount, "hashedPassword"> | undefined;
}

export const EMPTY_ACCOUNT_STATE: IAccountState = {
    limitOrdersOnStocks: {},
    ownedStocks: undefined,
    token: getTokenInCookie(),
    userAccount: undefined,
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
    .withHandler(UpdateLimitOrdersOnStock.TYPE, (state, { stockId, limitOrders }) => {
        return setWith(state, {
            limitOrdersOnStocks: {
                ...state.limitOrdersOnStocks,
                [stockId]: limitOrders,
            },
        });
    })
    .build();
