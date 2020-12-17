export function assert<T>(condition: T): asserts condition {
    if (!condition) {
        throw new Error("Something went wrong");
    }
}
