/** @format */

import React, { useState } from "react";
import {
  Modal,
  Upload,
  Steps,
  Button,
  Result,
  Table,
  Select,
  Form,
} from "antd";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import XLSX from "xlsx";
import notifAlert from "../../../../components/NotifAlert";

import { ExportToExcel } from "../../../../components/Export/ExportToExcel";
import { useSelector } from "react-redux";
import { getReferenceAll } from "../../../../services/v2/referenceservice";
import { setHargaKomponenBiaya } from "../../../../services/v2/referenceservice/komponenbiaya";
const { Dragger } = Upload;

const { Step } = Steps;
const ModalSetHarga = ({ openModal, handleClose, refProvinsi, refKabkota }) => {
  const auths = useSelector((state: any) => state.auth);
  const auth = auths?.data || null;
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState<any>(false);
  const [selectedFileList, setSelectFileList] = useState<any>([]);
  const [data, setData] = useState<any>([]);
  const [fileImport, setFileImport] = useState<any>([]);
  //   const [fileXLS, setFileXLS] = useState<any>(null);
  const [provinsi, setProvinsi] = useState<any>(null);
  const [form] = Form.useForm();

  const props: UploadProps = {
    name: "file",
    multiple: false,
    style: { marginTop: 20, marginBottom: 20 },
    onChange(info: any) {
      const { status } = info.file;

      switch (status) {
        case "uploading":
          setSelectFileList([info.file]);
          handleFileExcel(info.file);
          break;
        case "done":
          setSelectFileList([info.file]);
          handleFileExcel(info.file);
          break;
      }
    },
    beforeUpload(file: any) {
      const isExcel =
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

      if (!isExcel) {
        notifAlert({
          type: "error",
          description: `${file.name} format yang di upload harus excel`,
        });
      }

      return isExcel || Upload.LIST_IGNORE;
    },
    onDrop(e: any): void {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const handleFileExcel = async (file: any) => {
    var reader = await new FileReader();
    // setFileXLS(file.originFileObj);
    try {
      reader.onload = function (e: any) {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, { type: "array" });
        var firstSheet = workbook.SheetNames[0];
        const elements = XLSX.utils
          .sheet_to_json(workbook.Sheets[firstSheet])
          .map((el: any) => {
            return {
              tahun: el["Tahun"],
              kategori: el["Kategori"],
              kodeKategori: el["Kode Kategori"],
              kodeProvinsi: el["Kode Provinsi"],
              kodeKabkota: el["Kode Kabkota"],
              kode: el["Kode"],
              spesifikasi: el["Spesifikasi"],
              satuan: el["Satuan"],
              harga1: el["Harga 1"],
              harga2: el["Harga 2"],
              harga3: el["Harga 3"],
            };
          });
        setFileImport(elements);
      };
      reader.readAsArrayBuffer(file.originFileObj);
    } catch (error) {
      notifAlert({ type: "error", description: "Upload file gagal!" });
    }
  };

  const steps = [
    {
      title: "Export",
      content: "export",
    },
    {
      title: "Import",
      content: "import",
    },
    {
      title: "Proses Data",
      content: "proses",
    },
    {
      title: "Selesai",
      content: "selesai",
    },
  ];

  const footerModal = (
    <div className="steps-action">
      {current > 0 && current < 3 && (
        <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
          Kembali
        </Button>
      )}
      {current > 0 && current < 2 && (
        <Button
          type="primary"
          onClick={() => next()}
          disabled={current === 1 ? (fileImport.length ? false : true) : false}>
          Lanjut
        </Button>
      )}
      {current === 2 && (
        <Button
          type="primary"
          onClick={() => handleSend()}
          disabled={fileImport.length ? false : true}>
          Kirim
        </Button>
      )}
      {current === steps.length - 1 && (
        <Button type="primary" onClick={() => handleReset()}>
          Tutup
        </Button>
      )}
    </div>
  );

  const columns: any = [
    { title: "Tahun", key: "tahun", dataIndex: "tahun" },
    { title: "Kategori", key: "kategori", dataIndex: "kategori" },
    { title: "Kode Kategori", key: "kodeKategori", dataIndex: "kodeKategori" },
    { title: "Kode Provinsi", key: "kodeProvinsi", dataIndex: "kodeProvinsi" },
    { title: "Kode Kab/Kota", key: "kodeKabkota", dataIndex: "kodeKabkota" },
    { title: "Kode", key: "kode", dataIndex: "kode" },
    { title: "Nama", key: "nama", dataIndex: "nama" },
    { title: "Spesifikasi", key: "spesifikasi", dataIndex: "spesifikasi" },
    { title: "Satuan", key: "satuan", dataIndex: "satuan" },
    { title: "Harga 1", key: "harga1", dataIndex: "harga1" },
    { title: "Harga 2", key: "harga2", dataIndex: "harga2" },
    { title: "Harga 3", key: "harga3", dataIndex: "harga3" },
  ];

  const handleReset = () => {
    setCurrent(0);
    setSelectFileList([]);
    setFileImport([]);
    setData([]);
    handleClose();
  };

  const handleSend = async () => {
    try {
      //   let FData = new FormData();
      //   FData.append("file", fileXLS);
      await setHargaKomponenBiaya(data);
      notifAlert({
        type: "success",
        description: "File Berhasil di upload",
      });
      setSelectFileList([]);
      setFileImport([]);
      setData([]);
      //   setFileXLS(null);
      next();
    } catch (error) {
      console.log(error);
    }
  };

  const handleExport = async (data: any) => {
    try {
      let xls = data.map((el: any) => {
        return {
          Tahun: el.tahun,
          Kategori: el.nama_kategori,
          "Kode Kategori": el.kode_kategori,
          "Kode Provinsi": el.kode_provinsi,
          "Kode Kabkota": el.kode_kabkota,
          Kode: el.kode,
          Nama: el.nama,
          Spesifikasi: el.spesifikasi,
          Satuan: el.satuan,
          "Harga 1": el.harga_1,
          "Harga 2": el.harga_2,
          "Harga 3": el.harga_3,
        };
      });
      setData(xls);
      ExportToExcel(xls, "template-komponen-biaya");
      setCurrent(1);
      notifAlert({
        type: "success",
        description: "Data berhasil di export",
      });
    } catch (error) {
      notifAlert({
        type: "error",
        description: "Data Gagal di export",
      });
    }
  };

  const handleChange = (values) => {
    for (let obj in values) {
      if (obj === "provinsi") {
        setProvinsi(values.provinsi);
        form.setFieldsValue({ kabkota: null });
      }
    }
  };

  const getData = async (values: any) => {
    setLoading(true);

    // if (groupRole === "kabkota" && tmpFilter?.kabkota) {

    const komponenBiaya = await getReferenceAll("komponen-biaya", {
      tahun: auth?.isTahun,
      kode_provinsi: values.provinsi,
      kode_kabkota: values.kabkota,
    });
    if (komponenBiaya.length) {
      handleExport(komponenBiaya);
    } else {
      notifAlert({
        type: "error",
        description: "Maaf data komponen biaya tidak di temukan!",
      });
    }

    // }
    // if (
    //   (groupRole === "pusat" || groupRole === "provinsi") &&
    //   tmpFilter?.kabkota
    // ) {
    //   const komponenBiaya = await getReferenceAll("komponen-biaya", {
    //     tahun: auth?.isTahun,
    //     kode_provinsi: tmpFilter?.provinsi,
    //     kode_kabkota: tmpFilter?.kabkota,
    //   });

    // }
    setLoading(false);
  };
  return (
    <Modal
      key="sendMasal"
      width={1100}
      visible={openModal}
      title={`Set Harga Komponen Biaya`}
      onCancel={handleReset}
      footer={footerModal}>
      <Steps current={current} size="small">
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="my-4">
        {(steps[current].content === "export" && (
          <Result
            title="Informasi"
            subTitle="Pilih Provinsi dan Kab / Kota lalu export dahulu file contoh template .excel"
            extra={
              <>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={getData}
                  onValuesChange={handleChange}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Form.Item
                        label="Provinsi"
                        name="provinsi"
                        rules={[
                          {
                            required: true,
                            message: "Provinsi tidak boleh kosong!",
                          },
                        ]}>
                        <Select
                          allowClear
                          showSearch
                          optionFilterProp="children"
                          placeholder="Pilih Provinsi">
                          {refProvinsi?.length &&
                            refProvinsi.map((e: any, i: any) => {
                              return (
                                <Select.Option key={`prov${i}`} value={e.kode}>
                                  {e.nama}
                                </Select.Option>
                              );
                            })}
                        </Select>
                      </Form.Item>
                    </div>
                    <div>
                      <Form.Item
                        label="Kab / Kota"
                        name="kabkota"
                        rules={[
                          {
                            required: true,
                            message: "Kab / Kota tidak boleh kosong!",
                          },
                        ]}>
                        <Select
                          allowClear
                          showSearch
                          optionFilterProp="children"
                          placeholder="Pilih Kab / Kota">
                          {provinsi &&
                            refKabkota?.length &&
                            refKabkota
                              .filter((item) => item.kode_provinsi === provinsi)
                              .map((e: any, i: any) => {
                                return (
                                  <Select.Option
                                    key={`role${i}`}
                                    value={e.kode}>
                                    {e.nama}
                                  </Select.Option>
                                );
                              })}
                        </Select>
                      </Form.Item>
                    </div>
                  </div>
                </Form>
                <Button
                  loading={loading}
                  key="console"
                  icon={<DownloadOutlined />}
                  onClick={() => form.submit()}>
                  Download
                </Button>
              </>
            }
          />
        )) ||
          (steps[current].content === "import" && (
            <Dragger {...props} fileList={selectedFileList}>
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">Klik atau tarik File Excel</p>
              <p className="ant-upload-hint">
                Format file .excel yang akan di upload harus sesuai dengan file
                template di step 1.
              </p>
            </Dragger>
          )) ||
          (steps[current].content === "proses" && (
            <Table
              rowKey={(record) => record.kode}
              dataSource={fileImport}
              columns={columns}
              //   pagination={false}
              bordered
            />
          )) ||
          (steps[current].content === "selesai" && (
            <Result
              status="success"
              title="Selesai"
              subTitle="Proses kirim kode registrasi berhasil"
              extra={
                <Button key="kembali" onClick={() => setCurrent(0)}>
                  Kembali ke awal
                </Button>
              }
            />
          ))}
      </div>
    </Modal>
  );
};
export default ModalSetHarga;
