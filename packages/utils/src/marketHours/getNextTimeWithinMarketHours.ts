import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

// NOTE: Market hours are in PST, but the server exists in UTC
const MARKET_HOURS = {
    startTime: 6,
    endTime: 21,
    openDays: [1, 2, 3, 4, 5, 6],
};

const goToMarketStartTime = (startDate: dayjs.Dayjs) => {
    return startDate
        .set("hour", MARKET_HOURS.startTime)
        .set("minute", 0)
        .set("second", 0);
};

const goToNextDay = (startDate: dayjs.Dayjs) => {
    return goToMarketStartTime(startDate).add(1, "day");
};

export function getNextTimeWithinMarketHours(nextTime: dayjs.Dayjs): dayjs.Dayjs {
    // Note: we re-parse in dayjs to add the "tz" plugin
    const dateAdjustedToPst = dayjs(nextTime).tz("America/Los_Angeles");

    if (!MARKET_HOURS.openDays.includes(dateAdjustedToPst.day()) || dateAdjustedToPst.hour() >= MARKET_HOURS.endTime) {
        return getNextTimeWithinMarketHours(goToNextDay(dateAdjustedToPst));
    }

    if (dateAdjustedToPst.hour() < MARKET_HOURS.startTime) {
        return getNextTimeWithinMarketHours(goToMarketStartTime(dateAdjustedToPst));
    }

    return dateAdjustedToPst;
}

export function isTimeInMarketHours(nextTime: Date): boolean {
    const dayjsTime = dayjs(nextTime);

    return dayjsTime.valueOf() === getNextTimeWithinMarketHours(dayjsTime).valueOf();
}

export function getNextTimeWithinMarketHoursJSDate(nextTime: Date): Date {
    return new Date(getNextTimeWithinMarketHours(dayjs(nextTime)).valueOf());
}

export function isMarketOpenOnDateDay(date: Date): boolean {
    const dayjsTime = dayjs(date).tz("America/Los_Angeles");
    return MARKET_HOURS.openDays.includes(dayjsTime.day());
}

export function goToStartOfMarketOpenHours(date: Date): Date {
    const dayjsTime = dayjs(date).tz("America/Los_Angeles");
    return new Date(goToMarketStartTime(dayjsTime).valueOf());
}
