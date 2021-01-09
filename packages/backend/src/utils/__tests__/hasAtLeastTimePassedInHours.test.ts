import { hasAtLeastTimePassedInHours } from "../hasAtLeastTimePassedInHours";

describe("hasAtLeastTimePassedInHours", () => {
    it("works as expected", () => {
        const nowDate = new Date("2021-01-05 11:30:00 AM");
        const compareAgainstDate = new Date("2021-01-05 10:00:00 AM");

        expect(hasAtLeastTimePassedInHours(nowDate, compareAgainstDate, 1)).toBeTruthy();
        expect(hasAtLeastTimePassedInHours(nowDate, compareAgainstDate, 2)).toBeFalsy();
    });

    it("works as expected in the negative", () => {
        const nowDate = new Date("2021-01-05 10:00:00 AM");
        const compareAgainstDate = new Date("2021-01-05 11:30:00 AM");

        expect(hasAtLeastTimePassedInHours(nowDate, compareAgainstDate, -1)).toBeFalsy();
        expect(hasAtLeastTimePassedInHours(nowDate, compareAgainstDate, -2)).toBeTruthy();
    });
});
