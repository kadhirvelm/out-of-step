import { assert } from "../../utils/testUtils";
import { getPriceForAgriColaInc } from "../agriColaInc";

describe("it can price Agri Cola Inc as expected", () => {
    it("can work", async done => {
        const pricedValue = await getPriceForAgriColaInc({
            averageTemperateInCelsius: 5.03,
            averageWindSpeed: 3.71,
            highPriceAverage: 39.06,
            lowPriceAverage: 38.9,
            percentOwnership: 0,
            previousPrice: 24,
        });

        expect(pricedValue).not.toEqual(undefined);
        done();
    });

    it("can reduce the price when the temperature drops", async done => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForAgriColaInc({
                averageTemperateInCelsius: 5.03,
                averageWindSpeed: 3.71,
                highPriceAverage: 39.06,
                lowPriceAverage: 38.9,
                percentOwnership: 0,
                previousPrice: 24,
            }),
            getPriceForAgriColaInc({
                averageTemperateInCelsius: 2.03,
                averageWindSpeed: 3.71,
                highPriceAverage: 39.06,
                lowPriceAverage: 38.9,
                percentOwnership: 0,
                previousPrice: 24,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice - changedPrice).toBeGreaterThan(0);

        done();
    });

    it("increases the price when the wind speed goes up", async done => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForAgriColaInc({
                averageTemperateInCelsius: 5.03,
                averageWindSpeed: 3.71,
                highPriceAverage: 39.06,
                lowPriceAverage: 38.9,
                percentOwnership: 0,
                previousPrice: 24,
            }),
            getPriceForAgriColaInc({
                averageTemperateInCelsius: 5.03,
                averageWindSpeed: 10.71,
                highPriceAverage: 39.06,
                lowPriceAverage: 38.9,
                percentOwnership: 0,
                previousPrice: 24,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(changedPrice - originalPrice).toBeGreaterThan(0);

        done();
    });

    it("decreases the change in price with increased ownership", async done => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForAgriColaInc({
                averageTemperateInCelsius: 5.03,
                averageWindSpeed: 3.71,
                highPriceAverage: 39.06,
                lowPriceAverage: 38.9,
                percentOwnership: 0,
                previousPrice: 24,
            }),
            getPriceForAgriColaInc({
                averageTemperateInCelsius: 5.03,
                averageWindSpeed: 3.71,
                highPriceAverage: 39.06,
                lowPriceAverage: 38.9,
                percentOwnership: 100,
                previousPrice: 24,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(Math.abs(24 - originalPrice)).toBeGreaterThan(Math.abs(24 - changedPrice));

        done();
    });

    it("increases the price when the delta between high and low go up", async done => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForAgriColaInc({
                averageTemperateInCelsius: 5.03,
                averageWindSpeed: 3.71,
                highPriceAverage: 39.06,
                lowPriceAverage: 38.9,
                percentOwnership: 0,
                previousPrice: 24,
            }),
            getPriceForAgriColaInc({
                averageTemperateInCelsius: 5.03,
                averageWindSpeed: 3.71,
                highPriceAverage: 149.06,
                lowPriceAverage: 40.9,
                percentOwnership: 0,
                previousPrice: 24,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(Math.abs(24 - originalPrice)).toBeLessThan(Math.abs(24 - changedPrice));

        done();
    });

    it.skip("decreases the price when the delta between high and low goes down", async done => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForAgriColaInc({
                averageTemperateInCelsius: 5.03,
                averageWindSpeed: 3.71,
                highPriceAverage: 50.5,
                lowPriceAverage: 45,
                percentOwnership: 0,
                previousPrice: 24,
            }),
            getPriceForAgriColaInc({
                averageTemperateInCelsius: 5.03,
                averageWindSpeed: 3.71,
                highPriceAverage: 25,
                lowPriceAverage: 23,
                percentOwnership: 0,
                previousPrice: 24,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(Math.abs(24 - originalPrice)).toBeGreaterThan(Math.abs(24 - changedPrice));

        done();
    });
});
