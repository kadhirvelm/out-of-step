import * as React from "react";
import { keyBy, merge } from "lodash-es";
import { Spinner } from "@blueprintjs/core";
import classNames from "classnames";
import { IPriceHistory, IStock, StocksFrontendService } from "../../../../api/dist";
import { checkIfIsError } from "../../utils/checkIfIsError";
import { getTokenInCookie } from "../../utils/tokenInCookies";
import styles from "./stockManager.module.scss";
import { formatNumber } from "../../utils/formatNumber";

const getAllStocks = async (setAllStocksWithPrice: (allStocksWithPrice: Array<IStock & IPriceHistory>) => void) => {
    const stocksAndPrices = await StocksFrontendService.getAllStocks(undefined, getTokenInCookie());
    const stocksChecked = checkIfIsError(stocksAndPrices);
    if (stocksChecked === undefined) {
        return;
    }

    const indexedStocks = merge(keyBy(stocksChecked.stocks, "id"), keyBy(stocksChecked.priceHistory, "stock"));
    setAllStocksWithPrice(Object.values(indexedStocks).sort((a, b) => a.name.localeCompare(b.name)));
};

export const StockManager: React.FC = () => {
    const [allStocksWithPrice, setAllStocksWithPrice] = React.useState<Array<IStock & IPriceHistory> | undefined>(
        undefined,
    );

    React.useEffect(() => {
        getAllStocks(setAllStocksWithPrice);
    }, []);

    if (allStocksWithPrice === undefined) {
        return (
            <div className={styles.spinnerContainer}>
                <Spinner />
            </div>
        );
    }

    return (
        <div className={styles.stocksContainer}>
            {allStocksWithPrice.map(stock => (
                <div
                    className={classNames(styles.singleStockContainer, {
                        [styles.acquiredStock]: stock.status === "ACQUIRED",
                    })}
                    key={stock.id}
                >
                    <div className={styles.leftContainer}>
                        <span className={styles.stockTitle}>{stock.name}</span>
                        <span className={styles.stockMarketCap}>
                            {formatNumber(stock.dollarValue * stock.totalQuantity)}
                        </span>
                    </div>
                    <div className={styles.rightContainer}>
                        <span className={styles.currentPrice}>
                            {stock.status === "ACQUIRED" ? "Acquired" : `$${stock.dollarValue}`}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};
