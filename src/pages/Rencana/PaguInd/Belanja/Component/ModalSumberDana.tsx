/** @format */

import React, { useEffect, useState } from "react";
import {
  Select,
  InputNumber,
  Form,
  Space,
  Modal,
  Alert,
  Button,
  Descriptions,
  Divider,
} from "antd";
import { useSelector } from "react-redux";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { formatRupiah } from "../../../../../utils/helper";

type sumberDanaModal = {
  title: string;
  openModal: boolean;
  editSumberDana: any;
  validData: any;
  onClose: () => void;
  saveSumberDana: (values: any, action: string) => void;
};

type sumberDanaType = {
  jumlah: any;
  rencanaPendapatanId: any;
  quantity: any;
  kodePajak: any;
  jenisPajak: any;
};

const ModalSumberDana = (params: sumberDanaModal) => {
  const store = useSelector((state: any) => state.store);
  // let tmpSumberDana: any =
  //   (params.validData.tagSumberDana === "sumberBos" &&
  //     store.sumberDana.filter((item) => item.bos === "1")) ||
  //   (params.validData.tagSumberDana === "sumberBkba" &&
  //     store.sumberDana.filter((item) => item.bkba === "1")) ||
  //   (params.validData.tagSumberDana === "sumberLain" &&
  //     store.sumberDana.filter(
  //       (item) => item.bkba === "0" && item.bos === "0",
  //     )) ||
  //   store.sumberDana.filter((item) => item.bkba === "0" && item.bos === "0");
  // tmpSumberDana =
  //   tmpSumberDana.length && tmpSumberDana.map((item: any) => item.kode);
  const tmpRekapSumberDana = store.rencanaRekapSumberDanaBelanja || [];
  const tmpPajak = store.pajak || [];
  const namaPajak = tmpPajak.filter(
    (item: any) => item.kode === params.validData.jenisPajak,
  );
  const [form] = Form.useForm();
  // const [action, setAction] = useState(null);
  // const [tmpData, setTmpData] = useState<any>({});

  const [listSumberDana, setListSumberDana] = useState<any>([]);

  useEffect(() => {
    form.resetFields();
    setListSumberDana(params.editSumberDana);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const handleSave = (values) => {
    let payload: any = [];
    // eslint-disable-next-line array-callback-return
    values.sumberDanaList.map((item: any) => {
      let tmpData: sumberDanaType = {
        jumlah: item.kuantitas * params.validData.hargaSatuan,
        rencanaPendapatanId: item.sumberDana,
        quantity: item.kuantitas,
        kodePajak: params.validData.jenisPajak,
        jenisPajak: namaPajak[0].nama,
      };
      payload.push(tmpData);
    });
    params.saveSumberDana(payload, params.title);
  };

  const handleChange = (_: any, allValues: any) => {
    setListSumberDana(allValues.sumberDanaList);
  };

  const getSaldoSumberDana = (tmpDataRekap: any, kodeSumberDana: any) => {
    let totalSaldo = 0;
    tmpDataRekap
      .filter((item: any) => item.id === kodeSumberDana)
      .map((item) => (totalSaldo = item.selisih));
    return totalSaldo;
  };

  let tmpList: any = [];
  let tmpKuantitas = 0;
  let filterSumberDana: any = [];
  listSumberDana.length &&
    // eslint-disable-next-line array-callback-return
    listSumberDana.map((item: any) => {
      let tmp = {
        sumberDana: item?.sumberDana || null,
        kuantitas: item?.kuantitas || 0,
        saldo:
          (item?.sumberDana &&
            getSaldoSumberDana(tmpRekapSumberDana, item.sumberDana)) ||
          0,
      };
      tmpKuantitas += item?.kuantitas;
      item?.sumberDana && filterSumberDana.push(item?.sumberDana);
      tmpList.push(tmp);
    });

  let sisaSaldo =
    (isNaN(
      params.validData.totalSaldo - tmpKuantitas * params.validData.hargaSatuan,
    ) &&
      params.validData.totalSaldo) ||
    params.validData.totalSaldo - tmpKuantitas * params.validData.hargaSatuan;

  let sisaKuantitas = params.validData.totalKuantitas - tmpKuantitas;
  let buttonEnabled = sisaKuantitas === 0 ? false : true;
  return (
    <>
      <Modal
        visible={params.openModal}
        width={1000}
        title={`Sumber Dana`}
        okText="Simpan"
        cancelText="Batal"
        okButtonProps={{ disabled: buttonEnabled }}
        onOk={() => form.submit()}
        onCancel={() => params.onClose()}>
        <div className="mb-2 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Descriptions size="small" bordered>
              <Descriptions.Item label="Total Biaya" span={3}>
                {formatRupiah(params.validData.totalSaldo)}
              </Descriptions.Item>
              <Descriptions.Item label="Total Jumlah Kuantitas" span={3}>
                {params.validData.totalKuantitas}
              </Descriptions.Item>
              <Descriptions.Item label="Harga Satuan" span={3}>
                {formatRupiah(params.validData.hargaSatuan)}
              </Descriptions.Item>
              <Descriptions.Item label="Jenis Pajak" span={3}>
                {(params.validData.jenisPajak === "ppn" &&
                  "PPN (Koefisien 11%)") ||
                  (params.validData.jenisPajak === "tidakTermasukPajak" &&
                    "Tidak Termasuk Pajak") ||
                  (params.validData.jenisPajak === "termasukPajak" &&
                    "Termasuk Pajak")}
              </Descriptions.Item>
            </Descriptions>
          </div>
          <div className="flex-1">
            <Descriptions size="small" labelStyle={{ fontWeight: "bold" }}>
              <Descriptions.Item label="Sisa Biaya" span={3}>
                {formatRupiah(sisaSaldo)}
              </Descriptions.Item>
              <Descriptions.Item label="Sisa Jumlah Kuantitas" span={3}>
                {sisaKuantitas}
              </Descriptions.Item>
            </Descriptions>
            <Alert
              message="Informasi"
              description="Sisa Total Biaya dan Total Kuantitas, Sisa Total Biaya dan Total Kuantitas Harus 0"
              type="info"
              showIcon
            />
          </div>
        </div>
        <Divider plain orientation="left">
          Tambahkan Sumber Dana
        </Divider>
        <Form
          form={form}
          key="tambahSumberDana"
          layout="vertical"
          onFinish={handleSave}
          onValuesChange={handleChange}>
          <Form.List name="sumberDanaList" initialValue={listSumberDana}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index: number) => {
                  let filterSumber =
                    (tmpList[index]?.sumberDana &&
                      filterSumberDana.filter(
                        (item: any) =>
                          !item.includes(tmpList[index]?.sumberDana),
                      )) ||
                    filterSumberDana;
                  let saldoSumber = tmpList[index]?.saldo;
                  let totalKuantitasHarga =
                    (!isNaN(
                      params.validData.hargaSatuan * tmpList[index]?.kuantitas,
                    ) &&
                      params.validData.hargaSatuan *
                        tmpList[index]?.kuantitas) ||
                    0;
                  let maxKuantitas = tmpList[index]?.kuantitas + sisaKuantitas;

                  const checkValidationSaldo = (
                    saldoSumber,
                    totalKuantitasHarga,
                  ) => {
                    if (saldoSumber < totalKuantitasHarga) {
                      return Promise.reject(
                        "Saldo dari Sumber Dana tidak mencukupi!",
                      );
                    } else {
                      return Promise.resolve();
                    }
                  };

                  return (
                    <div>
                      <Space
                        key={key}
                        className="flex flex-row"
                        size={[16, 24]}
                        style={{ marginBottom: 8 }}
                        align="baseline">
                        <div>{index + 1}.</div>
                        <Form.Item
                          {...restField}
                          label="Sumber Dana"
                          key={`sumberDana${key}`}
                          name={[name, "sumberDana"]}
                          rules={[
                            {
                              required: true,
                              message: "Sumber Dana tidak boleh kosong!",
                            },
                            {
                              validator: () =>
                                checkValidationSaldo(
                                  saldoSumber,
                                  totalKuantitasHarga,
                                ),
                            },
                          ]}>
                          <Select placeholder="Pilih Sumber Dana">
                            {tmpRekapSumberDana.length &&
                              tmpRekapSumberDana
                                // .filter((item: any) =>
                                //   tmpSumberDana.includes(item.kode_sumber_dana),
                                // )
                                .filter(
                                  (item: any) =>
                                    !filterSumber.includes(item.id),
                                )
                                .map((item: any) => (
                                  <Select.Option value={item.id}>
                                    {item.nama_kode_sumber_dana}
                                  </Select.Option>
                                ))}
                          </Select>
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          label="Alokasikan Kuantitas"
                          key={`kuantitas${key}`}
                          name={[name, "kuantitas"]}
                          rules={[
                            {
                              required: true,
                              message: "Jumlah Kuantitas tidak boleh kosong!",
                            },
                            {
                              validator: () =>
                                checkValidationSaldo(
                                  saldoSumber,
                                  totalKuantitasHarga,
                                ),
                            },
                          ]}>
                          <InputNumber
                            type="number"
                            min={1}
                            max={maxKuantitas}
                            placeholder="Alokasikan Kuantitas"
                          />
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Space>
                      <div className="mb-2">
                        <Descriptions key={key} size="small" bordered>
                          <Descriptions.Item label="Saldo Sumber Dana" span={3}>
                            {formatRupiah(saldoSumber)}
                          </Descriptions.Item>
                          <Descriptions.Item
                            label="Jumlah Saldo yang digunakan"
                            span={3}>
                            {formatRupiah(totalKuantitasHarga)}
                          </Descriptions.Item>
                        </Descriptions>
                      </div>
                    </div>
                  );
                })}
                {sisaKuantitas > 0 && (
                  <Form.Item>
                    <Button
                      type="primary"
                      onClick={() => add()}
                      icon={<PlusOutlined />}>
                      Tambah
                    </Button>
                  </Form.Item>
                )}
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </>
  );
};
export default ModalSumberDana;
