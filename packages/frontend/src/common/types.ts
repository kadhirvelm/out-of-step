import { IStock, IPriceHistory, IPriceHistoryId } from "../../../api/dist";

export type IStockWithDollarValue = IStock &
    Pick<IPriceHistory, "dollarValue" | "timestamp"> & { priceHistoryId: IPriceHistoryId };
