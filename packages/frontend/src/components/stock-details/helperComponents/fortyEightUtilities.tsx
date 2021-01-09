import * as React from "react";
import { createGoogleNewsLink } from "../../../utils/createGoogleNewsLink";
import styles from "./common.module.scss";

export const FortyEightUtilities: React.FC<{}> = () => {
    return (
        <div className={styles.informationContainer}>
            <div className={styles.firstSectionLabel}>Overview</div>
            <div className={styles.underline} />
            <div className={styles.paragraph}>
                One of the primary utilities provider for the lower forty eight states in the United States of America
                specializing in generating and distributing electricity to American households. They have started
                expanding their business to include distributing potable water from sanitation plants, beginning in some
                of the major cities on the west coast. Forty Eight Utilities has been around for a number of years,
                though similar to its work force, the company has not diversified its energy production facilities
                beyond coal. Given global warming, its long term future is unclear, consequently the board authorizes
                dividend payouts regularly in the hope of stabilizing the stock short term, allowing the executive team
                to cash out.
            </div>
            <div className={styles.sectionLabel}>History</div>
            <div className={styles.underline} />
            <div className={styles.paragraph}>
                The company has been in the electrical production and distribution industry since its inception. It was
                founded under the name All American Power back in 1907, but given the 2016 election and subsequent
                political unrest, they were forced to rebrand themselves following intense public backlash. It used the
                opportunity to bring in fresh, diverse talent, which really is just a group of slightly tan Italian
                Americans, who began pushing the company to expand to providing other utilities. This is how they
                entered the water distribution sector, though it&apos;s unclear if this will pay off long term.
            </div>
            <div className={styles.divider} />
            <div className={styles.sectionLabel}>Company information</div>
            <div className={styles.underline} />
            <div className={styles.row}>
                <div className={styles.rowLabel}>Headquarters:</div>
                <div>New York City, NY</div>
            </div>
            <div className={styles.row}>
                <div className={styles.rowLabel}>Founded:</div>
                <div>1907</div>
            </div>
            <div className={styles.row}>
                <div className={styles.rowLabel}>IPO year:</div>
                <div>1943</div>
            </div>
            <div className={styles.divider} />
            <div className={styles.sectionLabel}>Stock data inputs</div>
            <div className={styles.underline} />
            <div className={styles.row}>
                <div className={styles.rowLabel}>Input 1:</div>
                <div>Electrical demand in mainland US</div>
            </div>
            <div className={styles.row}>
                <div className={styles.rowLabel}>Input 2:</div>
                <div>Output of some west coast water plants</div>
            </div>
            <div className={styles.divider} />
            <div className={styles.sectionLabel}>Possible sources</div>
            <div className={styles.underline} />
            <a
                className={styles.link}
                href={createGoogleNewsLink("electrical generation in the US")}
                target="_blank"
                rel="noreferrer"
            >
                Electrical generation in the US
            </a>
            <a
                className={styles.link}
                href={createGoogleNewsLink("Water output on the west coast")}
                target="_blank"
                rel="noreferrer"
            >
                Water output on the west coast
            </a>
        </div>
    );
};
