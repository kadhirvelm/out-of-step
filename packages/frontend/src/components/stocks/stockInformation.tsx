import { Button, Spinner } from "@blueprintjs/core";
import { IOwnedStock, IStockWithDollarValue, ITimeBucket, StocksFrontendService } from "@stochastic-exchange/api";
import classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { bindActionCreators, Dispatch } from "redux";
import { Routes } from "../../common/routes";
import { selectOwnedStockQuantityOfViewStock, selectUserOwnedStock } from "../../selectors/stocksSelector";
import { SetViewStockWithLatestPrice, SetViewTransactionsForStock } from "../../store/interface/actions";
import { IStoreState } from "../../store/state";
import { SetOwnedStockQuantity } from "../../store/stocks/actions";
import { callOnPrivateEndpoint } from "../../utils/callOnPrivateEndpoint";
import { formatDollar, formatNumber } from "../../utils/formatNumber";
import { StockChart } from "./stockChart";
import styles from "./stockInformation.module.scss";
import { BuyStocksDialog, SellStocksDialog } from "./stocksDialog";

interface IStoreProps {
    cashOnHand: number | undefined;
    ownedStockQuantity: number | undefined;
    userOwnedStockOfStockWithLatestPrice: IOwnedStock | undefined;
    viewStockWithLatestPrice: IStockWithDollarValue | undefined;
}

interface IDispatchProps {
    removeViewStockWithLatestPrice: () => void;
    setOwnedStockQuantity: (newOwnedStockWithQuantity: { [stock: string]: number }) => void;
    setViewTransactionsForStock: (stockWithDollarValue: IStockWithDollarValue) => void;
}

const VALID_TIME_BUCKETS: ITimeBucket[] = ["day", "5 days", "month", "all"];

const TransactStock: React.FC<{
    cashOnHand: number | undefined;
    setViewTransactionsForStock: (stockWithDollarValue: IStockWithDollarValue) => void;
    totalOwnedStock: number;
    userOwnedStockOfStockWithLatestPrice: IOwnedStock | undefined;
    viewStockWithLatestPrice: IStockWithDollarValue;
}> = ({
    cashOnHand,
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
                                <Button className={styles.transactButton} disabled text="Limit order" />
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
                    minimal
                    onClick={viewTransactionHistory}
                    text="View your transaction history"
                />
            </div>
        </div>
    );
};

