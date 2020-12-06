import { Icon } from "@blueprintjs/core";
import { IAccount, IGetAccountResponse } from "@stochastic-exchange/api";
import classNames from "classnames";
import * as React from "react";
import { Redirect, Route, Switch, useHistory, useLocation } from "react-router-dom";
import { AccountServiceFrontend } from "../../../api/dist";
import { executePrivateEndpoint } from "../utils/executePrivateEndpoint";
import styles from "./mainPage.module.scss";
import { CurrentStandings } from "./standings/currentStandings";
import { StockManager } from "./stocks/stockManager";
import { UserManager } from "./userManager/userManager";

const getUser = async (setUserAccount: (userAccount: IGetAccountResponse | undefined) => void) => {
    setUserAccount(await executePrivateEndpoint(AccountServiceFrontend.getAccount, undefined));
};

export const MainPage: React.FC = () => {
    const history = useHistory();
    const location = useLocation();

    const [userAccount, setUserAccount] = React.useState<IGetAccountResponse | undefined>(undefined);

    React.useEffect(() => {
        getUser(setUserAccount);
    }, []);

    const onUserClick = () => history.push("/user");
    const onPortfolioClick = () => history.push("/portfolio");
    const onScoreClick = () => history.push("/score");

    const updateUserAccount = (updatedUserAccount: Partial<IAccount>) => setUserAccount({ ...userAccount, account: { ...userAccount?.account, ...updatedUserAccount } } as IGetAccountResponse)

    return (
        <div className={styles.overallContainer}>
            <div className={styles.mainContentContainer}>
                <Switch>
                    <Route
                        path="/user"
                        component={() => <UserManager userAccount={userAccount?.account} setUserAccount={updateUserAccount} />}
                    />
                    <Route path="/portfolio" component={StockManager} />
                    <Route path="/score" component={() => <CurrentStandings userAccountId={userAccount?.account.id} />} />
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
