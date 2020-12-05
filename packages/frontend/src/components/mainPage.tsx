import { Icon } from "@blueprintjs/core";
import classNames from "classnames";
import * as React from "react";
import { Redirect, Route, Switch, useHistory, useLocation } from "react-router-dom";
import { IAccount, AccountServiceFrontend } from "../../../api/dist";
import { checkIfIsError } from "../utils/checkIfIsError";
import { getTokenInCookie } from "../utils/tokenInCookies";
import styles from "./mainPage.module.scss";
import { StockManager } from "./stocks/stockManager";
import { UserManager } from "./userManager/userManager";

const getUser = async (setUserAccount: (userAccount: Partial<IAccount> | undefined) => void) => {
    const rawUser = await AccountServiceFrontend.getAccount(undefined, getTokenInCookie());
    setUserAccount(checkIfIsError(rawUser));
};

export const MainPage: React.FC = () => {
    const history = useHistory();
    const location = useLocation();

    const [userAccount, setUserAccount] = React.useState<Partial<IAccount> | undefined>(undefined);

    React.useEffect(() => {
        getUser(setUserAccount);
    }, []);

    const onUserClick = () => history.push("/user");
    const onPortfolioClick = () => history.push("/portfolio");
    const onScoreClick = () => history.push("/score");

    return (
        <div className={styles.overallContainer}>
            <div className={styles.mainContentContainer}>
                <Switch>
                    <Route
                        path="/user"
                        component={() => <UserManager userAccount={userAccount} setUserAccount={setUserAccount} />}
                    />
                    <Route path="/portfolio" component={StockManager} />
                    <Route path="/score" component={() => <div>Score</div>} />
                    <Redirect to="/portfolio" />
                </Switch>
            </div>
            <div className={styles.footerContainer}>
                <div className={styles.footerIconContainer} onClick={onUserClick}>
                    <Icon
                        className={classNames(styles.footerIcon, {
                            [styles.active]: location.pathname === "/user",
                        })}
                        icon="user"
                        iconSize={Icon.SIZE_LARGE}
                    />
                </div>
                <div className={styles.footerIconContainer} onClick={onPortfolioClick}>
                    <Icon
                        className={classNames(styles.footerIcon, {
                            [styles.active]: location.pathname === "/portfolio",
                        })}
                        icon="chart"
                        iconSize={Icon.SIZE_LARGE}
                    />
                </div>
                <div className={styles.footerIconContainer} onClick={onScoreClick}>
                    <Icon
                        className={classNames(styles.footerIcon, {
                            [styles.active]: location.pathname === "/score",
                        })}
                        icon="path"
                        iconSize={Icon.SIZE_LARGE}
                    />
                </div>
            </div>
        </div>
    );
};
