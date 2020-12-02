import { IStock, StocksFrontendService } from "@stochastic-exchange/api";
import * as React from "react";

export const MainPage: React.FC = () => {
    const [allStocks, setAllStocks] = React.useState<IStock[]>([]);

    const getStocks = async () => {
        setAllStocks(await StocksFrontendService.getAllStocks({}));
    };

    React.useEffect(() => {
        getStocks();
    }, []);

    return (
        <div>
            {allStocks.map(stock => (
                <div>{stock.id},</div>
            ))}
        </div>
    );
};
