/* eslint-disable @typescript-eslint/require-await */

import { IHistoricalPricePointsId, IPricePointId, IStockId, IVolumeId, StocksBackendService } from "@out-of-step/api";
import Express from "express";

export function configureAllRoutes(app: Express.Express) {
    StocksBackendService(app, {
        getAllStocks: async () => {
            return [
                {
                    id: "test-stock-1" as IStockId,
                    historicalPricePoints: "test-historical-price-points" as IHistoricalPricePointsId,
                    latestPricePoint: "latest-price-point" as IPricePointId,
                    metadata: {
                        name: "Sample stock 1",
                        status: "available",
                    },
                    volume: "volume-id" as IVolumeId,
                },
            ];
        },
    });
}
