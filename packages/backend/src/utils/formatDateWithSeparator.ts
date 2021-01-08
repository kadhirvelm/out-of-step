const ensureTwoDigits = (num: number) => (num.toString().length === 1 ? `0${num}` : num.toString());

export const formatDateWithSeparator = (date: Date, separator?: string) => {
    const separatorString = separator ?? "-";
    return `${date.getFullYear()}${separatorString}${ensureTwoDigits(
        date.getMonth() + 1,
    )}${separatorString}${ensureTwoDigits(date.getDate())}`;
};
