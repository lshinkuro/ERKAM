/** @format */

import React from "react";
import { Button, Modal, Descriptions } from "antd";
import moment from "moment";
import "moment/locale/id";
import { formatRupiah } from "../../../../utils/helper";

type FormActionType = {
  openModal: boolean;
  title: string;
  store: any;
  data: any;
  handleSave: (e: any) => void;
  handleClose: () => void;
};

const ModalApprovalPindahBuku = ({
  openModal,
  title,
  data,
  store,
  handleSave,
  handleClose,
}: FormActionType) => {
  const tmpRekeningBelanja = store.rekeningBelanja || [];
  return (
    <Modal
      visible={openModal}
      title={`${title} Nota Pindah Buku`}
      width={800}
      onCancel={handleClose}
      footer={
        title === "Approval" && [
          <Button onClick={handleClose}>Batal</Button>,
          <Button onClick={() => handleSave("/disapproval")} danger>
            Tolak
          </Button>,
          <Button type="primary" onClick={() => handleSave("/approval")}>
            Disetujui
          </Button>,
        ]
      }>
      <Descriptions
        labelStyle={{ fontWeight: 600 }}
        size="small"
        layout="vertical"
        column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}>
        <Descriptions.Item label="No Nota">
          {data?.noNotaFormat}
        </Descriptions.Item>
        <Descriptions.Item label="Tanggal Nota">
          {data?.tanggalNota
            ? moment(data?.tanggalNota).format("dddd,DD MMM YYYY HH:mm:ss")
            : "-"}
        </Descriptions.Item>
        <Descriptions.Item label="No Referensi">
          {data?.realisasiNoReferensi || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Tanggal Realisasi">
          {data?.tanggalRealisasi
            ? moment(data?.tanggalRealisasi).format("dddd,DD MMM YYYY HH:mm:ss")
            : "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Sumber Dana">
          {data?.rencanaPendapatanName || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Tipe Kas">
          {data?.namaTipeKas || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="No Rekening">
          {(data?.rekeningBankId &&
            tmpRekeningBelanja
              .filter((item: any) => item.id.includes(data?.rekeningBankId))
              .map((item) => item.no_rekening)) ||
            "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Rekening Atas Nama">
          {(data?.rekeningBankId &&
            tmpRekeningBelanja
              .filter((item: any) => item.id.includes(data?.rekeningBankId))
              .map((item) => item.no_rekening_nama)) ||
            "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Nama Bank">
          {data?.namaRekeningBank || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Ke Tipe Kas">
          {data?.namaToTipeKas || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Ke No Rekening">
          {(data?.toRekeningBankId &&
            tmpRekeningBelanja
              .filter((item: any) => item.id.includes(data?.toRekeningBankId))
              .map((item) => item.no_rekening)) ||
            "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Ke Rekening Atas Nama">
          {(data?.toRekeningBankId &&
            tmpRekeningBelanja
              .filter((item: any) => item.id.includes(data?.toRekeningBankId))
              .map((item) => item.no_rekening_nama)) ||
            "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Ke Nama Bank">
          {data?.namaToRekeningBank || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Total">
          {(data?.grandTotal && formatRupiah(data?.grandTotal)) || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Keterangan">
          {data?.keterangan || "-"}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};
export default ModalApprovalPindahBuku;
