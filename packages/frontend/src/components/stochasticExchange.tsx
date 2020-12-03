import * as React from "react";
import { connect } from "react-redux";
import { IStoreState } from "../store/state";
import { LoginPage } from "./loginPage";

interface IStoreProps {
    token: string | undefined;
}

const UnconnectedStochasticExchange: React.FC<IStoreProps> = ({ token }) => {
    if (token === undefined) {
        return <LoginPage />;
    }

    return <div>You&apos;re in! {token}.</div>;
};

function mapStateToProps(state: IStoreState): IStoreProps {
    return {
        token: state.account.token,
    };
}

export const StochasticExchange = connect(mapStateToProps)(UnconnectedStochasticExchange);
