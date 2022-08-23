/** @format */

import React from "react";
import { BreadCrumb } from "../../../components";
import "react-data-table-component-extensions/dist/index.css";
import Headers from "./header";
import PaguDefinitifList from "./list";

function PaguDefinitif() {
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Pencairan" },
    { path: "/", breadcrumbName: "Pagu Definitif" },
    { path: "/", breadcrumbName: "List" },
  ];
  const groupRole = JSON.parse(localStorage.getItem("auth")!).group_role || "";

  return (
    <>
      <BreadCrumb routes={itemBreadcrumb} title="Pagu Definitif " />
      {groupRole !== "pusat" ? <Headers /> : null}
      <PaguDefinitifList />
    </>
  );
}

export default PaguDefinitif;
