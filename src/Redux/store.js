import { createStore, applyMiddleware, compose } from "redux";
import { rootReducer } from "./rootReducer";

// for both dev tools and middlewares
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers(applyMiddleware());

export const store = createStore(rootReducer, enhancer);
