import { Button, Checkbox, Dialog, InputGroup } from "@blueprintjs/core";
import { IAccount, IOwnedStock, IStockWithDollarValue, TransactionFrontendService } from "@stochastic-exchange/api";
import * as React from "react";
import { connect } from "react-redux";
import { CompoundAction } from "redoodle";
import { Dispatch } from "redux";
import { selectUserOwnedStock } from "../../selectors/stocksSelector";
import { IUpdateUserAccountOnTransaction, UpdateUserAccountOnTransaction } from "../../store/account/actions";
import { IStoreState } from "../../store/state";
import { SetOwnedStockQuantity } from "../../store/stocks/actions";
import { executePrivateEndpoint } from "../../utils/executePrivateEndpoint";
import { formatDollar } from "../../utils/formatNumber";
import { showToast } from "../../utils/toaster";
import styles from "./stocksDialog.module.scss";

interface IStoreProps {
    account: Omit<IAccount, "hashedPassword"> | undefined;
    userOwnedStockOfBuyStock: IOwnedStock | undefined;
}

interface IDispatchProps {
    updateStateOnTrasaction: (
        ownedStockQuantity: { [stock: string]: number },
        transaction: IUpdateUserAccountOnTransaction,
    ) => void;
}

interface IOwnProps {
    isOpen: boolean;
    onClose: () => void;
    stock: IStockWithDollarValue;
    totalOwnedStock: number;
    type: "buy" | "sell";
}

