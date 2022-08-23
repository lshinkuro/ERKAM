/** @format */

import React, { useEffect, useState } from "react";
import { Form, Input, Button, Divider, Space } from "antd";
import { useHistory } from "react-router";
import notifAlert from "../../../components/NotifAlert";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../../../services/v2/usermanservice/profileservices";
import { setStore } from "../../../redux/actions";
import { editMadrasah } from "../../../services/v2/usermanservice/madrasahservices";

const Komite = () => {
  const route = useHistory();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const store = useSelector((state: any) => state.store);
  const madrasah = store.profile.madrasah || [];
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    form.setFieldsValue({
      nik: madrasah.nik_komite,
      nama: madrasah.nama_komite,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [madrasah]);

  const handleSaveKomite = async (values) => {
    setIsLoading(true);
    try {
      let payload = {
        id: madrasah.id,
        nik_komite: values.nik,
        nama_komite: values.nama,
      };
      await editMadrasah(payload);
      setTimeout(async () => {
        const profile = await getProfile();
        const dataProfile = { profile };
        dispatch(setStore(dataProfile));
      }, 100);
      notifAlert({ type: "success", description: "Data Berhasil di simpan" });
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };

  return (
    <>
      <div className="p-4">
        <Form
          form={form}
          key="formEditProfile"
          name="formEditProfile"
          layout="vertical"
          onFinish={handleSaveKomite}>
          <Form.Item
            label="Nama Ketua Komite"
            name="nama"
            rules={[
              {
                required: true,
                message: "Nama Ketua Komite tidak boleh kosong!",
              },
            ]}>
            <Input placeholder="NIK Ketua Komite" />
          </Form.Item>
          <Form.Item
            label="NIK Ketua Komite"
            name="nik"
            rules={[
              {
                required: true,
                message: "NIK Ketua Komite tidak boleh kosong!",
              },
            ]}>
            <Input placeholder="NIK Ketua Komite" />
          </Form.Item>
          <Divider />
          <Space className="">
            <Button
              onClick={() => {
                route.push("/profile-madrasah");
              }}>
              Batal
            </Button>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Simpan
            </Button>
          </Space>
        </Form>
      </div>
    </>
  );
};

export default Komite;
