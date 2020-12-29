import { Button } from "@blueprintjs/core";
import {
    ILimitOrder,
    ILimitOrderId,
    IOwnedStock,
    IStockId,
    IStockWithDollarValue,
    TransactionFrontendService,
} from "@stochastic-exchange/api";
import * as React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { bindActionCreators, Dispatch } from "redux";
import classNames from "classnames";
import { Routes } from "../../common/routes";
import { selectUserOwnedStock } from "../../selectors/selector";
import { UpdateLimitOrdersOnStock } from "../../store/account/actions";
import { SetViewStockWithLatestPrice } from "../../store/interface/actions";
import { IStoreState } from "../../store/state";
import { checkIfIsError } from "../../utils/checkIfIsError";
import { formatDollar } from "../../utils/formatNumber";
import { showToast } from "../../utils/toaster";
import { getTokenInCookie } from "../../utils/tokenInCookies";
import { DisplayLimitOrders } from "./helperComponents/displayLimitOrders";
import { NewBuyLimitOrder, NewSellLimitOrder } from "./helperComponents/newLimitOrder";
import styles from "./limitOrders.module.scss";

interface IStoreProps {
    cashOnHand: number;
    limitOrdersOnStock: ILimitOrder[];
    userOwnedStockOfStockWithLatestPrice: IOwnedStock | undefined;
    viewLimitOrdersForStock: IStockWithDollarValue | undefined;
}

interface IDispatchProps {
    setViewStockWithLatestPrice: (stockWithDollarValue: IStockWithDollarValue) => void;
    updateLimitOrdersOnStock: (payload: { stockId: IStockId; limitOrders: ILimitOrder[] }) => void;
}

const getLimitOrdersForStock = async (
    stockWithDollarValue: IStockWithDollarValue,
    updateLimitOrdersOnStock: (payload: { stockId: IStockId; limitOrders: ILimitOrder[] }) => void,
) => {
    const maybeLimitOrdersWithErrors = await TransactionFrontendService.viewLimitOrdersForStock(
        {
            stockId: stockWithDollarValue.id,
        },
        getTokenInCookie(),
    );

    const maybeLimitOrders = checkIfIsError(maybeLimitOrdersWithErrors);
    updateLimitOrdersOnStock({
        stockId: stockWithDollarValue.id,
        limitOrders: maybeLimitOrders?.limitOrders ?? [],
    });
};

