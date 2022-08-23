/** @format */

import React from "react";
import { Link, useHistory } from "react-router-dom";
import Background from "../../assets/img/background-image.svg";
import { FooterLogin, HeaderLogo } from "../../components/LoginArea";
import { Form, Input, Button } from "antd";
import { codeCek } from "../../services/v2/usermanservice/madrasahservices";

const CodeRegister = () => {
  const [form] = Form.useForm();
  const route = useHistory();

  const kodeCek = async (values: any) => {
    try {
      const res = await codeCek(values.codeRegistrasi);
      if (res.success) {
        route.push({
          pathname: "/create-account",
          state: res.return,
        });
      }
    } catch (error) {
      console.log(error);
      // route.push({
      //   pathname: "/create-account",
      //   state: values,
      // });
    }
  };

  const onFinish = (values: any) => {
    kodeCek(values);
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
            Registrasi Madrasah
          </h2>
          <div className="max-w-md mx-auto">
            <Form
              form={form}
              name="normal_login"
              className="login-form"
              layout="vertical"
              // initialValues={{ remember: true }}
              onFinish={onFinish}>
              <Form.Item
                label="Kode Registrasi"
                name="codeRegistrasi"
                rules={[
                  {
                    required: true,
                    message: "Kode Registrasi tidak boleh kosong!",
                  },
                ]}>
                <Input placeholder="Masukan Kode Registrasi" type="number" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button mb-2">
                  Registrasi
                </Button>
                <div>
                  Sudah punya akun?
                  <Link to="/login"> Login</Link>
                </div>
              </Form.Item>
            </Form>
          </div>
          <FooterLogin />
        </div>
      </div>
    </div>
  );
};
export default CodeRegister;
