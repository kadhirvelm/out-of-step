import * as chartist from "chartist";
import { range } from "lodash-es";
import { constrainNumber } from "../../utils/constrainNumber";
import { formatDollar } from "../../utils/formatNumber";
import styles from "./customTapValueIndicator.module.scss";

const PADDING_ON_GRAPH = {
    bottom: 37,
    lower: 50,
    upper: 15,
};

function calculateYPercentUsingLinearRange(clientX: number, bounds: [number, number]) {
    return (clientX - PADDING_ON_GRAPH.lower - bounds[0]) / (bounds[1] - bounds[0]);
}

function calculatePercentBetweenRanges(percent: number, lowerBound: number, upperBound: number) {
    return lowerBound + (upperBound - lowerBound) * percent;
}

export function customTapValueIndicator() {
    return (chart: chartist.IChartistLineChart) => {
        if (!(chart instanceof chartist.Line)) {
            return;
        }

        const startAndStopIndicesBetweenDataPoints: Array<[number, number]> = [];
        let underlyingData: Array<{ value: number; meta: string }> = [];
        let yAxisRange: [number, number] = [0.1, 0.1];
        let yAxisLength: number = 0;
        const mainChartContainer: HTMLDivElement = chart.container;

        const indicator = document.createElement("div");
        const indicatorPoint = document.createElement("div");
        const valueLabel = document.createElement("div");

        const findWhichIndexClientXIsBetween = (clientX: number) =>
            startAndStopIndicesBetweenDataPoints.findIndex(index => clientX - PADDING_ON_GRAPH.lower < index[1]);

        const renderPointOnValueLabel = (dollarValue: number, point: { value: number; meta: string }) => {
            valueLabel.textContent = `${formatDollar(dollarValue)} (${new Date(point.meta).toLocaleString()})`;
        };

        const moveIndicatorPoint = (clientX: number, calculatedYValue: number) => {
            indicatorPoint.style.left = `${clientX}px`;

            const percentOfHeight = (calculatedYValue - yAxisRange[0]) / (yAxisRange[1] - yAxisRange[0]);
            indicatorPoint.style.bottom = `${yAxisLength * percentOfHeight + PADDING_ON_GRAPH.bottom}px`;
        };

        const moveValueToPoint = (clientX: number) => {
            const whichIndexTouchIsBetween = findWhichIndexClientXIsBetween(clientX);
            if (whichIndexTouchIsBetween === -1) {
                return;
            }

            const calculatedYPercent = calculateYPercentUsingLinearRange(
                clientX,
                startAndStopIndicesBetweenDataPoints[whichIndexTouchIsBetween],
            );
            const calculatedYValue = calculatePercentBetweenRanges(
                calculatedYPercent,
                underlyingData[whichIndexTouchIsBetween].value,
                underlyingData[whichIndexTouchIsBetween + 1].value,
            );

            indicator.style.left = `${clientX}px`;
            renderPointOnValueLabel(
                calculatedYValue,
                calculatedYPercent < 0.5
                    ? underlyingData[whichIndexTouchIsBetween]
                    : underlyingData[whichIndexTouchIsBetween + 1],
            );
            moveIndicatorPoint(clientX, calculatedYValue);
        };

        const onTouchMove = (event: TouchEvent) => {
            const positionOnXAxis = constrainNumber(
                event.touches[0].clientX,
                PADDING_ON_GRAPH.lower,
                mainChartContainer.clientWidth - PADDING_ON_GRAPH.upper,
            );

            moveValueToPoint(positionOnXAxis);

            event.stopPropagation();
            event.preventDefault();
        };

        mainChartContainer.addEventListener("touchstart", onTouchMove);
        mainChartContainer.addEventListener("touchmove", onTouchMove);

        const initialize = () => {
            indicator.className = styles.valueIndicator;
            indicatorPoint.className = styles.valueIndicatorPoint;
            valueLabel.className = styles.valueLabel;

            mainChartContainer.appendChild(indicator);
            mainChartContainer.appendChild(indicatorPoint);
            mainChartContainer.appendChild(valueLabel);
        };

        initialize();

        chart.on("created", (data: any) => {
            yAxisLength = data.axisY.axisLength;
            yAxisRange = [data.axisY.range.min, data.axisY.range.max];

            moveValueToPoint(PADDING_ON_GRAPH.lower);
        });

        chart.on("data", ({ data: { series } }: any) => {
            [underlyingData] = series;
            const widthPerContainer =
                (mainChartContainer.clientWidth - PADDING_ON_GRAPH.lower - PADDING_ON_GRAPH.upper) /
                (underlyingData.length - 1);

            range(0, underlyingData.length - 1, 1).forEach(width => {
                startAndStopIndicesBetweenDataPoints.push([width * widthPerContainer, (width + 1) * widthPerContainer]);
            });

            renderPointOnValueLabel(underlyingData[0].value, underlyingData[0]);
        });
    };
}
