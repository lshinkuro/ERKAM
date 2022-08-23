/** @format */

import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { SidebarContext } from "../../context/SidebarContext";
import {
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SyncOutlined,
  CloudSyncOutlined,
  BellOutlined,
  SettingOutlined,
  PoweroffOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd/es/menu";
import { useDispatch, useSelector } from "react-redux";
import { Select, Space, Dropdown, Badge, Menu, Button, Modal } from "antd";
import { setTahunPeriode, signOut } from "../../redux/actions";
import { Notification } from "../Notification";

type MenuItem = Required<MenuProps>["items"][number];

const { confirm } = Modal;

function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}
const HeaderNav = () => {
  const dispatch = useDispatch();
  const { isDesktop, toggleSidebar, toggleDesktop } =
    useContext(SidebarContext);
  const store = useSelector((state: any) => state.store);
  const auth = useSelector((state: any) => state.auth);

  const [tahun, setTahun] = useState(auth.isTahun);

  const handlePeriodeChange = (value: string) => {
    setTahun(value);
    dispatch(setTahunPeriode(value));
  };

  const logOut = () => {
    // dispatch(setClearStore());
    setTimeout(() => dispatch(signOut()), 10);
  };

  /** Confirmasi Keluar */
  const handleConfKeluar = () => {
    confirm({
      title: "Yakin Ingin Keluar?",
      icon: <ExclamationCircleOutlined />,
      content:
        "Jika keluar, semua data yang tersimpan dilokal perangkat Anda akan otomatis hilang.",
      okText: "Keluar",
      okType: "danger",
      cancelText: "Tetap Di Aplikasi",
      onOk() {
        return logOut();
      },
    });
  };
  /** menu user */
  const itemsUser: MenuItem[] = [
    getItem(<Link to="/profil/akun">Akun</Link>, "1", <UserOutlined />),
    getItem(
      <Link to="/profil/edit">Pengaturan Akun</Link>,
      "2",
      <SettingOutlined />,
    ),
    getItem(
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      <a onClick={handleConfKeluar}>Logout</a>,
      "3",
      <PoweroffOutlined />,
    ),
  ];

  /** Notif */
  const itemsNotif: MenuItem[] = [getItem(<Notification />)];
  const menuUser = <Menu style={{ width: 180 }} items={itemsUser} />;
  const menuNotif = <Menu style={{ width: 260 }} items={itemsNotif} />;
  /** menu Sync */
  const itemsSync: MenuItem[] = [
    getItem(
      <Button type="text">Sinkronisasi Data Offline</Button>,
      "1",
      <SyncOutlined />,
    ),
  ];
  const menuSync = <Menu style={{ width: 240 }} items={itemsSync} />;

  return (
    <header className="relative z-40 h-16 py-5 bg-green-500 shadow-bottom dark:bg-gray-800">
      <div className="flex items-center justify-between h-full px-4 md:px-2 mx-auto text-white dark:text-gray-500">
        <div>
          <Space size="middle">
            <div className="lg:hidden">
              <MenuUnfoldOutlined
                onClick={toggleSidebar}
                aria-label="Menu"
                style={{ fontSize: "18px" }}
              />
            </div>
            <div className="hidden lg:block">
              {isDesktop ? (
                <>
                  <MenuUnfoldOutlined
                    onClick={toggleDesktop}
                    style={{ fontSize: "20px" }}
                  />
                </>
              ) : (
                <>
                  <MenuFoldOutlined
                    onClick={toggleDesktop}
                    style={{ fontSize: "20px" }}
                  />
                </>
              )}
            </div>
            <Select
              defaultValue={tahun}
              onChange={handlePeriodeChange}
              placeholder="Periode Tahun">
              {store.periodeTahunActive.length &&
                store.periodeTahunActive.map((item: any, index: number) => (
                  <Select.Option key={index} value={item.tahun}>
                    {item.nama}
                  </Select.Option>
                ))}
            </Select>
          </Space>
        </div>
        <div>
          <Space direction="horizontal">
            <Space wrap>
              {/* <NoticeIcon /> */}
              <Dropdown
                overlay={menuNotif}
                placement="bottomRight"
                trigger={["click"]}
                arrow={{ pointAtCenter: true }}>
                <Button
                  type="text"
                  icon={
                    <Badge dot={true} size="small">
                      <BellOutlined
                        aria-label="Menu"
                        style={{ fontSize: "18px", color: "white" }}
                      />
                    </Badge>
                  }
                />
              </Dropdown>
            </Space>

            <Space wrap>
              <Dropdown
                overlay={menuSync}
                placement="bottomRight"
                trigger={["click"]}
                arrow={{ pointAtCenter: true }}>
                <Button
                  type="text"
                  icon={
                    <CloudSyncOutlined
                      aria-label="Menu"
                      style={{ fontSize: "20px", color: "white" }}
                    />
                  }
                />
              </Dropdown>
            </Space>
            <Space wrap>
              <Dropdown
                overlay={menuUser}
                placement="bottomRight"
                trigger={["click"]}
                arrow={{ pointAtCenter: true }}>
                <Button
                  type="text"
                  icon={
                    <UserOutlined
                      aria-label="Menu"
                      style={{ fontSize: "20px", color: "white" }}
                    />
                  }
                />
              </Dropdown>
            </Space>
          </Space>
        </div>
      </div>
    </header>
  );
};
export default HeaderNav;
