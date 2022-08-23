/** @format */

import React, { useState, useEffect } from "react";
import { Button, Input, Form, Divider } from "antd";
import { UserOutlined } from "@ant-design/icons";
import * as profileservice from "../../../services/v2/usermanservice/profileservices";
import notifAlert from "../../../components/NotifAlert";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setClearStore, signOut } from "../../../redux/actions";

const EditNik = () => {
  const route = useHistory();
  const dispatch = useDispatch();
  const store = useSelector((state: any) => state.store);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const profile: any = store.profile.profile || [];

  useEffect(() => {
    setDataProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const setDataProfile = () => {
    form.setFieldsValue({
      nik: profile?.nik,
    });
  };

  const handleSaveNik = async (values: any) => {
    setLoading(true);
    let params = {
      nik: values.nik,
    };
    try {
      await profileservice.editProfileNIK(params);
      notifAlert({ type: "success", description: "Data berhasil di simpan" });
      dispatch(signOut());
      dispatch(setClearStore());
      setTimeout(() => route.push("/login"), 100);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <Form
      form={form}
      key="formEditNik"
      name="formEditNik"
      layout="vertical"
      onFinish={handleSaveNik}>
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
            message: "Jumlah harus NIK 16 karakter!",
          },
        ]}>
        <Input
          //   type="number"
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="NIK"
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
export default EditNik;
