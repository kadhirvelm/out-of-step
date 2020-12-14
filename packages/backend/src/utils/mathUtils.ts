function sendUndefinedOrNumber(number: number) {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(number)) {
        return undefined;
    }

    return number;
}

export function averageOfNumberArray(numArray: number[]) {
    return sendUndefinedOrNumber(numArray.reduce((p, n) => p + n, 0) / numArray.length);
}

export function averageOfObjectsArray(array: any[], key: string) {
    return sendUndefinedOrNumber(array.reduce((p, n) => p + n[key], 0) / array.length);
}
