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
import { useCallOnPrivateEndpoint } from "../../utils/useCallOnPrivateEndpoint";

interface IStoreProps {
    cashOnHand: number;
    limitOrdersOnStock: ILimitOrder[] | undefined;
    userOwnedStockOfStockWithLatestPrice: IOwnedStock | undefined;
    viewLimitOrdersForStock: IStockWithDollarValue | undefined;
}

interface IDispatchProps {
    setViewStockWithLatestPrice: (stockWithDollarValue: IStockWithDollarValue) => void;
    updateLimitOrdersOnStock: (payload: { stockId: IStockId; limitOrders: ILimitOrder[] }) => void;
}

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

    if (viewLimitOrdersForStock === undefined) {
        history.push(Routes.PORTFOLIO);
        return null;
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const limitOrders = useCallOnPrivateEndpoint(
        TransactionFrontendService.viewLimitOrdersForStock,
        { stockId: viewLimitOrdersForStock.id },
        [viewLimitOrdersForStock.id],
        `limit-order-${viewLimitOrdersForStock.id}`,
    );

    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
        if (limitOrders === undefined || limitOrdersOnStock !== undefined) {
            return;
        }

        updateLimitOrdersOnStock({
            stockId: viewLimitOrdersForStock.id,
            limitOrders: limitOrders.limitOrders,
        });
    }, [viewLimitOrdersForStock, limitOrders, updateLimitOrdersOnStock, limitOrdersOnStock]);

    const openBuyLimit = () => setIsBuyLimitOpen(true);
    const closeBuyLimit = () => setIsBuyLimitOpen(false);

    const openSellLimit = () => setIsSellLimitOpen(true);
    const closeSellLimit = () => setIsSellLimitOpen(false);

    const defaultLimitOrdersOnStock = limitOrdersOnStock ?? [];

    const onGoBack = () => {
        setViewStockWithLatestPrice(viewLimitOrdersForStock);
        history.push(Routes.STOCK);
    };

    const onNewLimitOrder = (newLimitOrder: ILimitOrder) => {
        updateLimitOrdersOnStock({
            stockId: viewLimitOrdersForStock.id,
            limitOrders: defaultLimitOrdersOnStock.concat(newLimitOrder),
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
            limitOrders: defaultLimitOrdersOnStock.filter(order => order.id !== id),
        });
        showToast({ intent: "none", message: response.message });
    };

    const buyLimitOrders = defaultLimitOrdersOnStock.filter(order => order.type === "buy-limit");
    const sellLimitOrders = defaultLimitOrdersOnStock.filter(order => order.type === "sell-limit");

    return (
        <div className={styles.overallContainer}>
            <div className={styles.header}>
                <span className={styles.limitOrders}>Limit orders for</span>
                <span className={styles.stockName}>{viewLimitOrdersForStock.name}</span>
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
                <DisplayLimitOrders
                    isLoading={limitOrders === undefined}
                    limitOrders={buyLimitOrders}
                    onLimitOrderDelete={handleLimitOrderDelete}
                />
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
                <DisplayLimitOrders
                    isLoading={limitOrders === undefined}
                    limitOrders={sellLimitOrders}
                    onLimitOrderDelete={handleLimitOrderDelete}
                />
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
                ? undefined
                : state.account.limitOrdersOnStocks[state.interface.viewLimitOrdersForStock.id] ?? undefined,
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
