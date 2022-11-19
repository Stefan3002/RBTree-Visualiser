import {combineReducers} from "redux";
import {aboutReducer} from "./about/aboutReducer";
import {typeReducer} from "./typeOfAlgo/typeReducer";

export const rootReducer = combineReducers({
        about: aboutReducer,
    type: typeReducer
    })