const UnconnectedStocksDialog: React.FC<IStoreProps & IDispatchProps & IOwnProps> = ({
    account,
    isOpen,
    onClose,
    stock,
    type,
    totalOwnedStock,
    updateStateOnTrasaction,
    userOwnedStockOfBuyStock,
}) => {
    if (account === undefined) {
        return null;
    }

    const [isLoading, setIsLoading] = React.useState(false);

    const [rawQuantity, setRawQuantity] = React.useState("");
    const [parsedQuantity, setParsedQuantity] = React.useState(0);

    const [acknowledgeTransaction, setAcknowledgeTransaction] = React.useState(false);

    const resetDialog = () => {
        setRawQuantity("");
        setParsedQuantity(0);
        setAcknowledgeTransaction(false);
        setIsLoading(false);
    };

    const onExecuteAction = async () => {
        if (parsedQuantity === undefined) {
            return;
        }

        setIsLoading(true);

        const response = await executePrivateEndpoint(TransactionFrontendService.createExchangeTransaction, {
            price: stock.priceHistoryId,
            purchasedQuantity: type === "buy" ? parsedQuantity : 0,
            soldQuantity: type === "sell" ? parsedQuantity : 0,
            stock: stock.id,
        });

        if (response === undefined) {
            setAcknowledgeTransaction(false);
            setIsLoading(false);
            return;
        }

        updateStateOnTrasaction(
            { [stock.id]: totalOwnedStock + (type === "buy" ? parsedQuantity : -parsedQuantity) },
            {
                stockId: stock.id,
                purchaseQuantity: type === "buy" ? parsedQuantity : 0,
                soldQuantity: type === "sell" ? parsedQuantity : 0,
                price: stock.dollarValue,
            },
        );

        showToast({
            intent: type === "buy" ? "success" : "primary",
            message: `Successfully ${type === "buy" ? "purchased" : "sold"} ${parsedQuantity} shares.`,
        });

        resetDialog();
        onClose();
    };

    const updateRawQuantity = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRawQuantity(event.currentTarget.value);
        setAcknowledgeTransaction(false);
    };

    const maximumSharesPurchaseAble = Math.min(
        Math.floor(account.cashOnHand / stock.dollarValue),
        stock.totalQuantity - totalOwnedStock,
    );
    const maximumSellable = userOwnedStockOfBuyStock?.quantity ?? 0;
    const maximumNumber = type === "buy" ? maximumSharesPurchaseAble : maximumSellable;

    const updateParsedQuantity = () => {
        const parsedNumber = Math.min(parseInt(rawQuantity, 10), maximumNumber);

        // eslint-disable-next-line no-restricted-globals
        if (isNaN(parsedNumber)) {
            setRawQuantity("0");
            setParsedQuantity(0);
        } else {
            setRawQuantity(parsedNumber.toLocaleString());
            setParsedQuantity(parsedNumber);
        }
    };

    const toggleAcknowledge = () => setAcknowledgeTransaction(!acknowledgeTransaction);

    const maybeRenderWarningValue = () => {
        if (parsedQuantity !== maximumNumber) {
            return null;
        }

        return (
            <span>
                , <span className={styles.warningValue}>the maximum possible</span>
            </span>
        );
    };

    return (
        <Dialog
            className={styles.dialogContainer}
            icon="exchange"
            isOpen={isOpen}
            lazy
            onClose={isLoading ? undefined : onClose}
            title={type === "buy" ? "Buy shares" : "Sell shares"}
        >
            <div className={styles.mainDialogBody}>
                <div className={styles.currentSeparatorContainer}>
                    <span className={styles.label}>Cash on hand:</span>
                    <span className={styles.value}>${account.cashOnHand.toLocaleString()}</span>
                </div>
                <div className={styles.currentSeparatorContainer}>
                    <span className={styles.label}>Current shares:</span>
                    <span className={styles.value}>{userOwnedStockOfBuyStock?.quantity.toLocaleString() ?? 0}</span>
                </div>
                <div className={styles.sharesToBuyContainer}>
                    <span className={styles.sharesToBuySentence}>{type === "buy" ? "Buy" : "Sell"}</span>
                    <InputGroup
                        className={styles.inputContainer}
                        intent={parsedQuantity === maximumNumber ? "warning" : "none"}
                        onBlur={updateParsedQuantity}
                        onChange={updateRawQuantity}
                        placeholder="quantity"
                        value={rawQuantity}
                    />
                    <span className={styles.sharesToBuySentence}>shares</span>
                </div>
                <div className={styles.summarySentence}>
                    You will {type} <span className={styles.value}>{parsedQuantity ?? 0}</span> shares of{" "}
                    <span className={styles.value}>{stock.name}</span>
                    {maybeRenderWarningValue()} at <span className={styles.value}>${stock.dollarValue.toFixed(2)}</span>{" "}
                    per share for a total of{" "}
                    <span className={styles.value}>{formatDollar(parsedQuantity * stock.dollarValue)}</span>.
                </div>
                <div className={styles.summarySentence}>
                    After this transaction, you will have{" "}
                    <span className={styles.value}>
                        {(
                            (userOwnedStockOfBuyStock?.quantity ?? 0) +
                            parsedQuantity * (type === "buy" ? 1 : -1)
                        ).toLocaleString()}
                    </span>{" "}
                    shares in total and{" "}
                    <span className={styles.value}>
                        {formatDollar(
                            account.cashOnHand - parsedQuantity * stock.dollarValue * (type === "buy" ? 1 : -1),
                        )}
                    </span>{" "}
                    cash on hand.
                </div>
            </div>
            <div className={styles.acknowledgeContainer}>
                <Checkbox
                    disabled={parsedQuantity === 0}
                    checked={acknowledgeTransaction}
                    onChange={toggleAcknowledge}
                    label="I approve of this transaction"
                />
            </div>
            <div className={styles.footerContainer}>
                <Button minimal onClick={onClose} text="Cancel" />
                <Button
                    className={styles.buyButton}
                    disabled={
                        !acknowledgeTransaction ||
                        parsedQuantity === undefined ||
                        parsedQuantity === 0 ||
                        (type === "buy"
                            ? parsedQuantity * stock.dollarValue > account.cashOnHand
                            : parsedQuantity > (userOwnedStockOfBuyStock?.quantity ?? 0))
                    }
                    intent={type === "buy" ? "success" : "primary"}
                    loading={isLoading}
                    text={type === "buy" ? "Buy shares" : "Sell shares"}
                    onClick={onExecuteAction}
                />
            </div>
        </Dialog>
    );
};

function mapStateToProps(state: IStoreState, ownProps: IOwnProps): IStoreProps {
    return {
        account: state.account.userAccount,
        userOwnedStockOfBuyStock: selectUserOwnedStock(ownProps.stock)(state),
    };
}

function mapDispatchToProps(dispatch: Dispatch): IDispatchProps {
    return {
        updateStateOnTrasaction: (
            ownedStockQuantity: { [stockId: string]: number },
            updateTransaction: IUpdateUserAccountOnTransaction,
        ) =>
            dispatch(
                CompoundAction([
                    SetOwnedStockQuantity(ownedStockQuantity),
                    UpdateUserAccountOnTransaction(updateTransaction),
                ]),
            ),
    };
}

export const StocksDialog = connect(mapStateToProps, mapDispatchToProps)(UnconnectedStocksDialog);

export const BuyStocksDialog: React.FC<Omit<IOwnProps, "type">> = props => <StocksDialog type="buy" {...props} />;
export const SellStocksDialog: React.FC<Omit<IOwnProps, "type">> = props => <StocksDialog type="sell" {...props} />;
