import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { Button, InputGroup } from "@blueprintjs/core";
import { AccountServiceFrontend } from "../../../api/dist";
import { SetToken } from "../store/account/actions";
import { setTokenInCookie } from "../utils/tokenInCookies";
import styles from "./loginPage.module.scss";
import { hashPassword } from "../utils/hashPassword";

interface IDispatchProps {
    setToken: (payload: { token: string }) => void;
}

const UnconnectedLoginPage: React.FC<IDispatchProps> = ({ setToken }) => {
    const [typeOfEntry, setTypeOfEntry] = React.useState<"creating-account" | "login">("login");

    const [rawTextPassword, setRawTextPassword] = React.useState<string>("");
    const [username, setUsername] = React.useState<string>("");

    const [email, setEmail] = React.useState("");
    const [name, setName] = React.useState("");

    const [loginError, setLoginError] = React.useState<string | undefined>(undefined);

    const completeLogin = (token: string) => {
        setToken({ token });
        setTokenInCookie(token);
    };

    const login = async () => {
        const tokenOrError = await AccountServiceFrontend.loginToAccount({
            hashedPassword: hashPassword(rawTextPassword),
            username,
        });

        if (typeof tokenOrError !== "string") {
            setLoginError(tokenOrError.error);
        } else {
            completeLogin(tokenOrError);
        }
    };

    const createAccount = async () => {
        const tokenOrError = await AccountServiceFrontend.createAccount({
            hashedPassword: hashPassword(rawTextPassword),
            email,
            name,
            username,
        });

        if (typeof tokenOrError !== "string") {
            setLoginError(tokenOrError.error);
        } else {
            completeLogin(tokenOrError);
        }
    };

    const switchTypeOfEntry = () => {
        if (typeOfEntry === "login") {
            setTypeOfEntry("creating-account");
        } else {
            setTypeOfEntry("login");
        }
    };

    const updateName = (event: React.ChangeEvent<HTMLInputElement>) => setName(event.currentTarget.value);
    const updateEmail = (event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.currentTarget.value);

    const renderExtraFields = () => {
        return (
            <>
                <InputGroup placeholder="Name" onChange={updateName} value={name} />
                <InputGroup placeholder="Email" onChange={updateEmail} value={email} />
            </>
        );
    };

    const updateUsername = (event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.currentTarget.value);
    const updateRawTextPassword = (event: React.ChangeEvent<HTMLInputElement>) =>
        setRawTextPassword(event.currentTarget.value);

    return (
        <div className={styles.mainContainer}>
            <div className={styles.overallContainer}>
                <div className={styles.stochasticExchangeContainer}>Stochastic Exchange</div>
                <div className={styles.fieldsContainer}>
                    <InputGroup placeholder="Username" onChange={updateUsername} value={username} />
                    <InputGroup
                        placeholder="Password"
                        onChange={updateRawTextPassword}
                        type="password"
                        value={rawTextPassword}
                    />
                    {typeOfEntry === "creating-account" && renderExtraFields()}
                </div>
                <div className={styles.footerContainer}>
                    <Button
                        className={styles.primaryButton}
                        intent="primary"
                        text={typeOfEntry === "login" ? "Login" : "Create account"}
                        onClick={typeOfEntry === "login" ? login : createAccount}
                    />
                    <span className={styles.secondaryButton} onClick={switchTypeOfEntry}>
                        {typeOfEntry === "login" ? "Create account" : "Login"}
                    </span>
                </div>
                <div className={styles.errorContainer}>
                    {loginError !== undefined && <span>{JSON.stringify(loginError)}</span>}
                </div>
            </div>
        </div>
    );
};

function mapDispatchToProps(dispatch: Dispatch): IDispatchProps {
    return bindActionCreators(
        {
            setToken: SetToken,
        },
        dispatch,
    );
}

export const LoginPage = connect(undefined, mapDispatchToProps)(UnconnectedLoginPage);
