/** @format */

import React from "react";
import { Form, Modal, Descriptions, DatePicker, Input, Table } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import moment from "moment";
import "moment/locale/id";
import { formatRupiah } from "../../../../utils/helper";

type FormActionType = {
  openModal: boolean;
  title: string;
  store: any;
  data: any;
  rincian: any;
  handleSave: (e: any) => void;
  handleClose: () => void;
};

const ModalTanggalRealisasiPengeluaranKegiatan = ({
  openModal,
  title,
  data,
  store,
  rincian,
  handleSave,
  handleClose,
}: FormActionType) => {
  const [form] = Form.useForm();
  const tmpRekeningBelanja = store.rekeningBelanja || [];
  const tmpPenerima = store.penerimaRekening || [];
  const tmpBank = store.bank || [];
  const dataPenerima =
    tmpPenerima.find((item) => item.id.includes(data?.penerimaId)) || null;
  const dataBankPenerima =
    (dataPenerima &&
      dataPenerima.penerimaRekenings.find((item) =>
        item.id.includes(data?.penerimaRekeningId),
      )) ||
    null;
  const getNameBank = (kodeBank) => {
    const nameBank =
      tmpBank
        .filter((item) => item.kode === kodeBank)
        .map((item) => item.nama) || "-";
    return nameBank;
  };
  const dataExpand = data?.biayaSumberDanas || [];
  const dataDetail = data?.biayaDetails.length ? data?.biayaDetails[0] : null;

  const columnsExpand = [
    {
      title: "Sumber Dana",
      key: "namaSumberDana",
      dataIndex: "namaSumberDana",
    },
    {
      title: "Jenis Pajak",
      dataIndex: "jenisPajak",
      key: "jenisPajak",
    },
    {
      title: "Tipe Kas",
      key: "namaTipeKas",
      dataIndex: "namaTipeKas",
    },
    {
      title: "Metode Pembayaran",
      key: "namaMetodePembayaran",
      dataIndex: "namaMetodePembayaran",
    },
    {
      title: "Data Rekening",
      key: "rekeningBankId",
      dataIndex: "rekeningBankId",
      render: (rekeningBankId) =>
        (rekeningBankId &&
          tmpRekeningBelanja
            .filter((item) => item.id.includes(rekeningBankId))
            .map((item) => {
              return `${item.nama_bank}-${item.no_rekening}`;
            })) ||
        "-",
    },
    {
      title: "Kuantitas",
      key: "quantity",
      dataIndex: "quantity",
    },
    {
      title: "Biaya Pajak",
      key: "biayaPajak",
      children: [
        {
          title: "PPN",
          key: "grandPajakTerutangPpn",
          dataIndex: "grandPajakTerutangPpn",
          render: (grandPajakTerutangPpn) =>
            formatRupiah(grandPajakTerutangPpn),
        },
        {
          title: "PPH21",
          key: "grandPajakTerutangPph21",
          dataIndex: "grandPajakTerutangPph21",
          render: (grandPajakTerutangPph21) =>
            formatRupiah(grandPajakTerutangPph21),
        },
        {
          title: "PPH22",
          key: "grandPajakTerutangPph22",
          dataIndex: "grandPajakTerutangPph22",
          render: (grandPajakTerutangPph22) =>
            formatRupiah(grandPajakTerutangPph22),
        },
        {
          title: "PPH23",
          key: "grandPajakTerutangPph23",
          dataIndex: "grandPajakTerutangPph23",
          render: (grandPajakTerutangPph23) =>
            formatRupiah(grandPajakTerutangPph23),
        },
      ],
    },
    {
      title: "Total",
      key: "Total",
      children: [
        {
          title: "Pajak",
          key: "grandPajak",
          dataIndex: "grandPajak",
          render: (grandPajak) => formatRupiah(grandPajak),
        },
        {
          title: "Pajak Terhutang",
          key: "grandPajakTerutang",
          dataIndex: "grandPajakTerutang",
          render: (grandPajakTerutang) => formatRupiah(grandPajakTerutang),
        },
        {
          title: "Sub Total",
          key: "jumlah",
          dataIndex: "jumlah",
          render: (jumlah) => formatRupiah(jumlah),
        },
        {
          title: "Grand Total",
          key: "grandTotal",
          render: (record) => formatRupiah(record.jumlah + record.grandPajak),
        },
      ],
    },
  ];

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return (
      data?.tanggalNota && moment(current).isBefore(data?.tanggalNota, "day")
    );
  };

  const handleAfterClose = () => {
    form.resetFields();
    handleClose();
  };

  const handleAfterSave = (values: any) => {
    const payload = {
      id: data?.id,
      tanggalRealisasi: moment(values.tanggalRealisasi).format(
        "YYYY-MM-DD HH:mm:ss",
      ),
      realisasiNoReferensi: values.noReferensi,
      penerimaRekeningId: data?.penerimaRekeningId,
      biayaSumberDanas: data?.biayaSumberDanas,
    };
    handleSave(payload);
    handleAfterClose();
  };

  return (
    <Modal
      key="modalTanggalRealisasiPengeluaranKegiatan"
      visible={openModal}
      title={`${title} Nota Pengembalian Kegiatan`}
      width={800}
      onCancel={handleAfterClose}
      cancelText="Batal"
      okText="Simpan"
      onOk={() => form.submit()}>
      <Form
        onFinish={handleAfterSave}
        form={form}
        layout="vertical"
        key="formTanggalRealisasiPengeluaranKegiatan"
        name="formTanggalRealisasiPengeluaranKegiatan">
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
      <div className="mb-2">
        <Descriptions
          labelStyle={{ fontWeight: 600 }}
          size="small"
          layout="vertical"
          column={{ xs: 1, sm: 1, md: 2 }}>
          <Descriptions.Item label="No Nota">
            {data?.noNotaFormat}
          </Descriptions.Item>
          <Descriptions.Item label="Tanggal Nota">
            {data?.tanggalNota
              ? moment(data?.tanggalNota).format("dddd,DD MMM YYYY HH:mm:ss")
              : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Nama Penerima">
            {dataPenerima?.nama}
          </Descriptions.Item>
          <Descriptions.Item label="No Rekening Penerima">
            {(dataBankPenerima && dataBankPenerima?.no_rekening) || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Nama Bank Penerima">
            {(dataBankPenerima && getNameBank(dataBankPenerima?.kode_bank)) ||
              "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Kategori Belanja">
            {dataDetail ? dataDetail.komponenBiayaKategori : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Nama Komponen Biaya">
            {dataDetail ? dataDetail.komponenBiayaNama : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Satuan">
            {dataDetail ? dataDetail.komponenBiayaSatuan : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Spesifikasi">
            {dataDetail ? dataDetail.komponenBiayaSpesifikasi : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Harga Satuan">
            {dataDetail ? formatRupiah(dataDetail.hargaSatuan) : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Keterangan">
            {data?.keterangan || "-"}
          </Descriptions.Item>
        </Descriptions>
      </div>
      <Table
        columns={columnsExpand}
        dataSource={dataExpand}
        pagination={false}
        bordered
      />
    </Modal>
  );
};
export default ModalTanggalRealisasiPengeluaranKegiatan;
