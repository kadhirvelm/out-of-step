import { defineAction } from "redoodle";

export const SetOwnedStockQuantity = defineAction("SetOwnedStockQuantity")<{ [stockId: string]: number }>();
