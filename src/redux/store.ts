/** @format */

import { applyMiddleware, createStore } from "redux";
import { reducer } from "./reducers";
import thunk from "redux-thunk";
import { persistStore, persistReducer, Persistor } from "redux-persist";
import storage from "redux-persist-indexeddb-storage";

const persistedReducer = persistReducer(
  {
    key: "root",
    storage: storage("rkamDB"),
  },
  reducer,
);

const Store = createStore(persistedReducer, {}, applyMiddleware(thunk));

export default Store;
export const persistor: Persistor = persistStore(Store);
