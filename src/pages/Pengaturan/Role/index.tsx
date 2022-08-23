/** @format */

import React, { useEffect, useState } from "react";
import { BreadCrumb } from "../../../components";
import { getUsermanAll } from "../../../services/v2/usermanservice";
import { Table, Select, Modal, Space, Button, Form, Input } from "antd";
import { useSelector } from "react-redux";
import { uuidv4 } from "../../../utils/helper";
import {
  ButtonTableDelete,
  ButtonTableEdit,
  ButtonTambah,
} from "../../../components/Button";
import notifAlert from "../../../components/NotifAlert";
import InputSearch from "../../../components/InputSearch";

const Role = () => {
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Pengaturan" },
    { path: "/", breadcrumbName: "Managemen User" },
    { path: "/", breadcrumbName: "Role" },
  ];
  const [isLoading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [search, setSearch] = useState<any>(null);
  const store = useSelector((state: any) => state.store);
  const authTmp = useSelector((state: any) => state.auth);
  const auth = authTmp?.data || null;

  const [openModalAction, setOpenModalAction] = useState(false);
  const [tableData, setTableData] = useState<any>([]);
  const [title, setTitle] = useState("");
  const [id, setID] = useState("");

  const getData = async () => {
    setLoading(true);
    const res = await getUsermanAll("role", {
      activated: 1,
    });

    console.log(res);
    setTableData(res || []);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleTambah = () => {
    setOpenModalAction(true);
    setTitle("Tambah");
    setID(uuidv4());
    form.resetFields();
  };

  function handleEdit(record: any) {
    setOpenModalAction(true);
    setTitle("Edit");
    setID(record.id);
    form.setFieldsValue({
      kode: record.kode,
      nama: record.nama,
      group: record.group,
      deskripsi: record.deskripsi,
    });
  }

  const handleDelete = async (record: any) => {
    setLoading(true);
    try {
      // await deleteUsers(record.id);
      getData();
      notifAlert({ type: "success", description: "Data berhasil dihapus" });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleSave = (values: any) => {
    try {
      const payload = {
        kode: values.kode,
        nama: values.nama,
        group: values.group,
        deskripsi: values.deskripsi,
      };
    } catch (error) {
      console.log(error);
    }
  };

  const dataTable = search
    ? tableData.filter((item: any) => {
        const val = search.toLowerCase();
        return (
          (item.kode !== null &&
            (item.kode || "").toLowerCase().includes(val)) ||
          (item.nama !== null &&
            (item.nama || "").toLowerCase().includes(val)) ||
          (item.deskripsi !== null &&
            (item.deskripsi || "").toLowerCase().includes(val)) ||
          (item.group !== null &&
            (item.group || "").toLowerCase().includes(val))
        );
      })
    : tableData;

  const columns: any = [
    {
      title: "Kode",
      key: "kode",
      dataIndex: "kode",
      onFilter: (value, record) => record.kode.indexOf(value) === 0,
      sorter: (a, b) => a.kode - b.kode,
    },
    {
      title: "Nama",
      key: "nama",
      dataIndex: "nama",
      onFilter: (value, record) => record.nama.indexOf(value) === 0,
      sorter: (a, b) => a.nama - b.nama,
    },
    {
      title: "Group",
      key: "group",
      className: "capitalize",
      dataIndex: "group",
      onFilter: (value, record) => record.group.indexOf(value) === 0,
      sorter: (a, b) => a.group - b.group,
    },
    {
      title: "Deskripsi",
      key: "deskripsi",
      dataIndex: "deskripsi",
    },
    {
      title: "Aksi",
      fixed: "right",
      width: 120,
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
  const handleReset = () => {
    form.resetFields();
    setOpenModalAction(false);
  };

  return (
    <>
      <BreadCrumb routes={itemBreadcrumb} title={"Role"} />
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
            columns={columns}
            dataSource={dataTable}
            bordered
            loading={isLoading}
          />
        </div>
      </div>
      <Modal
        visible={openModalAction}
        title={`${title} Role`}
        onCancel={handleReset}
        footer={[
          <Button key="back" onClick={handleReset}>
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
          key="formRole"
          name="formRole"
          layout="vertical"
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
            rules={[
              {
                required: true,
                message: "Nama tidak boleh kosong!",
              },
            ]}>
            <Input placeholder="Nama" />
          </Form.Item>
          <Form.Item
            label="Group"
            name="group"
            rules={[
              {
                required: true,
                message: "Group tidak boleh kosong!",
              },
            ]}>
            <Input type="number" placeholder="NIK" />
          </Form.Item>
          <Form.Item label="Deskripsi" name="deskripsi">
            <Input.TextArea placeholder="Deskripsi" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Role;
