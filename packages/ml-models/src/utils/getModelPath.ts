import { join } from "path";

export const getModelPath = (pathName: string) => `file://${join(process.cwd(), "../ml-models/src/models", pathName)}`;
