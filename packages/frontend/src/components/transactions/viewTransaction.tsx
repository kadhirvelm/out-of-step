import { Button } from "@blueprintjs/core";
import {
    IOwnedStock,
    IStockWithDollarValue,
    ITransactionHistoryComplete,
    TransactionFrontendService,
} from "@stochastic-exchange/api";
import { clone } from "lodash-es";
import * as React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { CompoundAction } from "redoodle";
import { Dispatch } from "redux";
import classNames from "classnames";
import { Routes } from "../../common/routes";
import { selectUserOwnedStock } from "../../selectors/selectUserOwnedStock";
import { SetViewStockWithLatestPrice, SetViewTransactionsForStock } from "../../store/interface/actions";
import { IStoreState } from "../../store/state";
import { callOnPrivateEndpoint } from "../../utils/callOnPrivateEndpoint";
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

    let startQuantityOfShares = clone(userOwnedStockOfStockWithLatestPrice?.quantity ?? 0);

    const renderSingleTransaction = (transaction: ITransactionHistoryComplete) => {
        if (transaction.type === "acquisition-transaction") {
            return null;
        }

        if (transaction.type === "dividend-transaction") {
            return null;
        }

        startQuantityOfShares = clone(startQuantityOfShares) - transaction.purchasedQuantity + transaction.soldQuantity;

        return (
            <div
                className={classNames(styles.singleExchangeTransaction, {
                    [styles.netPurchase]: transaction.purchasedQuantity > 0,
                    [styles.netSold]: transaction.soldQuantity > 0,
                })}
            >
                <div className={styles.rightContainer}>
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
                <div className={styles.leftContainer}>
                    <span className={styles.beforeLabel}>Shares before</span>
                    <span className={styles.totalQuantityOwned}>{clone(startQuantityOfShares)}</span>
                </div>
            </div>
        );
    };

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
                <div className={styles.stockOwnedLabel}>
                    <span className={styles.totalQuantityOwnedLabel}>You own:</span>
                    <span className={styles.totalQuantityOwned}>
                        {userOwnedStockOfStockWithLatestPrice?.quantity ?? 0} shares
                    </span>
                </div>
            </div>
            <span className={styles.transactionsTableLabel}>Transactions</span>
            <div className={styles.transactionsTable}>{transactionHistory?.map(renderSingleTransaction)}</div>
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
