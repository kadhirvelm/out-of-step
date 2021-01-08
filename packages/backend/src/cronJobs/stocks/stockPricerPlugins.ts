import { IObjectForAllStocks } from "@stochastic-exchange/api";
import { priceAgriColaInc } from "./stockPlugins/agriColaInc";
import { priceBitAndGamble } from "./stockPlugins/bitAndGamble";
import { priceDentalDamageAndCompany } from "./stockPlugins/dentalDamageAndCompany";
import { priceNoDawnTradingCompany } from "./stockPlugins/noDawnTradingCompany";
import { priceLeagueOfInfluencers } from "./stockPlugins/leagueOfInfluencers";
import { priceStabilityEnterprises } from "./stockPlugins/stabilityEnterprises";
import { priceViruzMeNot } from "./stockPlugins/viruzMeNot";
import { IStockPricerPlugin } from "./types";
import { priceFortyEightUtilities } from "./stockPlugins/fortyEightUtilities";

export const STOCK_PRICER_PLUGINS: IObjectForAllStocks<IStockPricerPlugin<{}>> = {
    "Agri Cola Inc": priceAgriColaInc,
    "Bit & Gamble": priceBitAndGamble,
    "Dental Damage and Company": priceDentalDamageAndCompany,
    "Forty Eight Utilities": priceFortyEightUtilities,
    "League of Influencers": priceLeagueOfInfluencers,
    "No Dawn Trading Company": priceNoDawnTradingCompany,
    "Stability Enterprises": priceStabilityEnterprises,
    "Viruz Me Not": priceViruzMeNot,
};
