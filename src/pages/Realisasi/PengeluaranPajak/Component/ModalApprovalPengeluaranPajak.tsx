/** @format */

import React from "react";
import { Button, Modal, Descriptions } from "antd";
import moment from "moment";
import "moment/locale/id";
import { formatRupiah } from "../../../../utils/helper";
import TableDetailPajak from "./TableDetailPajak";

type FormActionType = {
  openModal: boolean;
  title: string;
  store: any;
  data: any;
  handleSave: (e: any) => void;
  handleClose: () => void;
};

const ModalApprovalPengeluaranPajak = ({
  openModal,
  title,
  data,
  store,
  handleSave,
  handleClose,
}: FormActionType) => {
  const tmpRekeningBelanja = store.rekeningBelanja || [];
  const tmpSumberDana = store.rencanaPendapatanDefinitif || [];
  const tmpTipeKas = store.tipeKas || [];
  const tmpPajak = store.pajak || [];

  return (
    <Modal
      key="ModalApprovalPengeluaranPajak"
      visible={openModal}
      title={`${title} Nota Pengeluaran Pajak`}
      width={1100}
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
          {tmpSumberDana
            .filter((item) => item.id.includes(data?.rencanaPendapatanId))
            .map((item) => item.nama_sumber_dana) || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Tipe Kas">
          {tmpTipeKas
            .filter((item) => item.kode === data?.kodeTipeKas)
            .map((item) => item.nama) || "-"}
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
        <Descriptions.Item label="Jenis Pajak">
          {(data?.kodePajak &&
            tmpPajak
              .filter((item) => item.kode === data?.kodePajak)
              .map((item) => item.nama)) ||
            "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Total">
          {(data?.grandTotal && formatRupiah(data?.grandTotal)) || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Keterangan">
          {data?.keterangan || "-"}
        </Descriptions.Item>
      </Descriptions>
      <TableDetailPajak data={data?.pajakDetails || []} store={store} />
    </Modal>
  );
};
export default ModalApprovalPengeluaranPajak;
