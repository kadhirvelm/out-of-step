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

export function getNextTimeWithinMarketHours(nextTime: Date): Date {
    if (!MARKET_HOURS.openDays.includes(nextTime.getDay()) || nextTime.getHours() >= MARKET_HOURS.endTime) {
        return getNextTimeWithinMarketHours(goToNextDay(nextTime));
    }

    if (nextTime.getHours() < MARKET_HOURS.startTime) {
        return getNextTimeWithinMarketHours(goToMarketStartTime(nextTime));
    }

    return nextTime;
}
