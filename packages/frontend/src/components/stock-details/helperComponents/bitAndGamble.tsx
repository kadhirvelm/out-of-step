import * as React from "react";
import { createGoogleNewsLink } from "../../../utils/createGoogleNewsLink";
import styles from "./common.module.scss";

export const BitAndGamble: React.FC<{}> = () => {
    return (
        <div className={styles.informationContainer}>
            <div className={styles.firstSectionLabel}>Overview</div>
            <div className={styles.underline} />
            <div className={styles.paragraph}>
                A company that provides excellent and automated investing advice to the retail market through cutting
                edge artificial intelligence and machine learning. Interestingly enough, their AI gives every single
                user the same advice: put all your life savings into the crypto market. Nothing could possibly go wrong.
                Coincidentally, it&apos;s the same advice the company&apos;s founder has been giving for a few years
                now.
            </div>
            <div className={styles.paragraph}>
                Seeing the devastating effects that COVID has had on the job market, Bit & Gamble saw an opportunity.
                First, it took out major loans from the federal government, then it began loaning this money directly to
                the recently jobless for investing purposes. In addition, the company has begun providing 5 free
                advising sessions to all new users. While undoubtedly very predatory, it has yet to be seen if this new
                strategy will be effective for the company long term.
            </div>
            <div className={styles.divider} />
            <div className={styles.sectionLabel}>Company information</div>
            <div className={styles.underline} />
            <div className={styles.row}>
                <div className={styles.rowLabel}>Headquarters:</div>
                <div>San Francisco, CA (obviously)</div>
            </div>
            <div className={styles.row}>
                <div className={styles.rowLabel}>Founded:</div>
                <div>2015</div>
            </div>
            <div className={styles.row}>
                <div className={styles.rowLabel}>IPO year:</div>
                <div>2017</div>
            </div>
            <div className={styles.divider} />
            <div className={styles.sectionLabel}>Possible sources</div>
            <div className={styles.underline} />
            <a
                className={styles.link}
                href={createGoogleNewsLink("best crypto currencies")}
                target="_blank"
                rel="noreferrer"
            >
                Best crypto currencies
            </a>
            <a
                className={styles.link}
                href={createGoogleNewsLink("unemployment rate in the united states")}
                target="_blank"
                rel="noreferrer"
            >
                Unemployment rate
            </a>
            <a
                className={styles.link}
                href={createGoogleNewsLink("federal government loans")}
                target="_blank"
                rel="noreferrer"
            >
                Federal government loans
            </a>
            <a
                className={styles.link}
                href={createGoogleNewsLink("federal funds rate")}
                target="_blank"
                rel="noreferrer"
            >
                Federal funds rate
            </a>
        </div>
    );
};
