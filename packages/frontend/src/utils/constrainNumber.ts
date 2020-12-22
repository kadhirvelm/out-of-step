export function constrainNumber(initialNumber: number, lowerBound: number, upperBound: number) {
    return Math.max(Math.min(initialNumber, upperBound), lowerBound);
}
