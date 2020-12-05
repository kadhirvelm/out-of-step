import * as React from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { Dispatch } from "redux";
import { SetToken } from "../store/account/actions";
import { IStoreState } from "../store/state";
import { showToast } from "../utils/toaster";
import { LoginPage } from "./loginPage";
import { MainPage } from "./mainPage";

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
        window.onTokenInvalidate = () => {
            showToast({ intent: "warning", message: "Your session has expired, please login again." });
            invalidateToken();
        };
    }, []);

    if (token === undefined) {
        return <LoginPage />;
    }

    return (
        <Router>
            <MainPage />
        </Router>
    );
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
