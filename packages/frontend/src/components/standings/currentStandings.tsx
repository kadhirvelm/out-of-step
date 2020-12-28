import { Spinner } from "@blueprintjs/core";
import * as React from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import { AccountServiceFrontend, IAccountId } from "../../../../api/dist";
import { IStoreState } from "../../store/state";
import { callOnPrivateEndpoint } from "../../utils/callOnPrivateEndpoint";
import styles from "./currentStandings.module.scss";
import { formatDollar } from "../../utils/formatNumber";

interface IStoreProps {
    userAccountId: IAccountId | undefined;
}

const UnconnectedCurrentStandings: React.FC<IStoreProps> = ({ userAccountId }) => {
    const currentStandings = callOnPrivateEndpoint(
        AccountServiceFrontend.getCurrentStandings,
        undefined,
        undefined,
        "current-standings",
    );

    if (currentStandings === undefined) {
        return (
            <div className={styles.spinnerContainer}>
                <Spinner />
            </div>
        );
    }

    return (
        <div className={styles.overallContainer}>
            <span className={styles.leaderboardText}>Leaderboard</span>
            <div className={styles.standingsContainer}>
                {currentStandings.map((standing, index) => (
                    <div
                        className={classNames(styles.singleStandingsContainer, {
                            [styles.gold]: index === 0,
                            [styles.silver]: index === 1,
                            [styles.bronze]: index === 2,
                        })}
                        key={standing.accountId}
                    >
                        <div className={styles.informationSpacer}>
                            <span>{index + 1}</span>
                            <div className={styles.informationContainer}>
                                <span className={styles.portfolioName}>{standing.portfolioName}</span>
                                <span className={styles.netWorth}>
                                    {standing.accountName} ({formatDollar(standing.netWorth)})
                                </span>
                            </div>
                        </div>
                        <div>{standing.accountId === userAccountId ? "You" : ""}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

function mapStateToProps(state: IStoreState): IStoreProps {
    return {
        userAccountId: state.account.userAccount?.id,
    };
}

export const CurrentStandings = connect(mapStateToProps)(UnconnectedCurrentStandings);
