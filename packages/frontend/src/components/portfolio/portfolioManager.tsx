import { Button, Icon, NonIdealState, Spinner } from "@blueprintjs/core";
import { IAccount, IOwnedStock, IStockWithDollarValue, StocksFrontendService } from "@stochastic-exchange/api";
import classNames from "classnames";
import { keyBy } from "lodash-es";
import * as React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { bindActionCreators, Dispatch } from "redux";
import { Routes } from "../../common/routes";
import { SetViewStockWithLatestPrice } from "../../store/interface/actions";
import { IStoreState } from "../../store/state";
import { callOnPrivateEndpoint } from "../../utils/callOnPrivateEndpoint";
import { formatDollar, formatNumber } from "../../utils/formatNumber";
import { MarketStatus } from "./helperComponents/marketStatus";
import styles from "./portfolioManager.module.scss";

interface IStoreProps {
    userAccount: Omit<IAccount, "hashedPassword"> | undefined;
    userOwnedStocks: IOwnedStock[] | undefined;
}

interface IDispatchProps {
    setViewStockWithLatestPrice: (stockWithLatestPrice: IStockWithDollarValue) => void;
}

const UnconnectedPortfolioManager: React.FC<IStoreProps & IDispatchProps> = ({
    setViewStockWithLatestPrice,
    userAccount,
    userOwnedStocks,
}) => {
    const history = useHistory();

    const [sortedStocks, setSortedStocks] = React.useState<
        | {
              totalAssetWorth: number;
              previousTotalAssetWorth: number;
              inUserPortfolio: IStockWithDollarValue[];
              notInUserPortfolio: IStockWithDollarValue[];
              keyedUserOwnedStocks: { [stockId: string]: IOwnedStock };
          }
        | undefined
    >(undefined);

    const allStocksWithPrice = callOnPrivateEndpoint(
        StocksFrontendService.getAllStocks,
        undefined,
        undefined,
        "get-all-stocks",
    );

    React.useEffect(() => {
        if (allStocksWithPrice === undefined || userOwnedStocks === undefined) {
            return;
        }

        const keyedStocks = keyBy(allStocksWithPrice.stocks, "id");
        const keyedUserOwnedStocks = keyBy(userOwnedStocks, "stock");
        const inUserPortfolio = allStocksWithPrice.stocks.filter(s => keyedUserOwnedStocks[s.id] !== undefined);
        const notInUserPortfolio = allStocksWithPrice.stocks.filter(s => keyedUserOwnedStocks[s.id] === undefined);

        setSortedStocks({
            totalAssetWorth: userOwnedStocks.reduce(
                (previous, next) => previous + next.quantity * (keyedStocks[next.stock].dollarValue ?? 0),
                0,
            ),
            previousTotalAssetWorth: userOwnedStocks.reduce(
                (previous, next) =>
                    previous + next.quantity * (keyedStocks[next.stock].previousPriceHistory?.dollarValue ?? 0),
                0,
            ),
            inUserPortfolio,
            notInUserPortfolio,
            keyedUserOwnedStocks,
        });
    }, [allStocksWithPrice, userOwnedStocks]);

    if (allStocksWithPrice === undefined || userAccount === undefined || sortedStocks === undefined) {
        return (
            <div className={styles.spinnerContainer}>
                <Spinner />
            </div>
        );
    }

    const goToHelpPage = () => {
        history.push(Routes.HELP);
    };

    const curriedSetViewSingleStockInformation = (stockInformation: IStockWithDollarValue) => () => {
        setViewStockWithLatestPrice(stockInformation);
        history.push(Routes.STOCK);
    };

    const renderSingleStock = (stock: IStockWithDollarValue, ownedStock?: IOwnedStock) => {
        const maybeTotalAssertWorth =
            ownedStock !== undefined && `$${formatNumber(ownedStock.quantity * stock.dollarValue)}`;

        return (
            <div
                className={styles.singleStockContainer}
                key={stock.id}
                onClick={curriedSetViewSingleStockInformation(stock)}
            >
                <div className={styles.leftContainer}>
                    <span className={styles.stockTitle}>{stock.name}</span>
                    <span className={styles.stockMarketCap}>Price: {formatDollar(stock.dollarValue)}</span>
                </div>
                <div className={styles.rightContainer}>
                    <span
                        className={classNames(styles.currentPrice, {
                            [styles.negativePrice]: (stock.previousPriceHistory?.dollarValue ?? 0) > stock.dollarValue,
                            [styles.positivePrice]:
                                (stock.previousPriceHistory?.dollarValue ?? Number.MAX_SAFE_INTEGER) <
                                stock.dollarValue,
                        })}
                    >
                        {maybeTotalAssertWorth}
                    </span>
                    <Icon
                        className={styles.chevronRightIndicator}
                        icon={stock.status === "AVAILABLE" ? "chevron-right" : "git-merge"}
                    />
                </div>
            </div>
        );
    };

    const maybeRenderUserPortfolioStocks = () => {
        if (sortedStocks.inUserPortfolio.length === 0) {
            return <NonIdealState className={styles.nonIdealStateStocks} description="Buy some below!" />;
        }

        return sortedStocks.inUserPortfolio.map(s => renderSingleStock(s, sortedStocks?.keyedUserOwnedStocks[s.id]));
    };

    const maybeRenderOtherStocks = () => {
        if (sortedStocks.notInUserPortfolio.length === 0) {
            return <NonIdealState className={styles.nonIdealStateStocks} description="None to display" />;
        }

        return sortedStocks.notInUserPortfolio.map(s => renderSingleStock(s));
    };

    return (
        <div className={styles.overallContainer}>
            <div className={styles.userInformationContainer}>
                <span className={styles.greeting}>
                    <span>Hi {userAccount.name},</span>
                    <Button icon="help" minimal onClick={goToHelpPage} />
                </span>
                <div className={styles.assetInformation}>
                    <span className={styles.totalWorth}>
                        ${((sortedStocks.totalAssetWorth ?? 0) + userAccount.cashOnHand).toLocaleString()}
                    </span>
                    <div className={styles.breakdownContainer}>
                        <span>Assets: ${sortedStocks.totalAssetWorth?.toLocaleString()}</span>
                        <span>Cash: ${userAccount.cashOnHand.toLocaleString()}</span>
                    </div>
                </div>
            </div>
            <MarketStatus />
            <span className={styles.typeOfStockLabel}>Your portfolio</span>
            <div className={styles.stocksContainer}>{maybeRenderUserPortfolioStocks()}</div>
            <span className={classNames(styles.typeOfStockLabel, styles.otherStocks)}>Other stocks</span>
            <div className={styles.stocksContainer}>{maybeRenderOtherStocks()}</div>
        </div>
    );
};

function mapStateToProps(state: IStoreState): IStoreProps {
    return {
        userAccount: state.account.userAccount,
        userOwnedStocks: state.account.ownedStocks,
    };
}

function mapDispatchToProps(dispatch: Dispatch): IDispatchProps {
    return bindActionCreators(
        {
            setViewStockWithLatestPrice: SetViewStockWithLatestPrice,
        },
        dispatch,
    );
}

export const PortfolioManager = connect(mapStateToProps, mapDispatchToProps)(UnconnectedPortfolioManager);
