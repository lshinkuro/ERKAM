/** @format */

import React, { useState } from "react";
import { BreadCrumb } from "../../../components";
import { Table, Input, Space, Form, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import notifAlert from "../../../components/NotifAlert";
import {
  ButtonTableDelete,
  ButtonTableEdit,
  ButtonTambah,
} from "../../../components/Button";
import InputSearch from "../../../components/InputSearch";
import {
  deleteSatuan,
  postSatuan,
} from "../../../services/v2/referenceservice/satuanservices";
import { setStore } from "../../../redux/actions";

const Satuan = () => {
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Referensi" },
    { path: "/", breadcrumbName: "Satuan" },
  ];
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const store = useSelector((state: any) => state.store);
  const refSatuan = store.satuan || [];
  const [search, setSearch] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [title, setTitle] = useState<any>("");
  const [openModal, setOpenModal] = useState(false);

  /** Filter Search */
  let dataTable: any = search
    ? refSatuan.filter((item: any) => {
        const val = search.toLowerCase();
        return (
          (item.nama !== null &&
            (item.nama || "").toString().toLowerCase().includes(val)) ||
          (item.kode !== null &&
            (item.kode || "").toString().toLowerCase().includes(val))
        );
      })
    : refSatuan;
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
    form.setFieldsValue({ kode: record.kode, nama: record.nama });
  };

  const handleDelete = async (record: any) => {
    try {
      await deleteSatuan(record.kode);
      let satuan = refSatuan.filter((item: any) => item.kode !== record.kode);

      notifAlert({
        type: "success",
        description: "Hapus data satuan berhasil",
      });
      setTimeout(() => {
        dispatch(setStore({ satuan }));
      }, 100);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTambah = () => {
    setTitle("Tambah");
    setOpenModal(true);
    form.resetFields();
  };

  const handleSave = async (values: any) => {
    const payload: any = {
      activated: 1,
      kode: values.kode,
      nama: values.nama,
    };

    try {
      await postSatuan(payload);
      const filterSatuan = refSatuan.filter(
        (item: any) => item.kode !== values.kode,
      );
      const satuan = [...filterSatuan, payload];
      notifAlert({
        type: "success",
        description: "Data satuan berhasil disimpan",
      });
      setTimeout(() => {
        dispatch(setStore({ satuan }));
      }, 100);
    } catch (error) {
      console.log(error);
    }

    setOpenModal(false);
  };

  return (
    <>
      <BreadCrumb routes={itemBreadcrumb} title="Satuan" />
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
        title={`${title} Satuan`}
        onCancel={() => setOpenModal(!openModal)}
        okText="Simpan"
        cancelText="Batal"
        onOk={() => form.submit()}>
        <Form
          form={form}
          key="formSatuan"
          name="formSatuan"
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
            rules={[{ required: true, message: "Nama tidak boleh kosong!" }]}>
            <Input placeholder="Nama" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default Satuan;
