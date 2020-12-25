import * as React from "react";
import { createGoogleNewsLink } from "../../../utils/createGoogleNewsLink";
import styles from "./common.module.scss";

export const DentalDamageAndCompany: React.FC<{}> = () => {
    return (
        <div className={styles.informationContainer}>
            <div className={styles.firstSectionLabel}>Overview</div>
            <div className={styles.underline} />
            <div className={styles.paragraph}>
                Initially, the company produced the specialized tools dentists needed for various procedures but faced
                financially difficult times at the start of 1993. In an attempt to revitalize their business, the
                company switched to mining, preparing and selling some of the cheaper metals used in dentistry, which
                really took the business to the next level. Today, it supplies these metals to many different sectors,
                but the majority of its business still comes from the dental sector.
            </div>
            <div className={styles.sectionLabel}>History</div>
            <div className={styles.underline} />
            <div className={styles.paragraph}>
                Back in 1993, the Got Milk campaign really took off causing many people across the United States to
                temporarily increase their dairy in-take. People, believing drinking more milk caused their teeth to get
                stronger, stopped going to the dentist as frequently, hurting the company&apos;s business.
            </div>
            <div className={styles.divider} />
            <div className={styles.sectionLabel}>Company information</div>
            <div className={styles.underline} />
            <div className={styles.row}>
                <div className={styles.rowLabel}>Headquarters:</div>
                <div>Port St. Lucie, FL</div>
            </div>
            <div className={styles.row}>
                <div className={styles.rowLabel}>Founded:</div>
                <div>1985</div>
            </div>
            <div className={styles.row}>
                <div className={styles.rowLabel}>IPO year:</div>
                <div>2003</div>
            </div>
            <div className={styles.divider} />
            <div className={styles.sectionLabel}>Possible sources</div>
            <div className={styles.underline} />
            <a
                className={styles.link}
                href={createGoogleNewsLink("metals market today")}
                target="_blank"
                rel="noreferrer"
            >
                Metals market today
            </a>
            <a
                className={styles.link}
                href={createGoogleNewsLink("US milk consumption trends")}
                target="_blank"
                rel="noreferrer"
            >
                US milk consumption trends
            </a>
            <a className={styles.link} href={createGoogleNewsLink("US dairy supply")} target="_blank" rel="noreferrer">
                US dairy supply
            </a>
        </div>
    );
};
