import tf from "@tensorflow/tfjs-node";

export interface ITrainLinearModelOptions {
    optimizer?: string | tf.Optimizer;
    loss?: string;
}

export async function trainLinearModel(
    xTrainingSet: number[],
    yTrainingSet: number[],
    options?: ITrainLinearModelOptions,
) {
    const model = tf.sequential();

    const xTensor = tf.tensor2d(xTrainingSet, [xTrainingSet.length, 1]);
    const yTensor = tf.tensor2d(yTrainingSet, [yTrainingSet.length, 1]);

    model.add(tf.layers.dense({ units: xTensor.shape[1], inputShape: [xTensor.shape[1]] }));
    model.add(tf.layers.dense({ units: 1 }));

    model.compile({
        optimizer: options?.optimizer ?? tf.train.adam(0.1),
        loss: options?.loss ?? "meanSquaredError",
    });

    await model.fit(xTensor, yTensor, { batchSize: 32, epochs: 100, shuffle: true, validationSplit: 0.1 });

    return model;
}
