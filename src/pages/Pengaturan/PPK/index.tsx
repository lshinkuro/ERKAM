/** @format */

import React from "react";
import { useSelector } from "react-redux";

import { BreadCrumb } from "../../../components";

const PPK = () => {
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Pengaturan" },
    { path: "/", breadcrumbName: "PPK" },
  ];
  const auths = useSelector((state: any) => state.auth);
  console.log(auths);
  return (
    <>
      <BreadCrumb routes={itemBreadcrumb} title="Pejabat Pembuat Komitmen" />
    </>
  );
};

export default PPK;
