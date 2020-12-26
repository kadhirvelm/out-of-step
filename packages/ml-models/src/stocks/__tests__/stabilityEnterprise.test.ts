import { assert } from "../../utils/testUtils";
import { getPriceForStabilityEnterprises } from "../stabilityEnterprises";

describe("it can price Stability Enterprise as expected", () => {
    it("decreases the price when the change in earthquakes goes up", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForStabilityEnterprises({
                changeInEarthquakesSinceLastMeasure: 0,
                maximumMagnitude: 6,
                percentOwnership: 0,
                previousPrice: 12,
                totalUpcomingElectionEvents: 10,
            }),
            getPriceForStabilityEnterprises({
                changeInEarthquakesSinceLastMeasure: 10,
                maximumMagnitude: 6,
                percentOwnership: 0,
                previousPrice: 12,
                totalUpcomingElectionEvents: 10,
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
                percentOwnership: 0,
                previousPrice: 12,
                totalUpcomingElectionEvents: 10,
            }),
            getPriceForStabilityEnterprises({
                changeInEarthquakesSinceLastMeasure: -10,
                maximumMagnitude: 6,
                percentOwnership: 0,
                previousPrice: 12,
                totalUpcomingElectionEvents: 10,
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
                percentOwnership: 0,
                previousPrice: 12,
                totalUpcomingElectionEvents: 10,
            }),
            getPriceForStabilityEnterprises({
                changeInEarthquakesSinceLastMeasure: 0,
                maximumMagnitude: 4,
                percentOwnership: 0,
                previousPrice: 12,
                totalUpcomingElectionEvents: 10,
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
                percentOwnership: 0,
                previousPrice: 12,
                totalUpcomingElectionEvents: 10,
            }),
            getPriceForStabilityEnterprises({
                changeInEarthquakesSinceLastMeasure: 0,
                maximumMagnitude: 8,
                percentOwnership: 0,
                previousPrice: 12,
                totalUpcomingElectionEvents: 10,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeGreaterThan(changedPrice);
    });

    it("increases the price when the total election events goes up beyond 10", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForStabilityEnterprises({
                changeInEarthquakesSinceLastMeasure: 0,
                maximumMagnitude: 6,
                percentOwnership: 0,
                previousPrice: 12,
                totalUpcomingElectionEvents: 10,
            }),
            getPriceForStabilityEnterprises({
                changeInEarthquakesSinceLastMeasure: 0,
                maximumMagnitude: 6,
                percentOwnership: 0,
                previousPrice: 12,
                totalUpcomingElectionEvents: 12,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeLessThan(changedPrice);
    });

    it("smaller change when the ownership goes up", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForStabilityEnterprises({
                changeInEarthquakesSinceLastMeasure: -20,
                maximumMagnitude: 6,
                percentOwnership: 0,
                previousPrice: 12,
                totalUpcomingElectionEvents: 5,
            }),
            getPriceForStabilityEnterprises({
                changeInEarthquakesSinceLastMeasure: -20,
                maximumMagnitude: 6,
                percentOwnership: 100,
                previousPrice: 12,
                totalUpcomingElectionEvents: 5,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeGreaterThan(changedPrice);
    });

    it("changes the price more when the previous price is higher", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForStabilityEnterprises({
                changeInEarthquakesSinceLastMeasure: -20,
                maximumMagnitude: 6,
                percentOwnership: 0,
                previousPrice: 12,
                totalUpcomingElectionEvents: 5,
            }),
            getPriceForStabilityEnterprises({
                changeInEarthquakesSinceLastMeasure: -20,
                maximumMagnitude: 6,
                percentOwnership: 0,
                previousPrice: 24,
                totalUpcomingElectionEvents: 5,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice - 12).toBeLessThan(changedPrice - 24);
    });
});
