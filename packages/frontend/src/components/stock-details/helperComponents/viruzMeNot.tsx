import * as React from "react";
import { createGoogleNewsLink } from "../../../utils/createGoogleNewsLink";
import styles from "./common.module.scss";

export const ViruzMeNot: React.FC<{}> = () => {
    return (
        <div className={styles.informationContainer}>
            <div className={styles.firstSectionLabel}>Overview</div>
            <div className={styles.underline} />
            <div className={styles.paragraph}>
                Formed during the dot com boom of the late 1990s, it&apos;s unclear what this company actually does. It
                once was valued at billions of dollars with a luxury office in the heart of San Francisco, but after the
                bubble burst, the company faced hard times. It somehow clung on by furloughing all of its staff except
                the founders, moving the headquarters to Montana, and pivoting its business to something vaguely related
                to scanning the internet for viruses and possible threats.
            </div>
            <div className={styles.paragraph}>
                During the COVID pandemic, the company saw an opportunity to expand its business from just scanning the
                web for virtual viruses to &quot;scanning the world for physical viruses&quot;. The company has yet to
                release exactly what it intends, but rest assured, there is a plan in place to release a product that
                will address corona.
            </div>
            <div className={styles.divider} />
            <div className={styles.sectionLabel}>Company information</div>
            <div className={styles.underline} />
            <div className={styles.row}>
                <div className={styles.rowLabel}>Headquarters:</div>
                <div>Outlook, Montana</div>
            </div>
            <div className={styles.row}>
                <div className={styles.rowLabel}>Founded:</div>
                <div>1995</div>
            </div>
            <div className={styles.row}>
                <div className={styles.rowLabel}>IPO year:</div>
                <div>2000</div>
            </div>
            <div className={styles.divider} />
            <div className={styles.sectionLabel}>Possible sources</div>
            <div className={styles.underline} />
            <a
                className={styles.link}
                href={createGoogleNewsLink("community threat intelligence events")}
                target="_blank"
                rel="noreferrer"
            >
                Community threat intelligence events
            </a>
            <a
                className={styles.link}
                href={createGoogleNewsLink("COVID cases in the United States")}
                target="_blank"
                rel="noreferrer"
            >
                COVID cases in the US
            </a>
        </div>
    );
};
