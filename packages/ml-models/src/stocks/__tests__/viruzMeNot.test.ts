import { assert } from "../../utils/testUtils";
import { getPriceForViruzMeNot } from "../viruzMeNot";

describe("it can price Viruz Me Not as expected", () => {
    it("increase the price when critical community threats goes up", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForViruzMeNot({
                changeInCurrentlyHospitalized: 0,
                changeInCriticalCommunityThreats: 0,
                previousPrice: 0.78,
            }),
            getPriceForViruzMeNot({
                changeInCurrentlyHospitalized: 1000,
                changeInCriticalCommunityThreats: 0,
                previousPrice: 0.78,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeLessThan(changedPrice);
    });

    it("decrease the price when critical community threats goes down", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForViruzMeNot({
                changeInCurrentlyHospitalized: 0,
                changeInCriticalCommunityThreats: 0,
                previousPrice: 0.78,
            }),
            getPriceForViruzMeNot({
                changeInCurrentlyHospitalized: -1000,
                changeInCriticalCommunityThreats: 0,
                previousPrice: 0.78,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeGreaterThan(changedPrice);
    });

    it("increase the price when the total hospitalized goes up", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForViruzMeNot({
                changeInCurrentlyHospitalized: 0,
                changeInCriticalCommunityThreats: 0,
                previousPrice: 0.78,
            }),
            getPriceForViruzMeNot({
                changeInCurrentlyHospitalized: 1000,
                changeInCriticalCommunityThreats: 0,
                previousPrice: 0.78,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeLessThan(changedPrice);
    });

    it("decrease the price when the total hospitalized goes down", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForViruzMeNot({
                changeInCurrentlyHospitalized: 0,
                changeInCriticalCommunityThreats: 0,
                previousPrice: 0.78,
            }),
            getPriceForViruzMeNot({
                changeInCurrentlyHospitalized: -1000,
                changeInCriticalCommunityThreats: 0,
                previousPrice: 0.78,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeGreaterThan(changedPrice);
    });

    it("has a higher price when the previous price is higher", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForViruzMeNot({
                changeInCurrentlyHospitalized: 5000,
                changeInCriticalCommunityThreats: 0,
                previousPrice: 0.78,
            }),
            getPriceForViruzMeNot({
                changeInCurrentlyHospitalized: 5000,
                changeInCriticalCommunityThreats: 0,
                previousPrice: 1.56,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeLessThan(changedPrice);
    });
});
