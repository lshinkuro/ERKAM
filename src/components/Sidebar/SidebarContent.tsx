/** @format */

import React, { useContext, useState, useEffect } from "react";
import {
  admin_pusat,
  admin_provinsi,
  admin_kabkota,
  kepala_madrasah,
  bendahara_madrasah,
  staff_madrasah,
  super_admin_pusat,
  pengarah_pusat,
  penanggung_jawab_umum_pusat,
  penanggung_jawab_teknis_pusat,
  pembuat_kebijakan_pusat,
  auditor_pusat,
  auditor_pusat_external,
  pengarah_provinsi,
  penanggung_jawab_umum_provinsi,
  penanggung_jawab_teknis_provinsi,
  pembuat_kebijakan_provinsi,
  auditor_provinsi,
  auditor_provinsi_external,
  pengarah_kabkota,
  auditor_kabkota_external,
  penanggung_jawab_umum_kabkota,
  penanggung_jawab_teknis_kabkota,
  pembuat_kebijakan_kabkota,
  auditor_kabkota,
  auditor_pusat_internal,
  pengawas_pusat,
} from "../../routes/sidebar";
import { Menu } from "antd";
import type { MenuProps } from "antd/es/menu";
import {
  HomeOutlined,
  EditOutlined,
  UserOutlined,
  IdcardOutlined,
  SettingOutlined,
  TeamOutlined,
  FolderOutlined,
  PieChartOutlined,
  CreditCardOutlined,
  RiseOutlined,
  FileDoneOutlined,
  UsbOutlined,
  FundOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import eRKAMlogo from "../../assets/img/erkam_putih.png";
import eRKAMlogomin from "../../assets/img/logo-erkam.png";
import logo from "../../assets/img/user.jpg";
import { SidebarContext } from "../../context/SidebarContext";
import { useSelector } from "react-redux";

type MenuItem = Required<MenuProps>["items"][number];

function SidebarContent() {
  const location = useLocation();
  const path = location.pathname;
  const IconCustom = {
    HomeOutlined: <HomeOutlined />,
    EditOutlined: <EditOutlined />,
    UserOutlined: <UserOutlined />,
    IdcardOutlined: <IdcardOutlined />,
    SettingOutlined: <SettingOutlined />,
    TeamOutlined: <TeamOutlined />,
    FolderOutlined: <FolderOutlined />,
    PieChartOutlined: <PieChartOutlined />,
    CreditCardOutlined: <CreditCardOutlined />,
    RiseOutlined: <RiseOutlined />,
    FileDoneOutlined: <FileDoneOutlined />,
    UsbOutlined: <UsbOutlined />,
    FundOutlined: <FundOutlined />,
    MessageOutlined: <MessageOutlined />,
  };
  const [collapse, setCollapse] = useState(false);
  const { isSidebarOpen, isDesktop, closeSidebar } = useContext(SidebarContext);
  const store = useSelector((state: any) => state.store);
  let profile: any = store.profile || [];

  useEffect(() => {
    setCollapse(isDesktop);
    if (isSidebarOpen) {
      setCollapse(false);
    }
  }, [isSidebarOpen, isDesktop]);

  let routes: any = [];
  if (profile?.role) {
    switch (profile?.role?.kode) {
      case "admin_pusat":
        routes = admin_pusat;
        break;
      case "super_admin_pusat":
        routes = super_admin_pusat;
        break;
      case "pengarah_pusat":
        routes = pengarah_pusat;
        break;
      case "penanggung_jawab_umum_pusat":
        routes = penanggung_jawab_umum_pusat;
        break;
      case "penanggung_jawab_teknis_pusat":
        routes = penanggung_jawab_teknis_pusat;
        break;
      case "pembuat_kebijakan_pusat":
        routes = pembuat_kebijakan_pusat;
        break;
      case "auditor_pusat":
        routes = auditor_pusat;
        break;
      case "auditor_pusat_external":
        routes = auditor_pusat_external;
        break;
      case "auditor_pusat_internal":
        routes = auditor_pusat_internal;
        break;
      case "admin_provinsi":
        routes = admin_provinsi;
        break;
      case "pengarah_provinsi":
        routes = pengarah_provinsi;
        break;
      case "penanggung_jawab_umum_provinsi":
        routes = penanggung_jawab_umum_provinsi;
        break;
      case "penanggung_jawab_teknis_provinsi":
        routes = penanggung_jawab_teknis_provinsi;
        break;
      case "pembuat_kebijakan_provinsi":
        routes = pembuat_kebijakan_provinsi;
        break;
      case "auditor_provinsi":
        routes = auditor_provinsi;
        break;
      case "auditor_provinsi_external":
        routes = auditor_provinsi_external;
        break;
      case "admin_kabkota":
        routes = admin_kabkota;
        break;
      case "pengarah_kabkota":
        routes = pengarah_kabkota;
        break;
      case "auditor_kabkota_external":
        routes = auditor_kabkota_external;
        break;
      case "penanggung_jawab_umum_kabkota":
        routes = penanggung_jawab_umum_kabkota;
        break;
      case "penanggung_jawab_teknis_kabkota":
        routes = penanggung_jawab_teknis_kabkota;
        break;
      case "pembuat_kebijakan_kabkota":
        routes = pembuat_kebijakan_kabkota;
        break;
      case "auditor_kabkota":
        routes = auditor_kabkota;
        break;
      case "kepala_madrasah":
        routes = kepala_madrasah;
        break;
      case "bendahara_madrasah":
        routes = bendahara_madrasah;
        break;
      case "staff_madrasah":
        routes = staff_madrasah;
        break;
      case "pengawas_pusat":
        routes = pengawas_pusat;
        break;
      // default  setRoutes(bendahara_madrasah);
    }
  }
  const avatar = null;

  function handleIcon(icon) {
    return IconCustom[icon];
  }

  /** menu sidebar */
  const itemsSidebar: MenuItem[] = routes.length ? itemsParse(routes, "") : [];

  function itemsParse(itemTmp: any, index?: string) {
    let itemData: MenuItem[] = [];
    if (itemTmp.length) {
      // eslint-disable-next-line array-callback-return
      itemTmp.map((item: any, i: any) => {
        itemData.push({
          label: item.routes ? (
            item.name
          ) : (
            <Link to={item.path}>{item.name} </Link>
          ),
          // key: `${index}${i}`,
          key: item.routes ? `${index}${i}` : `${item.path}`,
          icon: item.icon ? handleIcon(item.icon) : null,
          children: item.routes
            ? itemsParse(item.routes, `sub${index}.${i}`)
            : undefined,
        });
      });
    }
    return itemData;
  }

  return (
    <>
      <div
        className={
          collapse
            ? "pb-2 pt-0 pr-0 pl-0 z-50 bg-white h-screen  overflow-y-auto scrollbar"
            : "w-64 pb-2 pt-0 pr-0 pl-0 z-50 bg-white h-screen  overflow-y-auto scrollbar"
        }>
        <div
          className={
            collapse ? "fixed w-20 z-10 bg-white" : "fixed w-64 z-10 bg-white"
          }>
          <div className="relative z-2">
            <div className="flex justify-center h-16 bg-green-500">
              {collapse ? (
                <img
                  aria-hidden="true"
                  className="m-0 p-3"
                  src={eRKAMlogomin}
                  alt="Office"
                  style={{ objectFit: "cover" }}
                  onClick={closeSidebar}
                />
              ) : (
                <img
                  aria-hidden="true"
                  className="m-0"
                  src={eRKAMlogo}
                  alt="Office"
                  style={{ objectFit: "cover", width: "100%" }}
                  onClick={closeSidebar}
                />
              )}
            </div>
            <div className="px-6 mt-4">
              <div className="flex flex-row items-center text-sm my-2 text-gray-600">
                <img
                  className="md rounded-full"
                  src={avatar ? avatar : logo}
                  alt="logo"
                  style={
                    collapse
                      ? { objectFit: "cover", width: "100%", height: "100%" }
                      : { objectFit: "cover", width: "25%", height: "25%" }
                  }
                />
                {collapse ? (
                  ""
                ) : (
                  <div className="flex flex-col">
                    <span className="ml-4 text-md font-bold">
                      {profile?.profile?.nama}
                    </span>
                    <span className="ml-4 text-md">{profile?.role?.nama}</span>
                    <span className="ml-4 text-xs">
                      {profile?.group_role === "madrasah"
                        ? profile?.madrasah?.status === "n"
                          ? "Madrasah Negeri"
                          : "Madrasah Swasta"
                        : ""}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full pt-44">
          <Menu
            // defaultSelectedKeys={[`${path}`]}
            // defaultOpenKeys={["/profile-madrasah"]}
            selectedKeys={[`${path}`]}
            mode="inline"
            theme="light"
            inlineCollapsed={collapse}
            items={itemsSidebar}
          />
        </div>
      </div>
    </>
  );
}
export default SidebarContent;
