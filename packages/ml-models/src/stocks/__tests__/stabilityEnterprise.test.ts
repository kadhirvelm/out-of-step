import { assert } from "../../utils/testUtils";
import { getPriceForStabilityEnterprises } from "../stabilityEnterprises";

describe("it can price Stability Enterprise as expected", () => {
    it("decreases the price when the change in earthquakes goes up", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForStabilityEnterprises({
                changeInEarthquakesSinceLastMeasure: 0,
                maximumMagnitude: 6,
                previousPrice: 12,
                changeInElectionEvents: 0,
            }),
            getPriceForStabilityEnterprises({
                changeInEarthquakesSinceLastMeasure: 10,
                maximumMagnitude: 6,
                previousPrice: 12,
                changeInElectionEvents: 0,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeGreaterThan(changedPrice);
    });

    it("increases the price when the change in earthquakes goes down", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForStabilityEnterprises({
                changeInEarthquakesSinceLastMeasure: 0,
                maximumMagnitude: 6,
                previousPrice: 12,
                changeInElectionEvents: 0,
            }),
            getPriceForStabilityEnterprises({
                changeInEarthquakesSinceLastMeasure: -10,
                maximumMagnitude: 6,
                previousPrice: 12,
                changeInElectionEvents: 0,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeLessThan(changedPrice);
    });

    it("increases the price when the maximum magnitude is less than 6", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForStabilityEnterprises({
                changeInEarthquakesSinceLastMeasure: 0,
                maximumMagnitude: 6,
                previousPrice: 12,
                changeInElectionEvents: 0,
            }),
            getPriceForStabilityEnterprises({
                changeInEarthquakesSinceLastMeasure: 0,
                maximumMagnitude: 4,
                previousPrice: 12,
                changeInElectionEvents: 0,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeLessThan(changedPrice);
    });

    it("decreases the price when the max magnitude is greater than 6", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForStabilityEnterprises({
                changeInEarthquakesSinceLastMeasure: 0,
                maximumMagnitude: 6,
                previousPrice: 12,
                changeInElectionEvents: 0,
            }),
            getPriceForStabilityEnterprises({
                changeInEarthquakesSinceLastMeasure: 0,
                maximumMagnitude: 8,
                previousPrice: 12,
                changeInElectionEvents: 0,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeGreaterThan(changedPrice);
    });

    it("increases the price when the change in election events goes up", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForStabilityEnterprises({
                changeInEarthquakesSinceLastMeasure: 0,
                maximumMagnitude: 6,
                previousPrice: 12,
                changeInElectionEvents: 0,
            }),
            getPriceForStabilityEnterprises({
                changeInEarthquakesSinceLastMeasure: 0,
                maximumMagnitude: 6,
                previousPrice: 12,
                changeInElectionEvents: 1,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeLessThan(changedPrice);
    });

    it("decreases the price when the change in election events goes down", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForStabilityEnterprises({
                changeInEarthquakesSinceLastMeasure: 0,
                maximumMagnitude: 6,
                previousPrice: 12,
                changeInElectionEvents: 0,
            }),
            getPriceForStabilityEnterprises({
                changeInEarthquakesSinceLastMeasure: 0,
                maximumMagnitude: 6,
                previousPrice: 12,
                changeInElectionEvents: -1,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeGreaterThan(changedPrice);
    });
});
