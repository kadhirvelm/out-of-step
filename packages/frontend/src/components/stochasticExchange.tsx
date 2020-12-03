import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { SetToken } from "../store/account/actions";
import { IStoreState } from "../store/state";
import { LoginPage } from "./loginPage";

interface IStoreProps {
    token: string | undefined;
}

interface IDispatchProps {
    invalidateToken: () => void;
}

declare global {
    interface Window {
        onTokenInvalidate: () => void;
    }
}

const UnconnectedStochasticExchange: React.FC<IStoreProps & IDispatchProps> = ({ invalidateToken, token }) => {
    React.useEffect(() => {
        window.onTokenInvalidate = () => invalidateToken();
    }, []);

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

function mapDispatchToProps(dispatch: Dispatch): IDispatchProps {
    return {
        invalidateToken: () => dispatch(SetToken({ token: undefined })),
    };
}

export const StochasticExchange = connect(mapStateToProps, mapDispatchToProps)(UnconnectedStochasticExchange);
