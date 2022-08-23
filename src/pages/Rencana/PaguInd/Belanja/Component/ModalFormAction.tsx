/** @format */

import React, { useState, useEffect } from "react";
import moment from "moment";
import "moment/locale/id";
import { Select, Input, Form, DatePicker, Tabs, Modal } from "antd";
import { useSelector } from "react-redux";
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

type FormModalActionType = {
  title: any;
  editData: any;
  openModal: boolean;
  hanldeClose: () => void;
  handleSave: (e: any) => void;
  // handleChangeSelect: (e: any, a: string) => void;
};
const ModalFormAction = ({
  title,
  openModal,
  editData,
  handleSave,
  hanldeClose,
}: FormModalActionType) => {
  const [form] = Form.useForm();
  const [formBos] = Form.useForm();
  const [formBkba] = Form.useForm();
  const [tabActive, setTabActive] = useState<any>(null);

  useEffect(() => {
    if (editData) {
      console.log(editData, "useed");
      setTabActive(editData?.tag_sumber_dana || "sumberLain");
    }
  }, [editData, form, formBkba, formBos]);

  const handleReset = () => {
    if (title === "Tambah") {
      setTabActive("sumberBos");
      form.resetFields();
      formBos.resetFields();
      formBkba.resetFields();
    }
    hanldeClose();
  };

  const onTabClick = (key) => {
    setTabActive(key);
  };

  const handleAfterSave = (values: any) => {
    handleSave(values);
    handleReset();
  };

  return (
    <Modal
      visible={openModal}
      title={`${title} Rencana Kegiatan`}
      width={1000}
      okText="Simpan"
      cancelText="Batal"
      onCancel={handleReset}
      onOk={() =>
        (tabActive === "sumberBos" && formBos.submit()) ||
        (tabActive === "sumberBkba" && formBkba.submit()) ||
        ((tabActive === "sumberLain" || tabActive === null) && form.submit())
      }>
      <Tabs
        activeKey={tabActive || "sumberLain"}
        // defaultActiveKey={"sumberBos"}
        onTabClick={onTabClick}>
        <TabPane
          tab="Sumber Dana BOS"
          key="sumberBos"
          disabled={
            title === "Edit" && tabActive !== "sumberBos" ? true : false
          }>
          <FormAction
            key="formRencanaBos"
            name="sumberBos"
            form={formBos}
            disableField={true}
            editData={editData}
            handleSave={handleAfterSave}
          />
        </TabPane>
        <TabPane
          tab="Sumber Dana BKBA"
          key="sumberBkba"
          disabled={
            title === "Edit" && tabActive !== "sumberBkba" ? true : false
          }>
          <FormAction
            key="formDanaBkba"
            name="sumberBkba"
            form={formBkba}
            disableField={true}
            editData={editData}
            handleSave={handleAfterSave}
          />
        </TabPane>
        <TabPane
          tab="Sumber Dana Lain"
          key="sumberLain"
          disabled={
            title === "Edit" && tabActive !== "sumberLain" ? true : false
          }>
          <FormAction
            key="formRencanaLain"
            name="sumberLain"
            form={form}
            disableField={false}
            editData={editData}
            handleSave={handleAfterSave}
          />
        </TabPane>
      </Tabs>
    </Modal>
  );
};

type FormActionType = {
  key: string;
  name: string;
  form: any;
  editData: any;
  disableField: boolean;
  handleSave: (e: any) => void;
};

