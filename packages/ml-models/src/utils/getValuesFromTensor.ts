import _ from "lodash";
import tensorflow from "@tensorflow/tfjs-node";

const isSingleTensor = (tensor: tensorflow.Tensor | tensorflow.Tensor[]): tensor is tensorflow.Tensor => {
    return !Array.isArray(tensor);
};

export function getValuesFromTensor(tensor: tensorflow.Tensor | tensorflow.Tensor[]): number[] {
    if (isSingleTensor(tensor)) {
        return Array.from(tensor.dataSync().values());
    }

    return _.flatten(tensor.map(getValuesFromTensor));
}
