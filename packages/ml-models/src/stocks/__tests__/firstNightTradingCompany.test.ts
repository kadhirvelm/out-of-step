import { assert } from "../../utils/testUtils";
import { getPriceForFirstNightTradingCompany } from "../firstNightTradingCompany";

describe("it can price First Night Trading Company as expected", () => {
    it("increases the price when gold goes up", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForFirstNightTradingCompany({
                changeInGoldPrice: 0,
                changeInSilverPrice: 0,
                changeInTreasuryRealYieldCurveRate: 0,
                previousPrice: 14,
            }),
            getPriceForFirstNightTradingCompany({
                changeInGoldPrice: 5,
                changeInSilverPrice: 0,
                changeInTreasuryRealYieldCurveRate: 0,
                previousPrice: 14,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeLessThan(changedPrice);
    });

    it("decreases the price when gold goes down", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForFirstNightTradingCompany({
                changeInGoldPrice: 0,
                changeInSilverPrice: 0,
                changeInTreasuryRealYieldCurveRate: 0,
                previousPrice: 14,
            }),
            getPriceForFirstNightTradingCompany({
                changeInGoldPrice: -5,
                changeInSilverPrice: 0,
                changeInTreasuryRealYieldCurveRate: 0,
                previousPrice: 14,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeGreaterThan(changedPrice);
    });

    it("increases the price when silver goes up", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForFirstNightTradingCompany({
                changeInGoldPrice: 0,
                changeInSilverPrice: 0,
                changeInTreasuryRealYieldCurveRate: 0,
                previousPrice: 14,
            }),
            getPriceForFirstNightTradingCompany({
                changeInGoldPrice: 0,
                changeInSilverPrice: 0.2,
                changeInTreasuryRealYieldCurveRate: 0,
                previousPrice: 14,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeLessThan(changedPrice);
    });

    it("decreases the price when silver goes down", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForFirstNightTradingCompany({
                changeInGoldPrice: 0,
                changeInSilverPrice: 0,
                changeInTreasuryRealYieldCurveRate: 0,
                previousPrice: 14,
            }),
            getPriceForFirstNightTradingCompany({
                changeInGoldPrice: 0,
                changeInSilverPrice: -0.2,
                changeInTreasuryRealYieldCurveRate: 0,
                previousPrice: 14,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeGreaterThan(changedPrice);
    });

    it("increases the price when the treasury yield goes down", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForFirstNightTradingCompany({
                changeInGoldPrice: 0,
                changeInSilverPrice: 0,
                changeInTreasuryRealYieldCurveRate: 0,
                previousPrice: 14,
            }),
            getPriceForFirstNightTradingCompany({
                changeInGoldPrice: 0,
                changeInSilverPrice: 0,
                changeInTreasuryRealYieldCurveRate: -0.05,
                previousPrice: 14,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeLessThan(changedPrice);
    });

    it("decreases the price when the treasury yield goes up", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForFirstNightTradingCompany({
                changeInGoldPrice: 0,
                changeInSilverPrice: 0,
                changeInTreasuryRealYieldCurveRate: 0,
                previousPrice: 14,
            }),
            getPriceForFirstNightTradingCompany({
                changeInGoldPrice: 0,
                changeInSilverPrice: 0,
                changeInTreasuryRealYieldCurveRate: 0.05,
                previousPrice: 14,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeGreaterThan(changedPrice);
    });
});
