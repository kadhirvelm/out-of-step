import { Classes, Icon } from "@blueprintjs/core";
import { IGetAccountResponse } from "@stochastic-exchange/api";
import classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch, useHistory, useLocation } from "react-router-dom";
import { bindActionCreators, Dispatch } from "redux";
import { isTimeInMarketHours } from "@stochastic-exchange/utils";
import { AccountServiceFrontend } from "../../../api/dist";
import { SetUserAccountAndOwnedStocks } from "../store/account/actions";
import { executePrivateEndpoint } from "../utils/executePrivateEndpoint";
import styles from "./mainPage.module.scss";
import { CurrentStandings } from "./standings/currentStandings";
import { PortfolioManager } from "./portfolio/portfolioManager";
import { StockInformation } from "./stocks/stockInformation";
import { UserManager } from "./userManager/userManager";
import { ViewTransactions } from "./transactions/viewTransaction";
import { Routes } from "../common/routes";
import { StockDetails } from "./stock-details/stockDetails";
import { Help } from "./help/help";

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

    const onUserClick = () => history.push(Routes.USER);
    const onPortfolioClick = () => history.push(Routes.PORTFOLIO);
    const onScoreClick = () => history.push(Routes.SCORE);

    return (
        <div className={classNames(styles.overallContainer, { [Classes.DARK]: !isTimeInMarketHours(new Date()) })}>
            <div className={styles.headerContainer}>
                <div className={styles.headerIconContainer} onClick={onUserClick}>
                    <Icon
                        className={classNames(styles.headerIcon, {
                            [styles.active]: location.pathname === "/user",
                        })}
                        icon="user"
                        iconSize={Icon.SIZE_STANDARD}
                    />
                </div>
                <div className={styles.headerIconContainer} onClick={onPortfolioClick}>
                    <Icon
                        className={classNames(styles.headerIcon, {
                            [styles.active]: location.pathname === "/portfolio",
                        })}
                        icon="chart"
                        iconSize={Icon.SIZE_STANDARD}
                    />
                </div>
                <div className={styles.headerIconContainer} onClick={onScoreClick}>
                    <Icon
                        className={classNames(styles.headerIcon, {
                            [styles.active]: location.pathname === "/score",
                        })}
                        icon="path"
                        iconSize={Icon.SIZE_STANDARD}
                    />
                </div>
            </div>
            <div className={styles.mainContentContainer}>
                <Switch>
                    <Route path={Routes.HELP} component={Help} />
                    <Route path={Routes.PORTFOLIO} component={PortfolioManager} />
                    <Route path={Routes.SCORE} component={CurrentStandings} />
                    <Route path={Routes.STOCK} component={StockInformation} />
                    <Route path={Routes.STOCK_INFORMATION} component={StockDetails} />
                    <Route path={Routes.TRANSACTIONS} component={ViewTransactions} />
                    <Route path={Routes.USER} component={UserManager} />
                    <Redirect to={Routes.PORTFOLIO} />
                </Switch>
            </div>
        </div>
    );
};

function mapDispatchToProps(dispatch: Dispatch): IDispatchProps {
    return bindActionCreators({ setUserAccountAndOwnedStocks: SetUserAccountAndOwnedStocks }, dispatch);
}

export const MainPage = connect(undefined, mapDispatchToProps)(UnconnectedMainPage);
