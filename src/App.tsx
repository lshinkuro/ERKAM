/** @format */

import React, { lazy, useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import AccessibleNavigationAnnouncer from "./components/AccessibleNavigationAnnouncer";
import { message } from "antd";
import "./fontawesome";
import { useDispatch } from "react-redux";
import { setOnline } from "./redux/actions";

const basicLayout = lazy(() => import("./containers/Layout"));
const Login = lazy(() => import("./pages/Login"));
const Step2 = lazy(() => import("./pages/Login/Step2"));
const KodeRegistrasi = lazy(() => import("./pages/Registration/CodeRegister"));
const CreateAccount = lazy(() => import("./pages/Registration/CreateAccount"));
const ForgotPassword = lazy(
  () => import("./pages/Registration/ForgotPassword"),
);
const ResetPassword = lazy(() => import("./pages/Registration/ResetPassword"));

const VerifyEmail = lazy(() => import("./pages/Registration/VerifyEmail"));

const isOnline = navigator.onLine ? "online" : "offline";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const [isStatus, setStatus] = useState(isOnline === "online" ? true : false);

  useEffect(() => {
    window.addEventListener("online", () => {
      dispatch(setOnline(true));
      setStatus(true);
    });
    window.addEventListener("offline", () => {
      dispatch(setOnline(false));
      setStatus(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  if (!isStatus) {
    message.destroy();
    message.warning("Anda sedang Offline", 0);
  } else {
    message.destroy();
  }

  return (
    <>
      <Router>
        <AccessibleNavigationAnnouncer />
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/step-2-login" component={Step2} />
          <Route path="/kode-registrasi" component={KodeRegistrasi} />
          <Route path="/create-account" component={CreateAccount} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/reset-password" component={ResetPassword} />
          <Route path="/verify-email" component={VerifyEmail} />

          {/* Place new routes over this */}

          <Route path="/" component={basicLayout} />
          {/* If you have an index page, you can remothis Redirect */}
          {/* <Redirect exact from="/" to="/login" /> */}
        </Switch>
      </Router>
    </>
  );
};

export default App;
