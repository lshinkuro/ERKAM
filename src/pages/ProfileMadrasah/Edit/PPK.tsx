/** @format */

import React, { useEffect, useState } from "react";
import { Form, Select, Button, Divider, Space } from "antd";
import { useHistory } from "react-router";
import notifAlert from "../../../components/NotifAlert";
import { useDispatch, useSelector } from "react-redux";

import { getProfile } from "../../../services/v2/usermanservice/profileservices";
import { setStore } from "../../../redux/actions";
import { editMadrasah } from "../../../services/v2/usermanservice/madrasahservices";

const PPK = () => {
  const route = useHistory();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const store = useSelector((state: any) => state.store);
  const { levelPPK } = store;
  const madrasah = store.profile.madrasah || [];
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    form.setFieldsValue({ ppk: madrasah.kode_level_ppk });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [madrasah]);

  const handleSavePPK = async (values) => {
    setIsLoading(true);
    try {
      let payload = {
        id: madrasah.id,
        kode_level_ppk: values.ppk,
      };
      await editMadrasah(payload);
      notifAlert({ type: "success", description: "Data Berhasil di simpan" });
      setTimeout(async () => {
        const profile = await getProfile();
        const dataProfile = { profile };
        dispatch(setStore(dataProfile));
      }, 100);
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
          onFinish={handleSavePPK}>
          <Form.Item
            label="PPK"
            name="ppk"
            rules={[{ required: true, message: "PPK tidak boleh kosong!" }]}>
            <Select
              showSearch
              optionFilterProp="children"
              placeholder="Pilih PPK">
              {levelPPK?.length &&
                levelPPK.map((e: any, i: any) => {
                  return (
                    <Select.Option key={`ppk${i}`} value={e.kode}>
                      {e.nama}
                    </Select.Option>
                  );
                })}
            </Select>
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

export default PPK;
