import { Button, NonIdealState } from "@blueprintjs/core";
import {
    IOwnedStock,
    IStockValueAtTransactionTime,
    IStockWithDollarValue,
    ITransactionHistoryComplete,
    TransactionFrontendService,
} from "@stochastic-exchange/api";
import classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { CompoundAction } from "redoodle";
import { Dispatch } from "redux";
import { Routes } from "../../common/routes";
import { selectUserOwnedStock } from "../../selectors/selectUserOwnedStock";
import { SetViewStockWithLatestPrice, SetViewTransactionsForStock } from "../../store/interface/actions";
import { IStoreState } from "../../store/state";
import { callOnPrivateEndpoint } from "../../utils/callOnPrivateEndpoint";
import { formatDollar } from "../../utils/formatNumber";
import styles from "./viewTransaction.module.scss";

interface IStoreProps {
    userOwnedStockOfStockWithLatestPrice: IOwnedStock | undefined;
    viewTransactionsForStock: IStockWithDollarValue | undefined;
}

interface IDispatchProps {
    setViewStockWithLatestPrice: (stockWithDollarValue: IStockWithDollarValue) => void;
}

const UnconnectViewTransactions: React.FC<IStoreProps & IDispatchProps> = ({
    userOwnedStockOfStockWithLatestPrice,
    setViewStockWithLatestPrice,
    viewTransactionsForStock,
}) => {
    const history = useHistory();

    if (viewTransactionsForStock === undefined) {
        history.push(Routes.STOCK);
        return null;
    }

    const goBackToStockInformationPage = () => setViewStockWithLatestPrice(viewTransactionsForStock);

    const transactionHistory = callOnPrivateEndpoint(TransactionFrontendService.viewTransactionsForStock, {
        stockId: viewTransactionsForStock.id,
    });

    const renderSingleTransaction = (transaction: ITransactionHistoryComplete & IStockValueAtTransactionTime) => {
        if (transaction.type === "acquisition-transaction") {
            return null;
        }

        if (transaction.type === "dividend-transaction") {
            return null;
        }

        return (
            <div
                className={classNames(styles.singleExchangeTransaction, {
                    [styles.netPurchase]: transaction.purchasedQuantity > 0,
                    [styles.netSold]: transaction.soldQuantity > 0,
                })}
            >
                <div className={styles.leftContainer}>
                    <div className={styles.timestampAndExchangeContainer}>
                        <span className={styles.timestamp}>{new Date(transaction.timestamp).toLocaleString()}</span>
                        <div className={styles.exchangeContainer}>
                            {transaction.purchasedQuantity > 0 && (
                                <span>Purchased {transaction.purchasedQuantity} shares</span>
                            )}
                            {transaction.soldQuantity > 0 && <span>Sold {transaction.soldQuantity} shares</span>}
                            <span className={styles.atPriceContainer}>
                                at ${transaction.priceHistory.dollarValue.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
                <div className={styles.rightContainer}>
                    <span
                        className={classNames(styles.stockValueAtTransaction, {
                            [styles.positiveStockValue]: transaction.stockValueAtTransactionTime > 0,
                            [styles.negativeStockValue]: transaction.stockValueAtTransactionTime < 0,
                        })}
                    >
                        {formatDollar(transaction.stockValueAtTransactionTime)}
                    </span>
                </div>
            </div>
        );
    };

    const maybeRenderTransactionHistory = () => {
        if (transactionHistory?.length === 0) {
            return <NonIdealState description="No transaction to display" />;
        }

        return transactionHistory?.map(renderSingleTransaction);
    };

    const totalStockWorth =
        (transactionHistory?.[0]?.stockValueAtTransactionTime ?? 0) +
        (userOwnedStockOfStockWithLatestPrice?.quantity ?? 0) * viewTransactionsForStock.dollarValue;

    return (
        <div className={styles.overallContainer}>
            <div className={styles.header}>
                <Button
                    className={styles.backButton}
                    icon="arrow-left"
                    minimal
                    onClick={goBackToStockInformationPage}
                />
                <span className={styles.stockName}>{viewTransactionsForStock.name}</span>
                <div
                    className={classNames(styles.stockWorthLabel, {
                        [styles.positiveStockValue]: totalStockWorth > 0,
                        [styles.negativeStockValue]: totalStockWorth < 0,
                    })}
                >
                    {formatDollar(totalStockWorth)}
                </div>
            </div>
            <div className={styles.transactionLabelContainer}>
                <span className={styles.transactionsTableLabel}>Transaction</span>
                <span className={styles.transactionsTableLabel}>Total value</span>
            </div>
            <div className={styles.transactionsTable}>{maybeRenderTransactionHistory()}</div>
        </div>
    );
};

function mapStateToProps(state: IStoreState): IStoreProps {
    return {
        userOwnedStockOfStockWithLatestPrice: selectUserOwnedStock(state.interface.viewTransactionsForStock)(state),
        viewTransactionsForStock: state.interface.viewTransactionsForStock,
    };
}

function mapDispatchToProps(dispatch: Dispatch): IDispatchProps {
    return {
        setViewStockWithLatestPrice: (stockWithDollarValue: IStockWithDollarValue) =>
            dispatch(
                CompoundAction([
                    SetViewStockWithLatestPrice(stockWithDollarValue),
                    SetViewTransactionsForStock(undefined),
                ]),
            ),
    };
}

export const ViewTransactions = connect(mapStateToProps, mapDispatchToProps)(UnconnectViewTransactions);
