/** @format */

import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { BreadCrumb } from "../../components";
import { Tabs, Typography, Alert, Row, Col, Avatar, Tooltip } from "antd";
import eRKAMlogo from "../../assets/img/user.jpg";
import { QuestionCircleFilled } from "@ant-design/icons";
import { DataProfile, GantiPassword, EditNik } from "./Form";
import FormEmail from "./Form/FormEmail";
const { TabPane } = Tabs;
const { Title } = Typography;

const EditProfile = () => {
  const route = useHistory();
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Profil" },
    { path: "/", breadcrumbName: "Edit" },
  ];
  // const store = useContext(StoreContext);
  const [width, setWidth] = useState<any>(window.innerWidth);

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => window.removeEventListener("resize", handleWindowSizeChange);
  }, [width]);

  return (
    <>
      <BreadCrumb
        routes={itemBreadcrumb}
        title="Edit Profil"
        back
        toBack={() => route.goBack()}
      />
      <div className="p-6 mb-1">
        <div className="p-4 bg-white shadow-sm">
          <Tabs
            tabPosition={width >= 600 ? "left" : "top"}
            tabBarStyle={{ color: "green" }}>
            <TabPane tab="Profil" key="1">
              <Title level={4}>Profil</Title>
              <Row gutter={[16, 16]}>
                <Col
                  className="gutter-row"
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 16 }}
                  lg={{ span: 16 }}
                  xl={{ span: 16 }}>
                  <DataProfile />
                </Col>
                <Col
                  className="gutter-row"
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 8 }}
                  lg={{ span: 8 }}
                  xl={{ span: 8 }}>
                  <div className="flex items-center justify-center flex-col">
                    <div className="mb-2">
                      Avatar{" "}
                      <Tooltip title="Format yang diperbolehkan hanya file JPG atau PNG, kurang dari 2MB, resolusi max 300 x 300">
                        <QuestionCircleFilled />
                      </Tooltip>{" "}
                      :
                    </div>
                    <div className="mb-2">
                      <Avatar
                        size={{
                          xs: 100,
                          sm: 100,
                          md: 100,
                          lg: 100,
                          xl: 100,
                          xxl: 100,
                        }}
                        src={eRKAMlogo}
                        // src={avatar !== null ? avatar : eRKAMlogo}
                      />
                    </div>
                    <div className="mb-1">
                      {/* <Upload>
                        <Button appearance="ghost">
                          <Icon icon="upload2" /> Upload
                        </Button>
                      </Upload> */}
                    </div>
                  </div>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Email" key="2">
              <Title level={4}>Email</Title>
              <FormEmail />
            </TabPane>
            <TabPane tab="NIK" key="3">
              <Title level={4}>NIK</Title>
              <Row gutter={[16, 16]}>
                <Col
                  className="gutter-row"
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 12 }}
                  lg={{ span: 12 }}
                  xl={{ span: 12 }}>
                  <EditNik />
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Ganti Password" key="4">
              <Title level={4}>Ganti Password</Title>
              <Row gutter={[16, 16]}>
                <Col
                  className="gutter-row"
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 12 }}
                  lg={{ span: 12 }}
                  xl={{ span: 12 }}>
                  <div className="mb-2">
                    <Alert
                      message="Anda akan Logout setelah ganti password sukses"
                      type="info"
                      showIcon
                    />
                  </div>
                  <GantiPassword />
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </>
  );
};
export default EditProfile;
