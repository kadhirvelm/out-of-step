import { assert } from "../../utils/testUtils";
import { getPriceForDentalDamageAndCompany } from "../dentalDamageAndCompany";

describe("it can price Dental Damage and Company as expected", () => {
    it("increases the price when palladium goes up", async done => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForDentalDamageAndCompany({
                changeInPalladiumPrice: 0,
                changeInPlatinumPrice: 0,
                changeInUsDairyPricesAverageValue: 0,
                changeInUsMilkSupplyAverageValue: 0,
                percentOwnership: 0,
                previousPrice: 450,
            }),
            getPriceForDentalDamageAndCompany({
                changeInPalladiumPrice: 50,
                changeInPlatinumPrice: 0,
                changeInUsDairyPricesAverageValue: 0,
                changeInUsMilkSupplyAverageValue: 0,
                percentOwnership: 0,
                previousPrice: 450,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeLessThan(changedPrice);

        done();
    });

    it("decreases the price when palladium goes down", async done => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForDentalDamageAndCompany({
                changeInPalladiumPrice: 0,
                changeInPlatinumPrice: 0,
                changeInUsDairyPricesAverageValue: 0,
                changeInUsMilkSupplyAverageValue: 0,
                percentOwnership: 0,
                previousPrice: 450,
            }),
            getPriceForDentalDamageAndCompany({
                changeInPalladiumPrice: -50,
                changeInPlatinumPrice: 0,
                changeInUsDairyPricesAverageValue: 0,
                changeInUsMilkSupplyAverageValue: 0,
                percentOwnership: 0,
                previousPrice: 450,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeGreaterThan(changedPrice);

        done();
    });

    it("increases the price when platinum goes up", async done => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForDentalDamageAndCompany({
                changeInPalladiumPrice: 0,
                changeInPlatinumPrice: 0,
                changeInUsDairyPricesAverageValue: 0,
                changeInUsMilkSupplyAverageValue: 0,
                percentOwnership: 0,
                previousPrice: 450,
            }),
            getPriceForDentalDamageAndCompany({
                changeInPalladiumPrice: 0,
                changeInPlatinumPrice: 50,
                changeInUsDairyPricesAverageValue: 0,
                changeInUsMilkSupplyAverageValue: 0,
                percentOwnership: 0,
                previousPrice: 450,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeLessThan(changedPrice);

        done();
    });

    it("decreases the price when platinum goes down", async done => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForDentalDamageAndCompany({
                changeInPalladiumPrice: 0,
                changeInPlatinumPrice: 0,
                changeInUsDairyPricesAverageValue: 0,
                changeInUsMilkSupplyAverageValue: 0,
                percentOwnership: 0,
                previousPrice: 450,
            }),
            getPriceForDentalDamageAndCompany({
                changeInPalladiumPrice: 0,
                changeInPlatinumPrice: -50,
                changeInUsDairyPricesAverageValue: 0,
                changeInUsMilkSupplyAverageValue: 0,
                percentOwnership: 0,
                previousPrice: 450,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeGreaterThan(changedPrice);

        done();
    });

    it("decreases the price when us dairy goes up", async done => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForDentalDamageAndCompany({
                changeInPalladiumPrice: 0,
                changeInPlatinumPrice: 0,
                changeInUsDairyPricesAverageValue: 0,
                changeInUsMilkSupplyAverageValue: 0,
                percentOwnership: 0,
                previousPrice: 450,
            }),
            getPriceForDentalDamageAndCompany({
                changeInPalladiumPrice: 0,
                changeInPlatinumPrice: 0,
                changeInUsDairyPricesAverageValue: 1,
                changeInUsMilkSupplyAverageValue: 0,
                percentOwnership: 0,
                previousPrice: 450,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeGreaterThan(changedPrice);

        done();
    });

    it("increase the price when us dairy goes down", async done => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForDentalDamageAndCompany({
                changeInPalladiumPrice: 0,
                changeInPlatinumPrice: 0,
                changeInUsDairyPricesAverageValue: 0,
                changeInUsMilkSupplyAverageValue: 0,
                percentOwnership: 0,
                previousPrice: 450,
            }),
            getPriceForDentalDamageAndCompany({
                changeInPalladiumPrice: 0,
                changeInPlatinumPrice: 0,
                changeInUsDairyPricesAverageValue: -1,
                changeInUsMilkSupplyAverageValue: 0,
                percentOwnership: 0,
                previousPrice: 450,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeLessThan(changedPrice);

        done();
    });

    it("decreases the price when us milk supply goes up", async done => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForDentalDamageAndCompany({
                changeInPalladiumPrice: 0,
                changeInPlatinumPrice: 0,
                changeInUsDairyPricesAverageValue: 0,
                changeInUsMilkSupplyAverageValue: 0,
                percentOwnership: 0,
                previousPrice: 450,
            }),
            getPriceForDentalDamageAndCompany({
                changeInPalladiumPrice: 0,
                changeInPlatinumPrice: 0,
                changeInUsDairyPricesAverageValue: 0,
                changeInUsMilkSupplyAverageValue: 3,
                percentOwnership: 0,
                previousPrice: 450,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeGreaterThan(changedPrice);

        done();
    });

    it("increases the price when us milk supply goes down", async done => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForDentalDamageAndCompany({
                changeInPalladiumPrice: 0,
                changeInPlatinumPrice: 0,
                changeInUsDairyPricesAverageValue: 0,
                changeInUsMilkSupplyAverageValue: 0,
                percentOwnership: 0,
                previousPrice: 450,
            }),
            getPriceForDentalDamageAndCompany({
                changeInPalladiumPrice: 0,
                changeInPlatinumPrice: 0,
                changeInUsDairyPricesAverageValue: 0,
                changeInUsMilkSupplyAverageValue: -3,
                percentOwnership: 0,
                previousPrice: 450,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeLessThan(changedPrice);

        done();
    });

    it("lessens the change when the percent ownership goes up", async done => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForDentalDamageAndCompany({
                changeInPalladiumPrice: 100,
                changeInPlatinumPrice: 0,
                changeInUsDairyPricesAverageValue: 0,
                changeInUsMilkSupplyAverageValue: 0,
                percentOwnership: 0,
                previousPrice: 450,
            }),
            getPriceForDentalDamageAndCompany({
                changeInPalladiumPrice: 100,
                changeInPlatinumPrice: 0,
                changeInUsDairyPricesAverageValue: 0,
                changeInUsMilkSupplyAverageValue: 0,
                percentOwnership: 100,
                previousPrice: 450,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeGreaterThan(changedPrice);

        done();
    });

    it("does not increase the price more with a higher previous price", async done => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForDentalDamageAndCompany({
                changeInPalladiumPrice: 100,
                changeInPlatinumPrice: 0,
                changeInUsDairyPricesAverageValue: 0,
                changeInUsMilkSupplyAverageValue: 0,
                percentOwnership: 0,
                previousPrice: 450,
            }),
            getPriceForDentalDamageAndCompany({
                changeInPalladiumPrice: 100,
                changeInPlatinumPrice: 0,
                changeInUsDairyPricesAverageValue: 0,
                changeInUsMilkSupplyAverageValue: 0,
                percentOwnership: 0,
                previousPrice: 900,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(Math.round(originalPrice - 450)).toEqual(Math.round(changedPrice - 900));

        done();
    });
});
