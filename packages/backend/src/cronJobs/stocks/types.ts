import { IPriceHistory, IStockId } from "@stochastic-exchange/api";

export type IStockPriceReturnType<InputToModel extends {}> = Pick<IPriceHistory, "dollarValue"> & {
    calculationNotes: InputToModel;
};

export type IStockPricerPlugin<InputToModel extends {}> = (
    date: Date,
    metadata: { isDevelopmentTest: boolean; stockId: IStockId },
    previousPriceHistory?: Pick<IPriceHistory, "dollarValue" | "calculationNotes">,
) => Promise<IStockPriceReturnType<InputToModel>>;
