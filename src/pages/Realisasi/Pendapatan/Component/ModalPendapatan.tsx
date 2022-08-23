/** @format */

import React, { useState } from "react";
import { Select, Input, Form, DatePicker, InputNumber, Modal } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import moment from "moment";
import "moment/locale/id";

type FormActionType = {
  form: any;
  openModal: boolean;
  title: string;
  store: any;
  handleSave: (e: any) => void;
  handleClose: () => void;
};

const ModalPendapatan = ({
  form,
  openModal,
  title,
  store,
  handleSave,
  handleClose,
}: FormActionType) => {
  const tmpTipeKas = store.tipeKas || [];
  const tmpRekeningBelanja = store.rekeningBelanja || [];
  const tmpSumberDana = store.rencanaPendapatanDefinitif || [];
  const tipeKas = form.getFieldValue("tipeKas");
  const [enabledRekening, setEnabledRekening] = useState<any>(false);
  // eslint-disable-next-line arrow-body-style
  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    // Can not select days before today and today
    // if (title === "Edit") {
    // }
    return current && current < moment().startOf("day");
  };

  React.useEffect(() => {
    if (tipeKas === "rekening_bank") {
      return setEnabledRekening(true);
    }
    return setEnabledRekening(false);
  }, [tipeKas]);

  const handleChange = (values) => {
    for (let obj in values) {
      if (obj === "tipeKas") {
        if (values.tipeKas === "rekening_bank") {
          return setEnabledRekening(true);
        }
        return setEnabledRekening(false);
      }
    }
  };

  return (
    <Modal
      visible={openModal}
      title={`${title} Nota Pendapatan`}
      onCancel={handleClose}
      okText="Simpan"
      width={700}
      cancelText="Batal"
      onOk={() => form.submit()}>
      <Form
        form={form}
        key="modalRealisasiPendapatan"
        name="modalRealisasiPendapatan"
        layout="vertical"
        onValuesChange={handleChange}
        onFinish={handleSave}>
        <div className="grid grid-cols-1  md:items-center  md:grid-cols-2 gap-2 ">
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
                showSearch
                optionFilterProp="children"
                placeholder="Pilih Sumber Dana">
                {tmpSumberDana.length &&
                  tmpSumberDana.map((item: any, i: any) => {
                    return (
                      <Select.Option key={`snp${i}`} value={item.id}>
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
                showSearch
                optionFilterProp="children"
                placeholder="Pilih Tipe Kas">
                {tmpTipeKas.length &&
                  tmpTipeKas.map((e: any, i: any) => {
                    return (
                      <Select.Option key={`tipekas${i}`} value={e.kode}>
                        {e.nama}
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
                  showSearch
                  optionFilterProp="children"
                  placeholder="Pilih No Rekening">
                  {tmpRekeningBelanja.length &&
                    tmpRekeningBelanja.map((e: any, i: any) => {
                      return (
                        <Select.Option key={`noRek${i}`} value={e.id}>
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
              label="Nilai Pendapatan"
              name="nilaiPendapatan"
              rules={[
                {
                  required: true,
                  message: "Nilai Pendapatan tidak boleh kosong!",
                },
              ]}>
              <InputNumber
                style={{ width: "100%" }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                prefix="Rp."
                placeholder="Nilai Pendapatan"
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
    </Modal>
  );
};
export default ModalPendapatan;
