/** @format */

import React, { useState } from "react";
import { Button, Input, Form, Divider } from "antd";
import { LockOutlined } from "@ant-design/icons";
import * as profileservice from "../../../services/v2/usermanservice/profileservices";
import notifAlert from "../../../components/NotifAlert";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setClearStore, signOut } from "../../../redux/actions";

const GantiPassword = () => {
  const route = useHistory();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  const handleGantiPassword = async (values: any) => {
    setLoading(true);
    let params = {
      password_lama: values.password,
      password_baru: values.newPassword,
    };
    try {
      await profileservice.editProfileGantiPassword(params);
      notifAlert({ type: "success", description: "Data berhasil di simpan" });
      dispatch(signOut());
      dispatch(setClearStore());
      setTimeout(() => route.push("/login"), 10);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <Form
      form={form}
      key="formGantiPassword"
      name="formGantiPassword"
      layout="vertical"
      onFinish={handleGantiPassword}>
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
              if (!value || getFieldValue("newPassword") === value) {
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
      <Divider />
      <Form.Item className="text-right">
        <Button
          loading={loading}
          type="primary"
          htmlType="submit"
          className="mb-2">
          Simpan
        </Button>
      </Form.Item>
    </Form>
  );
};
export default GantiPassword;
