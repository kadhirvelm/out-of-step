import * as React from "react";
import { createGoogleNewsLink } from "../../../utils/createGoogleNewsLink";
import styles from "./common.module.scss";

export const LeagueOfInfluencers: React.FC<{}> = () => {
    return (
        <div className={styles.informationContainer}>
            <div className={styles.firstSectionLabel}>Overview</div>
            <div className={styles.underline} />
            <div className={styles.paragraph}>
                A lobbyist group for hire that decided to go public since they&apos;re &quot;a Silicon Valley company at
                heart,&quot; though all things considered, with their lack of morals they seem to be in the right
                company. The company&apos;s main line of business is pushing all kinds of legislative proposals into
                Congress. They&apos;re not well known for getting their customer&apos;s legislative agendas passed, but
                they&apos;re sure good at getting new bills introduced on the Congressional floor. The companies has
                offices in San Francisco, New York, and is head quartered in Washington DC.
            </div>
            <div className={styles.divider} />
            <div className={styles.sectionLabel}>S1 snippet on &quot;Risks&quot;</div>
            <div className={styles.underline} />
            <div className={styles.paragraph}>
                &quot;A few years ago it was leaked one that one of the company&apos; primary customers is Koch
                Industries, a known climate change denial group. While Koch Industries does not often call on the
                company for lobbying efforts, it seems politicians across the board tend to fear association with
                climate change and are less likely to work with our lobbyist experts (internally referred to as
                influencers) when the air quality dips, bringing climate change front and center.&quot;
            </div>
            <div className={styles.divider} />
            <div className={styles.sectionLabel}>Company information</div>
            <div className={styles.underline} />
            <div className={styles.row}>
                <div className={styles.rowLabel}>Headquarters:</div>
                <div>Washington, DC</div>
            </div>
            <div className={styles.row}>
                <div className={styles.rowLabel}>Founded:</div>
                <div>1987</div>
            </div>
            <div className={styles.row}>
                <div className={styles.rowLabel}>IPO year:</div>
                <div>2018</div>
            </div>
            <div className={styles.divider} />
            <div className={styles.sectionLabel}>Possible sources</div>
            <div className={styles.underline} />
            <a
                className={styles.link}
                href={createGoogleNewsLink("upcoming congressional bills")}
                target="_blank"
                rel="noreferrer"
            >
                Upcoming congressional bills
            </a>
            <a
                className={styles.link}
                href={createGoogleNewsLink("latest gun violence in america")}
                target="_blank"
                rel="noreferrer"
            >
                Latest gun violence
            </a>
        </div>
    );
};
