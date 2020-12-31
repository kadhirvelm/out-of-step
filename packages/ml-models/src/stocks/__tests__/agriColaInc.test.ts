import { assert } from "../../utils/testUtils";
import { getPriceForAgriColaInc } from "../agriColaInc";

describe("it can price Agri Cola Inc as expected", () => {
    it("increases the price when the rainfall goes up", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForAgriColaInc({
                averageRainfall: 3.2,
                averageTemperateInCelsius: 6,
                averageWindSpeed: 10.6,
                changeInAveragePrice: 0,
                previousPrice: 25,
            }),
            getPriceForAgriColaInc({
                averageRainfall: 6.2,
                averageTemperateInCelsius: 6,
                averageWindSpeed: 10.6,
                changeInAveragePrice: 0,
                previousPrice: 25,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeLessThan(changedPrice);
    });

    it("decreases the price when the rainfall goes down", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForAgriColaInc({
                averageRainfall: 3.2,
                averageTemperateInCelsius: 6,
                averageWindSpeed: 10.6,
                changeInAveragePrice: 0,
                previousPrice: 25,
            }),
            getPriceForAgriColaInc({
                averageRainfall: 0,
                averageTemperateInCelsius: 6,
                averageWindSpeed: 10.6,
                changeInAveragePrice: 0,
                previousPrice: 25,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeGreaterThan(changedPrice);
    });

    it("increases the price when the temperature goes up", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForAgriColaInc({
                averageRainfall: 3.2,
                averageTemperateInCelsius: 6,
                averageWindSpeed: 10.6,
                changeInAveragePrice: 0,
                previousPrice: 25,
            }),
            getPriceForAgriColaInc({
                averageRainfall: 3.2,
                averageTemperateInCelsius: 9,
                averageWindSpeed: 10.6,
                changeInAveragePrice: 0,
                previousPrice: 25,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeLessThan(changedPrice);
    });

    it("decreases the price when the temperature goes down", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForAgriColaInc({
                averageRainfall: 3.2,
                averageTemperateInCelsius: 6,
                averageWindSpeed: 10.6,
                changeInAveragePrice: 0,
                previousPrice: 25,
            }),
            getPriceForAgriColaInc({
                averageRainfall: 3.2,
                averageTemperateInCelsius: 3,
                averageWindSpeed: 10.6,
                changeInAveragePrice: 0,
                previousPrice: 25,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeGreaterThan(changedPrice);
    });

    it("increases the price when the wind speed goes up", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForAgriColaInc({
                averageRainfall: 3.2,
                averageTemperateInCelsius: 6,
                averageWindSpeed: 10.6,
                changeInAveragePrice: 0,
                previousPrice: 25,
            }),
            getPriceForAgriColaInc({
                averageRainfall: 3.2,
                averageTemperateInCelsius: 6,
                averageWindSpeed: 15,
                changeInAveragePrice: 0,
                previousPrice: 25,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeLessThan(changedPrice);
    });

    it("decreases the price when the wind speed goes down", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForAgriColaInc({
                averageRainfall: 3.2,
                averageTemperateInCelsius: 6,
                averageWindSpeed: 10.6,
                changeInAveragePrice: 0,
                previousPrice: 25,
            }),
            getPriceForAgriColaInc({
                averageRainfall: 3.2,
                averageTemperateInCelsius: 6,
                averageWindSpeed: 5,
                changeInAveragePrice: 0,
                previousPrice: 25,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeGreaterThan(changedPrice);
    });

    it("increases the price when the change in average price goes up", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForAgriColaInc({
                averageRainfall: 3.2,
                averageTemperateInCelsius: 6,
                averageWindSpeed: 10.6,
                changeInAveragePrice: 0,
                previousPrice: 25,
            }),
            getPriceForAgriColaInc({
                averageRainfall: 3.2,
                averageTemperateInCelsius: 6,
                averageWindSpeed: 10.6,
                changeInAveragePrice: 3,
                previousPrice: 25,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeLessThan(changedPrice);
    });

    it("decreases the price when the change in average price goes down", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForAgriColaInc({
                averageRainfall: 3.2,
                averageTemperateInCelsius: 6,
                averageWindSpeed: 10.6,
                changeInAveragePrice: 0,
                previousPrice: 25,
            }),
            getPriceForAgriColaInc({
                averageRainfall: 3.2,
                averageTemperateInCelsius: 6,
                averageWindSpeed: 10.6,
                changeInAveragePrice: -3,
                previousPrice: 25,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeGreaterThan(changedPrice);
    });

    it("increases the price more with a higher previous price", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForAgriColaInc({
                averageRainfall: 3.2,
                averageTemperateInCelsius: 6,
                averageWindSpeed: 10,
                changeInAveragePrice: 0,
                previousPrice: 25,
            }),
            getPriceForAgriColaInc({
                averageRainfall: 3.2,
                averageTemperateInCelsius: 6,
                averageWindSpeed: 10,
                changeInAveragePrice: 0,
                previousPrice: 75,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice - 25).toBeLessThan(changedPrice - 50);
    });
});
