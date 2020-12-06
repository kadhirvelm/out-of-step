import { Icon } from "@blueprintjs/core";
import { IGetAccountResponse } from "@stochastic-exchange/api";
import classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch, useHistory, useLocation } from "react-router-dom";
import { bindActionCreators, Dispatch } from "redux";
import { AccountServiceFrontend } from "../../../api/dist";
import { SetUserAccountAndOwnedStocks } from "../store/account/actions";
import { executePrivateEndpoint } from "../utils/executePrivateEndpoint";
import styles from "./mainPage.module.scss";
import { CurrentStandings } from "./standings/currentStandings";
import { StockManager } from "./stocks/stockManager";
import { UserManager } from "./userManager/userManager";

interface IDispatchProps {
    setUserAccountAndOwnedStocks: (userAccountAndOwnedStocks: IGetAccountResponse) => void;
}

const getUser = async (setUserAccountAndOwnedStocks: (userAccount: IGetAccountResponse) => void) => {
    const response = await executePrivateEndpoint(AccountServiceFrontend.getAccount, undefined);
    if (response === undefined) {
        return;
    }

    setUserAccountAndOwnedStocks(response);
};

const UnconnectedMainPage: React.FC<IDispatchProps> = ({ setUserAccountAndOwnedStocks }) => {
    const history = useHistory();
    const location = useLocation();

    React.useEffect(() => {
        getUser(setUserAccountAndOwnedStocks);
    }, []);

    const onUserClick = () => history.push("/user");
    const onPortfolioClick = () => history.push("/portfolio");
    const onScoreClick = () => history.push("/score");

    return (
        <div className={styles.overallContainer}>
            <div className={styles.mainContentContainer}>
                <Switch>
                    <Route path="/user" component={UserManager} />
                    <Route path="/portfolio" component={StockManager} />
                    <Route path="/score" component={CurrentStandings} />
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

function mapDispatchToProps(dispatch: Dispatch): IDispatchProps {
    return bindActionCreators({ setUserAccountAndOwnedStocks: SetUserAccountAndOwnedStocks }, dispatch);
}

export const MainPage = connect(undefined, mapDispatchToProps)(UnconnectedMainPage);