const UnconnectedStockInformation: React.FC<IStoreProps & IDispatchProps> = ({
    cashOnHand,
    ownedStockQuantity,
    removeViewStockWithLatestPrice,
    viewStockWithLatestPrice,
    setOwnedStockQuantity,
    setViewTransactionsForStock,
    userOwnedStockOfStockWithLatestPrice,
}) => {
    const history = useHistory();
    if (viewStockWithLatestPrice === undefined) {
        history.push(Routes.PORTFOLIO);
        return null;
    }

    const [bucket, setBucket] = React.useState<ITimeBucket>("day");
    const stockInformation = callOnPrivateEndpoint(
        StocksFrontendService.getSingleStockInformation,
        {
            stock: viewStockWithLatestPrice.id,
            bucket,
        },
        [bucket],
    );

    React.useEffect(() => {
        if (viewStockWithLatestPrice === undefined || stockInformation === undefined) {
            return;
        }

        setOwnedStockQuantity({ [viewStockWithLatestPrice.id]: stockInformation?.ownedStockQuantity });
    }, [stockInformation?.ownedStockQuantity, viewStockWithLatestPrice.id]);

    const goBackToPortfolioManager = () => {
        removeViewStockWithLatestPrice();
        history.push(Routes.PORTFOLIO);
    };

    const renderBackButton = () => {
        return (
            <div className={styles.backArrowContainer}>
                <Button icon="arrow-left" minimal onClick={goBackToPortfolioManager} />
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

    const viewTransactionHistory = () => {
        setViewTransactionsForStock(viewStockWithLatestPrice);
        history.push(Routes.TRANSACTIONS);
    };

    const maybeRenderTransactStock = () => {
        if (viewStockWithLatestPrice.status === "ACQUIRED") {
            return (
                <div className={styles.transactContainer}>
                    <div className={styles.acquiredInfoContainer}>
                        <span className={styles.hasBeenAcquiredLabel}>This stock has been acquired.</span>
                        <span className={styles.hasBeenAcquiredDescription}>
                            All shareholders have been paid {formatDollar(viewStockWithLatestPrice.dollarValue)} per
                            share.
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
            <TransactStock
                cashOnHand={cashOnHand}
                setViewTransactionsForStock={setViewTransactionsForStock}
                totalOwnedStock={ownedStockQuantity ?? stockInformation.ownedStockQuantity}
                userOwnedStockOfStockWithLatestPrice={userOwnedStockOfStockWithLatestPrice}
                viewStockWithLatestPrice={viewStockWithLatestPrice}
            />
        );
    };

    const setBucketCurried = (timeBucket: ITimeBucket) => () => setBucket(timeBucket);

    return (
        <div className={styles.stockInformationContainer}>
            {renderBackButton()}
            <div className={styles.stockDetailsContainer}>
                <span className={styles.stockName}>{viewStockWithLatestPrice.name}</span>
                <span className={styles.stockLatestPrice}>${viewStockWithLatestPrice.dollarValue.toFixed(2)}</span>
            </div>
            <div className={styles.timeBucketsContainer}>
                {VALID_TIME_BUCKETS.map(timeBucket => (
                    <span
                        className={classNames(styles.singleTimeBucket, {
                            [styles.singleTimeBucketActive]: timeBucket === bucket,
                        })}
                        key={timeBucket}
                        onClick={setBucketCurried(timeBucket)}
                    >
                        {timeBucket}
                    </span>
                ))}
            </div>
            <div className={styles.pricePointsContainer}>
                <StockChart pricePoints={stockInformation.priceHistory} timeBucket={bucket} />
            </div>
            <div className={styles.basicInformationContainer}>
                <div className={styles.columnContainer}>
                    <div className={styles.rowContainer}>
                        <span className={styles.label}>Market cap:</span>
                        <span>
                            $
                            {formatNumber(
                                viewStockWithLatestPrice.dollarValue * viewStockWithLatestPrice.totalQuantity,
                            )}
                        </span>
                    </div>
                    <div className={styles.rowContainer}>
                        <span className={styles.label}>Total shares:</span>
                        <span>{formatNumber(viewStockWithLatestPrice.totalQuantity)}</span>
                    </div>
                    <div className={styles.rowContainer}>
                        <span className={styles.label}>Available shares:</span>
                        <span>
                            {formatNumber(
                                viewStockWithLatestPrice.totalQuantity -
                                    (ownedStockQuantity ?? stockInformation.ownedStockQuantity),
                            )}
                        </span>
                    </div>
                </div>
                <div className={styles.columnContainer}>
                    <div className={styles.rowContainer}>
                        <span className={styles.label}>High:</span>
                        <span>{formatDollar(stockInformation.high)}</span>
                    </div>
                    <div className={styles.rowContainer}>
                        <span className={styles.label}>Low:</span>
                        <span>{formatDollar(stockInformation.low)}</span>
                    </div>
                </div>
            </div>
            {maybeRenderTransactStock()}
            <Button className={styles.seeStockInformation} disabled minimal text="See stock information" />
        </div>
    );
};

function mapStateToProps(store: IStoreState): IStoreProps {
    return {
        cashOnHand: store.account.userAccount?.cashOnHand,
        ownedStockQuantity: selectOwnedStockQuantityOfViewStock(store),
        userOwnedStockOfStockWithLatestPrice: selectUserOwnedStock(store.interface.viewStockWithLatestPrice)(store),
        viewStockWithLatestPrice: store.interface.viewStockWithLatestPrice,
    };
}

function mapDispatchToProps(dispatch: Dispatch): IDispatchProps {
    const boundActions = bindActionCreators(
        {
            setOwnedStockQuantity: SetOwnedStockQuantity,
            setViewTransactionsForStock: SetViewTransactionsForStock,
        },
        dispatch,
    );

    return {
        ...boundActions,
        removeViewStockWithLatestPrice: () => dispatch(SetViewStockWithLatestPrice(undefined)),
    };
}

export const StockInformation = connect(mapStateToProps, mapDispatchToProps)(UnconnectedStockInformation);
