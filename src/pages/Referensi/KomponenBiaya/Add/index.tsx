/** @format */

import React from "react";
import { BreadCrumb } from "../../../../components";
import { useHistory } from "react-router-dom";
import {
  Form,
  TreeSelect,
  Input,
  Tabs,
  Switch,
  InputNumber,
  Select,
  Button,
} from "antd";
import { useSelector } from "react-redux";
import { treeNested, treeNestedBelanja } from "../../../../utils/helper";
import { postKomponenBiaya } from "../../../../services/v2/referenceservice/komponenbiaya";
import notifAlert from "../../../../components/NotifAlert";
const { TabPane } = Tabs;
const FormKomponentBiaya = () => {
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Referensi" },
    { path: "/", breadcrumbName: "Komponen Biaya" },
    { path: "/", breadcrumbName: "Tambah" },
  ];
  const store = useSelector((state: any) => state.store);
  const auths = useSelector((state: any) => state.auth);
  const route = useHistory();
  const tmpKategoriKomponenBiaya = store.kategoriKomponenBiaya || [];
  const tmpKategoriBelanja = store.kategoriBelanja || [];
  const tmpProvinsi = store.provinsi || [];
  const tmpKabkota = store.kabkota || [];
  const tmpSatuan = store.satuan || [];

  const dataSelectKategoriBiaya = treeNested(tmpKategoriKomponenBiaya);
  const dataSelectJenisBiaya = treeNestedBelanja(tmpKategoriBelanja);
  const [form] = Form.useForm();

  // const handleChangeValue = (_, values) => {
  //   console.log(values);
  // };

  const handleSave = async (values: any) => {
    let harga: any = null;
    let listHarga: any = [];
    tmpProvinsi.length &&
      // eslint-disable-next-line array-callback-return
      tmpProvinsi.map((item) => {
        tmpKabkota.length &&
          tmpKabkota
            .filter((items) => items.kode_provinsi === item.kode)
            // eslint-disable-next-line array-callback-return
            .map((items, i) => {
              if (values[`${item.kode}${i}`]) {
                let hg1 = values[`harga1${item.kode}${i}`] || 0;
                let hg2 = values[`harga2${item.kode}${i}`] || 0;
                let hg3 = values[`harga3${item.kode}${i}`] || 0;
                harga = {
                  kodeKabKota: items.kode,
                  kodeProvinsi: item.kode,
                  harga1: hg1,
                  harga2: hg2,
                  harga3: hg3,
                };
                listHarga.push(harga);
              }
            });
      });

    const payload = {
      kode: values.kode,
      kodeKategori: values.kategoriKomponenBiaya,
      nama: values.nama,
      spesifikasi: values.spesifikasi,
      deskripsi: values.spesifikasi,
      satuan: values.satuan,
      jenisBelanja: values.jenisBelanja,
      tahun: auths.isTahun,
      belanjaLain: values.biayaLain ? true : false,
      harga: listHarga,
    };

    try {
      const res = await postKomponenBiaya(payload);
      console.log(res);
      notifAlert({
        type: "success",
        description: "Data berhasil disimpan",
      });
      form.resetFields();
    } catch (error) {
      console.log(error);
    }
  };

  // const handleChange = (values: any) => {
  //   for (let obj in values) {
  //     tmpProvinsi.length &&
  //       // eslint-disable-next-line array-callback-return
  //       tmpProvinsi.map((item) => {
  //         if (obj === `aktifProvinsi${item.kode}`) {
  //           let aktif = values[`aktifProvinsi${item.kode}`];
  //           let harga1 = values[`harga_1${item.kode}`] || 0;
  //           let harga2 = values[`harga_2${item.kode}`] || 0;
  //           let harga3 = values[`harga_3${item.kode}`] || 0;
  //           tmpKabkota.length &&
  //             tmpKabkota
  //               .filter((items) => items.kode_provinsi === item.kode)
  //               // eslint-disable-next-line array-callback-return
  //               .map((items, i) => {
  //                 var myobj = JSON.stringify(
  //                   "{ " + item.kode + i + ":" + aktif + " }",
  //                 );
  //                 let ts = JSON.parse(myobj);
  //                 form.setFieldsValue(ts);
  //               });
  //           // console.log(values[`aktifProvinsi${item.kode}`]);
  //         }
  //       });
  //   }
  // };

  return (
    <>
      <BreadCrumb
        routes={itemBreadcrumb}
        title="Tambah Komponen Biaya"
        back={true}
        toBack={() => route.goBack()}
      />
      <div className="m-5 p-5 bg-white shadow-md rounded">
        <Form
          form={form}
          key="formAddKomponentBiaya"
          name="formAddKomponentBiaya"
          layout="vertical"
          // onValuesChange={handleChangeValue}
          onFinish={handleSave}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Form.Item
                label="Kategori Komponen Biaya"
                name="kategoriKomponenBiaya"
                rules={[
                  {
                    required: true,
                    message: "Kategori Komponen Biaya tidak boleh kosong!",
                  },
                ]}>
                <TreeSelect
                  showSearch
                  style={{ width: "100%" }}
                  dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                  placeholder="Kategori Komponen Biaya"
                  allowClear
                  treeData={dataSelectKategoriBiaya}
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                label="Jenis Belanja"
                name="jenisBelanja"
                rules={[
                  {
                    required: true,
                    message: "Jenis Belanja tidak boleh kosong!",
                  },
                ]}>
                <TreeSelect
                  showSearch
                  multiple
                  style={{ width: "100%" }}
                  dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                  placeholder="Jenis Belanja"
                  allowClear
                  treeData={dataSelectJenisBiaya}
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                label="Kode Komponen Biaya"
                name="kode"
                rules={[
                  {
                    required: true,
                    message: "Kode Komponen Biaya tidak boleh kosong!",
                  },
                ]}>
                <Input placeholder="Kode" />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                label="Nama Komponen Biaya"
                name="nama"
                rules={[
                  {
                    required: true,
                    message: "Nama Komponen Biaya tidak boleh kosong!",
                  },
                ]}>
                <Input placeholder="Nama" />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                label="Satuan"
                name="satuan"
                rules={[
                  { required: true, message: "Satuan tidak boleh kosong!" },
                ]}>
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder="Pilih Satuan">
                  {tmpSatuan.length &&
                    tmpSatuan.map((e: any, i: any) => {
                      return (
                        <Select.Option key={`satuan${i}`} value={e.kode}>
                          {e.nama}
                        </Select.Option>
                      );
                    })}
                </Select>
              </Form.Item>
            </div>
            <div>
              <Form.Item
                label="Spesifikasi"
                name="spesifikasi"
                rules={[
                  {
                    required: true,
                    message: "Spesifikasi tidak boleh kosong!",
                  },
                ]}>
                <Input.TextArea placeholder="Spesifikasi" />
              </Form.Item>
            </div>
            <div>
              <Form.Item label="Deskripsi" name="deskripsi">
                <Input.TextArea placeholder="Deskripsi" />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                label="Termasuk Biaya Lainnya"
                name="biayaLain"
                valuePropName="checked">
                <Switch />
              </Form.Item>
            </div>
          </div>
          <div>
            <Tabs>
              {tmpProvinsi.length &&
                tmpProvinsi.map((item) => (
                  <TabPane tab={item.nama} key={item.kode}>
                    {/* <div className="w-full md:w-1/3">
                      <Form.Item
                        label={`Aktif Semua ${item.nama}`}
                        name={`aktifProvinsi${item.kode}`}
                        valuePropName="checked">
                        <Switch />
                      </Form.Item>
                      <Form.Item
                        noStyle
                        name={`harga_1${item.kode}`}
                        key={`harga_1${item.kode}`}>
                        <InputNumber
                          placeholder="0"
                          defaultValue={0}
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                      <Form.Item
                        noStyle
                        name={`harga_2${item.kode}`}
                        key={`harga_2${item.kode}`}>
                        <InputNumber
                          placeholder="0"
                          defaultValue={0}
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                      <Form.Item
                        name={`harga_3${item.kode}`}
                        key={`harga_3${item.kode}`}>
                        <InputNumber
                          placeholder="0"
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          defaultValue={0}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </div> */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {tmpKabkota.length &&
                        tmpKabkota
                          .filter((items) => items.kode_provinsi === item.kode)
                          .map((items, i) => (
                            <div>
                              <Form.Item
                                name={`${item.kode}${i}`}
                                label={items.nama}
                                valuePropName="checked">
                                <Switch />
                              </Form.Item>
                              <Form.Item
                                noStyle
                                name={`harga1${item.kode}${i}`}
                                key={`harga_1${items.kode}`}>
                                <InputNumber
                                  placeholder="0"
                                  defaultValue={0}
                                  formatter={(value) =>
                                    `${value}`.replace(
                                      /\B(?=(\d{3})+(?!\d))/g,
                                      ",",
                                    )
                                  }
                                  style={{ width: "100%" }}
                                />
                              </Form.Item>
                              <Form.Item
                                noStyle
                                name={`harga2${item.kode}${i}`}
                                key={`harga_2${items.kode}`}>
                                <InputNumber
                                  placeholder="0"
                                  defaultValue={0}
                                  formatter={(value) =>
                                    `${value}`.replace(
                                      /\B(?=(\d{3})+(?!\d))/g,
                                      ",",
                                    )
                                  }
                                  style={{ width: "100%" }}
                                />
                              </Form.Item>
                              <Form.Item
                                name={`harga3${item.kode}${i}`}
                                key={`harga_3${items.kode}`}>
                                <InputNumber
                                  placeholder="0"
                                  formatter={(value) =>
                                    `${value}`.replace(
                                      /\B(?=(\d{3})+(?!\d))/g,
                                      ",",
                                    )
                                  }
                                  defaultValue={0}
                                  style={{ width: "100%" }}
                                />
                              </Form.Item>
                            </div>
                          ))}
                    </div>
                  </TabPane>
                ))}
            </Tabs>
          </div>
          <Form.Item>
            <Button
              onClick={() => route.goBack()}
              className="login-form-button mb-2">
              Batal
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button mb-2">
              Simpan
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};
export default FormKomponentBiaya;
