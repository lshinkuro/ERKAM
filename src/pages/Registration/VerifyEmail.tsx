/** @format */

import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Background from "../../assets/img/background-image.svg";
import { FooterLogin, HeaderLogo } from "../../components/LoginArea";
import { Form, Button, Input, Alert } from "antd";
import { LockOutlined } from "@ant-design/icons";
import notifAlert from "../../components/NotifAlert";
import qs from "query-string";
import {
  tokenVerify,
  gantiPasswordWithToken,
} from "../../services/v2/usermanservice/validemail";

const VerifyEmail = (params: any) => {
  const notifDelay = 5000;
  const [form] = Form.useForm();
  const route = useHistory();
  const [savedToken, setSavedToken] = useState<any>("");
  const [verified, setVerified] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [verifiedMsg, setVerifiedMsg] = useState<string>("");
  const token = qs.parse(params.location.search).token;

  useEffect(() => {
    tokenVerify(token)
      .then((data) => {
        setVerified(true);
        setSavedToken(token);
        setVerifiedMsg(
          "Berhasil Verifikasi User Dengan Token yang diberikan, silahkan reset Password",
        );
      })
      .catch((error) => {
        setVerified(false);
        const msg = error.response.data.error
          ? error.response.data.error
          : error.response.data.return;
        setVerifiedMsg(`${msg}`);
      });
  }, [token]);

  const handleChangePassword = (values) => {
    setLoading(true);
    gantiPasswordWithToken(savedToken, values.newPassword, values.password)
      .then((data) => {
        window.setTimeout(() => {
          route.push("/login");
        }, notifDelay);
        form.resetFields();
        notifAlert({
          type: "success",
          description: "Password Berhasil Dirubah, Redirect To Login ....",
        });
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
    setLoading(false);
  };

  const onFinish = (values: any) => {
    handleChangePassword(values);
  };

  return (
    <div
      className="relative flex min-h-screen flex-col justify-center overflow-hidden  py-6 sm:py-12"
      style={{
        background: `url(${Background})`,
      }}>
      <div className="w-full space-y-12 px-10 sm:px-8 ">
        <div id="components-form-login">
          <HeaderLogo />
          <h2 className="mb-4 mt-4 text-lg text-center font-semibold text-gray-700 dark:text-gray-200">
            Verifikasi Email
          </h2>
          <div className="max-w-md mx-auto mb-4">
            {verified ? (
              <>
                <Alert
                  message="Berhasil"
                  type="success"
                  showIcon
                  className="mb-4"
                  description={<p>{verifiedMsg}</p>}
                />
                <Form
                  form={form}
                  name="normal_login"
                  className="login-form"
                  layout="vertical"
                  onFinish={onFinish}>
                  <Form.Item
                    label="Password Lama"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Password Lama tidak boleh kosong!",
                      },
                    ]}>
                    <Input.Password
                      prefix={<LockOutlined className="site-form-item-icon" />}
                      placeholder="Password Lama"
                    />
                  </Form.Item>
                  <Form.Item
                    label="Password Baru"
                    name="newPassword"
                    rules={[
                      {
                        required: true,
                        message: "Password Baru tidak boleh kosong!",
                      },
                      {
                        min: 6,
                        message: "Password Baru harus lebih dari 6 karakter!",
                      },
                    ]}>
                    <Input.Password
                      prefix={<LockOutlined className="site-form-item-icon" />}
                      placeholder="Password Baru"
                    />
                  </Form.Item>
                  <Form.Item
                    label="Konfirmasi Password"
                    name="confirmPassword"
                    dependencies={["newPassword"]}
                    rules={[
                      {
                        required: true,
                        message: "Konfirmasi Password tidak boleh kosong!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (
                            !value ||
                            getFieldValue("newPassword") === value
                          ) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              "Konfirmasi Password tidak sama dengan Password Baru!",
                            ),
                          );
                        },
                      }),
                    ]}>
                    <Input.Password
                      prefix={<LockOutlined className="site-form-item-icon" />}
                      placeholder="Konfirmasi Password"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      loading={loading}
                      type="primary"
                      htmlType="submit"
                      className="login-form-button mb-2">
                      Ubah Password
                    </Button>
                    <div>
                      Kembali ke halaman
                      <Link to="/login"> Login </Link>
                      atau
                      <Link to="/kode-registrasi"> Daftar</Link>
                    </div>
                  </Form.Item>
                </Form>
              </>
            ) : (
              <>
                <Alert
                  message="Kesalahan"
                  type="error"
                  showIcon
                  className="mb-4"
                  description={<p>{verifiedMsg}</p>}
                />
                <div>
                  Kembali ke halaman
                  <Link to="/login"> Login </Link>
                  atau
                  <Link to="/kode-registrasi"> Daftar</Link>
                </div>
              </>
            )}
          </div>
          <FooterLogin />
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
