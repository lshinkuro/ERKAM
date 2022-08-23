/** @format */

import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Background from "../../assets/img/background-image.svg";
import { Form, Select, Button } from "antd";
import { FooterLogin, HeaderLogo } from "../../components/LoginArea";
import { Login } from "../../services/v2/usermanservice/authenticationservice";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "../../redux/actions";

interface typeRole {
  value: any;
  label: any;
}

function Step2() {
  const [form] = Form.useForm();
  const [role, setRole] = useState<typeRole[]>([]);
  const dispatch = useDispatch();
  const store = useSelector((state: any) => state.store);
  const route = useHistory();
  const location = useLocation();
  const userLog: any = location.state;

  useEffect(() => {
    if (userLog === undefined) {
      route.push("/");
    }
    if (userLog.auth?.role) {
      let roleTmp: any = userLog.auth.role;
      setRole([{ value: roleTmp.kode, label: roleTmp.nama }]);
      form.setFieldsValue({ role: roleTmp.kode, tahun: userLog.isTahun });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLog]);

  const loginAction = async (values: any) => {
    try {
      let payload: any = {
        username: userLog.username,
        password: userLog.password,
        kodeRole: values.role,
      };
      const res = await Login(payload);

      const authTmp = {
        ...res.return,
        isLogin: true,
        isTahun: values.tahun,
      };
      dispatch(signIn(authTmp, values.tahun));
      route.push("/");
    } catch (err) {
      console.log(err);
    }
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
              form={form}
              name="normal_login"
              className="login-form"
              layout="vertical"
              // initialValues={{ remember: true }}
              onFinish={onFinish}>
              <Form.Item
                label="Role"
                name="role"
                rules={[
                  {
                    required: true,
                    message: "Role tidak boleh kosong!",
                  },
                ]}>
                <Select placeholder="Role" options={role} />
              </Form.Item>
              <Form.Item
                label="Tahun"
                name="tahun"
                rules={[
                  { required: true, message: "Tahun tidak boleh kosong!" },
                ]}>
                <Select placeholder="Tahun">
                  {store.periodeTahunActive.length &&
                    store.periodeTahunActive.map((item: any, i: any) => (
                      <Select.Option key={i} value={item.tahun}>
                        {item.nama}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button mb-2">
                  Masuk
                </Button>
              </Form.Item>
            </Form>
          </div>
          <FooterLogin />
        </div>
      </div>
    </div>
  );
}

export default Step2;
