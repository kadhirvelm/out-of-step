import { Button, Spinner } from "@blueprintjs/core";
import { capitalize } from "lodash-es";
import * as React from "react";
import {
    StocksFrontendService,
    TransactionFrontendService,
    IStockWithDollarValue,
    IOwnedStock,
} from "@stochastic-exchange/api";
import { connect } from "react-redux";
import { callOnPrivateEndpoint } from "../../utils/callOnPrivateEndpoint";
import { executePrivateEndpoint } from "../../utils/executePrivateEndpoint";
import styles from "./stockInformation.module.scss";
import { IStoreState } from "../../store/state";
import { selectUserOwnedStock } from "../../selectors/selectUserOwnedStock";
import { formatNumber } from "../../utils/formatNumber";

interface IStoreProps {
    cashOnHand: number | undefined;
    userOwnedStockOfStockWithLatestPrice: IOwnedStock | undefined;
}

interface IOwnProps {
    goBackToViewingAllStock: () => void;
    stockWithLatestPrice: IStockWithDollarValue;
}

const TransactStock: React.FC<{
    cashOnHand: number | undefined;
    stockWithLatestPrice: IStockWithDollarValue;
    userOwnedStockOfStockWithLatestPrice: IOwnedStock | undefined;
}> = ({ cashOnHand, stockWithLatestPrice, userOwnedStockOfStockWithLatestPrice }) => {
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
        <div className={styles.transactContainer}>
            <span className={styles.yourPortfolioLabel}>Your portfolio</span>
            <div className={styles.transactInformationContainer}>
                <div className={styles.rowContainer}>
                    <div className={styles.transactColumnContainer}>
                        <div className={styles.transactRowContainer}>
                            <div className={styles.transactLabel}>
                                <span className={styles.label}>Cash on hand:</span>
                                <span>${cashOnHand?.toLocaleString()}</span>
                            </div>
                            <div className={styles.transactButtonContainer}>
                                <Button
                                    className={styles.transactButton}
                                    disabled={(cashOnHand ?? 0) < stockWithLatestPrice.dollarValue}
                                    intent="success"
                                    text="Buy"
                                    onClick={onBuy}
                                />
                            </div>
                        </div>
                        <div className={styles.transactRowContainer}>
                            <div className={styles.transactLabel}>
                                <span className={styles.label}>You own:</span>
                                <span>{userOwnedStockOfStockWithLatestPrice?.quantity ?? 0} shares</span>
                            </div>
                            <div className={styles.transactButtonContainer}>
                                <Button
                                    className={styles.transactButton}
                                    disabled={
                                        userOwnedStockOfStockWithLatestPrice?.quantity === undefined ||
                                        userOwnedStockOfStockWithLatestPrice.quantity <= 0
                                    }
                                    intent="primary"
                                    text="Sell"
                                    onClick={onSell}
                                />
                                <Button className={styles.transactButton} disabled text="Limit order" />
                            </div>
                        </div>
                    </div>
                </div>
                <Button
                    className={styles.viewTransactionHistory}
                    disabled
                    minimal
                    text="View your transaction history"
                />
            </div>
        </div>
    );
};

const UnconnectedStockInformation: React.FC<IStoreProps & IOwnProps> = ({
    cashOnHand,
    goBackToViewingAllStock,
    stockWithLatestPrice,
    userOwnedStockOfStockWithLatestPrice,
}) => {
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

    const maybeRenderTransactStock = () => {
        if (stockWithLatestPrice.status === "ACQUIRED") {
            return null;
        }

        return (
            <TransactStock
                cashOnHand={cashOnHand}
                stockWithLatestPrice={stockWithLatestPrice}
                userOwnedStockOfStockWithLatestPrice={userOwnedStockOfStockWithLatestPrice}
            />
        );
    };

    const stockPrices = stockInformation.priceHistory.map(p => p.dollarValue);

    return (
        <div className={styles.stockInformationContainer}>
            {renderBackButton()}
            <div className={styles.stockDetailsContainer}>
                <span className={styles.stockName}>{stockWithLatestPrice.name}</span>
                <span className={styles.stockLatestPrice}>${stockWithLatestPrice.dollarValue.toFixed(2)}</span>
            </div>
            <div className={styles.pricePointsContainer}>
                {stockInformation.priceHistory.map(price => (
                    <div className={styles.singlePricePoint} key={price.id}>
                        <span>${price.dollarValue.toFixed(2)}</span>
                        <span>{new Date(price.timestamp).toLocaleString()}</span>
                    </div>
                ))}
            </div>
            <div className={styles.basicInformationContainer}>
                <div className={styles.columnContainer}>
                    <div className={styles.rowContainer}>
                        <span className={styles.label}>Market cap:</span>
                        <span>
                            ${formatNumber(stockWithLatestPrice.dollarValue * stockWithLatestPrice.totalQuantity)}
                        </span>
                    </div>
                    <div className={styles.rowContainer}>
                        <span className={styles.label}>Total shares:</span>
                        <span>{formatNumber(stockWithLatestPrice.totalQuantity)}</span>
                    </div>
                    <div className={styles.rowContainer}>
                        <span className={styles.label}>Available shares:</span>
                        <span>
                            {formatNumber(stockWithLatestPrice.totalQuantity - stockInformation.ownedStockQuantity)}
                        </span>
                    </div>
                </div>
                <div className={styles.columnContainer}>
                    <div className={styles.rowContainer}>
                        <span className={styles.label}>High:</span>
                        <span>${Math.max(...stockPrices).toFixed(2)}</span>
                    </div>
                    <div className={styles.rowContainer}>
                        <span className={styles.label}>Low:</span>
                        <span>${Math.min(...stockPrices).toFixed(2)}</span>
                    </div>
                </div>
            </div>
            {maybeRenderTransactStock()}
            <Button className={styles.moveToOtherPanels} disabled minimal text="See stock information" />
        </div>
    );
};

function mapStateToProps(store: IStoreState, ownProps: IOwnProps): IStoreProps {
    return {
        cashOnHand: store.account.userAccount?.cashOnHand,
        userOwnedStockOfStockWithLatestPrice: selectUserOwnedStock(ownProps.stockWithLatestPrice)(store),
    };
}

export const StockInformation = connect(mapStateToProps)(UnconnectedStockInformation);
