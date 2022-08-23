/** @format */

import React, { useState } from "react";
import { Modal, Upload, Steps, Button, Result, Table } from "antd";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import XLSX from "xlsx";
import notifAlert from "../../../components/NotifAlert";
import { submitFile } from "../../../services/v2/usermanservice/madrasahservices";
import { ExportToExcel } from "../../../components/Export/ExportToExcel";
const { Dragger } = Upload;

const { Step } = Steps;
const ModalSendMasal = ({
  openModal,
  handleClose,
  data,
  handleLoad,
  refProvinsi,
  refKabkota,
}) => {
  const [current, setCurrent] = useState(0);
  const [selectedFileList, setSelectFileList] = useState<any>([]);
  const [fileImport, setFileImport] = useState<any>([]);
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
      {current < 2 && (
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
    handleClose();
  };

  const handleSend = async () => {
    try {
      let FData = new FormData();
      FData.append("file", fileXLS);
      await submitFile(FData);
      notifAlert({
        type: "success",
        description: "File Berhasil di upload",
      });
      setSelectFileList([]);
      setFileImport([]);
      setFileXLS(null);
      handleLoad();
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
          const prov = refProvinsi
            .filter((item) => item.kode === el.kode_provinsi)
            .map((item) => item.nama);
          const kab = refKabkota
            .filter((item) => item.kode === el.kode_kabkota)
            .map((item) => item.nama);
          return {
            NSM: el.nsm,
            "NAMA SEKOLAH": el.nama,
            PROVINSI: (prov.length && prov[0]) || null,
            KABUPATEN: (kab.length && kab[0]) || null,
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
    <Modal
      key="sendMasal"
      width={1100}
      visible={openModal}
      title={`Kirim Masal Kode Registrasi Madrasah`}
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
                Format file .excel yang akan di upload harus sesuai dengan file
                template di step 1.
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
    </Modal>
  );
};
export default ModalSendMasal;
