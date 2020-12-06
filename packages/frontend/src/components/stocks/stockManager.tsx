import { Icon, Spinner } from "@blueprintjs/core";
import { IAccount, IOwnedStock, IStockWithDollarValue, StocksFrontendService } from "@stochastic-exchange/api";
import classNames from "classnames";
import { keyBy } from "lodash-es";
import * as React from "react";
import { connect } from "react-redux";
import { IStoreState } from "../../store/state";
import { callOnPrivateEndpoint } from "../../utils/callOnPrivateEndpoint";
import { formatNumber } from "../../utils/formatNumber";
import { StockInformation } from "./stockInformation";
import styles from "./stockManager.module.scss";

interface IStoreProps {
    userAccount: Omit<IAccount, "hashedPassword"> | undefined;
    userOwnedStocks: IOwnedStock[] | undefined;
}

const UnconnectedStockManager: React.FC<IStoreProps> = ({ userAccount, userOwnedStocks }) => {
    const [viewSingleStockInformation, setViewingSingleStockInformation] = React.useState<
        IStockWithDollarValue | undefined
    >(undefined);

    const [sortedStocks, setSortedStocks] = React.useState<
        | {
              totalAssetWorth: number;
              inUserPortfolio: IStockWithDollarValue[];
              notInUserPortfolio: IStockWithDollarValue[];
              keyedUserOwnedStocks: { [stockId: string]: IOwnedStock };
          }
        | undefined
    >(undefined);

    const allStocksWithPrice = callOnPrivateEndpoint(StocksFrontendService.getAllStocks, undefined);

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
            inUserPortfolio,
            notInUserPortfolio,
            keyedUserOwnedStocks,
        });
    }, [allStocksWithPrice, userOwnedStocks]);

    if (allStocksWithPrice === undefined || userAccount === undefined) {
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

    const renderSingleStock = (stock: IStockWithDollarValue, ownedStock?: IOwnedStock) => {
        const stockNameLabel =
            ownedStock === undefined ? `Price: $${stock.dollarValue.toFixed(2)}` : `Shares: ${ownedStock.quantity}`;

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
                    <span className={styles.stockMarketCap}>{stockNameLabel}</span>
                </div>
                <div className={styles.rightContainer}>
                    <span className={styles.currentPrice}>{maybeTotalAssertWorth}</span>
                    <Icon className={styles.chevronRightIndicator} icon="chevron-right" />
                </div>
            </div>
        );
    };

    return (
        <div className={styles.overallContainer}>
            <div className={styles.userInformationContainer}>
                <span className={styles.greeting}>{userAccount.name}</span>
                <div className={styles.assetInformation}>
                    <span className={styles.totalWorth}>
                        ${((sortedStocks?.totalAssetWorth ?? 0) + userAccount.cashOnHand).toLocaleString()}
                    </span>
                    <div className={styles.breakdownContainer}>
                        <span>Assets: ${sortedStocks?.totalAssetWorth?.toLocaleString()}</span>
                        <span>Cash: ${userAccount.cashOnHand.toLocaleString()}</span>
                    </div>
                </div>
            </div>
            <span className={styles.typeOfStockLabel}>Your portfolio</span>
            <div className={styles.stocksContainer}>
                {sortedStocks?.inUserPortfolio.map(s => renderSingleStock(s, sortedStocks?.keyedUserOwnedStocks[s.id]))}
            </div>
            <span className={classNames(styles.typeOfStockLabel, styles.otherStocks)}>Other stocks</span>
            <div className={styles.stocksContainer}>
                {sortedStocks?.notInUserPortfolio.map(s => renderSingleStock(s))}
            </div>
        </div>
    );
};

function mapStateToProps(state: IStoreState): IStoreProps {
    return {
        userAccount: state.account.userAccount,
        userOwnedStocks: state.account.ownedStocks,
    };
}

export const StockManager = connect(mapStateToProps)(UnconnectedStockManager);
