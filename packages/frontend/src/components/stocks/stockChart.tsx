import { IPriceHistoryInBuckets, ITimeBucket } from "@stochastic-exchange/api";
import * as React from "react";
import Chartist from "chartist";
import styles from "./stockChart.module.scss";
import { formatNumber } from "../../utils/formatNumber";

export const StockChart: React.FC<{ pricePoints: IPriceHistoryInBuckets[]; timeBucket: ITimeBucket }> = React.memo(
    ({ pricePoints, timeBucket }) => {
        const chartRef = React.useRef<HTMLDivElement>(null);

        const firstIndex = Math.round(pricePoints.length * 0.05);
        const secondIndex = Math.round(pricePoints.length * 0.4);
        const thirdIndex = Math.round(pricePoints.length * 0.75);

        const plotLineGraph = () => {
            if (chartRef.current == null) {
                return;
            }

            // eslint-disable-next-line no-new
            new Chartist.Line(
                chartRef.current,
                {
                    labels: [...pricePoints.map(p => p.timestamp)],
                    series: [[...pricePoints.map(p => p.dollarValue)]],
                },
                {
                    axisX: {
                        labelInterpolationFnc: (value: number, index: number) => {
                            if (index !== firstIndex && index !== secondIndex && index !== thirdIndex) {
                                return null;
                            }

                            return timeBucket === "day"
                                ? new Date(value).toLocaleTimeString()
                                : new Date(value).toLocaleDateString();
                        },
                        showGrid: false,
                    },
                    axisY: {
                        labelInterpolationFnc: (value: number): string => `$${formatNumber(value)}`,
                        showGrid: true,
                    },
                    classNames: { area: styles.area, line: styles.line },
                    height: chartRef.current.clientHeight,
                    lineSmooth: true,
                    low: 0,
                    showPoint: false,
                    showArea: true,
                },
            );
        };

        React.useEffect(() => {
            plotLineGraph();
        }, [pricePoints]);

        return <div className={styles.chartContainer} ref={chartRef} />;
    },
);
