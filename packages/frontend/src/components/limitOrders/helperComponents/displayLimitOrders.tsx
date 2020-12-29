import { Button, Icon, NonIdealState } from "@blueprintjs/core";
import { ILimitOrder, ILimitOrderId } from "@stochastic-exchange/api";
import classNames from "classnames";
import * as React from "react";
import { getLimitOrderPrice } from "../../../utils/getLimitOrderPrice";
import styles from "./displayLimitOrder.module.scss";

interface IProps {
    limitOrders: ILimitOrder[];
    onLimitOrderDelete: (id: ILimitOrderId) => void;
}

export const DisplayLimitOrders: React.FC<IProps> = ({ limitOrders, onLimitOrderDelete }) => {
    if (limitOrders.length === 0) {
        return <NonIdealState className={styles.nonIdealHeight} description="None to display." />;
    }

    const deleteThisLimitOrder = (id: ILimitOrderId) => () => onLimitOrderDelete(id);

    return (
        <div className={styles.mainContainer}>
            {limitOrders.map(order => (
                <div className={classNames(styles.limitOrder)} key={order.id}>
                    <div className={styles.directionContainer}>
                        {order.direction === "higher" ? <Icon icon="arrow-up" /> : <Icon icon="arrow-down" />}
                    </div>
                    <div className={styles.content}>
                        <span className={styles.timestamp}>{new Date(order.timestamp).toLocaleString()}</span>
                        <span className={styles.summaryText}>
                            {order.type === "buy-limit" ? "Buy" : "Sell"}{" "}
                            <span className={styles.importantValue}>{order.quantity.toLocaleString()}</span> shares when
                            the price {order.direction === "higher" ? "raises above" : "drops below"}{" "}
                            <span className={styles.importantValue}>{getLimitOrderPrice(order)}</span>.
                        </span>
                    </div>
                    <Button icon="cross" minimal onClick={deleteThisLimitOrder(order.id)} />
                </div>
            ))}
        </div>
    );
};
