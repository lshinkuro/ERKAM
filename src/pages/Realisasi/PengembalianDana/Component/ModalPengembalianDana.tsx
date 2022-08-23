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
// import type { RangePickerProps } from "antd/es/date-picker";
import moment from "moment";
import "moment/locale/id";
import { formatRupiah } from "../../../../utils/helper";
import { ButtonPlus } from "../../../../components/Button";
import ModalPenerima, {
  ModalPenerimaRekening,
} from "../../../../components/Modal/ModalPenerima";

type FormActionType = {
  openModal: boolean;
  title: string;
  data: any;
  store: any;
  handleSave: (e: any) => void;
  handleClose: () => void;
};

const ModalPengembalianDana = ({
  openModal,
  title,
  store,
  data,
  handleSave,
  handleClose,
}: FormActionType) => {
  const tmpRekeningBelanja = store.rekeningBelanja || [];
  const tmpTipeKas = store.tipeKas || [];
  const tmpSumberDana = store.rencanaPendapatanDefinitif || [];
  const tmpPendapatan = store.realisasiPendapatan || [];
  const [form] = Form.useForm();
  const tmpPendapatanHeader = store.realisasiPendapatanHeader || null;
  const tmpMetodePembayaran = store.metodePembayaran || [];
  const tmpPenerima = store.penerimaRekening || [];
  const tmpBank = store.bank || [];
  const [buttonEnabled, setButtonEnabled] = useState<any>(true);
  const [totalPendapatan, setTotalPendapatan] = useState<any>(0);
  const [totalPengeluaran, setTotalPengeluaran] = useState<any>(0);
  const [enabledRekening, setEnabledRekening] = useState<any>(false);
  const [disabledRekening, setDisabledRekening] = useState<any>(true);
  const [listPenerimaRekening, setListPenerimaRekening] = useState<any>(null);
  const [openModalPenerima, setOpenModalPenerima] = useState<any>(false);
  const [openModalPenerimaRekening, setOpenModalPenerimaRekening] =
    useState<any>(false);
  const [enabledRekeningPenerima, setEnabledRekeningPenerima] =
    useState<any>(false);
  let allFilter: any = { sumberDanaID: [], tipeKasID: [], rekeningID: [] };

  tmpPendapatanHeader &&
    // eslint-disable-next-line array-callback-return
    tmpPendapatanHeader?.header3?.map((item: any) => {
      item.kode_tipe_kas && allFilter[`tipeKasID`].push(item.kode_tipe_kas);
      item.rekening_bank_id &&
        allFilter[`rekeningID`].push(item.rekening_bank_id);
      item.details.map(
        (items) =>
          items.sumber_dana &&
          allFilter[`sumberDanaID`].push(items.sumber_dana),
      );
    });

  const getTotalData = (values: any) => {
    let tmpDataPendapatan: any = null;
    let totalSisa = 0;

    if (values?.kodeTipeKas === "rekening_bank") {
      tmpDataPendapatan =
        (values?.kodeTipeKas &&
          values?.rencanaPendapatanKode &&
          values?.rekeningBankId &&
          tmpPendapatanHeader &&
          tmpPendapatanHeader?.header3?.find(
            (item) =>
              item.kode_tipe_kas === values?.kodeTipeKas &&
              item.rekening_bank_id === values?.rekeningBankId,
          )) ||
        null;
    } else {
      tmpDataPendapatan =
        (values?.kodeTipeKas &&
          values?.rencanaPendapatanKode &&
          tmpPendapatanHeader &&
          tmpPendapatanHeader?.header3?.find(
            (item) => item.kode_tipe_kas === values?.kodeTipeKas,
          )) ||
        null;
    }

    tmpDataPendapatan &&
      tmpDataPendapatan.details
        .filter((items) =>
          items.sumber_dana.includes(values?.rencanaPendapatanKode),
        )
        .map((items) => (totalSisa = items.sisa));

    setTotalPendapatan(totalSisa);
    setButtonEnabled(totalSisa > 0 ? false : true);
  };

  const handleChangeField = (values: any) => {
    for (let obj in values) {
      switch (obj) {
        // case "sumberDana":
        //   getTotalData(values);
        //   break;
        // case "tipeKas":
        //   getTotalData(values);
        //   setEnabledRekening(values.tipeKas === "rekening_bank" ? true : false);
        //   break;
        case "notaPendapatan":
          const pendapatanTmp =
            tmpPendapatan.find((item) =>
              item.id.includes(values.notaPendapatan),
            ) || null;
          setEnabledRekening(
            pendapatanTmp && pendapatanTmp.kodeTipeKas === "rekening_bank"
              ? true
              : false,
          );
          form.setFieldsValue({
            sumberDana:
              (pendapatanTmp && pendapatanTmp.rencanaPendapatanKode) || null,
            tipeKas: (pendapatanTmp && pendapatanTmp.kodeTipeKas) || null,
            noRekening: (pendapatanTmp && pendapatanTmp.rekeningBankId) || null,
          });
          getTotalData(pendapatanTmp);

          break;
        case "metodePembayaran":
          setEnabledRekeningPenerima(
            values.metodePembayaran === "transfer" ? true : false,
          );
          break;
        case "penerima":
          setListPenerimaRekening(values.penerima);
          setDisabledRekening(values.penerima ? false : true);
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

  const getNameBank = (kodeBank) => {
    const nameBank = tmpBank
      .filter((item) => item.kode === kodeBank)
      .map((item) => item.nama);
    return nameBank;
  };

  useEffect(() => {
    if (data) {
      setEnabledRekening(data?.kodeTipeKas === "rekening_bank" ? true : false);
      setEnabledRekeningPenerima(
        data?.kodeMetodePembayaran === "transfer" ? true : false,
      );
      form.setFieldsValue({
        notaPendapatan: data?.pendapatan.id,
        sumberDana: data?.pendapatan.rencanaPendapatanKode,
        tipeKas: data?.pendapatan.kodeTipeKas,
        noRekening: data?.pendapatan.rekeningBankId,
        metodePembayaran: data?.kodeMetodePembayaran,
        keterangan: data?.keterangan,
        jumlah: data?.grandTotal,
        penerima: data?.penerimaId,
        noRekeningPenerima: data?.penerimaRekeningId,
        tanggalNota: moment(data?.tanggalNota),
      });
      getTotalData(data?.pendapatan);
      setTotalPengeluaran(data?.grandTotal);
    }

    // handleChangeField(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // const disabledDate: RangePickerProps["disabledDate"] = (current) => {
  //   const formValue = form.getFieldsValue();
  //   if (totalPendapatan >= 0) {
  //     const tanggalNota =
  //       tmpPendapatan.find((item) =>
  //         item.id.includes(formValue.notaPendapatan),
  //       ) || null;
  //     // .map((item) => item.tanggalNota);
  //     return tanggalNota && moment(current).isBefore(tanggalNota, "day");
  //   }

  //   // Can not select days before today and today
  //   // if (title === "Edit") {
  //   // }
  //   return current && current < moment().endOf("day");
  // };

  const handleSaveForm = (values: any) => {
    const payload = {
      rencana_pendapatan_id: values.notaPendapatan,
      kode_tipe_kas: values.tipeKas,
      rekening_bank_id:
        values.tipeKas === "rekening_bank" ? values?.noRekening : null,
      kode_metode_pembayaran: values.metodePembayaran,
      penerima_id: values.penerima,
      penerima_rekening_id:
        values.metodePembayaran === "transfer"
          ? values?.noRekeningPenerima
          : null,
      keterangan: values.keterangan || null,
      tanggal_nota: moment(values.tanggalNota).utc(),
      grand_total: values.jumlah,
    };
    handleSave(payload);
    handleCloseForm();
  };

  const handleCloseForm = () => {
    form.resetFields();
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
    <>
      <Modal
        visible={openModal}
        title={`${title} Nota Pengembalian Dana`}
        width={1100}
        onCancel={handleCloseForm}
        okButtonProps={{ disabled: buttonEnabled }}
        okText="Simpan"
        onOk={() => form.submit()}>
        <Form
          form={form}
          key="modalRealisasiPengembalianDana"
          name="modalRealisasiPengembalianDana"
          layout="vertical"
          onValuesChange={handleChange}
          onFinish={handleSaveForm}>
          <div className="grid grid-cols-1   md:grid-cols-2 gap-2">
            <div>
              <Form.Item
                label="Nota Realisasi Pendapatan"
                name="notaPendapatan"
                rules={[
                  {
                    required: true,
                    message: "Nota Realisasi Pendapatan tidak boleh kosong!",
                  },
                ]}>
                <Select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  placeholder="Pilih Nota Realisasi Pendapatan">
                  {tmpPendapatan.length &&
                    tmpPendapatan
                      .filter((item) => item.status === "Selesai")
                      .map((item: any, i: any) => {
                        return (
                          <Select.Option key={`np${i}`} value={item.id}>
                            {item.noNotaFormat}
                          </Select.Option>
                        );
                      })}
                </Select>
              </Form.Item>
            </div>
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
                  disabled
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
                  disabled
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
                    disabled
                    showSearch
                    optionFilterProp="children"
                    placeholder="Pilih No Rekening">
                    {tmpRekeningBelanja.length &&
                      tmpRekeningBelanja
                        .filter((item) =>
                          allFilter.rekeningID.includes(item.id),
                        )
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
                label="Tipe Metode Pembayaran"
                name="metodePembayaran"
                rules={[
                  {
                    required: true,
                    message: "Metode Pembayaran tidak boleh kosong!",
                  },
                ]}>
                <Select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  placeholder="Pilih Metode Pembayaran">
                  {tmpMetodePembayaran.length &&
                    tmpMetodePembayaran.map((item: any, i: any) => {
                      return (
                        <Select.Option
                          key={`tipePembayaran${i}`}
                          value={item.kode}>
                          {item.nama}
                        </Select.Option>
                      );
                    })}
                </Select>
              </Form.Item>
            </div>
            <div>
              <Form.Item label="Penerima" required>
                <Input.Group compact>
                  <Form.Item
                    label="Penerima"
                    name="penerima"
                    noStyle
                    rules={[
                      {
                        required: true,
                        message: "Penerima tidak boleh kosong!",
                      },
                    ]}>
                    <Select
                      allowClear
                      showSearch
                      style={{ width: "calc(100% - 50px)" }}
                      optionFilterProp="children"
                      placeholder="Pilih Penerima">
                      {tmpPenerima.length &&
                        tmpPenerima
                          // .filter((item) => allFilter.tipeKasID.includes(item.kode))
                          .map((item: any, i: any) => {
                            return (
                              <Select.Option
                                key={`penerima${i}`}
                                value={item.id}>
                                {item.nama}
                              </Select.Option>
                            );
                          })}
                    </Select>
                  </Form.Item>
                  <ButtonPlus
                    type="primary"
                    onClick={() => setOpenModalPenerima(true)}
                  />
                </Input.Group>
              </Form.Item>
            </div>
            {enabledRekeningPenerima && (
              <div>
                <Form.Item label="No Rekening Penerima" required>
                  <Input.Group compact>
                    <Form.Item
                      name="noRekeningPenerima"
                      noStyle
                      rules={[
                        {
                          required: true,
                          message: "No Rekening Penerima tidak boleh kosong!",
                        },
                      ]}>
                      <Select
                        allowClear
                        showSearch
                        style={{ width: "calc(100% - 50px)" }}
                        optionFilterProp="children"
                        placeholder="Pilih No Rekening Penerima">
                        {listPenerimaRekening &&
                          tmpPenerima
                            .filter((item) =>
                              item.id.includes(listPenerimaRekening),
                            )
                            .map((item: any) => {
                              return (
                                item.penerimaRekenings.length &&
                                item.penerimaRekenings.map((items, i) => (
                                  <Select.Option
                                    key={`noRekPenerima${i}`}
                                    value={items.id}
                                    disabled={disabledRekening}>
                                    {getNameBank(items.kode_bank)} -{" "}
                                    {items.no_rekening}
                                  </Select.Option>
                                ))
                              );
                            })}
                      </Select>
                    </Form.Item>
                    <ButtonPlus
                      type="primary"
                      disabled={disabledRekening}
                      onClick={() => setOpenModalPenerimaRekening(true)}
                    />
                  </Input.Group>
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
                <DatePicker
                  // disabledDate={disabledDate}
                  showTime
                />
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
              <Descriptions.Item label="Total Saldo Kas">
                {formatRupiah(totalPendapatan)}
              </Descriptions.Item>
              <Descriptions.Item label="Total Pengembalian Dana">
                {formatRupiah(totalPengeluaran)}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>
      </Modal>
      <ModalPenerima
        openModal={openModalPenerima}
        handleClose={() => setOpenModalPenerima(false)}
      />
      <ModalPenerimaRekening
        openModal={openModalPenerimaRekening}
        penerimaID={listPenerimaRekening}
        handleClose={() => setOpenModalPenerimaRekening(false)}
      />
    </>
  );
};
export default ModalPengembalianDana;
