import { IStock, IPriceHistory } from "../../../api/dist";

export type IStockWithDollarValue = IStock & Pick<IPriceHistory, "dollarValue" | "timestamp">;
