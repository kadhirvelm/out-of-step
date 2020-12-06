import { Spinner } from "@blueprintjs/core";
import * as React from "react";
import { AccountServiceFrontend, IAccountId } from "../../../../api/dist";
import { callOnPrivateEndpoint } from "../../utils/callOnPrivateEndpoint";
import styles from "./currentStandings.module.scss";

export const CurrentStandings: React.FC<{ userAccountId: IAccountId | undefined }> = ({ userAccountId }) => {
    const currentStandings = callOnPrivateEndpoint(AccountServiceFrontend.getCurrentStandings, undefined);

    if (currentStandings === undefined) {
        return (
            <div className={styles.spinnerContainer}>
                <Spinner />
            </div>
        );
    }

    return (
        <div className={styles.standingsContainer}>
            {currentStandings.map((standing, index) => (
                <div className={styles.singleStandingsContainer} key={standing.accountId}>
                    <div className={styles.informationSpacer}>
                        <span>{index + 1}</span>
                        <div className={styles.informationContainer}>
                            <span className={styles.portfolioName}>{standing.portfolioName}</span>
                            <span className={styles.netWorth}>${standing.netWorth.toLocaleString()}</span>
                        </div>
                    </div>
                    <div>{standing.accountId === userAccountId ? "You" : ""}</div>
                </div>
            ))}
        </div>
    );
};
