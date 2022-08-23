/** @format */

import React, { useState } from "react";
import { Modal, Upload, Steps, Button, Result, Table } from "antd";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import XLSX from "xlsx";
import notifAlert from "../../../components/NotifAlert";
import { useHistory } from "react-router-dom";
import { BreadCrumb } from "../../../components";
import TooltipInfo from "../../../components/TooltipInfo";
import { useSelector } from "react-redux";
import { ExportToExcel } from "../../../components/Export/ExportToExcel";
const { Dragger } = Upload;

const { Step } = Steps;

const steps = [
  {
    title: "Export",
    content: "Download terlebih dahulu format excel komponen biaya.",
  },
  {
    title: "Import",
    content: "Upload kembali excel komponen biaya yang telah di set harganya.",
  },
  {
    title: "Proses",
    content:
      "Pastikan data komponen yang anda upload itu sudah benar, ketik proses untuk mengupload data komponen biaya",
  },
  {
    title: "Selesai",
    content: "Set harga komponen biaya telah selesai",
  },
];

const SetKomponenBiayaHarga = () => {
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Referensi" },
    { path: "/", breadcrumbName: "Komponen Biaya" },
    { path: "/", breadcrumbName: "Set Harga Komponen Biaya" },
  ];
  const route = useHistory();
  const auths = useSelector((state: any) => state.auth);
  const [current, setCurrent] = useState(0);
  const [selectedFileList, setSelectFileList] = useState<any>([]);
  const [fileImport, setFileImport] = useState<any>([]);
  const [data, setData] = useState<any>([]);
  const [fileXLS, setFileXLS] = useState<any>(null);

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
    setFileXLS(file.originFileObj);
    try {
      reader.onload = function (e: any) {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, { type: "array" });
        var firstSheet = workbook.SheetNames[0];
        const elements = XLSX.utils
          .sheet_to_json(workbook.Sheets[firstSheet])
          .map((el: any) => {
            return {
              nsm: el["NSM"],
              nama: el["NAMA SEKOLAH"],
              provinsi: el["PROVINSI"],
              kabkota: el["KABUPATEN"],
              email: el["EMAIL"],
            };
          });
        setFileImport(elements);
      };
      reader.readAsArrayBuffer(file.originFileObj);
    } catch (error) {
      notifAlert({ type: "error", description: "Upload file gagal!" });
    }
  };
  const columns: any = [
    { title: "NSM", key: "nsm", dataIndex: "nsm" },
    { title: "Nama Madrasah", key: "nama", dataIndex: "nama" },
    { title: "Provinsi", key: "provinsi", dataIndex: "provinsi" },
    { title: "Kab/Kota", key: "kabkota", dataIndex: "kabkota" },
    { title: "Email", key: "email", dataIndex: "email" },
  ];

  const handleReset = () => {
    setCurrent(0);
    setSelectFileList([]);
    setFileImport([]);
    // handleClose();
  };

  const handleSend = async () => {
    try {
      let FData = new FormData();
      FData.append("file", fileXLS);
      // await submitFile(FData);
      notifAlert({
        type: "success",
        description: "File Berhasil di upload",
      });
      setSelectFileList([]);
      setFileImport([]);
      setFileXLS(null);
      // handleLoad();
      next();
    } catch (error) {
      console.log(error);
    }
  };

  const handleExport = () => {
    try {
      let xls = data
        .filter((item) => item.activated === "0")
        .map((el: any) => {
          // const prov = refProvinsi
          //   .filter((item) => item.kode === el.kode_provinsi)
          //   .map((item) => item.nama);
          // const kab = refKabkota
          //   .filter((item) => item.kode === el.kode_kabkota)
          //   .map((item) => item.nama);
          return {
            NSM: el.nsm,
            "NAMA SEKOLAH": el.nama,
            // PROVINSI: (prov.length && prov[0]) || null,
            // KABUPATEN: (kab.length && kab[0]) || null,
            EMAIL: el.email,
          };
        });
      ExportToExcel(xls, "referensi-madrasah");

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

  return (
    <>
      <BreadCrumb
        routes={itemBreadcrumb}
        title="Set Harga"
        back
        toBack={() => route.goBack()}
      />
      <div className="m-5 p-5 bg-white shadow-sm rounded-sm">
        <div className="mb-4">
          <Steps size="small" current={current}>
            {steps.map((item: any) => (
              <Step
                key={item.title}
                title={item.title}
                subTitle={<TooltipInfo title={item.content} />}
              />
            ))}
          </Steps>
          <div className="my-4">
            {(steps[current].content === "export" && (
              <Result
                title="Informasi"
                subTitle="Download terlebih dahulu file contoh template .excel"
                extra={
                  <Button
                    key="console"
                    icon={<DownloadOutlined />}
                    onClick={handleExport}>
                    Download
                  </Button>
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
                    Format file .excel yang akan di upload harus sesuai dengan
                    file template di step 1.
                  </p>
                </Dragger>
              )) ||
              (steps[current].content === "proses" && (
                <Table
                  rowKey={(record) => record.nsm}
                  dataSource={fileImport}
                  columns={columns}
                  pagination={false}
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
        </div>
      </div>
    </>
  );
};

export default SetKomponenBiayaHarga;
