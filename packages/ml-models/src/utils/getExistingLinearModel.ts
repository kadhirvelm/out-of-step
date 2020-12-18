import * as tf from "@tensorflow/tfjs-node";
import { getModelPath } from "./getModelPath";
import { ITrainLinearModelOptions } from "./trainLinearModel";

export async function getExistingLinearModel(options: ITrainLinearModelOptions) {
    try {
        return tf.loadLayersModel(`${getModelPath(options.name)}/model.json`);
    } catch {
        return undefined;
    }
}
