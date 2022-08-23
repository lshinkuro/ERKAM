/** @format */

import React from "react";
import { Form, Modal, Descriptions, DatePicker, Input } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import moment from "moment";
import "moment/locale/id";
import { formatRupiah } from "../../../../utils/helper";

type FormActionType = {
  openModal: boolean;
  form: any;
  title: string;
  store: any;
  data: any;
  handleSave: (e: any) => void;
  handleClose: () => void;
};

const ModalTanggalRealisasiPendapatan = ({
  openModal,
  title,
  data,
  store,
  form,
  handleSave,
  handleClose,
}: FormActionType) => {
  const tmpRekeningBelanja = store.rekeningBelanja || [];
  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return (
      data?.tanggalNota && moment(current).isBefore(data?.tanggalNota, "day")
    );
  };

  return (
    <Modal
      visible={openModal}
      title={`${title} Nota Pendapatan`}
      width={700}
      onCancel={handleClose}
      cancelText="Batal"
      okText="Simpan"
      onOk={() => form.submit()}>
      <Form
        onFinish={handleSave}
        form={form}
        layout="vertical"
        key="formTanggalRealisasiPendapatan"
        name="formTanggalRealisasiPendapatan">
        <div className="grid grid-cols-1  md:items-center  md:grid-cols-2 gap-2 ">
          <div>
            <Form.Item
              label="Tanggal Realisasi"
              name="tanggalRealisasi"
              rules={[
                {
                  required: true,
                  message: "Tanggal Realisasi tidak boleh kosong!",
                },
              ]}>
              <DatePicker
                disabledDate={disabledDate}
                placeholder="Tanggal Realisasi"
                showTime
              />
            </Form.Item>
          </div>
          <div>
            <Form.Item
              label="No Referensi"
              name="noReferensi"
              rules={[
                {
                  required: true,
                  message: "No Referensi tidak boleh kosong!",
                },
              ]}>
              <Input placeholder="No Referensi" />
            </Form.Item>
          </div>
        </div>
      </Form>
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
export default ModalTanggalRealisasiPendapatan;
