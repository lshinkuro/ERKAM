/** @format */

import React, { useState } from "react";
import { BreadCrumb } from "../../../components";
import {
  Table,
  Input,
  Space,
  Form,
  Modal,
  Tag,
  Switch,
  InputNumber,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import notifAlert from "../../../components/NotifAlert";
import {
  ButtonTableDelete,
  ButtonTableEdit,
  ButtonTambah,
} from "../../../components/Button";
import InputSearch from "../../../components/InputSearch";
import { setStore } from "../../../redux/actions";
import { uuidv4 } from "../../../utils/helper";
import {
  deletePajak,
  postPajak,
} from "../../../services/v2/referenceservice/pajakservices";

const Pajak = () => {
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Referensi" },
    { path: "/", breadcrumbName: "Pajak" },
  ];
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const store = useSelector((state: any) => state.store);
  const auth = useSelector((state: any) => state.auth);
  const refPajak = store.pajak || [];
  const [search, setSearch] = useState<any>(null);
  const [id, setID] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [title, setTitle] = useState<any>("");
  const [openModal, setOpenModal] = useState(false);

  /** Filter Search */
  let dataTable: any = search
    ? refPajak.filter((item: any) => {
        const val = search.toLowerCase();
        return (
          (item.nama !== null &&
            (item.nama || "").toString().toLowerCase().includes(val)) ||
          (item.kode !== null &&
            (item.kode || "").toString().toLowerCase().includes(val))
        );
      })
    : refPajak;
  const totalDataTable = dataTable.length;
  /**
   * Filter Pagination
   */
  dataTable = dataTable.filter((v, i) => {
    let start = pageSize * (page - 1);
    let end = start + pageSize;

    return i >= start && i < end;
  });

  const columnTmp = [
    {
      title: "Kode",
      dataIndex: "kode",
      key: "kode",
      onFilter: (value, record) => record.kode.indexOf(value) === 0,
      sorter: (a, b) => a.kode - b.kode,
    },
    {
      title: "Nama",
      dataIndex: "nama",
      key: "nama",
      onFilter: (value, record) => record.nama.indexOf(value) === 0,
      sorter: (a, b) => a.nama - b.nama,
    },
    {
      title: "Koefesien",
      dataIndex: "koefisien",
      key: "koefisien",
      onFilter: (value, record) => record.koefisien.indexOf(value) === 0,
      sorter: (a, b) => a.koefisien - b.koefisien,
    },
    {
      title: "Rencana",
      dataIndex: "rencana",
      key: "rencana",
      render: (rencana) =>
        (rencana === "0" && <Tag color="default">Tidak Aktif</Tag>) || (
          <Tag color="success">Aktif</Tag>
        ),
    },
    {
      title: "Realisasi",
      dataIndex: "realisasi",
      key: "realisasi",
      render: (realisasi) =>
        (realisasi === "0" && <Tag color="default">Tidak Aktif</Tag>) || (
          <Tag color="success">Aktif</Tag>
        ),
    },
    {
      title: "Keterangan",
      dataIndex: "deskripsi",
      key: "keterangan",
    },

    {
      title: "Aksi",
      key: "aksi",

      render: (record) => (
        <Space>
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

  const handleEdit = (record: any) => {
    setTitle("Edit");
    setOpenModal(true);
    setID(record.id);
    form.setFieldsValue({
      kode: record.kode,
      nama: record.nama,
      deskripsi: record.deskripsi,
      koefisien: record.koefisien,
      realisasi: record.realisasi === "0" ? false : true,
      rencana: record.rencana === "0" ? false : true,
    });
  };

  const handleDelete = async (record: any) => {
    try {
      await deletePajak(record.id);
      let pajak = refPajak.filter((item: any) => item.id !== record.id);

      notifAlert({
        type: "success",
        description: "Hapus data pajak berhasil",
      });
      setTimeout(() => {
        dispatch(setStore({ pajak }));
      }, 100);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTambah = () => {
    setTitle("Tambah");
    setID(uuidv4());
    setOpenModal(true);
    form.resetFields();
  };

  const handleSave = async (values: any) => {
    const payload: any = {
      id: id,
      tahun: auth.isTahun,
      activated: 1,
      kode: values.kode,
      nama: values.nama,
      koefisien: values.koefisien,
      deskripsi: values.deskripsi,
      realisasi: values.realisasi ? "1" : "0",
      rencana: values.rencana ? "1" : "0",
    };

    try {
      await postPajak(payload);
      const filterPajak = refPajak.filter((item: any) => item.id !== id);
      const pajak = [...filterPajak, payload];
      notifAlert({
        type: "success",
        description: "Data pajak berhasil disimpan",
      });
      setTimeout(() => {
        dispatch(setStore({ pajak }));
      }, 100);
    } catch (error) {
      console.log(error);
    }

    setOpenModal(false);
  };

  return (
    <>
      <BreadCrumb routes={itemBreadcrumb} title="Pajak" />
      <div className="m-5 p-5 bg-white shadow-md rounded">
        <div className="mb-4 flex justify-end">
          <div className="mr-4">
            <ButtonTambah onClick={handleTambah} />
          </div>
          <InputSearch
            className="w-3/4"
            onChange={(e: any) => setSearch(e.currentTarget.value)}
          />
        </div>
        <div className="w-full">
          <Table
            rowKey={(record) => record.id}
            columns={columnTmp}
            dataSource={dataTable}
            bordered
            pagination={{
              total: totalDataTable,
              position: ["bottomRight"],
              defaultPageSize: pageSize,
              defaultCurrent: page,
              showTotal: (total) => `Total ${total} items`,
              onChange(page, pageSize) {
                setPage(page);
                setPageSize(pageSize);
              },
            }}
          />
        </div>
      </div>
      <Modal
        visible={openModal}
        title={`${title} Pajak`}
        onCancel={() => setOpenModal(!openModal)}
        okText="Simpan"
        cancelText="Batal"
        onOk={() => form.submit()}>
        <Form
          form={form}
          key="formPajak"
          name="formPajak"
          layout="vertical"
          initialValues={{ koefisien: 0 }}
          onFinish={handleSave}>
          <Form.Item
            label="Kode"
            name="kode"
            rules={[{ required: true, message: "Kode tidak boleh kosong!" }]}>
            <Input placeholder="Kode" />
          </Form.Item>
          <Form.Item
            label="Nama"
            name="nama"
            rules={[{ required: true, message: "Nama tidak boleh kosong!" }]}>
            <Input placeholder="Nama" />
          </Form.Item>
          <Form.Item label="Koefisien" name="koefisien">
            <InputNumber min={0} placeholder="Koefisien" />
          </Form.Item>
          <Form.Item label="Rencana" name="rencana" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="Realisasi" name="realisasi" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="Keterangan" name="deskripsi">
            <Input.TextArea placeholder="Keterangan" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default Pajak;
