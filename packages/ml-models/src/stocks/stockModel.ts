import * as tf from "@tensorflow/tfjs-node";
import { getExistingLinearModel } from "../utils/getExistingLinearModel";
import { getValuesFromTensor } from "../utils/getValuesFromTensor";
import { ITrainLinearModelOptions, trainLinearModel } from "../utils/trainLinearModel";

export class StockModel<InputData> {
    constructor(private options: ITrainLinearModelOptions, private convertInputToArray: (input: InputData) => any[]) {}

    public getPrice = async (input: InputData) => {
        const trainedModel = await getExistingLinearModel(this.options);
        if (trainedModel === undefined) {
            return undefined;
        }

        const dataArray = this.convertInputToArray(input);

        const predictedValue = trainedModel.predict(tf.tensor2d(dataArray, [1, dataArray.length]));
        return getValuesFromTensor(predictedValue)[0];
    };

    public trainModel = (trainingData: Array<{ input: InputData; output: number }>) => {
        return async () => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            const trainX: any[][] = trainingData.map(td => this.convertInputToArray(td.input));
            const trainY: any[] = trainingData.map(td => td.output);

            await trainLinearModel(trainX, trainY, this.options);
        };
    };
}
