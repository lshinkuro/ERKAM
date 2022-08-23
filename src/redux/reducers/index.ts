/** @format */

import { combineReducers } from "redux";
import storeReducers from "./storeReducers";
import authReducers from "./authReducers";
/** combine store reducers */
export const reducer = combineReducers({
  store: storeReducers,
  auth: authReducers,
});
