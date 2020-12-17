import { priceAgriColaInc } from "./stockPlugins/agriColaInc";
import { priceStabilityEnterprises } from "./stockPlugins/stabilityEnterprises";
import { IStockPricerPlugin } from "./types";

export const STOCK_PRICER_PLUGINS: { [stockName: string]: IStockPricerPlugin } = {
    // "Agri Cola Inc": priceAgriColaInc,
    "Stability Enterprises": priceStabilityEnterprises,
};
