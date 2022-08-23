/** @format */

import React, { useState, useEffect } from "react";
import { InputNumber, Form, Modal, Descriptions, Divider } from "antd";
import moment from "moment";
import "moment/locale/id";

type akbModal = {
  title: string;
  openModal: boolean;
  editAkb: any;
  validData: any;
  onClose: () => void;
  saveAKB: (values: any, action: string) => void;
};

const ModalAkb = (params: akbModal) => {
  const [form] = Form.useForm();
  const [listAkb, setListAkb] = useState<any>(null);
  const listMonth = moment.months();

  useEffect(() => {
    if (params.editAkb) {
      form.setFieldsValue(params.editAkb);
    } else {
      form.resetFields();
      let jmlBln: any = {};
      for (let i = 1; i <= 12; i++) {
        jmlBln[`jumlahBulan${i}`] = 0;
      }
      form.setFieldsValue(jmlBln);
    }

    setListAkb(params.editAkb);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.editAkb]);

  const handleSave = (values) => {
    params.saveAKB(values, params.title);
  };

  const handleChange = (_: any, allValues: any) => {
    setListAkb(allValues);
  };

  let tmpJumlah = 0;
  // eslint-disable-next-line array-callback-return
  listMonth.map((_: any, index: number) => {
    tmpJumlah +=
      (listAkb &&
        listAkb[`jumlahBulan${index + 1}`] &&
        listAkb[`jumlahBulan${index + 1}`]) ||
      0;
  });

  let sisaJumlah = params.validData.totalKuantitas - tmpJumlah;
  const startMonth = params.validData.startMonth;
  const endMonth = params.validData.endMonth;
  return (
    <>
      <Modal
        visible={params.openModal}
        width={700}
        title={`Set Anggaran Kas Bulanan`}
        okText="Simpan"
        cancelText="Batal"
        okButtonProps={{ disabled: sisaJumlah === 0 ? false : true }}
        onOk={() => form.submit()}
        onCancel={() => params.onClose()}>
        <div className="mb-2 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Descriptions size="small" bordered>
              <Descriptions.Item label="Total Jumlah Koefisien">
                {params.validData.totalKuantitas}
              </Descriptions.Item>
            </Descriptions>
          </div>
          <div className="flex-1">
            <Descriptions size="small" labelStyle={{ fontWeight: "bold" }}>
              <Descriptions.Item label="Sisa Jumlah Koefisien">
                {sisaJumlah}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>
        <Divider plain orientation="left">
          Anggaran Kas Bulanan
        </Divider>
        <Form
          form={form}
          key="tambahAkb"
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 12 }}
          onFinish={handleSave}
          onValuesChange={handleChange}>
          <div className="grid grid-cols-3 gap-2">
            {listMonth.map((item: any, index: number) => {
              let i = index + 1;
              let enabledField = true;
              if (i >= startMonth && i <= endMonth) {
                enabledField = false;
              }
              const tmpMax = listAkb && listAkb[`jumlahBulan${i}`] + sisaJumlah;
              return (
                <Form.Item key={item} label={item} name={`jumlahBulan${i}`}>
                  <InputNumber min={0} max={tmpMax} disabled={enabledField} />
                </Form.Item>
              );
            })}
          </div>
        </Form>
      </Modal>
    </>
  );
};
export default ModalAkb;
