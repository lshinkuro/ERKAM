/** @format */
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Background from "../../assets/img/background-image.svg";
import { FooterLogin, HeaderLogo } from "../../components/LoginArea";
import { Form, Button, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { ForgotPass } from "../../services/v2/usermanservice/authenticationservice";
import notifAlert from "../../components/NotifAlert";
import { useSelector } from "react-redux";

function ForgotPassword() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const route = useHistory();
  const auth = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (auth.isLogin) {
      route.push("/");
    }
  }, [auth, route]);

  const handleSendForgotPassword = async (values) => {
    setLoading(true);
    try {
      let params = {
        nik: values.nik,
      };
      const res = await ForgotPass(params);
      notifAlert({ type: "success", description: res.data.return });
      form.resetFields();
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const onFinish = (values: any) => {
    handleSendForgotPassword(values);
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
            Lupa Password
          </h2>
          <div className="max-w-md mx-auto">
            <Form
              form={form}
              name="normal_login"
              className="login-form"
              layout="vertical"
              onFinish={onFinish}>
              <Form.Item
                label="NIK"
                name="nik"
                rules={[
                  {
                    required: true,
                    message: "NIK tidak boleh kosong!",
                  },
                  {
                    min: 15,
                    message: "Jumlah karakter NIK tidak sesuai!",
                  },
                ]}>
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="NIK"
                  type="number"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  loading={loading}
                  type="primary"
                  htmlType="submit"
                  className="login-form-button mb-2">
                  Kirim
                </Button>
                <div>
                  Kembali ke halaman
                  <Link to="/login"> Login </Link>
                  atau
                  <Link to="/kode-registrasi"> Daftar</Link>
                </div>
              </Form.Item>
            </Form>
          </div>
          <FooterLogin />
        </div>
      </div>
    </div>
  );
}
export default ForgotPassword;
