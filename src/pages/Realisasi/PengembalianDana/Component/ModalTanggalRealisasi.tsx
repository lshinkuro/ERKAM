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

const ModalTanggalRealisasiPengembalianDana = ({
  openModal,
  title,
  data,
  store,
  form,
  handleSave,
  handleClose,
}: FormActionType) => {
  const tmpRekeningBelanja = store.rekeningBelanja || [];
  const tmpPenerima = store.penerimaRekening || [];
  const tmpTipeKas = store.tipeKas || [];
  const tmpBank = store.bank || [];
  let tmpDataPenerima: any = null;
  tmpPenerima
    .filter((item: any) => item.id.includes(data?.penerimaId))
    .map((item) =>
      item.penerimaRekenings
        .filter((items) => items.id.includes(data?.penerimaRekeningId))
        .map((items) => (tmpDataPenerima = items)),
    );
  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return (
      data?.tanggalNota && moment(current).isBefore(data?.tanggalNota, "day")
    );
  };

  return (
    <Modal
      key="modalTanggalRealisasiPengembalianDana"
      visible={openModal}
      title={`${title} Nota Pengembalian Dana`}
      width={800}
      onCancel={handleClose}
      cancelText="Batal"
      okText="Simpan"
      onOk={() => form.submit()}>
      <Form
        onFinish={handleSave}
        form={form}
        layout="vertical"
        key="formTanggalRealisasiPengembalianDana"
        name="formTanggalRealisasiPengembalianDana">
        <div className="grid grid-cols-1  md:items-center md:grid-cols-2 gap-2 ">
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
          {data?.pendapatan?.rencanaPendapatanName || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Tipe Kas">
          {(data?.kodeTipeKas &&
            tmpTipeKas
              .filter((item: any) => item.kode === data?.kodeTipeKas)
              .map((item) => item.nama)) ||
            "-"}
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
        <Descriptions.Item label="Nama Penerima">
          {(tmpDataPenerima && tmpDataPenerima.no_rekening_nama) || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="No Rekening Penerima">
          {(tmpDataPenerima && tmpDataPenerima.no_rekening) || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Nama Bank Penerima">
          {(tmpDataPenerima &&
            tmpBank
              .filter((item) => item.kode.includes(tmpDataPenerima.kode_bank))
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
    </Modal>
  );
};
export default ModalTanggalRealisasiPengembalianDana;
