/** @format */

import React from "react";
import { useHistory } from "react-router-dom";
import BreadCrumb from "../../../components/BreadCrumb";
import { Tabs } from "antd";
import Logo from "./Logo";
import PPK from "./PPK";
import Komite from "./Komite";
import ProfileMadrasah from "./ProfileMadrasah";
const { TabPane } = Tabs;

const EditProfilMadrasah: React.FC<any> = () => {
  const route = useHistory();
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Profil Madrasah" },
    { path: "/", breadcrumbName: "Edit" },
  ];

  return (
    <>
      <BreadCrumb
        routes={itemBreadcrumb}
        title="Edit Profil Madrasah"
        back
        toBack={() => route.goBack()}
      />
      <div className="p-5">
        <div className=" bg-white shadow-md">
          <Tabs type="card" size="middle">
            <TabPane tab="Logo" key="1">
              <Logo />
            </TabPane>
            <TabPane tab="PPK" key="2">
              <PPK />
            </TabPane>
            <TabPane tab="Komite" key="3">
              <Komite />
            </TabPane>
            <TabPane tab="Profil" key="4">
              <ProfileMadrasah />
            </TabPane>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default EditProfilMadrasah;
