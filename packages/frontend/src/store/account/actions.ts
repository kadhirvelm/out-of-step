import { IAccount, IGetAccountResponse } from "@stochastic-exchange/api";
import { defineAction } from "redoodle";

export const SetToken = defineAction("SetToken")<{
    token: string | undefined;
}>();

export const SetUserAccountAndOwnedStocks = defineAction("SetUserAccountAndOwnedStocks")<
    Partial<IGetAccountResponse>
>();

export const UpdatedUserAccount = defineAction("UpdateUserAccount")<Partial<Omit<IAccount, "hashedPassword">>>();
