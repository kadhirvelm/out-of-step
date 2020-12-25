import { Button, Spinner } from "@blueprintjs/core";
import { IOwnedStock, IStockWithDollarValue, ITimeBucket, StocksFrontendService } from "@stochastic-exchange/api";
import classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { bindActionCreators, Dispatch } from "redux";
import { Routes } from "../../common/routes";
import { selectOwnedStockQuantityOfViewStock, selectUserOwnedStock } from "../../selectors/selector";
import {
    SetViewStockDetails,
    SetViewStockWithLatestPrice,
    SetViewTransactionsForStock,
} from "../../store/interface/actions";
import { IStoreState } from "../../store/state";
import { SetOwnedStockQuantity } from "../../store/stocks/actions";
import { callOnPrivateEndpoint } from "../../utils/callOnPrivateEndpoint";
import { formatAsPercent, formatDollar, formatDollarForGraph, formatNumber } from "../../utils/formatNumber";
import { StockChart } from "./helperComponents/stockChart";
import { TransactStock } from "./helperComponents/transactStocks";
import styles from "./stockInformation.module.scss";

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
    setViewStockDetails: (stockWithDollarValue: IStockWithDollarValue) => void;
}

const VALID_TIME_BUCKETS: ITimeBucket[] = ["day", "5 days", "month", "all"];

const UnconnectedStockInformation: React.FC<IStoreProps & IDispatchProps> = ({
    cashOnHand,
    ownedStockQuantity,
    removeViewStockWithLatestPrice,
    viewStockWithLatestPrice,
    setOwnedStockQuantity,
    setViewStockDetails,
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
        `stock-information-${viewStockWithLatestPrice.id}-${bucket}`,
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

    const setBucketCurried = (timeBucket: ITimeBucket) => () => setBucket(timeBucket);

    const maybeRenderYesterdaysClose = () => {
        if (bucket !== "day") {
            return undefined;
        }

        return (
            <div className={styles.rowContainer}>
                <span className={styles.label}>Previous close:</span>
                <span>{formatDollarForGraph(viewStockWithLatestPrice.previousPriceHistory?.dollarValue ?? 0)}</span>
            </div>
        );
    };

    const viewStockDetails = () => {
        setViewStockDetails(viewStockWithLatestPrice);
        history.push(Routes.STOCK_INFORMATION);
    };

    return (
        <div className={styles.stockInformationContainer}>
            {renderBackButton()}
            <div className={styles.stockDetailsContainer}>
                <span className={styles.stockName}>{viewStockWithLatestPrice.name}</span>
                <span className={styles.stockLatestPrice}>{formatDollar(viewStockWithLatestPrice.dollarValue)}</span>
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
                <StockChart
                    previousClosePrice={viewStockWithLatestPrice.previousPriceHistory?.dollarValue}
                    pricePoints={stockInformation.priceHistory}
                    timeBucket={bucket}
                />
            </div>
            <span className={styles.summaryLabel}>Summary</span>
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
                            {formatAsPercent(
                                (viewStockWithLatestPrice.totalQuantity - (ownedStockQuantity ?? 0)) /
                                    viewStockWithLatestPrice.totalQuantity,
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
                    {maybeRenderYesterdaysClose()}
                </div>
            </div>
            <Button
                className={styles.seeStockDetails}
                icon="info-sign"
                minimal
                onClick={viewStockDetails}
                text="See more stock details"
            />
            <TransactStock
                cashOnHand={cashOnHand}
                setViewTransactionsForStock={setViewTransactionsForStock}
                totalOwnedStock={ownedStockQuantity ?? stockInformation.ownedStockQuantity}
                userOwnedStockOfStockWithLatestPrice={userOwnedStockOfStockWithLatestPrice}
                viewStockWithLatestPrice={viewStockWithLatestPrice}
            />
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
            setViewStockDetails: SetViewStockDetails,
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
