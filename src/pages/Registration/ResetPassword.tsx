/** @format */
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Background from "../../assets/img/background-image.svg";
import { FooterLogin, HeaderLogo } from "../../components/LoginArea";
import { Form, Button, Input, Alert } from "antd";
import { LockOutlined } from "@ant-design/icons";
import notifAlert from "../../components/NotifAlert";
import qs from "query-string";
import { ResetPass } from "../../services/v2/usermanservice/authenticationservice";
import { useSelector } from "react-redux";

const ResetPassword = (params: any) => {
  const route = useHistory();
  const [form] = Form.useForm();
  const [token, setToken] = useState<any>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<any>("");
  const auth = useSelector((state: any) => state.auth);
  const tokenTmp = qs.parse(params.location.search).token;
  useEffect(() => {
    if (auth.isLogin || tokenTmp === undefined) {
      route.push("/");
    } else {
      const defPayload = {
        isLogin: false,
        token: "",
        kode_role: "",
        group_role: "",
      };
      const defVal = JSON.stringify(defPayload);
      localStorage.setItem("auth", defVal);
    }
    setToken(tokenTmp);
  }, [auth, route, tokenTmp]);

  const handleChangePassword = async (values) => {
    setLoading(true);
    try {
      let payLoad = {
        token: token,
        password: values.password,
      };
      const res = await ResetPass(payLoad);
      setMessage(
        "Pergantian password anda berhasil silahkan kembali melakukan login",
      );
      notifAlert({
        type: "success",
        description: res.data.return,
      });
    } catch (err) {
      console.log(err);
    }
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
            Reset Password
          </h2>
          <div className="max-w-md mx-auto mb-4">
            {message ? (
              <Alert
                message="Berhasil"
                type="success"
                showIcon
                className="mb-4"
                description={
                  <p>
                    {message}
                    <br />
                    <br />
                    <Button type="primary" onClick={() => route.push("/login")}>
                      Login
                    </Button>
                  </p>
                }
              />
            ) : (
              <Form
                form={form}
                name="normal_login"
                className="login-form"
                layout="vertical"
                onFinish={onFinish}>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Password tidak boleh kosong!",
                    },
                    {
                      min: 6,
                      message: "Password harus lebih dari 6 karakter!",
                    },
                  ]}>
                  <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    placeholder="Password"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    loading={loading}
                    type="primary"
                    htmlType="submit"
                    className="login-form-button mb-2">
                    Ganti Password
                  </Button>
                  <div>
                    Kembali ke halaman
                    <Link to="/login"> Login </Link>
                    atau
                    <Link to="/kode-registrasi"> Daftar</Link>
                  </div>
                </Form.Item>
              </Form>
            )}
          </div>
          <FooterLogin />
        </div>
      </div>
    </div>
  );
};
export default ResetPassword;
