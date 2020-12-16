import tf from "@tensorflow/tfjs-node";
import { getModelPath } from "./getModelPath";

export interface ITrainLinearModelOptions {
    batchSize?: number;
    name: string;
    epochs?: number;
    optimizer?: string | tf.Optimizer;
    loss?: string;
}

export async function trainLinearModel(
    xTrainingSet: number[][],
    yTrainingSet: number[],
    options: ITrainLinearModelOptions,
) {
    const xTensor = tf.tensor2d(xTrainingSet, [xTrainingSet.length, xTrainingSet[0].length]);
    const yTensor = tf.tensor2d(yTrainingSet, [yTrainingSet.length, 1]);

    const model = tf.sequential();

    model.add(tf.layers.dense({ units: xTensor.shape[1], inputShape: [xTensor.shape[1]] }));
    model.add(tf.layers.dense({ units: 1 }));

    model.compile({
        optimizer: options?.optimizer ?? tf.train.adam(0.1),
        loss: options?.loss ?? "meanSquaredError",
    });

    await model.fit(xTensor, yTensor, {
        batchSize: options.batchSize ?? 32,
        epochs: options.epochs ?? 50,
        shuffle: true,
        validationSplit: 0.1,
        verbose: 1,
    });

    model.save(getModelPath(options.name));

    return model;
}
