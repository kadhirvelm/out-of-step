import { ILimitOrder, IPriceHistory } from "@stochastic-exchange/api";
import _ from "lodash";
import { postgresPool } from "../../../utils/getPostgresPool";
import { executeLimitOrders } from "./executeLimitOrders";

const getPriceFromLimitOrder = (limitOrder: ILimitOrder) => {
    if (limitOrder.type === "buy-limit") {
        return limitOrder.buyAtPrice;
    }

    return limitOrder.sellAtPrice;
};

const shouldExecuteLimitOrder = (limitOrder: ILimitOrder, pricePointForStock: IPriceHistory): boolean => {
    if (pricePointForStock.stock !== limitOrder.stock) {
        return false;
    }

    const priceOfLimitOrder = getPriceFromLimitOrder(limitOrder);
    const priceOfStock = pricePointForStock.dollarValue;

    if (limitOrder.direction === "higher") {
        return priceOfStock >= priceOfLimitOrder;
    }

    return priceOfStock <= priceOfLimitOrder;
};

export async function handleLimitOrders() {
    const [latestPricePoint, allPendingLimitOrders] = await Promise.all([
        postgresPool.query<IPriceHistory>(
            // eslint-disable-next-line @typescript-eslint/quotes
            'SELECT DISTINCT ON (stock) * FROM "priceHistory" ORDER BY stock, timestamp DESC',
        ),
        postgresPool.query<ILimitOrder>("SELECT * FROM \"limitOrder\" WHERE status = 'PENDING'"),
    ]);

    const keyedByStockPricePoint = _.keyBy(latestPricePoint.rows, "stock");
    const keyedByAllPendingLimitOrders = _.groupBy(allPendingLimitOrders.rows, "stock");

    const limitOrdersToExecute = _.flatten(
        _.compact(
            Object.keys(keyedByStockPricePoint).map(stockId => {
                const limitOrdersForStock = keyedByAllPendingLimitOrders[stockId];
                if (limitOrdersForStock === undefined) {
                    return undefined;
                }

                const toExecuteLimitOrders = limitOrdersForStock.filter(order =>
                    shouldExecuteLimitOrder(order, keyedByStockPricePoint[stockId]),
                );
                if (toExecuteLimitOrders.length === 0) {
                    return undefined;
                }

                return toExecuteLimitOrders;
            }),
        ),
    );

    if (limitOrdersToExecute.length === 0) {
        return undefined;
    }

    return executeLimitOrders(
        limitOrdersToExecute.sort((a, b) =>
            new Date(a.timestamp).valueOf() > new Date(b.timestamp).valueOf() ? 1 : -1,
        ),
        keyedByStockPricePoint,
    );
}
