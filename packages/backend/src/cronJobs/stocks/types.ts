import { IPriceHistory } from "@stochastic-exchange/api";

export type IStockPlugin = (
    totalOwnedStock: number,
    previousPriceHistory?: IPriceHistory,
) => Promise<Pick<IPriceHistory, "dollarValue" | "calculationNotes">>;
