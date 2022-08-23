/** @format */

import React from "react";
import { useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";

function AccessibleNavigationAnnouncer() {
  const route = useHistory();
  const location = useLocation();
  const path = location.pathname.slice(1);
  const pageNoAuth = [
    "login",
    "forgot-password",
    "step-2-login",
    "kode-registrasi",
    "create-account",
    "verify-email",
    "reset-password",
    // "service-worker.js",
  ];
  const auth = useSelector((state: any) => state.auth);
  if (!auth.isLogin) {
    const test = pageNoAuth.filter((item: any) => item.includes(path));
    if (!test.length) {
      route.push("/login");
    }
  }
  return <></>;
}

export default AccessibleNavigationAnnouncer;
