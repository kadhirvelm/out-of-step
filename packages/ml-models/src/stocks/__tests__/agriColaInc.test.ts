import { clone } from "lodash";
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

describe.only("Sample run using real data for Agri Cola Inc", () => {
    it("Can successfully execute all the points in order", async done => {
        const allPoints = [
            {
                averageTemperateInCelsius: -2.817142857142869,
                averageWindSpeed: 2.9571428571428577,
                highPriceAverage: 25,
                lowPriceAverage: 25,
                percentOwnership: 0.0002,
            },
            {
                averageTemperateInCelsius: -2.842857142857099,
                averageWindSpeed: 3.028571428571429,
                highPriceAverage: 21.81,
                lowPriceAverage: 21.81,
                percentOwnership: 0.0002,
            },
            {
                averageTemperateInCelsius: -2.8614285714285757,
                averageWindSpeed: 3.028571428571429,
                highPriceAverage: 18.76,
                lowPriceAverage: 18.76,
                percentOwnership: 0.0002,
            },
            {
                averageTemperateInCelsius: -3.0149999999999864,
                averageWindSpeed: 3.0375000000000005,
                highPriceAverage: 15.84,
                lowPriceAverage: 15.84,
                percentOwnership: 0.0002,
            },
            {
                averageTemperateInCelsius: -3.1988888888888596,
                averageWindSpeed: 3.0916666666666677,
                highPriceAverage: 12.94,
                lowPriceAverage: 12.94,
                percentOwnership: 0.0002,
            },
            {
                averageTemperateInCelsius: -2.6028571428571468,
                averageWindSpeed: 3.2595238095238104,
                highPriceAverage: 10.35,
                lowPriceAverage: 10.35,
                percentOwnership: 0.0002,
            },
            {
                averageTemperateInCelsius: -2.6028571428571468,
                averageWindSpeed: 3.307142857142858,
                highPriceAverage: 8.28,
                lowPriceAverage: 8.28,
                percentOwnership: 0.0002,
            },
            {
                averageTemperateInCelsius: -2.6028571428571468,
                averageWindSpeed: 3.307142857142858,
                highPriceAverage: 6.62,
                lowPriceAverage: 6.62,
                percentOwnership: 0.0002,
            },
            {
                averageTemperateInCelsius: -2.46636363636361,
                averageWindSpeed: 3.4386363636363644,
                highPriceAverage: 5.3,
                lowPriceAverage: 5.3,
                percentOwnership: 0.0002,
            },
            {
                averageTemperateInCelsius: -2.46636363636361,
                averageWindSpeed: 3.4386363636363644,
                highPriceAverage: 4.24,
                lowPriceAverage: 4.24,
                percentOwnership: 0.0002,
            },
            {
                averageTemperateInCelsius: -2.384782608695616,
                averageWindSpeed: 3.4891304347826093,
                highPriceAverage: 3.39,
                lowPriceAverage: 3.39,
                percentOwnership: 0.0002,
            },
            {
                averageTemperateInCelsius: -2.384782608695616,
                averageWindSpeed: 3.4891304347826093,
                highPriceAverage: 2.71,
                lowPriceAverage: 2.71,
                percentOwnership: 0.0002,
            },
            {
                averageTemperateInCelsius: -2.3370833333332826,
                averageWindSpeed: 3.535416666666667,
                highPriceAverage: 2.17,
                lowPriceAverage: 2.17,
                percentOwnership: 0.0002,
            },
            {
                averageTemperateInCelsius: -2.339999999999975,
                averageWindSpeed: 3.514583333333334,
                highPriceAverage: 1.74,
                lowPriceAverage: 1.74,
                percentOwnership: 0.0002,
            },
            {
                averageTemperateInCelsius: -2.214999999999975,
                averageWindSpeed: 3.8499999999999996,
                highPriceAverage: 1.39,
                lowPriceAverage: 1.39,
                percentOwnership: 0.0002,
            },
            {
                averageTemperateInCelsius: -2.576666666666654,
                averageWindSpeed: 3.766666666666666,
                highPriceAverage: 1.11,
                lowPriceAverage: 1.11,
                percentOwnership: 0.0002,
            },
            {
                averageTemperateInCelsius: -2.576666666666654,
                averageWindSpeed: 3.766666666666666,
                highPriceAverage: 0.89,
                lowPriceAverage: 0.89,
                percentOwnership: 0.0002,
            },
            {
                averageTemperateInCelsius: -2.576666666666654,
                averageWindSpeed: 3.433333333333333,
                highPriceAverage: 0.71,
                lowPriceAverage: 0.71,
                percentOwnership: 1,
            },
            {
                averageTemperateInCelsius: -2.576666666666654,
                averageWindSpeed: 3.433333333333333,
                highPriceAverage: 0.57,
                lowPriceAverage: 0.57,
                percentOwnership: 1,
            },
            {
                averageTemperateInCelsius: -2.8724999999999454,
                averageWindSpeed: 3.2249999999999996,
                highPriceAverage: 0.46,
                lowPriceAverage: 0.46,
                percentOwnership: 1,
            },
            {
                averageTemperateInCelsius: -3.147999999999911,
                averageWindSpeed: 3.0999999999999996,
                highPriceAverage: 0.37,
                lowPriceAverage: 0.37,
                percentOwnership: 1,
            },
            {
                averageTemperateInCelsius: -3.217999999999961,
                averageWindSpeed: 3.1999999999999997,
                highPriceAverage: 0.3,
                lowPriceAverage: 0.3,
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
    });
});
