import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

// NOTE: Market hours are in PST, but the server exists in UTC
const MARKET_HOURS = {
    startTime: 6,
    endTime: 21,
    openDays: [1, 2, 3, 4, 5],
};

const goToMarketStartTime = (startDate: dayjs.Dayjs) => {
    return startDate.set("hour", MARKET_HOURS.startTime);
};

const goToNextDay = (startDate: dayjs.Dayjs) => {
    return goToMarketStartTime(startDate).add(1, "day");
};

export function getNextTimeWithinMarketHours(nextTime: dayjs.Dayjs): dayjs.Dayjs {
    const dateAdjustedToPst = nextTime.tz("America/Los_Angeles");

    if (!MARKET_HOURS.openDays.includes(dateAdjustedToPst.day()) || dateAdjustedToPst.hour() >= MARKET_HOURS.endTime) {
        return getNextTimeWithinMarketHours(goToNextDay(dateAdjustedToPst));
    }

    if (dateAdjustedToPst.hour() < MARKET_HOURS.startTime) {
        return getNextTimeWithinMarketHours(goToMarketStartTime(dateAdjustedToPst));
    }

    return dateAdjustedToPst;
}
