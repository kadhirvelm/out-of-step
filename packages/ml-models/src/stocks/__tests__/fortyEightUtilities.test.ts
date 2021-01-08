import { assert } from "../../utils/testUtils";
import { getPriceForFortyEightUtilities } from "../fortyEightUtilities";

describe("it can price Forty Eight Utilities as expected", () => {
    it("increases the price when the electrical percent goes up", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForFortyEightUtilities({
                changeInElectricalOutput: 0,
                changeInWaterOutput: 0,
                previousPrice: 15,
            }),
            getPriceForFortyEightUtilities({
                changeInElectricalOutput: 5,
                changeInWaterOutput: 0,
                previousPrice: 15,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeLessThan(changedPrice);
    });

    it("decreases the price when the electrical percent goes down", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForFortyEightUtilities({
                changeInElectricalOutput: 0,
                changeInWaterOutput: 0,
                previousPrice: 15,
            }),
            getPriceForFortyEightUtilities({
                changeInElectricalOutput: -5,
                changeInWaterOutput: 0,
                previousPrice: 15,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeGreaterThan(changedPrice);
    });

    it("increases the price when the water percent goes up", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForFortyEightUtilities({
                changeInElectricalOutput: 0,
                changeInWaterOutput: 0,
                previousPrice: 15,
            }),
            getPriceForFortyEightUtilities({
                changeInElectricalOutput: 0,
                changeInWaterOutput: 5,
                previousPrice: 15,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeLessThan(changedPrice);
    });

    it("decreases the price when the water percent goes down", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForFortyEightUtilities({
                changeInElectricalOutput: 0,
                changeInWaterOutput: 0,
                previousPrice: 15,
            }),
            getPriceForFortyEightUtilities({
                changeInElectricalOutput: 0,
                changeInWaterOutput: -5,
                previousPrice: 15,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeGreaterThan(changedPrice);
    });

    it("changes by the same amount even with a higher previous price", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForFortyEightUtilities({
                changeInElectricalOutput: 0,
                changeInWaterOutput: 5,
                previousPrice: 15,
            }),
            getPriceForFortyEightUtilities({
                changeInElectricalOutput: 0,
                changeInWaterOutput: 5,
                previousPrice: 30,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(Math.round(originalPrice - 15)).toEqual(Math.round(changedPrice - 30));
    });
});
