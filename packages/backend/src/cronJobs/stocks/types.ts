import { IPriceHistory, IStock } from "@stochastic-exchange/api";

export type IStockPricerPlugin = (
    date: Date,
    stock: IStock,
    totalOwnedStock: number,
    previousPriceHistory?: Pick<IPriceHistory, "dollarValue" | "calculationNotes">,
) => Promise<Pick<IPriceHistory, "dollarValue" | "calculationNotes">>;
