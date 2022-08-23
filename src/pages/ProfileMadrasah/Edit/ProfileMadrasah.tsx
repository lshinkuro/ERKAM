/** @format */

import React, { useEffect, useState } from "react";
import { Form, Input, Button, Divider, Space, Select, Typography } from "antd";
import { useHistory } from "react-router";
import notifAlert from "../../../components/NotifAlert";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../../../services/v2/usermanservice/profileservices";
import { setStore } from "../../../redux/actions";
import { editMadrasah } from "../../../services/v2/usermanservice/madrasahservices";
import { getReferenceAll } from "../../../services/v2/referenceservice";
const { Text } = Typography;

const ProfileMadrasah = () => {
  const route = useHistory();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const store = useSelector((state: any) => state.store);
  const madrasah = store.profile.madrasah || [];
  const { provinsi, kabkota, kecamatan } = store;
  const [isLoading, setIsLoading] = useState(false);
  const [kelurahan, setRefKelurahan] = useState<any>([]);

  const getData = async () => {
    const res = await getReferenceAll("kelurahan", { activated: 1 });
    setRefKelurahan(res);
  };

  useEffect(() => {
    getData();
    form.setFieldsValue({
      npsn: madrasah.npsn,
      nama: madrasah.nama,
      jenjang: madrasah.jenjang.nama,
      status: madrasah.status === "n" ? "Negeri" : "Swasta",
      provinsi: madrasah.kode_provinsi,
      kabkota: madrasah.kode_kabkota,
      kelurahan: madrasah.kode_kelurahan,
      kecamatan: madrasah.kode_kecamatan,
      rt: madrasah.rt,
      rw: madrasah.rw,
      alamat: madrasah.alamat_jalan,
      kodepos: madrasah.kode_pos,
      npwp: madrasah.npwp,
      telepon: madrasah.telp,
      website: madrasah.website,
      email: madrasah.email,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [madrasah]);

  const handleSaveProfile = async (values) => {
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
          onFinish={handleSaveProfile}>
          <Text strong>Profil Madrasah</Text>
          <Divider />
          <div className="flex  flex-col  md:flex-row gap-2 ">
            <div className="flex-1">
              <Form.Item
                label="NPSN"
                name="npsn"
                rules={[
                  {
                    required: true,
                    message: "NPSN tidak boleh kosong!",
                  },
                ]}>
                <Input placeholder="NPSN" disabled />
              </Form.Item>
            </div>
            <div className="flex-1">
              <Form.Item
                label="Nama Lembaga"
                name="nama"
                rules={[
                  {
                    required: true,
                    message: "Nama Lembaga tidak boleh kosong!",
                  },
                ]}>
                <Input placeholder="Nama Lembaga" disabled />
              </Form.Item>
            </div>
          </div>
          <div className="flex  flex-col  md:flex-row gap-2 ">
            <div className="flex-1">
              <Form.Item
                label="Jenjang"
                name="jenjang"
                rules={[
                  {
                    required: true,
                    message: "Jenjang tidak boleh kosong!",
                  },
                ]}>
                <Input placeholder="Jenjang" disabled />
              </Form.Item>
            </div>
            <div className="flex-1">
              <Form.Item
                label="Status Madrasah"
                name="status"
                rules={[
                  {
                    required: true,
                    message: "Status Madrasah tidak boleh kosong!",
                  },
                ]}>
                <Input placeholder="Status Madrasah" disabled />
              </Form.Item>
            </div>
          </div>
          <Text strong>Alamat Madrasah</Text>
          <Divider />
          <div className="flex  flex-col  md:flex-row gap-2 ">
            <div className="flex-1">
              <Form.Item
                label="Provinsi"
                name="provinsi"
                rules={[
                  {
                    required: true,
                    message: "Provinsi tidak boleh kosong!",
                  },
                ]}>
                <Select placeholder="Provinsi" disabled>
                  {provinsi.map((item: any, index: number) => (
                    <Select.Option key={`pro${index}`} value={item.kode}>
                      {item.nama}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="flex-1">
              <Form.Item
                label="Kabupaten/Kota"
                name="kabkota"
                rules={[
                  {
                    required: true,
                    message: "Kabupaten/Kota tidak boleh kosong!",
                  },
                ]}>
                <Select placeholder="Kabupaten/Kota" disabled>
                  {kabkota.map((item: any, index: number) => (
                    <Select.Option key={`kab${index}`} value={item.kode}>
                      {item.nama}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </div>
          <div className="flex  flex-col  md:flex-row gap-2 ">
            <div className="flex-1">
              <Form.Item
                label="Kecamatan"
                name="kecamatan"
                rules={[
                  {
                    required: true,
                    message: "Kecamatan tidak boleh kosong!",
                  },
                ]}>
                <Select placeholder="Kecamatan" disabled>
                  {kecamatan.map((item: any, index: number) => (
                    <Select.Option key={`kec${index}`} value={item.kode}>
                      {item.nama}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="flex-1">
              <Form.Item
                label="Kelurahan"
                name="kelurahan"
                rules={[
                  {
                    required: true,
                    message: "Kelurahan tidak boleh kosong!",
                  },
                ]}>
                <Select placeholder="Kelurahan" disabled>
                  {kelurahan.map((item: any, index: number) => (
                    <Select.Option key={`kel${index}`} value={item.kode}>
                      {item.nama}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </div>
          <div className="flex  flex-col  md:flex-row gap-2 ">
            <div className="flex-1">
              <Form.Item
                label="RT"
                name="rt"
                rules={[
                  {
                    required: true,
                    message: "RT tidak boleh kosong!",
                  },
                ]}>
                <Input placeholder="RT" disabled />
              </Form.Item>
            </div>
            <div className="flex-1">
              <Form.Item
                label="RW"
                name="rw"
                rules={[
                  {
                    required: true,
                    message: "RW tidak boleh kosong!",
                  },
                ]}>
                <Input placeholder="RW" disabled />
              </Form.Item>
            </div>
          </div>
          <div className="flex  flex-col  md:flex-row gap-2 ">
            <div className="flex-1">
              <Form.Item
                label="Alamat Lengkap"
                name="alamat"
                rules={[
                  {
                    required: true,
                    message: "Alamat tidak boleh kosong!",
                  },
                ]}>
                <Input placeholder="Alamat Lengkap" disabled />
              </Form.Item>
            </div>
            <div className="flex-1">
              <Form.Item
                label="Kode Pos"
                name="kodepos"
                rules={[
                  {
                    required: true,
                    message: "Kode Pos tidak boleh kosong!",
                  },
                ]}>
                <Input placeholder="Kode Pos" disabled />
              </Form.Item>
            </div>
          </div>
          <Text strong>Informasi Lainnya</Text>
          <Divider />
          <div className="flex  flex-col  md:flex-row gap-2 ">
            <div className="flex-1">
              <Form.Item
                label="NPWP"
                name="npwp"
                rules={[
                  {
                    required: true,
                    message: "NPWP tidak boleh kosong!",
                  },
                ]}>
                <Input placeholder="NPWP" disabled />
              </Form.Item>
            </div>
            <div className="flex-1">
              <Form.Item
                label="Telepon"
                name="telepon"
                rules={[
                  {
                    required: true,
                    message: "Telepon tidak boleh kosong!",
                  },
                ]}>
                <Input placeholder="Telepon" disabled />
              </Form.Item>
            </div>
          </div>
          <div className="flex  flex-col  md:flex-row gap-2 ">
            <div className="flex-1">
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Email tidak boleh kosong!",
                  },
                ]}>
                <Input placeholder="Email" disabled />
              </Form.Item>
            </div>
            <div className="flex-1">
              <Form.Item
                label="Website"
                name="website"
                rules={[
                  {
                    required: true,
                    message: "Website tidak boleh kosong!",
                  },
                ]}>
                <Input placeholder="Website" disabled />
              </Form.Item>
            </div>
          </div>
          <Divider />
          <Space className="">
            <Button
              onClick={() => {
                route.push("/profile-madrasah");
              }}>
              Batal
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              disabled
              loading={isLoading}>
              Simpan
            </Button>
          </Space>
        </Form>
      </div>
    </>
  );
};

export default ProfileMadrasah;
