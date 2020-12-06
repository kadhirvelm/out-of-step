import { Icon, Spinner } from "@blueprintjs/core";
import classNames from "classnames";
import { keyBy, pick } from "lodash-es";
import * as React from "react";
import { StocksFrontendService } from "../../../../api/dist";
import { IStockWithDollarValue } from "../../common/types";
import { callOnPrivateEndpoint } from "../../utils/callOnPrivateEndpoint";
import { formatNumber } from "../../utils/formatNumber";
import { StockInformation } from "./stockInformation";
import styles from "./stockManager.module.scss";

const getStocksWithPrice = (): IStockWithDollarValue[] => {
    const stocksAndPrices = callOnPrivateEndpoint(StocksFrontendService.getAllStocks, undefined);
    if (stocksAndPrices === undefined) {
        return [];
    }

    const keyedStocks = keyBy(stocksAndPrices.stocks, "id");
    const keyedPrices = keyBy(stocksAndPrices.priceHistory, "stock");

    const indexedStocks = Object.keys(keyedStocks).map(stockId => {
        const priceForStock = keyedPrices[stockId];

        return {
            ...keyedStocks[stockId],
            ...pick(priceForStock ?? {}, "timestamp", "dollarValue"),
            priceHistoryId: priceForStock.id,
        };
    });

    return indexedStocks.sort((a, b) => a.name.localeCompare(b.name));
};

export const StockManager: React.FC = () => {
    const [viewSingleStockInformation, setViewingSingleStockInformation] = React.useState<
        IStockWithDollarValue | undefined
    >(undefined);

    const allStocksWithPrice = getStocksWithPrice();

    if (allStocksWithPrice === undefined) {
        return (
            <div className={styles.spinnerContainer}>
                <Spinner />
            </div>
        );
    }

    const goBackToViewingAllStock = () => setViewingSingleStockInformation(undefined);

    if (viewSingleStockInformation !== undefined) {
        return (
            <StockInformation
                goBackToViewingAllStock={goBackToViewingAllStock}
                stockWithLatestPrice={viewSingleStockInformation}
            />
        );
    }

    const curriedSetViewSingleStockInformation = (stockInformation: IStockWithDollarValue) => () =>
        setViewingSingleStockInformation(stockInformation);

    return (
        <div className={styles.stocksContainer}>
            {allStocksWithPrice.map(stock => (
                <div
                    className={classNames(styles.singleStockContainer, {
                        [styles.acquiredStock]: stock.status === "ACQUIRED",
                    })}
                    key={stock.id}
                    onClick={curriedSetViewSingleStockInformation(stock)}
                >
                    <div className={styles.leftContainer}>
                        <span className={styles.stockTitle}>{stock.name}</span>
                        <span className={styles.stockMarketCap}>
                            {formatNumber((stock.dollarValue ?? 0) * stock.totalQuantity)}
                        </span>
                    </div>
                    <div className={styles.rightContainer}>
                        <span className={styles.currentPrice}>
                            {stock.status === "ACQUIRED" ? "Acquired" : `$${stock.dollarValue.toFixed(2)}`}
                        </span>
                        <Icon className={styles.chevronRightIndicator} icon="chevron-right" />
                    </div>
                </div>
            ))}
        </div>
    );
};
