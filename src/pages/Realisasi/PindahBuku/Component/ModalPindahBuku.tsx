/** @format */

import React, { useState, useEffect } from "react";
import {
  Select,
  Input,
  Form,
  DatePicker,
  InputNumber,
  Modal,
  Divider,
  Descriptions,
} from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import moment from "moment";
import "moment/locale/id";
import { formatRupiah } from "../../../../utils/helper";

type FormActionType = {
  openModal: boolean;
  title: string;
  form: any;
  store: any;
  handleSave: (e: any) => void;
  handleClose: () => void;
};

const ModalPindahBuku = ({
  openModal,
  title,
  store,
  form,
  handleSave,
  handleClose,
}: FormActionType) => {
  const tmpRekeningBelanja = store.rekeningBelanja || [];
  const tmpTipeKas = store.tipeKas || [];
  const tmpSumberDana = store.rencanaPendapatanDefinitif || [];
  const tmpPendapatan = store.realisasiPendapatan || [];
  const tmpPendapatanHeader = store.realisasiPendapatanHeader || [];
  const [buttonEnabled, setButtonEnabled] = useState<any>(true);
  const [totalPendapatan, setTotalPendapatan] = useState<any>(0);
  const [totalPengeluaran, setTotalPengeluaran] = useState<any>(0);
  const [enabledRekening, setEnabledRekening] = useState<any>(false);
  const [enabledRekeningTujuan, setEnabledRekeningTujuan] =
    useState<any>(false);
  let allFilter: any = { sumberDanaID: [], tipeKasID: [], rekeningID: [] };
  tmpPendapatan &&
    tmpPendapatan
      .filter((item) => item.kepalaMadrasahApproved === "True")
      // eslint-disable-next-line array-callback-return
      .map((item: any) => {
        item.kodeTipeKas && allFilter[`tipeKasID`].push(item.kodeTipeKas);
        item.rekeningBankId &&
          allFilter[`rekeningID`].push(item.rekeningBankId);
        item.rencanaPendapatanKode &&
          allFilter[`sumberDanaID`].push(item.rencanaPendapatanKode);
      });

  const getTotalData = (values: any) => {
    let tmpDataPendapatan: any = null;
    let totalSisa = 0;
    if (values.tipeKas === "rekening_bank") {
      tmpDataPendapatan =
        (values.tipeKas &&
          values.sumberDana &&
          values?.noRekening &&
          tmpPendapatanHeader &&
          tmpPendapatanHeader.header3.find(
            (item) =>
              item.kode_tipe_kas === values.tipeKas &&
              item.rekening_bank_id === values?.noRekening,
          )) ||
        null;
    } else {
      tmpDataPendapatan =
        (values.tipeKas &&
          values.sumberDana &&
          tmpPendapatanHeader &&
          tmpPendapatanHeader.header3.find(
            (item) => item.kode_tipe_kas === values.tipeKas,
          )) ||
        null;
    }

    tmpDataPendapatan &&
      tmpDataPendapatan.details
        .filter((items) => items.sumber_dana.includes(values.sumberDana))
        .map((items) => (totalSisa = items.sisa));

    setTotalPendapatan(totalSisa);
  };
  const handleChangeField = (values: any) => {
    for (let obj in values) {
      switch (obj) {
        case "sumberDana":
          getTotalData(values);
          break;
        case "tipeKas":
          getTotalData(values);
          setEnabledRekening(values.tipeKas === "rekening_bank" ? true : false);
          break;
        case "tipeKasTujuan":
          setEnabledRekeningTujuan(
            values.tipeKasTujuan === "rekening_bank" ? true : false,
          );
          break;
        case "jumlah":
          setTotalPengeluaran((values.jumlah && values.jumlah) || 0);
          break;
      }
    }
  };

  const handleChange = (_, values: any) => {
    handleChangeField(values);
  };

  useEffect(() => {
    const values = form.getFieldsValue();
    if (!values.jumlah || values.jumlah === 0 || totalPendapatan === 0) {
      setButtonEnabled(true);
    } else {
      setButtonEnabled(false);
    }
    // console.log(values);
    getTotalData(values);
    handleChangeField(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.getFieldsValue()]);

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    const formValue = form.getFieldsValue();
    if (totalPendapatan >= 0) {
      const tanggalNota = tmpPendapatan
        .filter(
          (item) =>
            item.rencanaPendapatanKode.includes(formValue.sumberDana) &&
            item.kodeTipeKas.includes(formValue.tipeKas),
        )
        .map((item) => item.tanggalNota);
      return tanggalNota[0] && moment(current).isBefore(tanggalNota[0], "day");
    }

    // Can not select days before today and today
    // if (title === "Edit") {
    // }
    return current && current < moment().startOf("day");
  };

  const handleSaveForm = (values: any) => {
    let sumberData: any =
      tmpSumberDana.find(
        (item) => item.kode_sumber_dana === values.sumberDana,
      ) || null;

    let namaRekeningTujuan: any =
      values.tipeKasTujuan === "rekening_bank"
        ? tmpRekeningBelanja
            .filter((item) => item.id.includes(values?.noRekeningTujuan))
            .map((item) => item.no_rekening_nama)
        : null;
    let namaRekening: any =
      values.tipeKasTujuan === "rekening_bank"
        ? tmpRekeningBelanja
            .filter((item) => item.id.includes(values?.noRekening))
            .map((item) => item.no_rekening_nama)
        : null;
    let tipeKasNama: any = tmpTipeKas
      .filter((item) => item.kode === values.tipeKas)
      .map((item) => item.nama);
    let tipeKasNamaTujuan: any = tmpTipeKas
      .filter((item) => item.kode === values.tipeKasTujuan)
      .map((item) => item.nama);
    const payload = {
      rencanaPendapatanId: sumberData && sumberData.id,
      kodeTipeKas: values.tipeKas,
      namaTipeKas: tipeKasNama[0],
      rekeningBankId:
        values.tipeKas === "rekening_bank" ? values?.noRekening : null,
      namaRekeningBank: (namaRekening && namaRekening[0]) || null,
      toKodeTipeKas: values.tipeKasTujuan,
      namaToTipeKas: (tipeKasNamaTujuan && tipeKasNamaTujuan[0]) || null,
      toRekeningBankId:
        values.tipeKasTujuan === "rekening_bank"
          ? values?.noRekeningTujuan
          : null,
      namaToRekeningBank: (namaRekeningTujuan && namaRekeningTujuan[0]) || null,
      keterangan: values.keterangan || null,
      tanggalNota: moment(values.tanggalNota).format("YYYY-MM-DD HH:mm:ss"),
      rencanaPendapatanKode:
        (sumberData && sumberData.kode_sumber_dana) || null,
      rencanaPendapatanName:
        (sumberData && sumberData.nama_sumber_dana) || null,
      grandTotal: values.jumlah,
    };
    setTotalPendapatan(0);
    setTotalPengeluaran(0);
    handleSave(payload);
  };

  const handleCloseForm = () => {
    setTotalPendapatan(0);
    setTotalPengeluaran(0);
    handleClose();
  };

  const checkValidationSaldo = (saldoPendapatan, saldoPengeluaran) => {
    if (saldoPendapatan < saldoPengeluaran) {
      return Promise.reject("Saldo dari Sumber Dana tidak mencukupi!");
    } else {
      return Promise.resolve();
    }
  };
  return (
    <Modal
      key="modalPindahBuku"
      visible={openModal}
      title={`${title} Nota Pindah Buku`}
      width={800}
      onCancel={handleCloseForm}
      okButtonProps={{ disabled: buttonEnabled }}
      okText="Simpan"
      onOk={() => form.submit()}>
      <Form
        form={form}
        key="modalFormPindahBuku"
        layout="vertical"
        onValuesChange={handleChange}
        onFinish={handleSaveForm}>
        <div className="grid grid-cols-1   md:grid-cols-2 gap-2">
          <div>
            <Form.Item
              label="Sumber Dana"
              name="sumberDana"
              rules={[
                {
                  required: true,
                  message: "Sumber Dana tidak boleh kosong!",
                },
              ]}>
              <Select
                allowClear
                showSearch
                optionFilterProp="children"
                placeholder="Pilih Sumber Dana">
                {tmpSumberDana.length &&
                  tmpSumberDana
                    .filter((item) =>
                      allFilter.sumberDanaID.includes(item.kode_sumber_dana),
                    )
                    .map((item: any, i: any) => {
                      return (
                        <Select.Option
                          key={`sp${i}`}
                          value={item.kode_sumber_dana}>
                          {item.nama_sumber_dana}
                        </Select.Option>
                      );
                    })}
              </Select>
            </Form.Item>
          </div>
          <div>
            <Form.Item
              label="Tipe Kas"
              name="tipeKas"
              rules={[
                {
                  required: true,
                  message: "Tipe Kas tidak boleh kosong!",
                },
              ]}>
              <Select
                allowClear
                showSearch
                optionFilterProp="children"
                placeholder="Pilih Tipe Kas">
                {tmpTipeKas.length &&
                  tmpTipeKas
                    .filter((item) => allFilter.tipeKasID.includes(item.kode))
                    .map((item: any, i: any) => {
                      return (
                        <Select.Option key={`tipekas${i}`} value={item.kode}>
                          {item.nama}
                        </Select.Option>
                      );
                    })}
              </Select>
            </Form.Item>
          </div>
          {enabledRekening && (
            <div>
              <Form.Item
                label="No Rekening"
                name="noRekening"
                rules={[
                  {
                    required: true,
                    message: "No Rekening tidak boleh kosong!",
                  },
                ]}>
                <Select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  placeholder="Pilih No Rekening">
                  {tmpRekeningBelanja.length &&
                    tmpRekeningBelanja
                      .filter((item) => allFilter.rekeningID.includes(item.id))
                      .map((item: any, i: any) => {
                        return (
                          <Select.Option key={`noRek${i}`} value={item.id}>
                            {item.nama_bank} - {item.no_rekening}
                          </Select.Option>
                        );
                      })}
                </Select>
              </Form.Item>
            </div>
          )}
          <div>
            <Form.Item
              label="Tipe Kas Tujuan"
              name="tipeKasTujuan"
              rules={[
                {
                  required: true,
                  message: "Tipe Kas Tujuan tidak boleh kosong!",
                },
              ]}>
              <Select
                allowClear
                showSearch
                optionFilterProp="children"
                placeholder="Pilih Tipe Kas">
                {tmpTipeKas.length &&
                  tmpTipeKas.map((item: any, i: any) => {
                    return (
                      <Select.Option
                        key={`tipeKasTujuan${i}`}
                        value={item.kode}>
                        {item.nama}
                      </Select.Option>
                    );
                  })}
              </Select>
            </Form.Item>
          </div>
          {enabledRekeningTujuan && (
            <div>
              <Form.Item
                label="No Rekening Tujuan"
                name="noRekeningTujuan"
                rules={[
                  {
                    required: true,
                    message: "No Rekening Tujuan tidak boleh kosong!",
                  },
                ]}>
                <Select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  placeholder="Pilih No Rekening">
                  {tmpRekeningBelanja.length &&
                    tmpRekeningBelanja.map((e: any, i: any) => {
                      return (
                        <Select.Option key={`noRekTu${i}`} value={e.id}>
                          {e.nama_bank} - {e.no_rekening}
                        </Select.Option>
                      );
                    })}
                </Select>
              </Form.Item>
            </div>
          )}
          <div>
            <Form.Item
              label="Tanggal Nota"
              name="tanggalNota"
              rules={[
                {
                  required: true,
                  message: "Tanggal Nota tidak boleh kosong!",
                },
              ]}>
              <DatePicker disabledDate={disabledDate} showTime />
            </Form.Item>
          </div>
          <div>
            <Form.Item
              label="Jumlah"
              name="jumlah"
              rules={[
                {
                  required: true,
                  message: "Jumlah tidak boleh kosong!",
                },
                {
                  validator: () =>
                    checkValidationSaldo(totalPendapatan, totalPengeluaran),
                },
              ]}>
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                max={totalPendapatan}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                prefix="Rp."
                placeholder="Jumlah"
              />
            </Form.Item>
          </div>
          <div>
            <Form.Item label="Keterangan" name="keterangan">
              <Input.TextArea placeholder="Keterangan" />
            </Form.Item>
          </div>
        </div>
      </Form>
      <Divider />
      <div className="flex justify-start md:justify-end gap-4">
        <div className="md:w-1/2">
          <Descriptions
            column={1}
            contentStyle={{
              fontWeight: 600,
              justifyContent: "end",
              fontSize: 18,
            }}>
            <Descriptions.Item label="Total Penerimaan di BKU">
              {formatRupiah(totalPendapatan)}
            </Descriptions.Item>
            <Descriptions.Item label="Total Pengeluaran di BKU">
              {formatRupiah(totalPengeluaran)}
            </Descriptions.Item>
            <Descriptions.Item label="Sisa Saldo di BKU">
              {formatRupiah(totalPendapatan - totalPengeluaran)}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </Modal>
  );
};
export default ModalPindahBuku;
