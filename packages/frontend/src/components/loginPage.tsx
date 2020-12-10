import { Button, InputGroup } from "@blueprintjs/core";
import * as React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { bindActionCreators, Dispatch } from "redux";
import { AccountServiceFrontend } from "../../../api/dist";
import { Routes } from "../common/routes";
import { SetToken } from "../store/account/actions";
import { checkIfIsError } from "../utils/checkIfIsError";
import { hashPassword } from "../utils/hashPassword";
import { setTokenInCookie } from "../utils/tokenInCookies";
import styles from "./loginPage.module.scss";

interface IDispatchProps {
    setToken: (payload: { token: string }) => void;
}

const ResetPassword: React.FC<{
    completeLogin: (token: string | undefined) => void;
    switchBackToLogin: () => void;
}> = ({ completeLogin, switchBackToLogin }) => {
    const history = useHistory();

    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");

    const updateUsername = (event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.currentTarget.value);
    const updateEmail = (event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.currentTarget.value);

    const forgotPassword = async () => {
        const tokenOrError = await AccountServiceFrontend.forgotPassword({
            username,
            email,
        });

        history.push(Routes.USER);
        completeLogin(checkIfIsError(tokenOrError));
    };

    return (
        <>
            <div className={styles.fieldsContainer}>
                <InputGroup placeholder="Username" onChange={updateUsername} value={username} />
                <InputGroup placeholder="Email" onChange={updateEmail} value={email} />
            </div>
            <div className={styles.footerContainer}>
                <Button
                    className={styles.primaryButton}
                    intent="primary"
                    text="Forgot password"
                    onClick={forgotPassword}
                />
                <span className={styles.secondaryButton} onClick={switchBackToLogin}>
                    Login
                </span>
            </div>
        </>
    );
};

const UnconnectedLoginPage: React.FC<IDispatchProps> = ({ setToken }) => {
    const [typeOfEntry, setTypeOfEntry] = React.useState<"creating-account" | "login" | "forgot-password">("login");

    const [rawTextPassword, setRawTextPassword] = React.useState<string>("");
    const [username, setUsername] = React.useState<string>("");

    const [email, setEmail] = React.useState("");
    const [name, setName] = React.useState("");
    const [portfolioName, setPortfolioName] = React.useState("");

    const completeLogin = (token: string | undefined) => {
        if (token === undefined) {
            return;
        }

        setTokenInCookie(token);
        setToken({ token });
    };

    const login = async () => {
        const tokenOrError = await AccountServiceFrontend.loginToAccount({
            hashedPassword: hashPassword(rawTextPassword),
            username,
        });

        completeLogin(checkIfIsError(tokenOrError));
    };

    const createAccount = async () => {
        const tokenOrError = await AccountServiceFrontend.createAccount({
            hashedPassword: hashPassword(rawTextPassword),
            email,
            name,
            username,
            portfolioName,
        });

        completeLogin(checkIfIsError(tokenOrError));
    };

    const switchTypeOfEntry = () => {
        if (typeOfEntry === "login") {
            setTypeOfEntry("creating-account");
        } else if (typeOfEntry === "creating-account") {
            setTypeOfEntry("login");
        }
    };

    const updateName = (event: React.ChangeEvent<HTMLInputElement>) => setName(event.currentTarget.value);
    const updateEmail = (event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.currentTarget.value);
    const updatePortfolioName = (event: React.ChangeEvent<HTMLInputElement>) =>
        setPortfolioName(event.currentTarget.value);

    const renderExtraFields = () => {
        return (
            <>
                <InputGroup placeholder="Your name" onChange={updateName} value={name} />
                <InputGroup placeholder="Email" onChange={updateEmail} value={email} />
                <InputGroup placeholder="Portfolio name" onChange={updatePortfolioName} value={portfolioName} />
            </>
        );
    };

    const updateUsername = (event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.currentTarget.value);
    const updateRawTextPassword = (event: React.ChangeEvent<HTMLInputElement>) =>
        setRawTextPassword(event.currentTarget.value);

    const switchToForgotPassword = () => setTypeOfEntry("forgot-password");

    const renderLoginOrCreate = () => {
        return (
            <>
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
                <div className={styles.forgotPasswordContainer} onClick={switchToForgotPassword}>
                    <span>Forgot password</span>
                </div>
            </>
        );
    };

    const switchBackToLogin = () => setTypeOfEntry("login");

    return (
        <div className={styles.mainContainer}>
            <div className={styles.overallContainer}>
                <div className={styles.stochasticExchangeContainer}>Stochastic Exchange</div>
                {typeOfEntry === "forgot-password" ? (
                    <ResetPassword completeLogin={completeLogin} switchBackToLogin={switchBackToLogin} />
                ) : (
                    renderLoginOrCreate()
                )}
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
