import { assert } from "../../utils/testUtils";
import { getPriceForDentalDamageAndCompany } from "../dentalDamageAndCompany";

describe("it can price Dental Damage and Company as expected", () => {
    it("increases the price when palladium goes up", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForDentalDamageAndCompany({
                changeInPalladiumPrice: 0,
                changeInPlatinumPrice: 0,
                changeInUsDairyPricesAverageValue: 0,
                changeInUsMilkSupplyAverageValue: 0,
                previousPrice: 450,
            }),
            getPriceForDentalDamageAndCompany({
                changeInPalladiumPrice: 50,
                changeInPlatinumPrice: 0,
                changeInUsDairyPricesAverageValue: 0,
                changeInUsMilkSupplyAverageValue: 0,
                previousPrice: 450,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeLessThan(changedPrice);
    });

    it("decreases the price when palladium goes down", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForDentalDamageAndCompany({
                changeInPalladiumPrice: 0,
                changeInPlatinumPrice: 0,
                changeInUsDairyPricesAverageValue: 0,
                changeInUsMilkSupplyAverageValue: 0,
                previousPrice: 450,
            }),
            getPriceForDentalDamageAndCompany({
                changeInPalladiumPrice: -50,
                changeInPlatinumPrice: 0,
                changeInUsDairyPricesAverageValue: 0,
                changeInUsMilkSupplyAverageValue: 0,
                previousPrice: 450,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeGreaterThan(changedPrice);
    });

    it("increases the price when platinum goes up", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForDentalDamageAndCompany({
                changeInPalladiumPrice: 0,
                changeInPlatinumPrice: 0,
                changeInUsDairyPricesAverageValue: 0,
                changeInUsMilkSupplyAverageValue: 0,
                previousPrice: 450,
            }),
            getPriceForDentalDamageAndCompany({
                changeInPalladiumPrice: 0,
                changeInPlatinumPrice: 50,
                changeInUsDairyPricesAverageValue: 0,
                changeInUsMilkSupplyAverageValue: 0,
                previousPrice: 450,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeLessThan(changedPrice);
    });

    it("decreases the price when platinum goes down", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForDentalDamageAndCompany({
                changeInPalladiumPrice: 0,
                changeInPlatinumPrice: 0,
                changeInUsDairyPricesAverageValue: 0,
                changeInUsMilkSupplyAverageValue: 0,
                previousPrice: 450,
            }),
            getPriceForDentalDamageAndCompany({
                changeInPalladiumPrice: 0,
                changeInPlatinumPrice: -50,
                changeInUsDairyPricesAverageValue: 0,
                changeInUsMilkSupplyAverageValue: 0,
                previousPrice: 450,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeGreaterThan(changedPrice);
    });

    it("decreases the price when us dairy goes up", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForDentalDamageAndCompany({
                changeInPalladiumPrice: 0,
                changeInPlatinumPrice: 0,
                changeInUsDairyPricesAverageValue: 0,
                changeInUsMilkSupplyAverageValue: 0,
                previousPrice: 450,
            }),
            getPriceForDentalDamageAndCompany({
                changeInPalladiumPrice: 0,
                changeInPlatinumPrice: 0,
                changeInUsDairyPricesAverageValue: 1,
                changeInUsMilkSupplyAverageValue: 0,
                previousPrice: 450,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeGreaterThan(changedPrice);
    });

    it("increase the price when us dairy goes down", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForDentalDamageAndCompany({
                changeInPalladiumPrice: 0,
                changeInPlatinumPrice: 0,
                changeInUsDairyPricesAverageValue: 0,
                changeInUsMilkSupplyAverageValue: 0,
                previousPrice: 450,
            }),
            getPriceForDentalDamageAndCompany({
                changeInPalladiumPrice: 0,
                changeInPlatinumPrice: 0,
                changeInUsDairyPricesAverageValue: -1,
                changeInUsMilkSupplyAverageValue: 0,
                previousPrice: 450,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeLessThan(changedPrice);
    });

    it("decreases the price when us milk supply goes up", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForDentalDamageAndCompany({
                changeInPalladiumPrice: 0,
                changeInPlatinumPrice: 0,
                changeInUsDairyPricesAverageValue: 0,
                changeInUsMilkSupplyAverageValue: 0,
                previousPrice: 450,
            }),
            getPriceForDentalDamageAndCompany({
                changeInPalladiumPrice: 0,
                changeInPlatinumPrice: 0,
                changeInUsDairyPricesAverageValue: 0,
                changeInUsMilkSupplyAverageValue: 3,
                previousPrice: 450,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeGreaterThan(changedPrice);
    });

    it("increases the price when us milk supply goes down", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForDentalDamageAndCompany({
                changeInPalladiumPrice: 0,
                changeInPlatinumPrice: 0,
                changeInUsDairyPricesAverageValue: 0,
                changeInUsMilkSupplyAverageValue: 0,
                previousPrice: 450,
            }),
            getPriceForDentalDamageAndCompany({
                changeInPalladiumPrice: 0,
                changeInPlatinumPrice: 0,
                changeInUsDairyPricesAverageValue: 0,
                changeInUsMilkSupplyAverageValue: -3,
                previousPrice: 450,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeLessThan(changedPrice);
    });

    it("does not increase the price more with a higher previous price", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForDentalDamageAndCompany({
                changeInPalladiumPrice: 100,
                changeInPlatinumPrice: 0,
                changeInUsDairyPricesAverageValue: 0,
                changeInUsMilkSupplyAverageValue: 0,
                previousPrice: 450,
            }),
            getPriceForDentalDamageAndCompany({
                changeInPalladiumPrice: 100,
                changeInPlatinumPrice: 0,
                changeInUsDairyPricesAverageValue: 0,
                changeInUsMilkSupplyAverageValue: 0,
                previousPrice: 900,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(Math.round(originalPrice - 450)).toEqual(Math.round(changedPrice - 900));
    });
});
