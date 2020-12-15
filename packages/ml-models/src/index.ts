import tensorflow from "@tensorflow/tfjs-node";
import _ from "lodash";
import { trainLinearModel } from "./utils/trainLinearModel";

const trainX = _.range(0, 1000);
const trainY = _.range(0, 1000);

const testX = [10001, 10002, 10003];

const isSingleTensor = (tensor: tensorflow.Tensor | tensorflow.Tensor[]): tensor is tensorflow.Tensor => {
    return !Array.isArray(tensor);
};

trainLinearModel(trainX, trainY).then(model => {
    const test = model.predict(tensorflow.tensor2d(testX, [testX.length, 1]));

    if (isSingleTensor(test)) {
        console.log(test.dataSync());
    } else {
        test.forEach(singleTensor => {
            console.log(singleTensor.dataSync());
        });
    }
});
