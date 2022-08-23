/** @format */

import React from "react";
import { Button, Modal, Descriptions } from "antd";
import moment from "moment";
import "moment/locale/id";

type FormActionType = {
  openModal: boolean;
  title: string;
  store: any;
  data: any;
  rincian: any;
  handleSave: (e: any) => void;
  handleClose: () => void;
};

const ModalApprovalOutputKegiatan = ({
  openModal,
  title,
  data,
  store,
  rincian,
  handleSave,
  handleClose,
}: FormActionType) => {
  const tmpSumberDana = store.rencanaPendapatanDefinitif || [];

  return (
    <Modal
      visible={openModal}
      title={`${title} Output Kegiatan`}
      width={700}
      onCancel={handleClose}
      footer={[
        <Button onClick={handleClose}>Batal</Button>,
        <Button onClick={() => handleSave("DITOLAK")} danger>
          Tolak
        </Button>,
        <Button type="primary" onClick={() => handleSave("DISETUJUI")}>
          Disetujui
        </Button>,
      ]}>
      <Descriptions
        labelStyle={{ fontWeight: "bold" }}
        size="small"
        layout="vertical"
        column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}>
        <Descriptions.Item label="Tanggal Realisasi">
          {data?.tanggalRealisasi
            ? moment(data?.tanggalRealisasi).format("dddd,DD MMM YYYY HH:mm:ss")
            : "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Sumber Dana">
          {tmpSumberDana
            .filter((item: any) => item.id.includes(data?.rencanaPendapatanId))
            .map((item) => item.nama_sumber_dana) || "-"}
        </Descriptions.Item>

        <Descriptions.Item label="Standar Pendidikan">
          {rincian?.nama_snp || "-"}
        </Descriptions.Item>

        <Descriptions.Item label="Kegiatan">
          {rincian?.nama_kegiatan || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Sub Kegiatan">
          {rincian?.nama_sub_kegiatan || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Tahap">
          {data?.tahap || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Realisasi Output">
          {data?.qtyOutput + " " + rincian?.indikator_output_satuan || "-"}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};
export default ModalApprovalOutputKegiatan;
