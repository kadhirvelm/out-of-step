import { Button, Checkbox, Classes, Dialog, InputGroup, Radio, RadioGroup } from "@blueprintjs/core";
import { ILimitOrder, IOwnedStock, IStockWithDollarValue, TransactionFrontendService } from "@stochastic-exchange/api";
import { isTimeInMarketHours } from "@stochastic-exchange/utils";
import * as React from "react";
import classNames from "classnames";
import { checkIfIsError } from "../../../utils/checkIfIsError";
import { formatDollar } from "../../../utils/formatNumber";
import { showToast } from "../../../utils/toaster";
import { getTokenInCookie } from "../../../utils/tokenInCookies";
import styles from "./newLimitOrder.module.scss";

interface IProps {
    cashOnHand: number;
    isOpen: boolean;
    onClose: () => void;
    onNewLimitOrder: (newLimitOrder: ILimitOrder) => void;
    stock: IStockWithDollarValue;
    userOwnedStockOfStockWithLatestPrice: IOwnedStock | undefined;
    type: "buy-limit" | "sell-limit";
}

const NewLimitOrder: React.FC<IProps> = ({
    cashOnHand,
    isOpen,
    onClose,
    onNewLimitOrder,
    stock,
    userOwnedStockOfStockWithLatestPrice,
    type,
}) => {
    const [rawQuantity, setRawQuantity] = React.useState<string>("");
    const [parsedQuantity, setParsedQuantity] = React.useState<number | undefined>(undefined);

    const [rawPrice, setRawPrice] = React.useState<string>("");
    const [parsedPrice, setParsedPrice] = React.useState<number | undefined>(undefined);

    const [direction, setDirection] = React.useState<"higher" | "lower">("higher");

    const [acknowledgeTransaction, setAcknowledgeTransaction] = React.useState(false);

    const resetDialog = () => {
        setRawQuantity("");
        setParsedQuantity(undefined);
        setRawPrice("");
        setParsedPrice(undefined);
        setAcknowledgeTransaction(false);
    };

    const createNewLimitOrder = async () => {
        if (!acknowledgeTransaction || parsedQuantity === undefined || parsedPrice === undefined) {
            return;
        }

        let maybeNewLimitOrder: { message: string; newLimitOrder: ILimitOrder } | { error: string };

        if (type === "buy-limit") {
            maybeNewLimitOrder = await TransactionFrontendService.createLimitOrder(
                {
                    direction,
                    quantity: parsedQuantity,
                    stock: stock.id,
                    buyAtPrice: parsedPrice,
                    sellAtPrice: undefined,
                },
                getTokenInCookie(),
            );
        } else {
            maybeNewLimitOrder = await TransactionFrontendService.createLimitOrder(
                {
                    direction,
                    quantity: parsedQuantity,
                    stock: stock.id,
                    buyAtPrice: undefined,
                    sellAtPrice: parsedPrice,
                },
                getTokenInCookie(),
            );
        }

        const newLimitOrder = checkIfIsError(maybeNewLimitOrder);
        if (newLimitOrder === undefined) {
            setAcknowledgeTransaction(false);
            return;
        }

        showToast({ message: newLimitOrder.message, intent: type === "buy-limit" ? "success" : "primary" });
        resetDialog();
        onNewLimitOrder(newLimitOrder.newLimitOrder);
    };

    const updateRawQuantity = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRawQuantity(event.currentTarget.value);
        setAcknowledgeTransaction(false);
    };
    const updateRawPrice = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRawPrice(event.currentTarget.value);
        setAcknowledgeTransaction(false);
    };

    const updateParsedQuantity = () => {
        const parsedNumber = parseInt(rawQuantity.replace(/,/g, ""), 10);

        // eslint-disable-next-line no-restricted-globals
        if (isNaN(parsedNumber)) {
            setRawQuantity("0");
            setParsedQuantity(0);
        } else {
            setRawQuantity(parsedNumber.toLocaleString());
            setParsedQuantity(parsedNumber);
        }
    };
    const updateParsedPrice = () => {
        const parsedNumber = parseFloat(rawPrice.replace(/(,|\$)/g, ""));

        // eslint-disable-next-line no-restricted-globals
        if (isNaN(parsedNumber)) {
            setRawPrice("0");
            setParsedPrice(0);
        } else {
            const roundedDollar = Math.round(parsedNumber * 100) / 100;
            setRawPrice(formatDollar(roundedDollar));
            setParsedPrice(roundedDollar);
        }
    };

    const updateDirection = (event: React.FormEvent<HTMLInputElement>) => {
        setDirection(event.currentTarget.value as "higher" | "lower");
        setAcknowledgeTransaction(false);
    };

    const isComplete = () =>
        parsedQuantity !== undefined && parsedQuantity > 0 && parsedPrice !== undefined && parsedPrice > 0;

    const toggleAcknowledge = () => setAcknowledgeTransaction(!acknowledgeTransaction);

    return (
        <Dialog
            className={classNames(styles.dialogContainer, { [Classes.DARK]: !isTimeInMarketHours(new Date()) })}
            icon="plus"
            isOpen={isOpen}
            onClose={onClose}
            title={type === "buy-limit" ? "New buy limit" : "New sell limit"}
        >
            <div className={styles.overallContainer}>
                <span className={styles.summaryText}>
                    You currently have {formatDollar(cashOnHand)} cash on hand and own{" "}
                    {userOwnedStockOfStockWithLatestPrice?.quantity.toLocaleString() ?? 0} shares of {stock.name}, which
                    is currently priced at{" "}
                    <span className={styles.importantValue}>{formatDollar(stock.dollarValue)}</span>.
                </span>
                <div className={styles.contentContainer}>
                    <div className={styles.rowContainer}>
                        <span className={styles.label}>{type === "buy-limit" ? "Buy" : "Sell"}</span>
                        <InputGroup
                            className={styles.quantityInputGroup}
                            placeholder="quantity"
                            onBlur={updateParsedQuantity}
                            onChange={updateRawQuantity}
                            value={rawQuantity}
                        />
                    </div>
                    <div className={styles.rowContainer}>
                        <span className={styles.label}>shares if the price</span>
                        <RadioGroup className={styles.radioGroup} onChange={updateDirection} selectedValue={direction}>
                            <Radio label="raises above" value="higher" />
                            <Radio label="drops below" value="lower" />
                        </RadioGroup>
                    </div>
                    <InputGroup
                        placeholder="price"
                        onBlur={updateParsedPrice}
                        onChange={updateRawPrice}
                        value={rawPrice}
                    />
                </div>
                <div className={styles.summaryText}>
                    In summary, if the price{" "}
                    <span className={styles.importantValue}>
                        {direction === "higher" ? "raises above" : "drops below"} {formatDollar(parsedPrice ?? 0)}
                    </span>
                    , you will{" "}
                    <span className={styles.importantValue}>
                        {type === "buy-limit" ? "buy" : "sell"} {parsedQuantity?.toLocaleString() ?? 0}
                    </span>{" "}
                    shares of <span className={styles.importantValue}>{stock.name}</span>.
                </div>
                <div className={styles.note}>
                    Please note this limit order will only be checked whenever the stock prices are updated. The
                    Stochastic Exchange will attempt to execute whatever order it can fill, even if it&apos;s only a
                    partial limit order.
                </div>
                <div>
                    <Checkbox
                        disabled={!isComplete()}
                        checked={acknowledgeTransaction}
                        onChange={toggleAcknowledge}
                        label="I approve of this transaction"
                    />
                </div>
            </div>
            <div className={styles.footerContainer}>
                <Button className={styles.cancelButton} minimal onClick={onClose} text="Cancel" />
                <Button
                    disabled={!isComplete() || !acknowledgeTransaction}
                    intent={type === "buy-limit" ? "success" : "primary"}
                    icon="plus"
                    onClick={createNewLimitOrder}
                    text="Create limit order"
                />
            </div>
        </Dialog>
    );
};

export const NewBuyLimitOrder = (props: Omit<IProps, "type">) => <NewLimitOrder {...props} type="buy-limit" />;
export const NewSellLimitOrder = (props: Omit<IProps, "type">) => <NewLimitOrder {...props} type="sell-limit" />;
