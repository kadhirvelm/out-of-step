import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { getNextTimeWithinMarketHours } from "../getNextTimeWithinMarketHours";

dayjs.extend(utc);
dayjs.extend(timezone);

// eslint-disable-next-line jest/no-disabled-tests
describe.skip("can correctly increment the time", () => {
    it("can return a valid time", () => {
        const currentDate = dayjs("2020-12-15 15:00:00 PST", "America/Los_Angeles");
        expect(getNextTimeWithinMarketHours(currentDate).valueOf()).toEqual(currentDate.valueOf());
    });

    it("can increment to the next day", () => {
        const currentDate = dayjs("2020-12-15 22:00:00 PST", "America/Los_Angeles");
        expect(getNextTimeWithinMarketHours(currentDate).valueOf()).toEqual(
            dayjs("2020-12-16 06:00:00 PST", "America/Los_Angeles").valueOf(),
        );
    });

    it("can increment to the start of the market", () => {
        const currentDate = dayjs("2020-12-15 03:00:00 PST", "America/Los_Angeles");
        expect(getNextTimeWithinMarketHours(currentDate).valueOf()).toEqual(
            dayjs("2020-12-15 06:00:00 PST", "America/Los_Angeles").valueOf(),
        );
    });

    it("can increment to the start of the next market day", () => {
        const currentDate = dayjs("2020-12-18 21:00:00 PST", "America/Los_Angeles");
        expect(getNextTimeWithinMarketHours(currentDate).valueOf()).toEqual(
            dayjs("2020-12-19 06:00:00 PST", "America/Los_Angeles").valueOf(),
        );
    });

    it("can increment to the start of the next market day take 2", () => {
        const currentDate = dayjs("2020-12-19 21:00:00 PST", "America/Los_Angeles");
        expect(getNextTimeWithinMarketHours(currentDate).valueOf()).toEqual(
            dayjs("2020-12-20 06:00:00 PST", "America/Los_Angeles").valueOf(),
        );
    });

    it("can return a valid time in Europe/London", () => {
        const currentDate = dayjs("2020-12-15 23:00 GMT", "Europe/London");
        expect(getNextTimeWithinMarketHours(currentDate).valueOf()).toEqual(currentDate.valueOf());
    });

    it("can stay at the current day in Europe/London", () => {
        const currentDate = dayjs("2020-12-19 05:00:00 GMT", "Europe/London");
        expect(getNextTimeWithinMarketHours(currentDate).valueOf()).toEqual(
            dayjs("2020-12-19 06:00:00 PST", "America/Los_Angeles").valueOf(),
        );
    });

    it("can stay at the current day take 2 in Europe/London", () => {
        const currentDate = dayjs("2020-12-19 23:00:00 GMT", "Europe/London");
        expect(getNextTimeWithinMarketHours(currentDate).valueOf()).toEqual(
            dayjs("2020-12-19 15:00:00 PST", "America/Los_Angeles").valueOf(),
        );
    });
});
