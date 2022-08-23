/** @format */

import React, { useEffect, useState } from "react";
import { Select, Button, Input, Form, Divider } from "antd";
import * as profileservice from "../../../services/v2/usermanservice/profileservices";
import notifAlert from "../../../components/NotifAlert";
import { useDispatch, useSelector } from "react-redux";
import { setStore } from "../../../redux/actions";
import { getReferenceAll } from "../../../services/v2/referenceservice";

const FormEditData = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [kabkota, setKabkota] = useState<any>(null);
  const [kecamatan, setKecamatan] = useState<any>(null);
  const [provinsi, setProvinsi] = useState<any>(null);
  const store = useSelector((state: any) => state.store);
  const tmpProfile: any = store.profile.profile || [];
  const tmpProvinsi: any = store.provinsi || [];
  const tmpKabKota: any = store.kabkota || [];
  const tmpKecamatan: any = store.kecamatan || [];
  // const tmpKelurahan: any = store.kelurahan || [];
  const [tmpKelurahan, setRefKelurahan] = useState<any>([]);

  const getData = async () => {
    const tmpKelurahan = store.kelurahan || [];
    if (tmpKelurahan.length) {
      setRefKelurahan(tmpKelurahan);
    } else {
      const kelurahan = await getReferenceAll("kelurahan", { activated: 1 });
      setRefKelurahan(kelurahan);
      setTimeout(() => {
        dispatch(setStore({ kelurahan }));
      }, 100);
    }
  };

  useEffect(() => {
    getData();
    setDataProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setDataProfile = () => {
    form.setFieldsValue({
      nama: tmpProfile?.nama,
      provinsi: tmpProfile?.kode_provinsi || null,
      kabkota: tmpProfile.kode_kabkota || null,
      kecamatan: tmpProfile?.kode_kecamatan || null,
      kelurahan: tmpProfile?.kode_kelurahan || null,
      rt: tmpProfile?.rt || "",
      rw: tmpProfile?.rw || "",
      alamat: tmpProfile?.alamat_jalan || "",
    });
    setProvinsi(tmpProfile?.kode_provinsi);
    setKabkota(tmpProfile?.kode_kabkota);
    setKecamatan(tmpProfile?.kode_kecamatan);
  };

  const handleChangeSelect = (value: any, type: string) => {
    switch (type) {
      case "provinsi":
        setProvinsi(value);
        setKabkota(null);
        setKecamatan(null);
        form.setFieldsValue({
          kabkota: null,
          kecamatan: null,
          kelurahan: null,
        });
        return;
      case "kabkota":
        setKabkota(value);
        setKecamatan(null);
        form.setFieldsValue({
          kecamatan: null,
          kelurahan: null,
        });
        return;
      case "kecamatan":
        setKecamatan(value);
        form.setFieldsValue({
          kelurahan: null,
        });
        return;
    }
  };

  const handleSaveProfile = async (values: any) => {
    setLoading(true);
    let params: any = {
      nama: values.nama,
      rt: values.rt,
      rw: values.rw,
      user_id: tmpProfile.user_id,
      kode_provinsi: values.provinsi,
      kode_kabkota: values.kabkota,
      kode_kecamatan: values.kecamatan,
      kode_kelurahan: values.desa,
      alamat_jalan: values.alamat,
    };

    try {
      await profileservice.editProfile(params);
      notifAlert({ type: "success", description: "Data berhasil di simpan" });
      setTimeout(async () => {
        const profile = await profileservice.getProfile();
        const dataProfile = { profile };
        dispatch(setStore(dataProfile));
      }, 100);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <Form
      form={form}
      key="formEditProfile"
      name="formEditProfile"
      layout="vertical"
      onFinish={handleSaveProfile}>
      <Form.Item
        label="Nama"
        name="nama"
        rules={[
          {
            required: true,
            message: "Nama tidak boleh kosong!",
          },
        ]}>
        <Input placeholder="Nama" />
      </Form.Item>
      <Form.Item label="Provinsi" name="provinsi">
        <Select
          showSearch
          allowClear
          optionFilterProp="children"
          className="w-full"
          placeholder="Pilih Provinsi"
          onChange={(values: any) => handleChangeSelect(values, "provinsi")}>
          {tmpProvinsi?.length &&
            tmpProvinsi.map((e: any, i: any) => {
              return (
                <Select.Option key={`prov${i}`} value={e.kode}>
                  {e.nama}
                </Select.Option>
              );
            })}
        </Select>
      </Form.Item>

      <Form.Item label="Kabupaten / Kota" name="kabkota">
        <Select
          showSearch
          allowClear
          optionFilterProp="children"
          className="w-full"
          placeholder="Pilih Kabupaten / Kota"
          onChange={(values: any) => handleChangeSelect(values, "kabkota")}>
          {provinsi &&
            tmpKabKota?.length &&
            tmpKabKota
              .filter((e: any) => e.kode_provinsi === provinsi)
              .map((e: any, i: any) => {
                return (
                  <Select.Option key={`kabkot${i}`} value={e.kode}>
                    {e.nama}
                  </Select.Option>
                );
              })}
        </Select>
      </Form.Item>
      <Form.Item label="Kecamatan" name="kecamatan">
        <Select
          showSearch
          allowClear
          optionFilterProp="children"
          className="w-full"
          placeholder="Pilih Kecamatan"
          onChange={(values: any) => handleChangeSelect(values, "kecamatan")}>
          {kabkota &&
            tmpKecamatan?.length &&
            tmpKecamatan
              .filter((e: any) => e.kode_kabkota === kabkota)
              .map((e: any, i: any) => {
                return (
                  <Select.Option key={`kec${i}`} value={e.kode}>
                    {e.nama}
                  </Select.Option>
                );
              })}
        </Select>
      </Form.Item>
      <Form.Item label="Kelurahan / Desa" name="kelurahan">
        <Select
          showSearch
          allowClear
          optionFilterProp="children"
          className="w-full"
          placeholder="Pilih Kelurahan"
          onChange={(values: any) => handleChangeSelect(values, "kelurahan")}>
          {kecamatan &&
            tmpKelurahan?.length &&
            tmpKelurahan
              .filter((e: any) => e.kode_kecamatan === kecamatan)
              .map((e: any, i: any) => {
                return (
                  <Select.Option key={`kel${i}`} value={e.kode}>
                    {e.nama}
                  </Select.Option>
                );
              })}
        </Select>
      </Form.Item>
      <div className="flex">
        <div className="mr-2">
          <Form.Item label="RT" name="rt">
            <Input type="number" placeholder="RT" />
          </Form.Item>
        </div>
        <div>
          <Form.Item label="RW" name="rw">
            <Input type="number" placeholder="RW" />
          </Form.Item>
        </div>
      </div>
      <Form.Item label="Alamat Jalan" name="alamat">
        <Input.TextArea placeholder="Alamat Jalan" />
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

export default FormEditData;
