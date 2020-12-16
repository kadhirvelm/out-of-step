import { priceAgriColaInc } from "./agriColaInc";
import { IStockPricerPlugin } from "./types";

export const STOCK_PRICER_PLUGINS: { [stockName: string]: IStockPricerPlugin } = {
    "Agri Cola Inc": priceAgriColaInc,
};
