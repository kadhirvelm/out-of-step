import { Button, Spinner } from "@blueprintjs/core";
import { capitalize } from "lodash-es";
import * as React from "react";
import { StocksFrontendService } from "../../../../api/dist";
import { IStockWithDollarValue } from "../../common/types";
import { callOnPrivateEndpoint } from "../../utils/callOnPrivateEndpoint";
import styles from "./stockInformation.module.scss";

export const StockInformation: React.FC<{
    goBackToViewingAllStock: () => void;
    stockWithLatestPrice: IStockWithDollarValue;
}> = ({ goBackToViewingAllStock, stockWithLatestPrice }) => {
    const stockInformation = callOnPrivateEndpoint(StocksFrontendService.getSingleStockInformation, {
        stock: stockWithLatestPrice.id,
        bucket: "week",
    });

    const renderBackButton = () => {
        return (
            <div className={styles.backArrowContainer}>
                <Button icon="arrow-left" minimal onClick={goBackToViewingAllStock} />
            </div>
        );
    };

    if (stockInformation === undefined) {
        return (
            <div className={styles.stockInformationContainer}>
                {renderBackButton()}
                <div className={styles.spinnerContainer}>
                    <Spinner />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.stockInformationContainer}>
            {renderBackButton()}
            <div className={styles.stockDetailsContainer}>
                <span className={styles.stockName}>{stockWithLatestPrice.name}</span>
                <span className={styles.stockLatest}>
                    {capitalize(stockWithLatestPrice.status)} at ${stockWithLatestPrice.dollarValue.toFixed(2)}
                </span>
            </div>
            <div className={styles.historyLabel}>History</div>
            <div className={styles.pricePointsContainer}>
                {stockInformation.priceHistory.map(price => (
                    <div className={styles.singlePricePoint} key={price.id}>
                        <span>${price.dollarValue.toFixed(2)}</span>
                        <span>{new Date(price.timestamp).toLocaleString()}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
