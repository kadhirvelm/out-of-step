import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { StochasticExchange } from "./components/stochasticExchange";
import "./index.scss";
import { configureStore } from "./store/configureStore";

const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <StochasticExchange />
    </Provider>,
    document.getElementById("main-app"),
);
