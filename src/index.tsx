/** @format */

import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "./assets/css/tailwind.output.css";
import "./assets/css/tailwind.css";
import App from "./App";
import { SidebarProvider } from "./context/SidebarContext";
import ThemedSuspense from "./components/ThemedSuspense";
import * as serviceWorker from "./serviceWorker";
import "antd/dist/antd.css";
import "./assets/css/rsuite-custom-v2.css";
import "./assets/css/customstyle.css";

import Store, { persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";

// if (process.env.NODE_ENV !== 'production') {
//   const axe = require('react-axe')
//   axe(React, ReactDOM, 1000)
// }
localStorage.theme = "light";

ReactDOM.render(
  <Suspense fallback={<ThemedSuspense />}>
    <Provider store={Store}>
      <PersistGate loading={true} persistor={persistor}>
        <SidebarProvider>
          <App />
        </SidebarProvider>
      </PersistGate>
    </Provider>
  </Suspense>,
  document.getElementById("root"),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
