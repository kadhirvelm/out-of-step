import { IOwnedStock, IStockWithDollarValue } from "@stochastic-exchange/api";
import { createSelector } from "reselect";
import { IStoreState } from "../store/state";

export function selectUserOwnedStock(stock: IStockWithDollarValue | undefined) {
    return createSelector(
        (state: IStoreState) => state.account.ownedStocks,
        (ownedStocks: IOwnedStock[] | undefined): IOwnedStock | undefined => {
            if (stock === undefined) {
                return undefined;
            }

            return ownedStocks?.find(s => s.stock === stock.id);
        },
    );
}
