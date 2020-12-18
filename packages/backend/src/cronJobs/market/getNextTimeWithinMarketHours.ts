// NOTE: Market hours are in PST, but the server exists in UTC
const MARKET_HOURS = {
    startTime: 6,
    endTime: 21,
    openDays: [1, 2, 3, 4, 5],
};

const goToMarketStartTime = (startDate: Date) => {
    const newTime = new Date(startDate);

    newTime.setHours(MARKET_HOURS.startTime);

    return newTime;
};

const goToNextDay = (startDate: Date) => {
    const newTime = goToMarketStartTime(startDate);

    newTime.setDate(startDate.getDate() + 1);

    return newTime;
};

const adjustDateToPST = (date: Date) => new Date(date.valueOf() - (480 - date.getTimezoneOffset()) * 1000 * 60);

export function getNextTimeWithinMarketHours(nextTime: Date): Date {
    const dateAdjustedToPst = adjustDateToPST(nextTime);

    if (
        !MARKET_HOURS.openDays.includes(dateAdjustedToPst.getDay()) ||
        dateAdjustedToPst.getHours() >= MARKET_HOURS.endTime
    ) {
        return getNextTimeWithinMarketHours(goToNextDay(nextTime));
    }

    if (dateAdjustedToPst.getHours() < MARKET_HOURS.startTime) {
        return getNextTimeWithinMarketHours(goToMarketStartTime(nextTime));
    }

    return nextTime;
}
