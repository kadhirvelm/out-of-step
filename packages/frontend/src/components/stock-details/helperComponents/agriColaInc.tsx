import * as React from "react";
import { createGoogleNewsLink } from "../../../utils/createGoogleNewsLink";
import styles from "./common.module.scss";

export const AgriColaInc: React.FC<{}> = () => {
    return (
        <div className={styles.informationContainer}>
            <div className={styles.firstSectionLabel}>Overview</div>
            <div className={styles.underline} />
            <div className={styles.paragraph}>
                A player in the production of large scale biomass used as inputs to biologicals pipelines. Agri Cola has
                been around for many years and has some aging infrastructure, consequently not all of its production has
                been modernized to vertical and hydroponic based farming techniques yet.
            </div>
            <div className={styles.paragraph}>
                The company struggled for many years before it recently managed to acquire a large and long lasting
                contract with a currently unidentified customer. The majority of its business comes from this single
                large partnership.
            </div>
            <div className={styles.divider} />
            <div className={styles.sectionLabel}>Company information</div>
            <div className={styles.underline} />
            <div className={styles.row}>
                <div className={styles.rowLabel}>Headquarters:</div>
                <div>North-eastern USA</div>
            </div>
            <div className={styles.row}>
                <div className={styles.rowLabel}>Founded:</div>
                <div>1994</div>
            </div>
            <div className={styles.row}>
                <div className={styles.rowLabel}>IPO year:</div>
                <div>2020</div>
            </div>
            <div className={styles.divider} />
            <div className={styles.sectionLabel}>Possible sources</div>
            <div className={styles.underline} />
            <a
                className={styles.link}
                href={createGoogleNewsLink("top agricultural stocks news")}
                target="_blank"
                rel="noreferrer"
            >
                Top agricultural stocks
            </a>
            <a className={styles.link} href="http://hint.fm/wind/" target="_blank" rel="noreferrer">
                The wind map
            </a>
            <a
                className={styles.link}
                href={createGoogleNewsLink("temperature trends in the united states")}
                target="_blank"
                rel="noreferrer"
            >
                Temperature trends
            </a>
        </div>
    );
};
