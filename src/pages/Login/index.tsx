/** @format */

import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Background from "../../assets/img/background-image.svg";
import { Form, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { PreLogin } from "../../services/v2/usermanservice/authenticationservice";
import { FooterLogin, HeaderLogo } from "../../components/LoginArea";
import { useDispatch, useSelector } from "react-redux";
import { setPeriodeTahunActive, signIn } from "../../redux/actions";

/**
 *
 * @returns Login awal akses aplikasi
 */

const Login: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const store = useSelector((state: any) => state.store);
  // const auth = useSelector((state: any) => state.auth);
  const route = useHistory();
  let periodeTahun: string = "";

  useEffect(() => {
    dispatch(setPeriodeTahunActive() as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  store.periodeTahunActive.length &&
    // eslint-disable-next-line array-callback-return
    store.periodeTahunActive.reverse().map((item: any) => {
      periodeTahun = item.tahun;
    });

  // eslint-disable-next-line react-hooks/exhaustive-deps

  /**
   * Memberikan peringatan ketika user memasukkan user dan password, jika user dan password benar akan dikirim ke API untuk di proses selanjutnya
   */
  const loginAction = async (values) => {
    setLoading(true);
    try {
      const payload = {
        username: values.username,
        password: values.password,
      };

      const res = await PreLogin(payload);
      if (res.meta.success === "STEP_2") {
        const authTmp = {
          ...payload,
          auth: res.return,
          isTahun: periodeTahun,
        };
        route.push({
          pathname: "/step-2-login",
          state: authTmp,
        });
      } else {
        const authTmp = {
          ...res.return,
          isLogin: true,
          isTahun: periodeTahun,
        };
        dispatch(signIn(authTmp, periodeTahun));

        route.push("/");
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const onFinish = (values: any) => {
    loginAction(values);
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
          <div className="max-w-md mx-auto">
            <Form
              name="normal_login"
              className="login-form"
              layout="vertical"
              initialValues={{ remember: true }}
              onFinish={onFinish}>
              <Form.Item
                label="NIK atau Email"
                name="username"
                rules={[
                  {
                    required: true,
                    message: "NIK atau Email tidak boleh kosong!",
                  },
                ]}>
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="NIK Atau Email"
                />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Password tidak boleh kosong!" },
                ]}>
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>
              <Form.Item className="flex justify-between">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Link className="login-form-forgot" to="/forgot-password">
                  Lupa Password?
                </Link>
              </Form.Item>

              <Form.Item>
                <Button
                  loading={loading}
                  type="primary"
                  htmlType="submit"
                  className="login-form-button mb-2">
                  Login
                </Button>
                <div>
                  Belum punya akun?
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
};

export default Login;
