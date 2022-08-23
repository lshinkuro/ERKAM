/** @format */

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Select, Collapse, Input, Modal, Form, Descriptions } from "antd";
import notifAlert from "../NotifAlert";
import {
  postPenerima,
  postPenerimaRekening,
} from "../../services/v2/referenceservice/penerimaservices";
import { setStore } from "../../redux/actions";
import { getReferenceAll } from "../../services/v2/referenceservice";
import { uuidv4 } from "../../utils/helper";
const { Panel } = Collapse;
type penerimaModalType = {
  openModal: boolean;
  handleClose: () => void;
};

const ModalPenerima = ({ openModal, handleClose }: penerimaModalType) => {
  const store = useSelector((state: any) => state.store);
  const auth = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [provinsi, setProvinsi] = useState<any>(null);
  const [kabkota, setKabKota] = useState<any>(null);
  const [kecamatan, setKecamatan] = useState<any>(null);
  const refTipePenerima: {
    kode: string;
    nama: string;
  }[] = store.tipePenerima || [];
  const tmpPenerima = store.penerimaRekening || [];
  const refProvinsi: { kode: string; nama: string }[] = store.provinsi || [];
  const refKabkota: {
    kode: string;
    nama: string;
    kode_provinsi: string;
  }[] = store.kabkota || [];

  const refKecamatan: {
    kode: string;
    nama: string;
    kode_kabkota: string;
  }[] = store.kecamatan || [];
  const [refKelurahan, setRefKelurahan] = useState<any>([]);

  const getData = async () => {
    const tmpKelurahan = store.kelurahan || [];
    if (tmpKelurahan.length) {
      setRefKelurahan(tmpKelurahan);
    } else {
      const kelurahan = await getReferenceAll("kelurahan", { activated: 1 });
      setRefKelurahan(kelurahan);
      setTimeout(() => {
        dispatch(setStore({ kelurahan }));
      }, 100);
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setProvinsi(null);
    setKabKota(null);
    setKecamatan(null);
    form.resetFields();
    handleClose();
  };

  const handleSave = async (values) => {
    let payload: any = {
      kode_provinsi: values.provinsi,
      kode_kabkota: values.kabkota,
      nama: values.nama,
      kode_kelurahan: values.kelurahan,
      tahun: auth.tahun,
      email: values.email,
      npwp: values.npwp,
      rt: values.rt,
      rw: values.rw,
      alamat_jalan: values.alamat,
      kode_kecamatan: values.kecamatan,
      keterangan: values.keterangan,
      kode_tipe_penerima: values.tipePenerima,
      nomor_rekening: values.noRekening,
      nama_rekening: values.nama,
    };
    try {
      const res = await postPenerima(payload);
      notifAlert({ type: "success", description: "Data berhasil disimpan" });
      const penerimaRekening = [...tmpPenerima, res];
      setTimeout(() => {
        dispatch(setStore({ penerimaRekening }));
      }, 100);
    } catch (error) {
      console.log(error);
    }
    resetForm();
  };
  const handleChange = (values: any) => {
    for (let obj in values) {
      switch (obj) {
        case "provinsi":
          setProvinsi(values.provinsi || null);
          setKabKota(null);
          setKecamatan(null);
          form.setFieldsValue({
            kabkota: null,
            kecamatan: null,
            kelurahan: null,
          });
          break;
        case "kabkota":
          setKabKota(values.kabkota || null);
          setKecamatan(null);
          form.setFieldsValue({
            kecamatan: null,
            kelurahan: null,
          });
          break;
        case "kecamatan":
          setKecamatan(values.kecamatan || null);
          form.setFieldsValue({
            kelurahan: null,
          });
          break;
      }
    }
  };
  return (
    <Modal
      width={900}
      visible={openModal}
      title={`Tambah Penerima`}
      onCancel={resetForm}
      okText="Simpan"
      cancelText="Batal"
      onOk={() => form.submit()}>
      <Form
        form={form}
        key="ModalFormPenerima"
        name="ModalFormPenerima"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onValuesChange={handleChange}
        onFinish={handleSave}>
        <div className="flex  flex-col  md:flex-row gap-2 ">
          <div className="flex-1">
            <Form.Item
              label="Tipe Penerima"
              name="tipePenerima"
              rules={[
                {
                  required: true,
                  message: "Tipe Penerima tidak boleh kosong!",
                },
              ]}>
              <Select
                showSearch
                optionFilterProp="children"
                placeholder="Pilih Tipe Penerima">
                {refTipePenerima?.length &&
                  refTipePenerima.map((e: any, i: any) => {
                    return (
                      <Select.Option key={`bank${i}`} value={e.kode}>
                        {e.nama}
                      </Select.Option>
                    );
                  })}
              </Select>
            </Form.Item>
          </div>
          <div className="flex-1">
            <Form.Item
              label="Nama"
              name="nama"
              rules={[
                {
                  required: true,
                  message: "Nama tidak boleh kosong!",
                },
              ]}>
              <Input placeholder="Nama" />
            </Form.Item>
          </div>
        </div>
        <div className="flex  flex-col  md:flex-row gap-2 ">
          <div className="flex-1">
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Email tidak boleh kosong!",
                },
                {
                  type: "email",
                  message: "Format Email tidak valid!",
                },
              ]}>
              <Input placeholder="Email" />
            </Form.Item>
          </div>
          <div className="flex-1">
            <Form.Item label="NPWP" name="npwp">
              <Input placeholder="NPWP" />
            </Form.Item>
          </div>
        </div>
        <div className="flex  flex-col  md:flex-row gap-2 ">
          <div className="flex-1">
            <Form.Item
              label="Provinsi"
              name="provinsi"
              rules={[
                { required: true, message: "Provinsi tidak boleh kosong!" },
              ]}>
              <Select
                showSearch
                optionFilterProp="children"
                //   onChange={(e: any) => handleChangeSelect(e, "provinsi")}
                placeholder="Pilih Provinsi">
                {refProvinsi?.length &&
                  refProvinsi.map((e: any, i: any) => {
                    return (
                      <Select.Option key={`sumbe${i}`} value={e.kode}>
                        {e.nama}
                      </Select.Option>
                    );
                  })}
              </Select>
            </Form.Item>
          </div>
          <div className="flex-1">
            <Form.Item
              label="Kabupaten / Kota"
              name="kabkota"
              rules={[
                {
                  required: true,
                  message: "Kabupaten / Kota tidak boleh kosong!",
                },
              ]}>
              <Select
                showSearch
                optionFilterProp="children"
                //   onChange={(e: any) => handleChangeSelect(e, "kabkota")}
                placeholder="Pilih Kabupaten / Kota">
                {provinsi &&
                  refKabkota?.length &&
                  refKabkota
                    .filter((item: any) => item.kode_provinsi === provinsi)
                    .map((e: any, i: any) => {
                      return (
                        <Select.Option key={`kabkot${i}`} value={e.kode}>
                          {e.nama}
                        </Select.Option>
                      );
                    })}
              </Select>
            </Form.Item>
          </div>
        </div>
        <div className="flex  flex-col  md:flex-row gap-2 ">
          <div className="flex-1">
            <Form.Item
              label="Kecamatan"
              name="kecamatan"
              rules={[
                { required: true, message: "Kecamatan tidak boleh kosong!" },
              ]}>
              <Select
                showSearch
                //   onChange={(e: any) => handleChangeSelect(e, "kecamatan")}
                optionFilterProp="children"
                placeholder="Pilih Kecamatan">
                {kabkota &&
                  refKecamatan?.length &&
                  refKecamatan
                    .filter((item: any) => item.kode_kabkota === kabkota)
                    .map((e: any, i: any) => {
                      return (
                        <Select.Option key={`kec${i}`} value={e.kode}>
                          {e.nama}
                        </Select.Option>
                      );
                    })}
              </Select>
            </Form.Item>
          </div>
          <div className="flex-1">
            <Form.Item
              label="Kelurahan"
              name="kelurahan"
              rules={[
                {
                  required: true,
                  message: "Kelurahan tidak boleh kosong!",
                },
              ]}>
              <Select
                showSearch
                optionFilterProp="children"
                placeholder="Pilih Kelurahan">
                {kecamatan &&
                  refKelurahan?.length &&
                  refKelurahan
                    .filter((item: any) => item.kode_kecamatan === kecamatan)
                    .map((e: any, i: any) => {
                      return (
                        <Select.Option key={`sumbe${i}`} value={e.kode}>
                          {e.nama}
                        </Select.Option>
                      );
                    })}
              </Select>
            </Form.Item>
          </div>
        </div>
        <div className="flex  flex-col  md:flex-row gap-2 ">
          <div className="flex-1">
            <Form.Item label="RT" name="rt">
              <Input placeholder="RT" />
            </Form.Item>
          </div>
          <div className="flex-1">
            <Form.Item label="RW" name="rw">
              <Input placeholder="RW" />
            </Form.Item>
          </div>
        </div>
        <div className="flex  flex-col  md:flex-row gap-2 ">
          <div className="flex-1">
            <Form.Item label="No Rekening" name="noRekening">
              <Input placeholder="No Rekening" />
            </Form.Item>
          </div>
          <div className="flex-1">
            <Form.Item label="Alamat" name="alamat">
              <Input.TextArea placeholder="Alamat" />
            </Form.Item>
          </div>
        </div>
        <div className="md:w-1/2 lg:w-1/2">
          <Form.Item label="Keterangan" name="keterangan">
            <Input.TextArea placeholder="Keterangan" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};
