import _ from "lodash";
import * as tf from "@tensorflow/tfjs-node";

const isSingleTensor = (tensor: tf.Tensor | tf.Tensor[]): tensor is tf.Tensor => {
    return !Array.isArray(tensor);
};

export function getValuesFromTensor(tensor: tf.Tensor | tf.Tensor[]): number[] {
    if (isSingleTensor(tensor)) {
        return Array.from(tensor.dataSync().values());
    }

    return _.flatten(tensor.map(getValuesFromTensor));
}
