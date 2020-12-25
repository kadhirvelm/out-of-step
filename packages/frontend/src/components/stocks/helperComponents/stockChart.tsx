import { NonIdealState } from "@blueprintjs/core";
import { IPriceHistoryInBuckets, ITimeBucket } from "@stochastic-exchange/api";
import Chartist from "chartist";
import classNames from "classnames";
import { times } from "lodash-es";
import * as React from "react";
import { formatDollarForGraph } from "../../../utils/formatNumber";
import { customTapValueIndicator } from "./customTapValueIndicator";
import styles from "./stockChart.module.scss";

export const StockChart: React.FC<{
    previousClosePrice: number | undefined;
    pricePoints: IPriceHistoryInBuckets[];
    timeBucket: ITimeBucket;
}> = React.memo(({ previousClosePrice, pricePoints, timeBucket }) => {
    if (pricePoints.length === 0) {
        return (
            <div className={styles.chartContainer}>
                <NonIdealState description="No price points to display." />
            </div>
        );
    }

    const chartRef = React.useRef<HTMLDivElement>(null);

    const maybeIncludeBaselineFromYesterday =
        timeBucket === "day" ? times(pricePoints.length, () => ({ value: previousClosePrice ?? 0 })) : [];

    const minimumOfGraph = Math.min(
        ...maybeIncludeBaselineFromYesterday.map(p => p.value),
        ...pricePoints.map(p => p.dollarValue),
    );

    const stockConditionalFormattingClassName = () => {
        const baselineValue =
            timeBucket === "day" ? maybeIncludeBaselineFromYesterday.slice(-1)[0].value : pricePoints[0].dollarValue;
        const currentValue = pricePoints.slice(-1)[0].dollarValue;

        return {
            [styles.positiveTrend]: currentValue > baselineValue,
            [styles.negativeTrend]: currentValue < baselineValue,
        };
    };

    const plotLineGraph = () => {
        if (chartRef.current == null) {
            return;
        }

        // eslint-disable-next-line no-new
        new Chartist.Line(
            chartRef.current,
            {
                labels: [],
                series: [
                    [...pricePoints.map(p => ({ value: p.dollarValue, meta: p.timestamp }))],
                    maybeIncludeBaselineFromYesterday,
                ],
            },
            {
                axisX: {
                    showGrid: false,
                },
                axisY: {
                    labelInterpolationFnc: (value: number): string => formatDollarForGraph(value),
                    low: minimumOfGraph,
                    showGrid: true,
                    type: Chartist.AutoScaleAxis,
                },
                classNames: { area: styles.area, line: styles.line, point: styles.point },
                fullWidth: true,
                height: chartRef.current.clientHeight,
                lineSmooth: false,
                low: 0,
                showArea: true,
                plugins: [customTapValueIndicator()],
            },
        );
    };

    React.useEffect(() => {
        plotLineGraph();
    }, [pricePoints]);

    return <div className={classNames(styles.chartContainer, stockConditionalFormattingClassName())} ref={chartRef} />;
});
