import * as React from "react";
import { createGoogleNewsLink } from "../../../utils/createGoogleNewsLink";
import styles from "./common.module.scss";

export const FirstNightTradingCompany: React.FC<{}> = () => {
    return (
        <div className={styles.informationContainer}>
            <div className={styles.firstSectionLabel}>Overview</div>
            <div className={styles.underline} />
            <div className={styles.paragraph}>
                The company has branded itself as the go to anti-long on the American government. It claims to be able
                to make money during periods of high instability through highly classified investing mechanisms, but in
                truth it&apos;s just secretly a rare metals commodities trader. In other words as individuals believe
                there is less and less stability in the world, they withdraw their money from the traditional markets,
                give it to the First Night Trading Company, who in turn just invest in rare metals.
            </div>
            <div className={styles.sectionLabel}>History</div>
            <div className={styles.underline} />
            <div className={styles.paragraph}>
                The company began as the investing arm of the famous doomsday cult &quot;The Second Dawn.&quot; The cult
                had gained quite a following in the lead up to the prophesied end of the world in 2012. All of its new
                members would gave their worldly possessions to the cult for financial management, though unfortunately
                when the world did not end in 2012, all the cult members demanded their money back – not good for
                business. As a way to raise a new round of funding, the company decided to go public.
            </div>
            <div className={styles.divider} />
            <div className={styles.sectionLabel}>Company information</div>
            <div className={styles.underline} />
            <div className={styles.row}>
                <div className={styles.rowLabel}>Headquarters:</div>
                <div>Wasco County, OR</div>
            </div>
            <div className={styles.row}>
                <div className={styles.rowLabel}>Founded:</div>
                <div>1967</div>
            </div>
            <div className={styles.row}>
                <div className={styles.rowLabel}>IPO year:</div>
                <div>2012</div>
            </div>
            <div className={styles.divider} />
            <div className={styles.sectionLabel}>Possible sources</div>
            <div className={styles.underline} />
            <a
                className={styles.link}
                href={createGoogleNewsLink("current US treasury rates")}
                target="_blank"
                rel="noreferrer"
            >
                Current US treasury rates
            </a>
            <a
                className={styles.link}
                href={createGoogleNewsLink("latest rare metals market news")}
                target="_blank"
                rel="noreferrer"
            >
                Rare metals market
            </a>
            <a
                className={styles.link}
                href={createGoogleNewsLink("second dawn doomsday cult the 100")}
                target="_blank"
                rel="noreferrer"
            >
                Second dawn doomsday cult
            </a>
        </div>
    );
};
