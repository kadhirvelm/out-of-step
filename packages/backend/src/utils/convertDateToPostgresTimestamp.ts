export function convertDateToPostgresTimestamp(date: Date) {
    return `TO_TIMESTAMP(${Math.round(date.valueOf() / 1000.0 - 5)})`;
}
