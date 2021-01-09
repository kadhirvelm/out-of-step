import * as React from "react";
import { createGoogleNewsLink } from "../../../utils/createGoogleNewsLink";
import styles from "./common.module.scss";

export const StabilityEnterprises: React.FC<{}> = () => {
    return (
        <div className={styles.informationContainer}>
            <div className={styles.firstSectionLabel}>Overview</div>
            <div className={styles.underline} />
            <div className={styles.paragraph}>
                A construction company that specializes in constructing low income housing around the world.
                They&apos;re especially good at constructing for as cheaply as possible using efficiently sourced
                material. This means the company runs quite a risk whenever they begin a new project because if there
                happens to be a natural disaster, specifically an earthquake, while attempting to lay the building
                foundations down, there will be inevitable damage that the company has to cover out of pocket.
            </div>
            <div className={styles.paragraph}>
                As a side hustle, the company also plans and executes events for United States politicians. The company
                has found the more events it&apos;s able to host, the more politicians it can meet, and the better
                chance it has at getting introductions to foreign contracts. So far it has proven to be a worthwhile
                effort.
            </div>
            <div className={styles.divider} />
            <div className={styles.sectionLabel}>Company information</div>
            <div className={styles.underline} />
            <div className={styles.row}>
                <div className={styles.rowLabel}>Headquarters:</div>
                <div>Portland, OR</div>
            </div>
            <div className={styles.row}>
                <div className={styles.rowLabel}>Founded:</div>
                <div>1984</div>
            </div>
            <div className={styles.row}>
                <div className={styles.rowLabel}>IPO year:</div>
                <div>2011</div>
            </div>
            <div className={styles.row}>
                <div className={styles.rowLabel}>Pays out dividends</div>
            </div>
            <div className={styles.divider} />
            <div className={styles.sectionLabel}>Stock data inputs</div>
            <div className={styles.underline} />
            <div className={styles.row}>
                <div className={styles.rowLabel}>Input 1:</div>
                <div>Current global earthquakes</div>
            </div>
            <div className={styles.row}>
                <div className={styles.rowLabel}>Input 2:</div>
                <div>Federal election scheduled events</div>
            </div>
            <div className={styles.divider} />
            <div className={styles.sectionLabel}>Possible sources</div>
            <div className={styles.underline} />
            <a
                className={styles.link}
                href={createGoogleNewsLink("Earthquakes worldwide today")}
                target="_blank"
                rel="noreferrer"
            >
                Earthquakes worldwide today
            </a>
            <a
                className={styles.link}
                href={createGoogleNewsLink("upcoming political events in the US")}
                target="_blank"
                rel="noreferrer"
            >
                Upcoming political events
            </a>
        </div>
    );
};
