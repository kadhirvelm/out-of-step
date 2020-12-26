import { Button, InputGroup } from "@blueprintjs/core";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { AccountServiceFrontend, IAccount } from "../../../../api/dist";
import { SetToken, UpdatedUserAccount } from "../../store/account/actions";
import { IStoreState } from "../../store/state";
import { checkIfIsError } from "../../utils/checkIfIsError";
import { showToast } from "../../utils/toaster";
import { getTokenInCookie } from "../../utils/tokenInCookies";
import styles from "./userManager.module.scss";

interface IStoreProps {
    userAccount: Omit<IAccount, "hashedPassword"> | undefined;
}

interface IDispatchProps {
    setTokenToUndefined: () => void;
    updateUserAccount: (updatedUserAccount: Partial<IAccount>) => void;
}

const UserAccountDetails: React.FC<{
    setUpdatedUserAccount: (updatedUserAccount: Partial<IAccount>) => void;
    userAccount: Partial<IAccount>;
}> = ({ setUpdatedUserAccount, userAccount }) => {
    const [isLoading, setIsLoading] = React.useState(false);

    const [updatedUser, onUpdateUser] = React.useState<Partial<IAccount>>(userAccount);

    const updateUser = async () => {
        setIsLoading(true);
        const result = await AccountServiceFrontend.updateAccount({ updatedAccount: updatedUser }, getTokenInCookie());

        const checkedForError = checkIfIsError(result);
        if (checkedForError !== undefined) {
            showToast({ intent: "success", message: checkedForError.message });
        }

        setUpdatedUserAccount(updatedUser);
        setIsLoading(false);
    };

    const updateUserDetails = (key: keyof IAccount) => (event: React.ChangeEvent<HTMLInputElement>) => {
        onUpdateUser({ ...updatedUser, [key]: event.currentTarget.value });
    };

    const fields: Array<{
        label: string;
        key: keyof Omit<IAccount, "cashOnHand">;
    }> = [
        {
            label: "Email",
            key: "email",
        },
        {
            label: "Name",
            key: "name",
        },
        {
            label: "Portfolio name",
            key: "portfolioName",
        },
        {
            label: "New password",
            key: "hashedPassword",
        },
    ];

    return (
        <div className={styles.userFieldsContainer}>
            {fields.map(field => (
                <div className={styles.singleFieldContainer}>
                    <span className={styles.fieldLabel}>{field.label}</span>
                    <InputGroup
                        className={styles.fieldInput}
                        intent={userAccount[field.key] !== updatedUser[field.key] ? "warning" : "none"}
                        onChange={updateUserDetails(field.key)}
                        placeholder={field.label}
                        value={updatedUser[field.key] ?? ""}
                    />
                </div>
            ))}
            <Button
                className={styles.updateButton}
                disabled={updatedUser === userAccount}
                icon="updated"
                intent={updatedUser === userAccount ? "none" : "warning"}
                loading={isLoading}
                onClick={updateUser}
                text="Update details"
            />
        </div>
    );
};

const UnconnectedUserManager: React.FC<IDispatchProps & IStoreProps> = ({
    userAccount,
    updateUserAccount,
    setTokenToUndefined,
}) => {
    return (
        <div className={styles.mainContainer}>
            {userAccount !== undefined && (
                <UserAccountDetails userAccount={userAccount} setUpdatedUserAccount={updateUserAccount} />
            )}
            <Button className={styles.logoutButton} icon="log-out" text="Log out" onClick={setTokenToUndefined} />
        </div>
    );
};

function mapStateToProps(state: IStoreState): IStoreProps {
    return {
        userAccount: state.account.userAccount,
    };
}

function mapDispatchToProps(dispatch: Dispatch): IDispatchProps {
    return {
        ...bindActionCreators({ updateUserAccount: UpdatedUserAccount }, dispatch),
        setTokenToUndefined: () => dispatch(SetToken({ token: undefined })),
    };
}

export const UserManager = connect(mapStateToProps, mapDispatchToProps)(UnconnectedUserManager);
