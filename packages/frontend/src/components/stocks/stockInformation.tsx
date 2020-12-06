import { Button, Spinner } from "@blueprintjs/core";
import { capitalize } from "lodash-es";
import * as React from "react";
import { StocksFrontendService, TransactionFrontendService } from "../../../../api/dist";
import { IStockWithDollarValue } from "../../common/types";
import { callOnPrivateEndpoint } from "../../utils/callOnPrivateEndpoint";
import { executePrivateEndpoint } from "../../utils/executePrivateEndpoint";
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

    const onBuy = () => {
        executePrivateEndpoint(TransactionFrontendService.createExchangeTransaction, {
            price: stockWithLatestPrice.priceHistoryId,
            purchasedQuantity: 100,
            soldQuantity: 0,
            stock: stockWithLatestPrice.id,
        });
    };

    const onSell = () => {
        executePrivateEndpoint(TransactionFrontendService.createExchangeTransaction, {
            price: stockWithLatestPrice.priceHistoryId,
            purchasedQuantity: 0,
            soldQuantity: 100,
            stock: stockWithLatestPrice.id,
        });
    };

    return (
        <div className={styles.stockInformationContainer}>
            {renderBackButton()}
            <div className={styles.stockDetailsContainer}>
                <span className={styles.stockName}>{stockWithLatestPrice.name}</span>
                <span className={styles.stockLatest}>
                    {capitalize(stockWithLatestPrice.status)} at ${stockWithLatestPrice.dollarValue.toFixed(2)}
                </span>
            </div>
            <Button text="Buy 100" onClick={onBuy} />
            <Button text="Sell 100" onClick={onSell} />
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
