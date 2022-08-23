/** @format */

import React, { useState } from "react";
import {
  Button,
  Input,
  Form,
  Divider,
  Tabs,
  Typography,
  Alert,
  Row,
  Col,
} from "antd";
// import * as profileservice from "../../../services/v2/usermanservice/profileservices";
// import notifAlert from "../../../components/NotifAlert";
import {
  CheckCircleFilled,
  ExclamationCircleFilled,
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons";

import { useSelector } from "react-redux";
// import { setStore } from "../../../redux/actions";
const { TabPane } = Tabs;
const { Text } = Typography;

const FormEmail = () => {
  const [form] = Form.useForm();
  //   const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const store = useSelector((state: any) => state.store);
  const tmpProfile: any = store.profile.profile.user || [];
  const [verifikasi, setVerifikasi] = useState(tmpProfile.activated);
  const email = tmpProfile.email;
  const emailValidasi = tmpProfile.valid_email ? true : false;

  return (
    <Tabs>
      <TabPane tab="Status" key="1">
        <Row gutter={[20, 20]}>
          <Col
            className="gutter-row"
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 16 }}
            lg={{ span: 16 }}
            xl={{ span: 16 }}>
            <p>
              <Text strong>Email:</Text> {email}
            </p>
            <p>
              <Text strong>Status Verifikasi:</Text>{" "}
              {emailValidasi ? (
                <>
                  Terverifikasi <CheckCircleFilled style={{ color: "green" }} />
                </>
              ) : (
                <>
                  Belum valid{" "}
                  <ExclamationCircleFilled style={{ color: "red" }} />,{" "}
                  <Button
                    type="text"
                    onClick={() => setVerifikasi(!verifikasi)}>
                    verifikasi sekarang{" "}
                    {verifikasi ? (
                      <>
                        <UpOutlined />
                      </>
                    ) : (
                      <>
                        {" "}
                        <DownOutlined />
                      </>
                    )}
                  </Button>
                </>
              )}
            </p>
            {!verifikasi ? (
              <>
                <div className="mb-2">
                  <Alert
                    message="6 digit Kode akan dikirim ke alamat email"
                    type="info"
                    showIcon
                  />
                </div>
                <Form
                  form={form}
                  key="formVerifikasi"
                  name="formVerifikasi"
                  layout="vertical"
                  //   onFinish={handleGantiPassword}
                >
                  <Form.Item
                    label="Kode"
                    name="kode"
                    rules={[
                      {
                        required: true,
                        message: "Kode tidak boleh kosong!",
                      },
                    ]}>
                    <Input placeholder="Kode" />
                  </Form.Item>

                  <Divider />
                  <Form.Item className="text-right">
                    <Button
                      loading={loading}
                      type="default"
                      htmlType="submit"
                      className="mb-2">
                      Request Kode
                    </Button>
                    <Button
                      loading={loading}
                      type="primary"
                      htmlType="submit"
                      className="mb-2">
                      Verifikasi
                    </Button>
                  </Form.Item>
                </Form>
              </>
            ) : (
              ""
            )}
          </Col>
        </Row>
      </TabPane>
      <TabPane tab="Ganti Email" key="2">
        <Row gutter={[20, 20]}>
          <Col
            className="gutter-row"
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 16 }}
            lg={{ span: 16 }}
            xl={{ span: 16 }}>
            <div className="mb-2">
              <Alert
                message="6 digit Kode akan dikirim ke alamat email"
                type="info"
                showIcon
              />
            </div>
            <Form
              form={form}
              key="formGantiEmail"
              name="formGantiEmail"
              layout="vertical"
              //   onFinish={handleGantiPassword}
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Email tidak boleh kosong!",
                  },
                ]}>
                <Input type="email" placeholder="Email" />
              </Form.Item>
              <Form.Item
                label="Kode"
                name="kode"
                rules={[
                  {
                    required: true,
                    message: "Kode tidak boleh kosong!",
                  },
                ]}>
                <Input placeholder="Kode" />
              </Form.Item>

              <Divider />
              <Form.Item className="text-right">
                <Button
                  loading={loading}
                  type="default"
                  htmlType="submit"
                  className="mb-2">
                  Request Kode
                </Button>
                <Button
                  loading={loading}
                  type="primary"
                  htmlType="submit"
                  className="mb-2">
                  Verifikasi
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </TabPane>
    </Tabs>
  );
};
export default FormEmail;
