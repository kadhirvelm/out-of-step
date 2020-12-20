function sendUndefinedOrNumber(number: number) {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(number)) {
        return undefined;
    }

    return number;
}

export function averageOfNumberArray(numArray: number[] | undefined) {
    if (numArray === undefined) {
        return undefined;
    }

    return sendUndefinedOrNumber(numArray.reduce((p, n) => p + n, 0) / numArray.length);
}

export function averageOfObjectsArray(array: any[] | undefined, key: string) {
    if (array === undefined) {
        return undefined;
    }

    return sendUndefinedOrNumber(array.reduce((p, n) => p + n[key], 0) / array.length);
}
