import { Button } from "@blueprintjs/core";
import { IStockWithDollarValue, IOwnedStock } from "@stochastic-exchange/api";
import * as React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { bindActionCreators, Dispatch } from "redux";
import { Routes } from "../../../common/routes";
import { selectUserOwnedStock } from "../../../selectors/selector";
import { SetViewLimitOrdersForStock, SetViewTransactionsForStock } from "../../../store/interface/actions";
import { IStoreState } from "../../../store/state";
import { formatDollar } from "../../../utils/formatNumber";
import { BuyStocksDialog, SellStocksDialog } from "./stocksDialog";
import styles from "./transactStocks.module.scss";

interface IStoreProps {
    cashOnHand: number | undefined;
    userOwnedStockOfStockWithLatestPrice: IOwnedStock | undefined;
}

interface IDispatchProps {
    setViewLimitOrdersForStock: (stockWithDollarValue: IStockWithDollarValue) => void;
    setViewTransactionsForStock: (stockWithDollarValue: IStockWithDollarValue) => void;
}

interface IOwnProps {
    totalOwnedStock: number;
    viewStockWithLatestPrice: IStockWithDollarValue;
}

const UnconnectedTransactStock: React.FC<IStoreProps & IDispatchProps & IOwnProps> = ({
    cashOnHand,
    setViewLimitOrdersForStock,
    setViewTransactionsForStock,
    totalOwnedStock,
    userOwnedStockOfStockWithLatestPrice,
    viewStockWithLatestPrice,
}) => {
    const history = useHistory();

    const [isBuyDialogOpen, setBuyDialogOpenState] = React.useState<boolean>(false);
    const [isSellDialogOpen, setSellDialogOpenState] = React.useState<boolean>(false);

    const openBuyStocksDialog = () => setBuyDialogOpenState(true);
    const closeBuyStocksDialog = () => setBuyDialogOpenState(false);

    const openSellStocksDialog = () => setSellDialogOpenState(true);
    const closeSellStocksDialog = () => setSellDialogOpenState(false);

    const viewTransactionHistory = () => {
        setViewTransactionsForStock(viewStockWithLatestPrice);
        history.push(Routes.TRANSACTIONS);
    };

    const goToLimitOrders = () => {
        setViewLimitOrdersForStock(viewStockWithLatestPrice);
        history.push(Routes.LIMIT_ORDER);
    };

    if (viewStockWithLatestPrice.status === "ACQUIRED") {
        return (
            <div className={styles.transactContainer}>
                <div className={styles.acquiredInfoContainer}>
                    <span className={styles.hasBeenAcquiredLabel}>This stock has been acquired.</span>
                    <span className={styles.hasBeenAcquiredDescription}>
                        All shareholders have been paid {formatDollar(viewStockWithLatestPrice.dollarValue)} per share.
                    </span>
                    <Button
                        className={styles.viewTransactionHistory}
                        minimal
                        onClick={viewTransactionHistory}
                        text="View your transaction history"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.transactContainer}>
            <span className={styles.yourPortfolioLabel}>Your portfolio</span>
            <div className={styles.transactInformationContainer}>
                <div className={styles.rowContainer}>
                    <div className={styles.transactColumnContainer}>
                        <div className={styles.transactRowContainer}>
                            <div className={styles.transactLabel}>
                                <span className={styles.label}>Cash on hand:</span>
                                <span>{formatDollar(cashOnHand ?? 0)}</span>
                            </div>
                            <div className={styles.transactButtonContainer}>
                                <Button
                                    className={styles.transactButton}
                                    disabled={
                                        (cashOnHand ?? 0) < viewStockWithLatestPrice.dollarValue ||
                                        viewStockWithLatestPrice.totalQuantity - totalOwnedStock === 0
                                    }
                                    intent="success"
                                    text="Buy"
                                    onClick={openBuyStocksDialog}
                                />
                                <BuyStocksDialog
                                    isOpen={isBuyDialogOpen}
                                    onClose={closeBuyStocksDialog}
                                    stock={viewStockWithLatestPrice}
                                    totalOwnedStock={totalOwnedStock}
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
                                    onClick={openSellStocksDialog}
                                />
                                <Button
                                    className={styles.limitOrderTransactButton}
                                    onClick={goToLimitOrders}
                                    rightIcon="caret-right"
                                    text="Limit orders"
                                />
                                <SellStocksDialog
                                    isOpen={isSellDialogOpen}
                                    onClose={closeSellStocksDialog}
                                    stock={viewStockWithLatestPrice}
                                    totalOwnedStock={totalOwnedStock}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <Button
                    className={styles.viewTransactionHistory}
                    icon="history"
                    minimal
                    onClick={viewTransactionHistory}
                    text="View your transaction history"
                />
            </div>
        </div>
    );
};

function mapStateToProps(store: IStoreState): IStoreProps {
    return {
        cashOnHand: store.account.userAccount?.cashOnHand,
        userOwnedStockOfStockWithLatestPrice: selectUserOwnedStock(store.interface.viewStockWithLatestPrice)(store),
    };
}

function mapDispatchToProps(dispatch: Dispatch): IDispatchProps {
    return bindActionCreators(
        {
            setViewLimitOrdersForStock: SetViewLimitOrdersForStock,
            setViewTransactionsForStock: SetViewTransactionsForStock,
        },
        dispatch,
    );
}

export const TransactStocks = connect(mapStateToProps, mapDispatchToProps)(UnconnectedTransactStock);