export default ModalPenerima;

type penerimaRekeningModalType = {
  openModal: boolean;
  penerimaID: any;
  handleClose: () => void;
};

export const ModalPenerimaRekening = ({
  openModal,
  penerimaID,
  handleClose,
}: penerimaRekeningModalType) => {
  const store = useSelector((state: any) => state.store);
  const dispatch = useDispatch();
  const [formRekening] = Form.useForm();
  const tmpPenerima = store.penerimaRekening || [];
  const refProvinsi: { kode: string; nama: string }[] = store.provinsi || [];
  const refKabkota: {
    kode: string;
    nama: string;
    kode_provinsi: string;
  }[] = store.kabkota || [];

  const refKecamatan: {
    kode: string;
    nama: string;
    kode_kabkota: string;
  }[] = store.kecamatan || [];
  const refKelurahan: {
    kode: string;
    nama: string;
    kode_kecamatan: string;
  }[] = store.kelurahan || [];
  let listRekening: any = null;
  tmpPenerima &&
    penerimaID &&
    tmpPenerima
      .filter((item) => item.id.includes(penerimaID))
      .map((item) => (listRekening = item));

  const refBank: any = store.bank || [];

  const resetForm = () => {
    formRekening.resetFields();
    handleClose();
  };

  const handleSaveRekening = async (values) => {
    let payload: any = {
      id: uuidv4(),
      kode_bank: values.bank,
      d_penerima_id: penerimaID,
      no_rekening: values.noRekening,
      no_rekening_nama: values.nama,
    };

    try {
      await postPenerimaRekening(payload);
      const penerimaRekening = await getReferenceAll("penerima", {
        activated: 1,
      });
      notifAlert({ type: "success", description: "Data berhasil disimpan" });
      setTimeout(() => {
        dispatch(setStore({ penerimaRekening }));
      }, 100);
    } catch (error) {
      console.log(error);
    }
    resetForm();
  };
  return (
    <Modal
      visible={openModal}
      width={800}
      title={`Tambah Rekening Penerima`}
      onCancel={resetForm}
      okText="Simpan"
      cancelText="Batal"
      onOk={() => formRekening.submit()}>
      <Collapse style={{ marginBottom: 20 }}>
        <Panel header="Detail Penerima" key="1">
          <Descriptions
            title=""
            labelStyle={{ fontWeight: 600 }}
            layout="vertical">
            <Descriptions.Item label="Nama">
              {(listRekening && listRekening?.nama) || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {(listRekening && listRekening?.email) || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="NPWP">
              {(listRekening && listRekening?.npwp) || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Provinsi">
              {(listRekening &&
                listRekening?.kode_provinsi &&
                refProvinsi
                  .filter(
                    (item: any) => item.kode === listRekening?.kode_provinsi,
                  )
                  .map((item) => item.nama)) ||
                "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Kab / Kota">
              {(listRekening &&
                listRekening?.kode_kabkota &&
                refKabkota
                  .filter(
                    (item: any) => item.kode === listRekening?.kode_kabkota,
                  )
                  .map((item) => item.nama)) ||
                "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Kecamatan">
              {(listRekening &&
                listRekening?.kode_kecamatan &&
                refKecamatan
                  .filter(
                    (item: any) => item.kode === listRekening?.kode_kecamatan,
                  )
                  .map((item) => item.nama)) ||
                "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Kelurahan">
              {(listRekening &&
                listRekening?.kode_kelurahan &&
                refKelurahan
                  .filter(
                    (item: any) => item.kode === listRekening?.kode_kelurahan,
                  )
                  .map((item) => item.nama)) ||
                "-"}
            </Descriptions.Item>
            <Descriptions.Item label="RT">
              {(listRekening && listRekening?.rt) || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="RW">
              {(listRekening && listRekening?.rw) || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="No Rekening">
              {(listRekening && listRekening?.nama) || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Alamat">
              {(listRekening && listRekening?.alamat) || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Keterangan">
              {(listRekening && listRekening?.keterangan) || "-"}
            </Descriptions.Item>
          </Descriptions>
        </Panel>
      </Collapse>
      <Form
        form={formRekening}
        key="modalFormRekeningPenerima"
        name="modalFormRekeningPenerima"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
        onFinish={handleSaveRekening}>
        <Form.Item
          label="Bank"
          name="bank"
          rules={[
            {
              required: true,
              message: "Bank tidak boleh kosong!",
            },
          ]}>
          <Select
            showSearch
            optionFilterProp="children"
            placeholder="Pilih Bank">
            {refBank?.length &&
              refBank.map((e: any, i: any) => {
                return (
                  <Select.Option key={`bank${i}`} value={e.kode}>
                    {e.nama}
                  </Select.Option>
                );
              })}
          </Select>
        </Form.Item>
        <Form.Item
          label="No Rekening"
          name="noRekening"
          rules={[
            {
              required: true,
              message: "No Rekening tidak boleh kosong!",
            },
          ]}>
          <Input type="number" placeholder="No Rekening" />
        </Form.Item>
        <Form.Item
          label="Nama"
          name="nama"
          rules={[
            {
              required: true,
              message: "Nama tidak boleh kosong!",
            },
          ]}>
          <Input placeholder="Nama" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