const UnconnectedLimitOrders: React.FC<IStoreProps & IDispatchProps> = ({
    cashOnHand,
    limitOrdersOnStock,
    userOwnedStockOfStockWithLatestPrice,
    viewLimitOrdersForStock,
    setViewStockWithLatestPrice,
    updateLimitOrdersOnStock,
}) => {
    const history = useHistory();

    const [isBuyLimitOpen, setIsBuyLimitOpen] = React.useState(false);
    const [isSellLimitOpen, setIsSellLimitOpen] = React.useState(false);

    React.useEffect(() => {
        if (viewLimitOrdersForStock === undefined) {
            return;
        }

        getLimitOrdersForStock(viewLimitOrdersForStock, updateLimitOrdersOnStock);
    }, [viewLimitOrdersForStock, updateLimitOrdersOnStock]);

    if (viewLimitOrdersForStock === undefined) {
        history.push(Routes.PORTFOLIO);
        return null;
    }

    const openBuyLimit = () => setIsBuyLimitOpen(true);
    const closeBuyLimit = () => setIsBuyLimitOpen(false);

    const openSellLimit = () => setIsSellLimitOpen(true);
    const closeSellLimit = () => setIsSellLimitOpen(false);

    const onGoBack = () => {
        setViewStockWithLatestPrice(viewLimitOrdersForStock);
        history.push(Routes.STOCK);
    };

    const onNewLimitOrder = (newLimitOrder: ILimitOrder) => {
        updateLimitOrdersOnStock({
            stockId: viewLimitOrdersForStock.id,
            limitOrders: limitOrdersOnStock.concat(newLimitOrder),
        });

        closeBuyLimit();
        closeSellLimit();
    };

    const handleLimitOrderDelete = async (id: ILimitOrderId) => {
        const maybeResponse = await TransactionFrontendService.deleteLimitOrder({ id }, getTokenInCookie());

        const response = checkIfIsError(maybeResponse);
        if (response === undefined) {
            return;
        }

        updateLimitOrdersOnStock({
            stockId: viewLimitOrdersForStock.id,
            limitOrders: limitOrdersOnStock.filter(order => order.id !== id),
        });
        showToast({ intent: "none", message: response.message });
    };

    const buyLimitOrders = limitOrdersOnStock.filter(order => order.type === "buy-limit");
    const sellLimitOrders = limitOrdersOnStock.filter(order => order.type === "sell-limit");

    return (
        <div className={styles.overallContainer}>
            <div className={styles.header}>
                <span className={styles.stockName}>{viewLimitOrdersForStock.name}</span>
                <span className={styles.limitOrders}>Limit orders</span>
                <div className={styles.descriptionContainer}>
                    <div className={styles.description}>
                        Current price: {formatDollar(viewLimitOrdersForStock.dollarValue)}
                    </div>
                    <div className={styles.description}>
                        You own: {userOwnedStockOfStockWithLatestPrice?.quantity.toLocaleString() ?? 0} shares
                    </div>
                </div>
            </div>
            <div className={styles.existingLimitOrderContainers}>
                <Button className={styles.backButton} icon="arrow-left" minimal onClick={onGoBack} />
                <span className={styles.sectionLabel}>Buy limit orders</span>
                <DisplayLimitOrders limitOrders={buyLimitOrders} onLimitOrderDelete={handleLimitOrderDelete} />
                <Button
                    className={styles.newLimitOrderButton}
                    icon="plus"
                    intent="success"
                    onClick={openBuyLimit}
                    text="New buy order"
                />
                <NewBuyLimitOrder
                    cashOnHand={cashOnHand}
                    isOpen={isBuyLimitOpen}
                    onClose={closeBuyLimit}
                    onNewLimitOrder={onNewLimitOrder}
                    userOwnedStockOfStockWithLatestPrice={userOwnedStockOfStockWithLatestPrice}
                    stock={viewLimitOrdersForStock}
                />
                <span className={classNames(styles.sectionLabel, styles.bottomSectionLabel)}>Sell limit orders</span>
                <DisplayLimitOrders limitOrders={sellLimitOrders} onLimitOrderDelete={handleLimitOrderDelete} />
                <Button
                    className={styles.newLimitOrderButton}
                    icon="plus"
                    intent="primary"
                    onClick={openSellLimit}
                    text="New sell order"
                />
                <NewSellLimitOrder
                    cashOnHand={cashOnHand}
                    isOpen={isSellLimitOpen}
                    onClose={closeSellLimit}
                    onNewLimitOrder={onNewLimitOrder}
                    userOwnedStockOfStockWithLatestPrice={userOwnedStockOfStockWithLatestPrice}
                    stock={viewLimitOrdersForStock}
                />
            </div>
        </div>
    );
};

function mapStateToProps(state: IStoreState): IStoreProps {
    return {
        cashOnHand: state.account.userAccount?.cashOnHand ?? 0,
        limitOrdersOnStock:
            state.interface.viewLimitOrdersForStock === undefined
                ? []
                : state.account.limitOrdersOnStocks[state.interface.viewLimitOrdersForStock.id] ?? [],
        userOwnedStockOfStockWithLatestPrice: selectUserOwnedStock(state.interface.viewLimitOrdersForStock)(state),
        viewLimitOrdersForStock: state.interface.viewLimitOrdersForStock,
    };
}

function mapDispatchToProps(dispatch: Dispatch): IDispatchProps {
    const boundActions = {
        setViewStockWithLatestPrice: SetViewStockWithLatestPrice,
        updateLimitOrdersOnStock: UpdateLimitOrdersOnStock,
    };

    return bindActionCreators(boundActions, dispatch);
}

export const LimitOrders = connect(mapStateToProps, mapDispatchToProps)(UnconnectedLimitOrders);
