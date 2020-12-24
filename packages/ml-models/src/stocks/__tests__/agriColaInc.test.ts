import { assert } from "../../utils/testUtils";
import { getPriceForAgriColaInc } from "../agriColaInc";

describe("it can price Agri Cola Inc as expected", () => {
    it("increases the price when the temperature goes up", async done => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForAgriColaInc({
                averageTemperateInCelsius: 0,
                averageWindSpeed: 0,
                changeInAveragePrice: 0,
                percentOwnership: 0,
                previousPrice: 25,
            }),
            getPriceForAgriColaInc({
                averageTemperateInCelsius: 3,
                averageWindSpeed: 0,
                changeInAveragePrice: 0,
                percentOwnership: 0,
                previousPrice: 25,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeLessThan(changedPrice);

        done();
    });

    it("decreases the price when the temperature goes down", async done => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForAgriColaInc({
                averageTemperateInCelsius: 0,
                averageWindSpeed: 0,
                changeInAveragePrice: 0,
                percentOwnership: 0,
                previousPrice: 25,
            }),
            getPriceForAgriColaInc({
                averageTemperateInCelsius: -3,
                averageWindSpeed: 0,
                changeInAveragePrice: 0,
                percentOwnership: 0,
                previousPrice: 25,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeGreaterThan(changedPrice);

        done();
    });

    it("increases the price when the wind speed goes up", async done => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForAgriColaInc({
                averageTemperateInCelsius: 0,
                averageWindSpeed: 0,
                changeInAveragePrice: 0,
                percentOwnership: 0,
                previousPrice: 25,
            }),
            getPriceForAgriColaInc({
                averageTemperateInCelsius: 0,
                averageWindSpeed: 5,
                changeInAveragePrice: 0,
                percentOwnership: 0,
                previousPrice: 25,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeLessThan(changedPrice);

        done();
    });

    it("increases the price when the change in average price goes up", async done => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForAgriColaInc({
                averageTemperateInCelsius: 0,
                averageWindSpeed: 0,
                changeInAveragePrice: 0,
                percentOwnership: 0,
                previousPrice: 25,
            }),
            getPriceForAgriColaInc({
                averageTemperateInCelsius: 0,
                averageWindSpeed: 0,
                changeInAveragePrice: 3,
                percentOwnership: 0,
                previousPrice: 25,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeLessThan(changedPrice);

        done();
    });

    it("decreases the price when the change in average price goes down", async done => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForAgriColaInc({
                averageTemperateInCelsius: 0,
                averageWindSpeed: 0,
                changeInAveragePrice: 0,
                percentOwnership: 0,
                previousPrice: 25,
            }),
            getPriceForAgriColaInc({
                averageTemperateInCelsius: 0,
                averageWindSpeed: 0,
                changeInAveragePrice: -3,
                percentOwnership: 0,
                previousPrice: 25,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeGreaterThan(changedPrice);

        done();
    });

    it("lessens the change when the percent ownership goes up", async done => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForAgriColaInc({
                averageTemperateInCelsius: 0,
                averageWindSpeed: 10,
                changeInAveragePrice: 0,
                percentOwnership: 0,
                previousPrice: 25,
            }),
            getPriceForAgriColaInc({
                averageTemperateInCelsius: 0,
                averageWindSpeed: 10,
                changeInAveragePrice: 0,
                percentOwnership: 100,
                previousPrice: 25,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeGreaterThan(changedPrice);

        done();
    });

    it("increases the price more with a higher previous price", async done => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForAgriColaInc({
                averageTemperateInCelsius: 0,
                averageWindSpeed: 10,
                changeInAveragePrice: 0,
                percentOwnership: 0,
                previousPrice: 25,
            }),
            getPriceForAgriColaInc({
                averageTemperateInCelsius: 0,
                averageWindSpeed: 10,
                changeInAveragePrice: 0,
                percentOwnership: 0,
                previousPrice: 75,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice - 25).toBeLessThan(changedPrice - 50);

        done();
    });
});
