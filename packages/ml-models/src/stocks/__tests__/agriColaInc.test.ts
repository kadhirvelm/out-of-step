import { clone } from "lodash";
import { assert } from "../../utils/testUtils";
import { getPriceForAgriColaInc } from "../agriColaInc";

describe("it can price Agri Cola Inc as expected", () => {
    it("can work", async done => {
        const pricedValue = await getPriceForAgriColaInc({
            averageTemperateInCelsius: 5.03,
            averageWindSpeed: 3.71,
            averagePrice: 38.9,
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
                averagePrice: 38.9,
                percentOwnership: 0,
                previousPrice: 24,
            }),
            getPriceForAgriColaInc({
                averageTemperateInCelsius: 2.03,
                averageWindSpeed: 3.71,
                averagePrice: 38.9,
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
                averagePrice: 38.9,
                percentOwnership: 0,
                previousPrice: 24,
            }),
            getPriceForAgriColaInc({
                averageTemperateInCelsius: 5.03,
                averageWindSpeed: 10.71,
                averagePrice: 38.9,
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
                averagePrice: 38.9,
                percentOwnership: 0,
                previousPrice: 24,
            }),
            getPriceForAgriColaInc({
                averageTemperateInCelsius: 5.03,
                averageWindSpeed: 3.71,
                averagePrice: 38.9,
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
                averagePrice: 38.9,
                percentOwnership: 0,
                previousPrice: 24,
            }),
            getPriceForAgriColaInc({
                averageTemperateInCelsius: 5.03,
                averageWindSpeed: 3.71,
                averagePrice: 40.9,
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
                averagePrice: 45,
                percentOwnership: 0,
                previousPrice: 24,
            }),
            getPriceForAgriColaInc({
                averageTemperateInCelsius: 5.03,
                averageWindSpeed: 3.71,
                averagePrice: 23,
                percentOwnership: 0,
                previousPrice: 24,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(Math.abs(24 - originalPrice)).toBeGreaterThan(Math.abs(24 - changedPrice));

        done();
    });
});

describe("Sample run using real data for Agri Cola Inc", () => {
    it("Can successfully execute all the points in order", async done => {
        const allPoints = [
            {
                averageTemperateInCelsius: -2.817142857142869,
                averageWindSpeed: 2.9571428571428577,
                averagePrice: 25,
                percentOwnership: 0.0002,
            },
            {
                averageTemperateInCelsius: -2.842857142857099,
                averageWindSpeed: 3.028571428571429,
                averagePrice: 21.81,
                percentOwnership: 0.0002,
            },
            {
                averageTemperateInCelsius: -2.8614285714285757,
                averageWindSpeed: 3.028571428571429,
                averagePrice: 18.76,
                percentOwnership: 0.0002,
            },
            {
                averageTemperateInCelsius: -3.0149999999999864,
                averageWindSpeed: 3.0375000000000005,
                averagePrice: 15.84,
                percentOwnership: 0.0002,
            },
            {
                averageTemperateInCelsius: -3.1988888888888596,
                averageWindSpeed: 3.0916666666666677,
                averagePrice: 12.94,
                percentOwnership: 0.0002,
            },
            {
                averageTemperateInCelsius: -2.6028571428571468,
                averageWindSpeed: 3.2595238095238104,
                averagePrice: 10.35,
                percentOwnership: 0.0002,
            },
            {
                averageTemperateInCelsius: -2.6028571428571468,
                averageWindSpeed: 3.307142857142858,
                averagePrice: 8.28,
                percentOwnership: 0.0002,
            },
            {
                averageTemperateInCelsius: -2.6028571428571468,
                averageWindSpeed: 3.307142857142858,
                averagePrice: 6.62,
                percentOwnership: 0.0002,
            },
            {
                averageTemperateInCelsius: -2.46636363636361,
                averageWindSpeed: 3.4386363636363644,
                averagePrice: 5.3,
                percentOwnership: 0.0002,
            },
            {
                averageTemperateInCelsius: -2.46636363636361,
                averageWindSpeed: 3.4386363636363644,
                averagePrice: 4.24,
                percentOwnership: 0.0002,
            },
            {
                averageTemperateInCelsius: -2.384782608695616,
                averageWindSpeed: 3.4891304347826093,
                averagePrice: 3.39,
                percentOwnership: 0.0002,
            },
            {
                averageTemperateInCelsius: -2.384782608695616,
                averageWindSpeed: 3.4891304347826093,
                averagePrice: 2.71,
                percentOwnership: 0.0002,
            },
            {
                averageTemperateInCelsius: -2.3370833333332826,
                averageWindSpeed: 3.535416666666667,
                averagePrice: 2.17,
                percentOwnership: 0.0002,
            },
            {
                averageTemperateInCelsius: -2.339999999999975,
                averageWindSpeed: 3.514583333333334,
                averagePrice: 1.74,
                percentOwnership: 0.0002,
            },
            {
                averageTemperateInCelsius: -2.214999999999975,
                averageWindSpeed: 3.8499999999999996,
                averagePrice: 1.39,
                percentOwnership: 0.0002,
            },
            {
                averageTemperateInCelsius: -2.576666666666654,
                averageWindSpeed: 3.766666666666666,
                averagePrice: 1.11,
                percentOwnership: 0.0002,
            },
            {
                averageTemperateInCelsius: -2.576666666666654,
                averageWindSpeed: 3.766666666666666,
                averagePrice: 0.89,
                percentOwnership: 0.0002,
            },
            {
                averageTemperateInCelsius: -2.576666666666654,
                averageWindSpeed: 3.433333333333333,
                averagePrice: 0.71,
                percentOwnership: 1,
            },
            {
                averageTemperateInCelsius: -2.576666666666654,
                averageWindSpeed: 3.433333333333333,
                averagePrice: 0.57,
                percentOwnership: 1,
            },
            {
                averageTemperateInCelsius: -2.8724999999999454,
                averageWindSpeed: 3.2249999999999996,
                averagePrice: 0.46,
                percentOwnership: 1,
            },
            {
                averageTemperateInCelsius: -3.147999999999911,
                averageWindSpeed: 3.0999999999999996,
                averagePrice: 0.37,
                percentOwnership: 1,
            },
            {
                averageTemperateInCelsius: -3.217999999999961,
                averageWindSpeed: 3.1999999999999997,
                averagePrice: 0.3,
                percentOwnership: 1,
            },
        ];

        let currentPrice: number | undefined = 25;
        // eslint-disable-next-line no-restricted-syntax
        for (const point of allPoints) {
            // eslint-disable-next-line no-await-in-loop
            currentPrice = await getPriceForAgriColaInc({ ...point, previousPrice: clone(currentPrice ?? 25) });
        }

        expect(currentPrice).toBeGreaterThan(10);
        done();
    });
});
