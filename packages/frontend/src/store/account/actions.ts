import { IAccount, IGetAccountResponse, ILimitOrder, IStockId } from "@stochastic-exchange/api";
import { defineAction } from "redoodle";

export const SetToken = defineAction("SetToken")<{
    token: string | undefined;
}>();

export const SetUserAccountAndOwnedStocks = defineAction("SetUserAccountAndOwnedStocks")<
    Partial<IGetAccountResponse>
>();

export interface IUpdateUserAccountOnTransaction {
    stockId: IStockId;
    purchaseQuantity: number;
    soldQuantity: number;
    price: number;
}

export const UpdateUserAccountOnTransaction = defineAction("UpdatedUserAccountOnTransaction")<
    IUpdateUserAccountOnTransaction
>();

export const UpdatedUserAccount = defineAction("UpdateUserAccount")<Partial<Omit<IAccount, "hashedPassword">>>();

export const UpdateLimitOrdersOnStock = defineAction("UpdateLimitOrdersOnStock")<{
    stockId: IStockId;
    limitOrders: ILimitOrder[];
}>();
