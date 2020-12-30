import { Button, Spinner } from "@blueprintjs/core";
import { IStockWithDollarValue, ITimeBucket, StocksFrontendService } from "@stochastic-exchange/api";
import { isMarketOpenOnDateDay } from "@stochastic-exchange/utils";
import classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { bindActionCreators, Dispatch } from "redux";
import { Routes } from "../../common/routes";
import { selectOwnedStockQuantityOfViewStock } from "../../selectors/selector";
import { SetViewStockDetails, SetViewStockWithLatestPrice } from "../../store/interface/actions";
import { IStoreState } from "../../store/state";
import { SetOwnedStockQuantity } from "../../store/stocks/actions";
import { formatAsPercent, formatDollar, formatDollarForGraph, formatNumber } from "../../utils/formatNumber";
import { useCallOnPrivateEndpoint } from "../../utils/useCallOnPrivateEndpoint";
import { StockChart } from "./helperComponents/stockChart";
import { TransactStocks } from "./helperComponents/transactStocks";
import styles from "./stockInformation.module.scss";

interface IStoreProps {
    limitOrdersOnStock: number | undefined;
    ownedStockQuantity: number | undefined;
    viewStockWithLatestPrice: IStockWithDollarValue | undefined;
}

interface IDispatchProps {
    removeViewStockWithLatestPrice: () => void;
    setOwnedStockQuantity: (newOwnedStockWithQuantity: { [stock: string]: number }) => void;
    setViewStockDetails: (stockWithDollarValue: IStockWithDollarValue) => void;
}

const VALID_TIME_BUCKETS: ITimeBucket[] = ["day", "5 days", "month", "all"];

const UnconnectedStockInformation: React.FC<IStoreProps & IDispatchProps> = ({
    limitOrdersOnStock,
    ownedStockQuantity,
    removeViewStockWithLatestPrice,
    viewStockWithLatestPrice,
    setOwnedStockQuantity,
    setViewStockDetails,
}) => {
    const history = useHistory();

    const [bucket, setBucket] = React.useState<ITimeBucket>(isMarketOpenOnDateDay(new Date()) ? "day" : "5 days");

    if (viewStockWithLatestPrice === undefined) {
        history.push(Routes.PORTFOLIO);
        return null;
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const stockInformation = useCallOnPrivateEndpoint(
        StocksFrontendService.getSingleStockInformation,
        {
            stock: viewStockWithLatestPrice.id,
            bucket,
        },
        [bucket],
        `stock-information-${viewStockWithLatestPrice.id}-${bucket}`,
    );

    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
        if (viewStockWithLatestPrice === undefined || stockInformation === undefined) {
            return;
        }

        setOwnedStockQuantity({ [viewStockWithLatestPrice.id]: stockInformation.ownedStockQuantity });
    }, [
        stockInformation?.ownedStockQuantity,
        viewStockWithLatestPrice?.id,
        setOwnedStockQuantity,
        stockInformation,
        viewStockWithLatestPrice,
    ]);

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
            <TransactStocks
                totalLimitOrders={limitOrdersOnStock ?? stockInformation.totalLimitOrders}
                totalOwnedStock={ownedStockQuantity ?? stockInformation.ownedStockQuantity}
                viewStockWithLatestPrice={viewStockWithLatestPrice}
            />
        </div>
    );
};

function mapStateToProps(store: IStoreState): IStoreProps {
    return {
        limitOrdersOnStock:
            store.interface.viewStockWithLatestPrice === undefined
                ? undefined
                : store.account.limitOrdersOnStocks[store.interface.viewStockWithLatestPrice.id]?.length ?? undefined,
        ownedStockQuantity: selectOwnedStockQuantityOfViewStock(store),
        viewStockWithLatestPrice: store.interface.viewStockWithLatestPrice,
    };
}

function mapDispatchToProps(dispatch: Dispatch): IDispatchProps {
    const boundActions = bindActionCreators(
        {
            setOwnedStockQuantity: SetOwnedStockQuantity,
            setViewStockDetails: SetViewStockDetails,
        },
        dispatch,
    );

    return {
        ...boundActions,
        removeViewStockWithLatestPrice: () => dispatch(SetViewStockWithLatestPrice(undefined)),
    };
}

export const StockInformation = connect(mapStateToProps, mapDispatchToProps)(UnconnectedStockInformation);
