import { IObjectForAllStocks } from "@stochastic-exchange/api";
import { priceAgriColaInc } from "./stockPlugins/agriColaInc";
import { priceBitAndGamble } from "./stockPlugins/bitAndGamble";
import { priceDentalDamageAndCompany } from "./stockPlugins/dentalDamageAndCompany";
import { priceLeagueOfInfluencers } from "./stockPlugins/leagueOfInfluencers";
import { priceStabilityEnterprises } from "./stockPlugins/stabilityEnterprises";
import { priceViruzMeNot } from "./stockPlugins/viruzMeNot";
import { IStockPricerPlugin } from "./types";

export const STOCK_PRICER_PLUGINS: IObjectForAllStocks<IStockPricerPlugin<{}>> = {
    "Agri Cola Inc": priceAgriColaInc,
    "Bit & Gamble": priceBitAndGamble,
    "Dental Damage and Company": priceDentalDamageAndCompany,
    "League of Influencers": priceLeagueOfInfluencers,
    "Stability Enterprises": priceStabilityEnterprises,
    "Viruz Me Not": priceViruzMeNot,
};
