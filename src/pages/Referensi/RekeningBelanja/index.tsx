/** @format */

import React, { useState } from "react";
import { BreadCrumb } from "../../../components";
import {
  postRekeningBelanja,
  deleteRekeningBelanja,
} from "../../../services/v2/referenceservice/rekeningbelanjaservices";
import { uuidv4 } from "../../../utils/helper";
import { Table, Select, Modal, Space, Button, Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  ButtonTableDelete,
  ButtonTableEdit,
  ButtonTambah,
} from "../../../components/Button";
import notifAlert from "../../../components/NotifAlert";
import { setStore } from "../../../redux/actions";
import InputSearch from "../../../components/InputSearch";

function RekeningMadrasah() {
  // const route = useHistory();
  const [form] = Form.useForm();
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Pengaturan" },
    { path: "/", breadcrumbName: "Rekening Bank Madrasah" },
  ];
  const dispatch = useDispatch();
  const store = useSelector((state: any) => state.store);
  const authTmp = useSelector((state: any) => state.auth);
  const [search, setSearch] = useState<any>(null);
  const auth = authTmp.data || [];
  const refSumberdana = store.sumberDana || [];
  const role = auth.kode_role;
  let columns: any = columnTmp || [];
  const refBank: any = store.bank || [];
  const tmpRekeningBelanja = store.rekeningBelanja || [];
  const [isLoading, setIsLoading] = useState(false);
  const [openModalAction, setOpenModalAction] = useState(false);
  const [title, setTitle] = useState("");
  const [id, setID] = useState("");

  if (role === "kepala_madrasah" || role === "bendahara_madrasah") {
    columns = [
      ...columns,
      {
        title: "Aksi",
        fixed: "right",
        width: 100,
        render: (record) => (
          <Space size="small">
            <ButtonTableEdit onClick={() => handleEdit(record)} />
            <ButtonTableDelete
              onClick={() => {
                Modal.confirm({
                  title: "Perhatian",
                  content: "Yakin Hapus Data?",
                  onOk() {
                    return handleDelete(record);
                  },
                  onCancel() {},
                  okText: "Hapus",
                  cancelText: "Batal",
                  okType: "danger",
                });
              }}
            />
          </Space>
        ),
      },
    ];
  }

  const dataTable = search
    ? tmpRekeningBelanja.filter((item: any) => {
        const val = search.toLowerCase();
        return (
          (item.kode_bank !== null &&
            (item.kode_bank || "").toString().toLowerCase().includes(val)) ||
          (item.nama_bank !== null &&
            (item.nama_bank || "").toString().toLowerCase().includes(val)) ||
          (item.no_rekening !== null &&
            (item.no_rekening || "").toString().toLowerCase().includes(val)) ||
          (item.keterangan !== null &&
            (item.keterangan || "").toString().toLowerCase().includes(val)) ||
          (item.no_rekening_nama !== null &&
            (item.no_rekening_nama || "")
              .toString()
              .toLowerCase()
              .includes(val)) ||
          (item.kode_tipe_rekening !== null &&
            (item.kode_tipe_rekening || "")
              .toString()
              .toLowerCase()
              .includes(val)) ||
          (item.cabang_bank !== null &&
            (item.cabang_bank || "").toString().toLowerCase().includes(val))
        );
      })
    : tmpRekeningBelanja;

  function handleTambah() {
    setOpenModalAction(true);
    setTitle("Tambah");
    setID(uuidv4());
    form.resetFields();
  }

  function handleEdit(record?: any) {
    setOpenModalAction(true);
    setTitle("Ubah");
    setID(record.id);
    form.setFieldsValue({
      bank: record?.kode_bank || null,
      cabangBank: record?.cabang_bank,
      noRekening: record?.no_rekening,
      namaRekening: record?.no_rekening_nama,
      tipeRekening: record?.kode_tipe_rekening,
      keterangan: record?.keterangan,
    });
  }

  const handleSave = async (values: any) => {
    setIsLoading(true);
    const namaBank = refBank
      .filter((item: any) => item.kode.includes(values.bank))
      .map((item: any) => {
        return item.nama;
      });
    let payload: any = {
      id: id,
      kode_bank: values.bank,
      nama_bank: namaBank[0],
      cabang_bank: values.cabangBank,
      no_rekening_nama: values.namaRekening,
      no_rekening: values.noRekening,
      keterangan: values.keterangan,
      kode_tipe_rekening: values.tipeRekening,
      tahun: auth.isTahun,
      activated: 1,
      kantor_pusat_id: auth.madrasah.kantor_pusat_id,
      kantor_provinsi_id: auth.madrasah.kantor_provinsi_id,
      kantor_kabkota_id: auth.madrasah.kantor_kabkota_id,
      madrasah_id: auth.madrasah.id,
      nama_madrasah: auth.madrasah.nama,
      kode_provinsi: auth.madrasah.kode_provinsi,
      kode_kabkota: auth.madrasah.kode_kabkota,
    };

    let filterRekeningBelanja = tmpRekeningBelanja.filter(
      (item: any) => !item.id.includes(id),
    );

    try {
      const rekeningBelanja = [...filterRekeningBelanja, payload];
      await postRekeningBelanja(payload);
      dispatch(setStore({ rekeningBelanja }));
      notifAlert({ type: "success", description: "Data berhasil disimpan" });
    } catch (err) {
      console.log(err);
    }
    setOpenModalAction(false);
    setIsLoading(false);
  };

  const handleDelete = async (record: any) => {
    setIsLoading(true);
    try {
      const rekeningBelanja = tmpRekeningBelanja.filter(
        (item: any) => !item.id.includes(record.id),
      );
      await deleteRekeningBelanja(record.id);
      dispatch(setStore({ rekeningBelanja }));

      notifAlert({ type: "success", description: "Data berhasil dihapus" });
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };

  return (
    <>
      <BreadCrumb routes={itemBreadcrumb} title="Rekening Bank Madrasah" />
      <div className="m-5 p-5 bg-white shadow-md rounded">
        <div className="mb-4 flex justify-end">
          {role === "bendahara_madrasah" ||
            (role === "kepala_madrasah" && (
              <div className="mr-4">
                <ButtonTambah onClick={handleTambah} />
              </div>
            ))}

          <InputSearch
            className="w-3/4"
            onChange={(e: any) => setSearch(e.currentTarget.value)}
          />
        </div>

        <div className="w-full">
          <Table
            rowKey={(record) => record.id}
            columns={columns}
            dataSource={dataTable}
            bordered
            loading={isLoading}
          />
        </div>
      </div>
      <Modal
        width={700}
        visible={openModalAction}
        title={`${title} Rekening Bank`}
        onCancel={() => setOpenModalAction(!openModalAction)}
        footer={[
          <Button
            key="back"
            onClick={() => setOpenModalAction(!openModalAction)}>
            Batal
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isLoading}
            onClick={() => form.submit()}>
            Simpan
          </Button>,
        ]}>
        <Form
          form={form}
          key="formRekeningBelanja"
          name="formRekeningBelanja"
          layout="vertical"
          onFinish={handleSave}>
          <div className="flex  flex-col  md:flex-row gap-2 ">
            <div className="flex-1">
              <Form.Item
                label="Bank"
                name="bank"
                rules={[
                  { required: true, message: "Bank tidak boleh kosong!" },
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
            </div>
            <div className="flex-1">
              <Form.Item
                label="Cabang Bank"
                name="cabangBank"
                rules={[
                  {
                    required: true,
                    message: "Cabang Bank tidak boleh kosong!",
                  },
                ]}>
                <Input placeholder="Cabang Bank" />
              </Form.Item>
            </div>
          </div>
          <div className="flex  flex-col  md:flex-row gap-2 ">
            <div className="flex-1">
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
            </div>
            <div className="flex-1">
              <Form.Item
                label="Nama Rekening"
                name="namaRekening"
                rules={[
                  {
                    required: true,
                    message: "Nama Rekening tidak boleh kosong!",
                  },
                ]}>
                <Input placeholder="Nama Rekening" />
              </Form.Item>
            </div>
          </div>
          <Form.Item
            label="Tipe Rekening"
            name="tipeRekening"
            rules={[
              { required: true, message: "Tipe Rekening tidak boleh kosong!" },
            ]}>
            <Select
              showSearch
              optionFilterProp="children"
              placeholder="Pilih Tipe Rekening">
              {refSumberdana?.length &&
                refSumberdana.map((e: any, i: any) => {
                  return (
                    <Select.Option key={`sumbe${i}`} value={e.kode}>
                      {e.nama}
                    </Select.Option>
                  );
                })}
            </Select>
          </Form.Item>
          <Form.Item label="Keterangan" name="keterangan">
            <Input.TextArea placeholder="Keterangan" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

const columnTmp = [
  {
    title: "Kode Bank",
    dataIndex: "kode_bank",
    key: "kode_bank",
    onFilter: (value, record) => record.kode_bank.indexOf(value) === 0,
    sorter: (a, b) => a.kode_bank - b.kode_bank,
  },
  {
    title: "Nama Bank",
    dataIndex: "nama_bank",
    key: "nama_bank",
    onFilter: (value, record) => record.nama_bank.indexOf(value) === 0,
    sorter: (a, b) => a.nama_bank - b.nama_bank,
  },
  {
    title: "Cabang",
    dataIndex: "cabang_bank",
    key: "cabang_bank",
    onFilter: (value, record) => record.cabang_bank.indexOf(value) === 0,
    sorter: (a, b) => a.cabang_bank - b.cabang_bank,
  },
  {
    title: "No Rekening",
    dataIndex: "no_rekening",
    key: "no_rekening",
    onFilter: (value, record) => record.no_rekening.indexOf(value) === 0,
    sorter: (a, b) => a.no_rekening - b.no_rekening,
  },
  {
    title: "Nama Rekening",
    dataIndex: "no_rekening_nama",
    key: "no_rekening_nama",
    onFilter: (value, record) => record.no_rekening_nama.indexOf(value) === 0,
    sorter: (a, b) => a.no_rekening_nama - b.no_rekening_nama,
  },
  {
    title: "Keterangan",
    dataIndex: "keterangan",
    key: "keterangan",
  },
];
export default RekeningMadrasah;
