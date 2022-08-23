/** @format */

// import React from "react";
import {
  Select,
  Input,
  Form,
  DatePicker,
  Modal,
  Descriptions,
  Divider,
} from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import moment from "moment";
import "moment/locale/id";

type FormActionType = {
  form: any;
  openModal: boolean;
  title: string;
  store: any;
  rincian: any;
  handleSave: (e: any) => void;
  handleClose: () => void;
};

const ModalOutputKegiatan = ({
  form,
  openModal,
  title,
  store,
  rincian,
  handleSave,
  handleClose,
}: FormActionType) => {
  const tmpSumberDana = store.rencanaPendapatanDefinitif || [];
  // eslint-disable-next-line arrow-body-style
  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    // Can not select days before today and today
    // if (title === "Edit") {
    // }
    return current && current < moment().startOf("day");
  };

  return (
    <Modal
      key="modalRealisasiOutputKegiatan"
      visible={openModal}
      title={`${title} Output Kegiatan`}
      onCancel={handleClose}
      okText="Simpan"
      width={700}
      cancelText="Batal"
      onOk={() => form.submit()}>
      <Form
        form={form}
        key="formRealisasiOutputKegiatan"
        name="formRealisasiOutputKegiatan"
        layout="vertical"
        onFinish={handleSave}>
        <Descriptions
          labelStyle={{ fontWeight: "bold" }}
          size="small"
          layout="vertical">
          <Descriptions.Item label="SNP">{rincian?.nama_snp}</Descriptions.Item>
          <Descriptions.Item label="Kegiatan">
            {rincian?.nama_kegiatan}
          </Descriptions.Item>
          <Descriptions.Item label="Sub Kegiatan">
            {rincian?.nama_sub_kegiatan}
          </Descriptions.Item>
        </Descriptions>
        <Divider />
        <div className="grid grid-cols-1  md:items-center md:grid-cols-2 gap-2 ">
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
              label="Tanggal Realisasi"
              name="tanggalRealisasi"
              rules={[
                {
                  required: true,
                  message: "Tanggal Realisasi tidak boleh kosong!",
                },
              ]}>
              <DatePicker disabledDate={disabledDate} showTime />
            </Form.Item>
          </div>
          <div>
            <Form.Item
              label="Realisasi Output"
              name="qtyOutput"
              extra={rincian?.indikator_output}
              rules={[
                {
                  required: true,
                  message: "Realisasi Output tidak boleh kosong!",
                },
              ]}>
              <Input
                type="number"
                addonAfter={rincian?.indikator_output_satuan}
                placeholder="Realisasi Output"
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
export default ModalOutputKegiatan;
