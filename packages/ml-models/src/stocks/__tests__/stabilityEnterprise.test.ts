import { getPriceForStabilityEnterprises } from "../stabilityEnterprises";

describe("it can price Stability Enterprise as expected", () => {
    it("can work", async done => {
        const pricedValue = await getPriceForStabilityEnterprises({
            averageMagnitude: 4.6,
            maximumMagnitude: 6.2,
            minimumMagnitude: 4,
            percentOwnership: 0,
            previousPrice: 12,
            totalEarthquakes: 14,
            totalUpcomingElectionEvents: 12,
        });

        expect(pricedValue).not.toEqual(undefined);
        done();
    });

    // TODO: more checks to see if it's working as expected
});
