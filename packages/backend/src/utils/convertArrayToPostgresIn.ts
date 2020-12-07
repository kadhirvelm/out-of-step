export function convertArrayToPostgresIn(baseArray: string[]) {
    return `(${baseArray.map(value => `'${value}'`).join(",")})`;
}
