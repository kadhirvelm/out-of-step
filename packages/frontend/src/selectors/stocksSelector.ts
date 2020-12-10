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

export const selectOwnedStockQuantityOfViewStock = createSelector(
    (state: IStoreState) => state.stocks.ownedStockQuantity,
    (state: IStoreState) => state.interface.viewStockWithLatestPrice,
    (
        ownedStockQuantity: { [stockId: string]: number },
        viewStockWithLatestPrice: IStockWithDollarValue | undefined,
    ) => {
        if (viewStockWithLatestPrice === undefined) {
            return undefined;
        }

        return ownedStockQuantity[viewStockWithLatestPrice.id];
    },
);
