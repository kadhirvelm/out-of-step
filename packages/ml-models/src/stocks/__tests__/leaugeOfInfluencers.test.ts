import { assert } from "../../utils/testUtils";
import { getPriceForLeagueOfInfluencers } from "../leagueOfInfluencers";

describe("it can price Leauge of Influencers as expected", () => {
    it("increases the price when government bills goes up", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForLeagueOfInfluencers({
                changeInGovernmentBills: 0,
                changeInPeopleAffectedByGunViolence: 0,
                previousPrice: 200,
            }),
            getPriceForLeagueOfInfluencers({
                changeInGovernmentBills: 10,
                changeInPeopleAffectedByGunViolence: 0,
                previousPrice: 200,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeLessThan(changedPrice);
    });

    it("decreases the price when government bills go down", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForLeagueOfInfluencers({
                changeInGovernmentBills: 0,
                changeInPeopleAffectedByGunViolence: 0,
                previousPrice: 200,
            }),
            getPriceForLeagueOfInfluencers({
                changeInGovernmentBills: -10,
                changeInPeopleAffectedByGunViolence: 0,
                previousPrice: 200,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeGreaterThan(changedPrice);
    });

    it("increases the price when gun violence goes down", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForLeagueOfInfluencers({
                changeInGovernmentBills: 0,
                changeInPeopleAffectedByGunViolence: 0,
                previousPrice: 200,
            }),
            getPriceForLeagueOfInfluencers({
                changeInGovernmentBills: 0,
                changeInPeopleAffectedByGunViolence: -10,
                previousPrice: 200,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeLessThan(changedPrice);
    });

    it("decreases the price when gun violence goes up", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForLeagueOfInfluencers({
                changeInGovernmentBills: 0,
                changeInPeopleAffectedByGunViolence: 0,
                previousPrice: 200,
            }),
            getPriceForLeagueOfInfluencers({
                changeInGovernmentBills: 0,
                changeInPeopleAffectedByGunViolence: 10,
                previousPrice: 200,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeGreaterThan(changedPrice);
    });

    it("changes by the same amount regardless of previous price", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForLeagueOfInfluencers({
                changeInGovernmentBills: 10,
                changeInPeopleAffectedByGunViolence: 0,
                previousPrice: 200,
            }),
            getPriceForLeagueOfInfluencers({
                changeInGovernmentBills: 10,
                changeInPeopleAffectedByGunViolence: 0,
                previousPrice: 400,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);

        const changeInPriceOriginal = originalPrice - 200;
        expect(changedPrice - 400 - changeInPriceOriginal).toBeLessThan(changeInPriceOriginal * 0.025);
    });
});
