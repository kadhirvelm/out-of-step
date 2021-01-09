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
                been modernized to vertical and hydroponic based farming techniques yet. In other words a lot of its
                harvesting process is deeply dependent on the weather, particularly since much of the crops it grows are
                very temperature sensitive.
            </div>
            <div className={styles.paragraph}>
                The company struggled for many years before it recently managed to acquire a large and long lasting
                contract with a Corteva Agriscience. The majority of its business comes from this single large
                partnership, a new, but well known player in the agricultural space given its a shoot off from
                DowDuPoint. Agri Cola Inc secured this contract by promising rapid delivery of product straight to the
                customer.
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
            <div className={styles.sectionLabel}>Stock data inputs</div>
            <div className={styles.underline} />
            <div className={styles.row}>
                <div className={styles.rowLabel}>Input 1:</div>
                <div>Price of CTVA</div>
            </div>
            <div className={styles.row}>
                <div className={styles.rowLabel}>Input 2:</div>
                <div>Temperature in the NE</div>
            </div>
            <div className={styles.row}>
                <div className={styles.rowLabel}>Input 3:</div>
                <div>Wind speed in the NE</div>
            </div>
            <div className={styles.row}>
                <div className={styles.rowLabel}>Input 4:</div>
                <div>Rainfall in the NE</div>
            </div>
            <div className={styles.divider} />
            <div className={styles.sectionLabel}>Possibly helpful sources</div>
            <div className={styles.underline} />
            <a
                className={styles.link}
                href={createGoogleNewsLink("corteva agriscience news")}
                target="_blank"
                rel="noreferrer"
            >
                Corteva Agriscience
            </a>
            <a className={styles.link} href="http://hint.fm/wind/" target="_blank" rel="noreferrer">
                The wind map
            </a>
            <a
                className={styles.link}
                href={createGoogleNewsLink("weather trends in the north eastern united states")}
                target="_blank"
                rel="noreferrer"
            >
                Weather trends in the north eastern US
            </a>
        </div>
    );
};
