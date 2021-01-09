import { Button } from "@blueprintjs/core";
import * as React from "react";
import { useHistory } from "react-router-dom";
import { Routes } from "../../common/routes";
import { formatDollar } from "../../utils/formatNumber";
import styles from "./help.module.scss";

export const Help: React.FC<{}> = () => {
    const history = useHistory();

    const onGoBack = () => {
        history.push(Routes.PORTFOLIO);
    };

    return (
        <div className={styles.overallContainer}>
            <Button className={styles.backButton} icon="arrow-left" minimal onClick={onGoBack} />
            <div className={styles.title}>Stochastic Exchange Help</div>
            <div className={styles.contentContainer}>
                <div className={styles.sectionTitle}>Overview</div>
                <div className={styles.divider} />
                <div>
                    The goal of the game is simple, make as much money as you can through the simulated stock market.
                    Generally this means buying stocks at a low price and selling them at a higher price. We&apos;re
                    currently in beta testing, but when the game begins all players will be reset along with all stocks.
                    All players will begin the game with {formatDollar(1000000)} with the market running for an expected
                    8 weeks before declaring our first winner. Good luck!
                </div>
                <div className={styles.spacer} />
                <div className={styles.sectionTitle}>What is a stock?</div>
                <div className={styles.divider} />
                <div>
                    In the real world, a stock represents ownership of a corporation. Any person can go to the market
                    where a corporation has publicly listed to buy and sell this representation of ownership. The price
                    is determined by the demand for a stock, meaning the more people want it, the higher price.
                </div>
                <div className={styles.paragraphSpacer} />
                <div>
                    In the stochastic exchange however, we do not have this supply and demand based pricing. Instead our
                    servers dynamically price each stock – based on real world data – from 6 AM PST to 9 PM PST, 7 days
                    a week. During this time, the servers will generate new prices at random intervals between 10 and 45
                    minutes.
                </div>
                <div className={styles.spacer} />
                <div className={styles.sectionTitle}>How does each stock get priced?</div>
                <div className={styles.divider} />
                <div>
                    Most stocks use a simple linear regression machine learning model to take input data and produce a
                    price. Let&apos;s take an example, we see a stock called &quot;Christmas Tree Central&quot;
                    that&apos;s currently priced at $5. We also see in its stock information section that the company
                    sells Christmas trees.
                </div>
                <div className={styles.paragraphSpacer} />
                <div>
                    Seeing this, we can guess that the input data to the model is the total number of Christmas trees
                    sold in a given day. Next the question is how does the stock price move in relation to this data
                    point? Maybe it just goes up when any trees are sold? Or maybe it goes up when the number of trees
                    sold is greater than the average number of trees sold in a given day? Or maybe it&apos;s price
                    increases when the total number of Christmas trees sold in a given price point time period is
                    greater than the previous time period?
                </div>
                <div className={styles.paragraphSpacer} />
                <div>
                    All excellent guesses, who knows what the actual model is based on. Perhaps it&apos;s not even using
                    total Christmas trees sold but instead it&apos;s using the total number of Evergreen trees cut down
                    along with the inverse of total artificial Christmas trees sold. And that&apos;s not even getting
                    into how this input data is causing the stock&apos;s price to change! How fun.
                </div>
                <div className={styles.spacer} />
                <div className={styles.sectionTitle}>Mechanics</div>
                <div className={styles.divider} />
                <div>
                    You can buy and sell stocks from the portfolio screen and you can also place a limit order on stocks
                    that will buy or sell at a certain trigger price. Some stocks will also yield dividends based on
                    input data, and yet other stocks might be acquired along the way.
                </div>
                <div className={styles.spacer} />
                <div className={styles.sectionTitle}>FAQ</div>
                <div className={styles.divider} />
                <div className={styles.question}>Is there anything consistent between stocks?</div>
                <div className={styles.answer}>
                    The only aspect of each stock that&apos;s consistent is percent ownership. In other words the more
                    of stock of a given company is bought, the less volatile it becomes, both in the positive and
                    negative direction.
                </div>
                <div className={styles.question}>Are these real stocks?</div>
                <div className={styles.answer}>
                    No, none of these stocks are real, they&apos;re entirely simulated but each stock is priced actively
                    on real world data. See the &quot;How does each stock get priced&quot; section for more details.
                </div>
                <div className={styles.question}>What kind of data goes into the stocks?</div>
                <div className={styles.answer}>
                    We&apos;re getting into MNPI (material nonpublic information), but the Stochastic Exchange
                    guarantees all data points are automated and are time series based. In other words all data
                    that&apos;s brought in, in theory, changes at least day to day, and at most minute to minute.
                </div>
                <div className={styles.question}>Has the game started yet?</div>
                <div className={styles.answer}>
                    Not yet, we&apos;re still in beta testing to ensure the stability of the stocks. This is an also an
                    excellent opportunity to get a feel for how each stock works. We&apos;ll start the game for real
                    sometime in mid January.
                </div>
                <div className={styles.question}>How do limit orders work?</div>
                <div className={styles.answer}>
                    All active limit orders will be checked whenever the price points adjust. All sell limit orders will
                    be executed, then all buy limit orders, both in timestamp order. In other words, sell orders first,
                    and the earlier the limit order, the higher up the priority queue it will be.
                </div>
                <div className={styles.question}>What do I get for winning the exchange?</div>
                <div className={styles.answer}>
                    Internet glory – and a $250 donation made to a charity of your choosing.
                </div>
                <div className={styles.spacer} />
            </div>
        </div>
    );
};
