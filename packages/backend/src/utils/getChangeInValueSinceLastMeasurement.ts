/**
 * Where a positive number means the current value has gone up since the previous measurement.
 */
export function getChangeInValueSinceLastMeasurement(
    currentMeasurement: number,
    previousMeasurement: number | undefined,
) {
    return currentMeasurement - (previousMeasurement ?? currentMeasurement);
}
