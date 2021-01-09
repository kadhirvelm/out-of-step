export function hasAtLeastTimePassedInHours(
    date: Date | number,
    compareToDate: Date | number,
    numberOfHours: number,
): boolean {
    const testAgainstNumber: number = typeof date === "number" ? date : date.valueOf();
    const compareAgainstNumber: number = typeof compareToDate === "number" ? compareToDate : compareToDate.valueOf();

    return (testAgainstNumber - compareAgainstNumber) / (1000 * 60 * 60) > numberOfHours;
}
