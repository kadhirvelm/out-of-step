export const changeDateByDays = (date: Date, totalDays: number) => {
    return new Date(date.valueOf() + 1000 * 60 * 60 * 24 * totalDays);
};
