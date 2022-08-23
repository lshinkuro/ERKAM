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

const ModalApprovalPendapatan = ({
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
      title={`${title} Nota Pendapatan`}
      width={700}
      onCancel={handleClose}
      footer={[
        <Button onClick={handleClose}>Batal</Button>,
        <Button onClick={() => handleSave("/disapproval")} danger>
          Tolak
        </Button>,
        <Button type="primary" onClick={() => handleSave("/approval")}>
          Disetujui
        </Button>,
      ]}>
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
          {(data?.rekeningBankId &&
            tmpRekeningBelanja
              .filter((item: any) => item.id.includes(data?.rekeningBankId))
              .map((item) => item.nama_bank)) ||
            "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Nilai Pendapatan">
          {(data?.jumlah && formatRupiah(data?.jumlah)) || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Keterangan">
          {data?.keterangan || "-"}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};
export default ModalApprovalPendapatan;
