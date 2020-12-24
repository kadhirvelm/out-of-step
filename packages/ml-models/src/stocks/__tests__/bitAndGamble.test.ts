import { assert } from "../../utils/testUtils";
import { getPriceForBitAndGamble } from "../bitAndGamble";

describe("it can price Bit & Gamble as expected", () => {
    it("increases the price when the bitcoin value goes up", async done => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForBitAndGamble({
                averageEffectiveFederalFundsRate: 0.1,
                changeInAverageInitialClaimsForUnemployment: 0,
                changeInBitCoinValue: 0,
                percentOwnership: 0,
                previousPrice: 22000,
            }),
            getPriceForBitAndGamble({
                averageEffectiveFederalFundsRate: 0.1,
                changeInAverageInitialClaimsForUnemployment: 0,
                changeInBitCoinValue: 1000,
                percentOwnership: 0,
                previousPrice: 22000,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeLessThan(changedPrice);

        done();
    });

    it("decreases the price when the bitcoin value goes down", async done => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForBitAndGamble({
                averageEffectiveFederalFundsRate: 0.1,
                changeInAverageInitialClaimsForUnemployment: 0,
                changeInBitCoinValue: 0,
                percentOwnership: 0,
                previousPrice: 22000,
            }),
            getPriceForBitAndGamble({
                averageEffectiveFederalFundsRate: 0.1,
                changeInAverageInitialClaimsForUnemployment: 0,
                changeInBitCoinValue: -1000,
                percentOwnership: 0,
                previousPrice: 22000,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeGreaterThan(changedPrice);

        done();
    });

    it("uses more of the bit coin value when the federal funds rate goes up", async done => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForBitAndGamble({
                averageEffectiveFederalFundsRate: 0.1,
                changeInAverageInitialClaimsForUnemployment: 0,
                changeInBitCoinValue: 1000,
                percentOwnership: 0,
                previousPrice: 22000,
            }),
            getPriceForBitAndGamble({
                averageEffectiveFederalFundsRate: 0.3,
                changeInAverageInitialClaimsForUnemployment: 0,
                changeInBitCoinValue: 1000,
                percentOwnership: 0,
                previousPrice: 22000,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeLessThan(changedPrice);

        const [originalPriceTwo, changedPriceTwo] = await Promise.all([
            getPriceForBitAndGamble({
                averageEffectiveFederalFundsRate: 0.1,
                changeInAverageInitialClaimsForUnemployment: 0,
                changeInBitCoinValue: -1000,
                percentOwnership: 0,
                previousPrice: 22000,
            }),
            getPriceForBitAndGamble({
                averageEffectiveFederalFundsRate: 0.3,
                changeInAverageInitialClaimsForUnemployment: 0,
                changeInBitCoinValue: -1000,
                percentOwnership: 0,
                previousPrice: 22000,
            }),
        ]);

        assert(originalPriceTwo !== undefined && changedPriceTwo !== undefined);
        expect(originalPriceTwo).toBeGreaterThan(changedPriceTwo);

        done();
    });

    it("increases the price when unemployment is down", async done => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForBitAndGamble({
                averageEffectiveFederalFundsRate: 0.1,
                changeInAverageInitialClaimsForUnemployment: 0,
                changeInBitCoinValue: 0,
                percentOwnership: 0,
                previousPrice: 22000,
            }),
            getPriceForBitAndGamble({
                averageEffectiveFederalFundsRate: 0.1,
                changeInAverageInitialClaimsForUnemployment: -1000,
                changeInBitCoinValue: 0,
                percentOwnership: 0,
                previousPrice: 22000,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeLessThan(changedPrice);

        done();
    });

    it("decreases the price when unemployment is up", async done => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForBitAndGamble({
                averageEffectiveFederalFundsRate: 0.1,
                changeInAverageInitialClaimsForUnemployment: 0,
                changeInBitCoinValue: 0,
                percentOwnership: 0,
                previousPrice: 22000,
            }),
            getPriceForBitAndGamble({
                averageEffectiveFederalFundsRate: 0.1,
                changeInAverageInitialClaimsForUnemployment: 1000,
                changeInBitCoinValue: 0,
                percentOwnership: 0,
                previousPrice: 22000,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeGreaterThan(changedPrice);

        done();
    });

    it("uses more of the claims value when the federal funds rate goes up", async done => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForBitAndGamble({
                averageEffectiveFederalFundsRate: 0.1,
                changeInAverageInitialClaimsForUnemployment: 1000,
                changeInBitCoinValue: 0,
                percentOwnership: 0,
                previousPrice: 22000,
            }),
            getPriceForBitAndGamble({
                averageEffectiveFederalFundsRate: 0.3,
                changeInAverageInitialClaimsForUnemployment: 1000,
                changeInBitCoinValue: 0,
                percentOwnership: 0,
                previousPrice: 22000,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeGreaterThan(changedPrice);

        const [originalPriceTwo, changedPriceTwo] = await Promise.all([
            getPriceForBitAndGamble({
                averageEffectiveFederalFundsRate: 0.1,
                changeInAverageInitialClaimsForUnemployment: -1000,
                changeInBitCoinValue: 0,
                percentOwnership: 0,
                previousPrice: 22000,
            }),
            getPriceForBitAndGamble({
                averageEffectiveFederalFundsRate: 0.3,
                changeInAverageInitialClaimsForUnemployment: -1000,
                changeInBitCoinValue: 0,
                percentOwnership: 0,
                previousPrice: 22000,
            }),
        ]);

        assert(originalPriceTwo !== undefined && changedPriceTwo !== undefined);
        expect(originalPriceTwo).toBeLessThan(changedPriceTwo);

        done();
    });

    it("lessens the change when the percent ownership goes up", async done => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForBitAndGamble({
                averageEffectiveFederalFundsRate: 0.1,
                changeInAverageInitialClaimsForUnemployment: 0,
                changeInBitCoinValue: 1000,
                percentOwnership: 0,
                previousPrice: 22000,
            }),
            getPriceForBitAndGamble({
                averageEffectiveFederalFundsRate: 0.1,
                changeInAverageInitialClaimsForUnemployment: 1000,
                changeInBitCoinValue: 1000,
                percentOwnership: 100,
                previousPrice: 22000,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeGreaterThan(changedPrice);

        done();
    });

    it("adds to the existing price linearly", async done => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForBitAndGamble({
                averageEffectiveFederalFundsRate: 0.1,
                changeInAverageInitialClaimsForUnemployment: 0,
                changeInBitCoinValue: 1000,
                percentOwnership: 0,
                previousPrice: 22000,
            }),
            getPriceForBitAndGamble({
                averageEffectiveFederalFundsRate: 0.1,
                changeInAverageInitialClaimsForUnemployment: 0,
                changeInBitCoinValue: 1000,
                percentOwnership: 0,
                previousPrice: 44000,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeLessThan(changedPrice);
        expect(originalPrice - 22000).toEqual(changedPrice - 44000);

        done();
    });
});
