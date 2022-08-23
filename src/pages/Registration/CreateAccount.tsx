/** @format */

import React, { useState, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import Background from "../../assets/img/background-image.svg";
import { FooterLogin, HeaderLogo } from "../../components/LoginArea";
import { Form, Input, Button } from "antd";
import { Registrasi } from "../../services/v2/usermanservice/authenticationservice";
import notifAlert from "../../components/NotifAlert";

const CreateAccount = () => {
  const location = useLocation();
  const route = useHistory();
  const [form] = Form.useForm();
  const [data, setData] = useState<any>(null);
  //state hook

  useEffect(() => {
    let dataTmp: any = location.state || null;
    console.log(dataTmp);
    if (dataTmp) {
      setData(dataTmp);
    } else {
      route.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const handleSave = async (values: any) => {
    try {
      let payload: any = {
        kodeRegistrasi: data?.kodeRegistrasi,
        namaKepalaMadrasah: values.namaKepalaMadrasah,
        nikKepalaMadrasah: values.nikKepalaMadrasah,
        emailKepalaMadrasah: values.emailKepalaMadrasah,
        passwordKepalaMadrasah: values.passwordKepalaMadrasah,
        namaBendaharaMadrasah: values.namaBendaharaMadrasah,
        nikBendaharaMadrasah: values.nikBendaharaMadrasah,
        emailBendaharaMadrasah: values.emailBendaharaMadrasah,
        passwordBendaharaMadrasah: values.passwordBendaharaMadrasah,
      };

      await Registrasi(payload);

      notifAlert({
        type: "succces",
        description:
          "Kami telah mengirimkan link Validasi ke alamat E-mail yang anda masukkan untuk melakukan aktivasi akun Anda",
      });
      setTimeout(() => route.push("/login"), 5000);
      form.resetFields();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="relative flex min-h-screen flex-col justify-center overflow-hidden  p-6 sm:py-12"
      style={{
        background: `url(${Background})`,
      }}>
      <div className="flex-1 h-full w-3/4 mx-auto dark:bg-gray-800">
        {/* Image */}
        <HeaderLogo />
        <h2 className="mb-4 mt-4 text-lg text-center font-semibold text-gray-700 dark:text-gray-200">
          Registrasi Madrasah
        </h2>
        <div style={{ marginBottom: "2rem" }}>
          <div className="w-full bg-green-500 rounded-lg shadow-md">
            <h4 className="text-center font-bold py-2 text-xl text-white ">
              Data Madrasah
            </h4>
            <hr />
            <div className="md:p-5 px-8 py-5">
              <div className="flex  mb-4">
                <div className="w-1/4 font-bold md:font-medium">
                  <p className="text-white">NPSN</p>
                </div>
                <div className="w-3/4">
                  <p className="text-white text-sm">
                    : {data ? (data?.npsn ? data?.npsn : "-") : ""}
                  </p>
                </div>
              </div>
              <div className="flex  mb-4">
                <div className="w-1/4">
                  <p className="text-white font-bold md:font-medium">NSM</p>
                </div>
                <div className="w-3/4">
                  <p className="text-white text-sm">
                    : {data ? data?.nsm : "-"}
                  </p>
                </div>
              </div>
              <div className="flex  mb-4">
                <div className="w-1/4 font-bold md:font-medium">
                  <p className="text-white">Madrasah</p>
                </div>
                <div className="w-3/4">
                  <p className="text-white text-sm">
                    : {data ? data?.nama : "-"}
                  </p>
                </div>
              </div>
              <div className="flex  mb-4">
                <div className="w-1/4">
                  <p className="text-white font-bold md:font-medium">Status</p>
                </div>
                <div className="w-3/4">
                  <p className="text-white text-sm">
                    :{" "}
                    {data ? (data?.status === "s" && "Swasta") || "Negeri" : ""}
                  </p>
                </div>
              </div>

              <div className="flex mb-4">
                <div className="w-1/4">
                  <p className="text-white font-bold md:font-medium">Jenjang</p>
                </div>
                <div className="w-3/4">
                  <p className="text-white text-sm">
                    : {data ? data.jenjang?.nama : "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-2">
          <Form
            form={form}
            key="formCreateAccount"
            name="formCreateAccount"
            layout="vertical"
            onFinish={handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Form.Item
                  label="Nama Kepala Madrasah"
                  name="namaKepalaMadrasah"
                  rules={[
                    {
                      required: true,
                      message: "Nama Kepala Madrasah tidak boleh kosong!",
                    },
                  ]}>
                  <Input placeholder="Nama Kepala Madrasah" />
                </Form.Item>
                <Form.Item
                  label="NIK Kepala Madrasah"
                  name="nikKepalaMadrasah"
                  rules={[
                    {
                      required: true,
                      message: "NIK Kepala Madrasah tidak boleh kosong!",
                    },
                  ]}>
                  <Input type="number" placeholder="NIK Kepala Madrasah" />
                </Form.Item>
                <Form.Item
                  label="Email Kepala Madrasah"
                  name="emailKepalaMadrasah"
                  rules={[
                    {
                      required: true,
                      message: "Email Kepala Madrasah tidak boleh kosong!",
                    },
                    {
                      type: "email",
                      message: "Format email salah!",
                    },
                  ]}>
                  <Input placeholder="Email Kepala Madrasah" />
                </Form.Item>
                <Form.Item
                  label="Password Kepala Madrasah"
                  name="passwordKepalaMadrasah"
                  rules={[
                    {
                      required: true,
                      message: "Password Kepala Madrasah tidak boleh kosong!",
                    },
                    {
                      min: 6,
                      message: "Minimal 6 karakter!",
                    },
                  ]}>
                  <Input.Password placeholder="Password" />
                </Form.Item>
              </div>
              <div>
                <Form.Item
                  label="Nama Bendahara Madrasah"
                  name="namaBendaharaMadrasah"
                  rules={[
                    {
                      required: true,
                      message: "Nama Bendahara Madrasah tidak boleh kosong!",
                    },
                  ]}>
                  <Input placeholder="Nama Bendahara Madrasah" />
                </Form.Item>
                <Form.Item
                  label="NIK Bendahara Madrasah"
                  name="nikBendaharaMadrasah"
                  rules={[
                    {
                      required: true,
                      message: "NIK Bendahara Madrasah tidak boleh kosong!",
                    },
                  ]}>
                  <Input type="number" placeholder="NIK Bendahara Madrasah" />
                </Form.Item>
                <Form.Item
                  label="Email Bendahara Madrasah"
                  name="emailBendaharaMadrasah"
                  rules={[
                    {
                      required: true,
                      message: "Email Bendahara Madrasah tidak boleh kosong!",
                    },
                    {
                      type: "email",
                      message: "Format email salah!",
                    },
                  ]}>
                  <Input placeholder="Email Bendahara Madrasah" />
                </Form.Item>
                <Form.Item
                  label="Password Bendahara Madrasah"
                  name="passwordBendaharaMadrasah"
                  rules={[
                    {
                      required: true,
                      message:
                        "Password Bendahara Madrasah tidak boleh kosong!",
                    },
                    {
                      min: 6,
                      message: "Minimal 6 karakter!",
                    },
                  ]}>
                  <Input.Password placeholder="Password" />
                </Form.Item>
              </div>
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
            </div>
          </Form>
        </div>
        <FooterLogin />
      </div>
    </div>
  );
};

export default CreateAccount;
