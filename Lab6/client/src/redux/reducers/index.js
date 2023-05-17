import { combineReducers } from "redux";
import { characterReducer } from "./characterReducer";

const reducers = combineReducers({
  allCollectors: characterReducer,
});

export default reducers;
