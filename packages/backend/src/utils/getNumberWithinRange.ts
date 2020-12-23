export function getNumberWithinRange(baseNumber: number, min: number, max: number): number {
    return Math.max(Math.min(baseNumber, max), min);
}
