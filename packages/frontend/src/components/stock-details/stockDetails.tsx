import { Button, NonIdealState } from "@blueprintjs/core";
import { IObjectForAllStocks, IStockWithDollarValue } from "@stochastic-exchange/api";
import * as React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { bindActionCreators, Dispatch } from "redux";
import { Routes } from "../../common/routes";
import { SetViewStockWithLatestPrice } from "../../store/interface/actions";
import { IStoreState } from "../../store/state";
import { AgriColaInc } from "./helperComponents/agriColaInc";
import { BitAndGamble } from "./helperComponents/bitAndGamble";
import { DentalDamageAndCompany } from "./helperComponents/dentalDamageAndCompany";
import { NoDawnTradingCompany } from "./helperComponents/noDawnTradingCompany";
import { LeagueOfInfluencers } from "./helperComponents/leaugeOfInfluencers";
import { StabilityEnterprises } from "./helperComponents/stabilityEnterprises";
import { ViruzMeNot } from "./helperComponents/viruzMeNot";
import styles from "./stockDetails.module.scss";

interface IStoreProps {
    viewStockDetails: IStockWithDollarValue | undefined;
}

interface IDispatchProps {
    setViewStockWithLatestPrice: (stockWithLatestPrice: IStockWithDollarValue) => void;
}

const StockDetailsObject: IObjectForAllStocks<React.ReactElement | null> = {
    "Agri Cola Inc": <AgriColaInc />,
    "Bit & Gamble": <BitAndGamble />,
    "Dental Damage and Company": <DentalDamageAndCompany />,
    "League of Influencers": <LeagueOfInfluencers />,
    "No Dawn Trading Company": <NoDawnTradingCompany />,
    "Stability Enterprises": <StabilityEnterprises />,
    "Viruz Me Not": <ViruzMeNot />,
};

const UnconnectedStockDetails: React.FC<IStoreProps & IDispatchProps> = ({
    viewStockDetails,
    setViewStockWithLatestPrice,
}) => {
    const history = useHistory();

    if (viewStockDetails === undefined) {
        history.push(Routes.PORTFOLIO);
        return null;
    }

    const goBackToStockInformation = () => {
        setViewStockWithLatestPrice(viewStockDetails);
        history.push(Routes.STOCK);
    };

    const maybeRenderStockDetails = () => {
        const key = viewStockDetails.name as keyof IObjectForAllStocks<any>;
        const stockDetailsComponent: React.ReactElement | null | undefined = StockDetailsObject[key];
        if (stockDetailsComponent === undefined) {
            return <NonIdealState description="There is no information available about this stock." />;
        }

        return stockDetailsComponent;
    };

    return (
        <div className={styles.mainContainer}>
            <Button className={styles.backButton} icon="arrow-left" minimal onClick={goBackToStockInformation} />
            <div className={styles.header}>{viewStockDetails.name}</div>
            {maybeRenderStockDetails()}
        </div>
    );
};

function mapStateToProps(state: IStoreState): IStoreProps {
    return {
        viewStockDetails: state.interface.viewStockDetails,
    };
}

function mapDispatchToProps(dispatch: Dispatch): IDispatchProps {
    return bindActionCreators(
        {
            setViewStockWithLatestPrice: SetViewStockWithLatestPrice,
        },
        dispatch,
    );
}

export const StockDetails = connect(mapStateToProps, mapDispatchToProps)(UnconnectedStockDetails);
