import * as React from "react";
import { getNextTimeWithinMarketHoursJSDate, isTimeInMarketHours } from "@stochastic-exchange/utils";
import classNames from "classnames";
import styles from "./marketStatus.module.scss";

export const MarketStatus: React.FC<{}> = () => {
    const currentTime = new Date();

    if (isTimeInMarketHours(currentTime)) {
        return (
            <div className={classNames(styles.mainContainer, styles.marketOpen)}>
                The market is currently open and actively pricing.
            </div>
        );
    }

    return (
        <div className={classNames(styles.mainContainer, styles.marketClosed)}>
            <div>
                The market is currently closed, it will open again on
                <span className={styles.marketClosedDate}>
                    {getNextTimeWithinMarketHoursJSDate(currentTime).toLocaleString()}
                </span>
                . You can still trade stocks at this time.
            </div>
        </div>
    );
};
