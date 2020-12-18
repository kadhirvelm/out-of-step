import { getNextTimeWithinMarketHours } from "../getNextTimeWithinMarketHours";

describe("can correctly increment the time", () => {
    it("can return a valid time", () => {
        const currentDate = new Date("2020-12-15 15:00:00 GMT-08:00");
        expect(getNextTimeWithinMarketHours(currentDate).valueOf()).toEqual(currentDate.valueOf());
    });

    it("can increment to the next day", () => {
        const currentDate = new Date("2020-12-15 22:00:00 GMT-08:00");
        expect(getNextTimeWithinMarketHours(currentDate).valueOf()).toEqual(
            new Date("2020-12-16 06:00:00 GMT-08:00").valueOf(),
        );
    });

    it("can increment to the start of the market", () => {
        const currentDate = new Date("2020-12-15 03:00:00 GMT-08:00");
        expect(getNextTimeWithinMarketHours(currentDate).valueOf()).toEqual(
            new Date("2020-12-15 06:00:00 GMT-08:00").valueOf(),
        );
    });

    it("can increment to the start of the next market day", () => {
        const currentDate = new Date("2020-12-18 21:00:00 GMT-08:00");
        expect(getNextTimeWithinMarketHours(currentDate).valueOf()).toEqual(
            new Date("2020-12-21 06:00:00 GMT-08:00").valueOf(),
        );
    });

    it("can increment to the start of the next market day take 2", () => {
        const currentDate = new Date("2020-12-19 15:00:00 GMT-08:00");
        expect(getNextTimeWithinMarketHours(currentDate).valueOf()).toEqual(
            new Date("2020-12-21 06:00:00 GMT-08:00").valueOf(),
        );
    });
});