const FormAction = ({ editData, ...params }: FormActionType) => {
  const store = useSelector((state: any) => state.store);
  const auth = useSelector((state: any) => state.auth);
  const tmpSubKegiatan = store.subKegiatan || [];
  const tmpKegiatan = store.kegiatan || [];
  const tmpStandarPendidikan = store.snp || [];
  const tmpSatuan = store.satuan || [];
  const tmpKelompokSasaran = store.kelompokSasaran || [];
  const [standarPendidikan, setStandarPendidikan] = useState<any>(null);
  const [kegiatan, setKegiatan] = useState<any>(null);
  const form = params.form;

  useEffect(() => {
    setStandarPendidikan(editData?.kode_snp);
    setKegiatan(editData?.kode_kegiatan);
    form.setFieldsValue({
      waktuPelaksanaan: [
        moment(`${editData?.tahun}-${editData?.bulan_pelaksanaan_start}-01`),
        moment(`${editData?.tahun}-${editData?.bulan_pelaksanaan_end}-01`),
      ],
      kelompokSasaran: editData?.kelompok_sasaran,
      standarPendidikan: editData?.kode_snp,
      subKegiatan: editData?.kode_sub_kegiatan,
      kegiatan: editData?.kode_kegiatan,
      hasilSatuan: editData?.indikator_hasil_satuan,
      hasilTarget: editData?.indikator_hasil_target,
      indikatorHasil: editData?.indikator_hasil,
      outputSatuan: editData?.indikator_output_satuan,
      outputTarget: editData?.indikator_output_target,
      indikatorOutput: editData?.indikator_output,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData]);

  const handleValuesChange = (values) => {
    if (params.name !== "sumberLain") {
      for (let obj in values) {
        if (obj === "subKegiatan") {
          const subKegiatan = tmpSubKegiatan.find(
            (item) => item.kode === values.subKegiatan,
          );
          setStandarPendidikan(subKegiatan?.kode_snp);
          form.setFieldsValue({
            standarPendidikan: subKegiatan?.kode_snp,
            kegiatan: subKegiatan?.kode_kegiatan,
          });
        }
      }
    } else {
      for (let obj in values) {
        if (obj === "standarPendidikan") {
          setStandarPendidikan(values.standarPendidikan);
        }
        if (obj === "kegiatan") {
          setKegiatan(values.kegiatan);
        }
      }
    }
  };
  // eslint-disable-next-line arrow-body-style
  const disabledDate = (current) => {
    // Can not select days before today and today
    return current.year() !== moment(`${auth.isTahun}-12-01`).year();
  };

  return (
    <Form
      form={form}
      key={params.key}
      name={params.name}
      layout="vertical"
      initialValues={{
        tagSumberDana: params.name,
      }}
      onValuesChange={handleValuesChange}
      onFinish={params.handleSave}>
      <div className="flex  flex-col  md:items-center md:flex-row gap-2 ">
        <div className="flex-1">
          <Form.Item name="tagSumberDana" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            label="Standar Pendidikan"
            name="standarPendidikan"
            rules={[
              {
                required: true,
                message: "Standar Pendidikan tidak boleh kosong!",
              },
            ]}>
            <Select
              showSearch
              optionFilterProp="children"
              disabled={params.disableField}
              placeholder="Pilih Standar Pendidikan">
              {tmpStandarPendidikan?.length &&
                tmpStandarPendidikan.map((e: any, i: any) => {
                  return (
                    <Select.Option key={`snp${i}`} value={e.kode}>
                      {e.kode}.{e.nama}
                    </Select.Option>
                  );
                })}
            </Select>
          </Form.Item>
        </div>
        <div className="flex-1">
          <Form.Item
            label="Kegiatan"
            name="kegiatan"
            rules={[
              {
                required: true,
                message: "Kegiatan tidak boleh kosong!",
              },
            ]}>
            <Select
              showSearch
              optionFilterProp="children"
              disabled={params.disableField}
              placeholder="Pilih Kegiatan">
              {standarPendidikan &&
                tmpKegiatan
                  .filter((item: any) => item.kode_snp === standarPendidikan)
                  .map((e: any, i: any) => {
                    return (
                      <Select.Option key={`keg${i}`} value={e.kegiatan.kode}>
                        {e.kegiatan.kode}.{e.kegiatan.nama}
                      </Select.Option>
                    );
                  })}
            </Select>
          </Form.Item>
        </div>
      </div>

      <div className="flex  flex-col  md:items-center md:flex-row gap-2 ">
        <div className="flex-1">
          <Form.Item
            label="Sub Kegiatan"
            name="subKegiatan"
            rules={[
              {
                required: true,
                message: "Sub Kegiatan tidak boleh kosong!",
              },
            ]}>
            <Select
              showSearch
              optionFilterProp="children"
              placeholder="Pilih Sub Kegiatan">
              {params.name === "sumberLain"
                ? kegiatan &&
                  tmpSubKegiatan
                    .filter((e: any) => e.kode_kegiatan === kegiatan)
                    .map((e: any, i: any) => {
                      return (
                        <Select.Option key={`subkeg${i}`} value={e.kode}>
                          {e.kode}.{e.nama}
                        </Select.Option>
                      );
                    })
                : tmpSubKegiatan.map((e: any, i: any) => {
                    return (
                      <Select.Option key={`subkeg${i}`} value={e.kode}>
                        {e.kode}.{e.nama}
                      </Select.Option>
                    );
                  })}
            </Select>
          </Form.Item>
        </div>
        <div className="flex-1">
          <Form.Item
            label="Kelompok Sasaran"
            name="kelompokSasaran"
            rules={[
              {
                required: true,
                message: "Kelompok Sasaran tidak boleh kosong!",
              },
            ]}>
            <Select
              mode="multiple"
              showSearch
              optionFilterProp="children"
              placeholder="Pilih Kelompok Sasaran">
              {tmpKelompokSasaran.length &&
                tmpKelompokSasaran.map((e: any, i: any) => {
                  return (
                    <Select.Option key={`role${i}`} value={e.kode}>
                      {e.nama}
                    </Select.Option>
                  );
                })}
            </Select>
          </Form.Item>
        </div>
      </div>

      <div className="w-full">
        <Form.Item
          label="Waktu Pelaksanaan"
          name="waktuPelaksanaan"
          rules={[
            {
              required: true,
              message: "Waktu Pelaksanaan tidak boleh kosong!",
            },
          ]}>
          <RangePicker
            style={{ width: "100%" }}
            picker="month"
            defaultPickerValue={[
              moment(`${auth.isTahun}-01`, "YYYY-MM"),
              moment(`${auth.isTahun}-01`, "YYYY-MM"),
            ]}
            disabledDate={disabledDate}
            placeholder={["Pilih Bulan Awal", "Pilih Bulan Akhir"]}
          />
        </Form.Item>
      </div>

      <div className="flex  flex-col  md:items-center md:flex-row gap-2 ">
        <div className="flex-1">
          <Form.Item
            label="Indikator Output"
            tooltip="Output adalah hasil dari sebuah kegiatan / misalnya jumlah guru yang dilatih"
            name="indikatorOutput"
            rules={[
              {
                required: true,
                message: "Indikator Output tidak boleh kosong!",
              },
            ]}>
            <Input.TextArea placeholder="Indikator Output" />
          </Form.Item>
        </div>
        <div className="flex-1">
          <Form.Item
            label="Indikator Hasil"
            tooltip="Indikator Hasil adalah akibat dari output / misalnya hasil dari pelatihan guru / guru mampu menerapkan keterampilan tertentu di dalam kelas"
            name="indikatorHasil"
            rules={[
              {
                required: true,
                message: "Indikator Hasil tidak boleh kosong!",
              },
            ]}>
            <Input.TextArea placeholder="Indikator Hasil" />
          </Form.Item>
        </div>
      </div>
      <div className="flex  flex-col  md:items-center md:flex-row gap-2 ">
        <div className="flex-1">
          <div className="flex  flex-col  md:items-center md:flex-row">
            <div className="flex-1">
              <Form.Item
                label="Target"
                name="outputTarget"
                rules={[
                  {
                    required: true,
                    message: "Target tidak boleh kosong!",
                  },
                ]}>
                <Input type="number" />
              </Form.Item>
            </div>
            <div className="flex-1">
              <Form.Item
                label="Satuan"
                name="outputSatuan"
                rules={[
                  {
                    required: true,
                    message: "Satuan tidak boleh kosong!",
                  },
                ]}>
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder="Pilih Satuan">
                  {tmpSatuan.length &&
                    tmpSatuan.map((e: any, i: any) => {
                      return (
                        <Select.Option key={`role${i}`} value={e.kode}>
                          {e.nama}
                        </Select.Option>
                      );
                    })}
                </Select>
              </Form.Item>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex  flex-col  md:items-center md:flex-row">
            <div className="flex-1">
              <Form.Item
                label="Target"
                name="hasilTarget"
                rules={[
                  {
                    required: true,
                    message: "Target tidak boleh kosong!",
                  },
                ]}>
                <Input type="number" />
              </Form.Item>
            </div>
            <div className="flex-1">
              <Form.Item
                label="Satuan"
                name="hasilSatuan"
                rules={[
                  {
                    required: true,
                    message: "Satuan tidak boleh kosong!",
                  },
                ]}>
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder="Pilih Satuan">
                  {tmpSatuan.length &&
                    tmpSatuan.map((e: any, i: any) => {
                      return (
                        <Select.Option key={`role${i}`} value={e.kode}>
                          {e.nama}
                        </Select.Option>
                      );
                    })}
                </Select>
              </Form.Item>
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
};
export default ModalFormAction;
