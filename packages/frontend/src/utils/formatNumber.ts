import * as d3Format from "d3-format";

export function formatNumber(number: number) {
    return d3Format
        .format(".3s")(number)
        .replace(/G/, "B");
}
