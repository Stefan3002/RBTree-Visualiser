import {applyMiddleware, compose, createStore} from "redux";
import {logger} from 'redux-logger'
import {rootReducer} from "./rootReducer";

const middleWares = [logger]
const appliedMiddleWares = compose(applyMiddleware(...middleWares))

export const store = createStore(rootReducer, undefined, appliedMiddleWares)