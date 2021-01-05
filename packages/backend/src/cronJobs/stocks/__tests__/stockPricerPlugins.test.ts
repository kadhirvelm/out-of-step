import { STOCK_PRICER_PLUGINS } from "../stockPricerPlugins";

jest.mock("node-fetch", () => {
    return () => undefined;
});

const EXPECTED_DOLLAR_VALUE = 25;

jest.mock("@stochastic-exchange/ml-models", () => {
    return {
        getPriceForAgriColaInc: () => EXPECTED_DOLLAR_VALUE,
        getPriceForBitAndGamble: () => EXPECTED_DOLLAR_VALUE,
        getPriceForDentalDamageAndCompany: () => EXPECTED_DOLLAR_VALUE,
        getPriceForFirstNightTradingCompany: () => EXPECTED_DOLLAR_VALUE,
        getPriceForLeagueOfInfluencers: () => EXPECTED_DOLLAR_VALUE,
        getPriceForStabilityEnterprises: () => EXPECTED_DOLLAR_VALUE,
        getPriceForViruzMeNot: () => EXPECTED_DOLLAR_VALUE,
    };
});

describe("Stock pricer plugins", () => {
    const newDate = new Date();
    Object.entries(STOCK_PRICER_PLUGINS).forEach(pricerPlugin => {
        it(`can price ${pricerPlugin[0]} resiliently`, async () => {
            const pricedStock = await pricerPlugin[1](newDate);
            expect(pricedStock.dollarValue).toEqual(EXPECTED_DOLLAR_VALUE);
        });
    });
});
