/** @format */

import React, { useState } from "react";
import { BreadCrumb } from "../../../components";

import { Table, Input, Space, Form, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  ButtonTableDelete,
  ButtonTableEdit,
  ButtonTambah,
} from "../../../components/Button";
import notifAlert from "../../../components/NotifAlert";
import { uuidv4 } from "../../../utils/helper";
import InputSearch from "../../../components/InputSearch";
import { setStore } from "../../../redux/actions";
import {
  deletePenggunaanBos,
  postPenggunaanBos,
} from "../../../services/v2/referenceservice/penggunaanbos";
const KegiatanBos = () => {
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Referensi" },
    { path: "/", breadcrumbName: "Kegiatan BOS" },
  ];
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const store = useSelector((state: any) => state.store);
  const auths = useSelector((state: any) => state.auth);
  const auth = auths.data || null;
  const kodeRole = auth?.kode_role;
  const refPenggunaanBos = store.penggunaanBos || [];
  const [search, setSearch] = useState<any>(null);
  const [id, setID] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [title, setTitle] = useState<any>("");
  const [openModal, setOpenModal] = useState(false);

  /** Filter Search */
  let dataTable: any = search
    ? refPenggunaanBos.filter((item: any) => {
        const val = search.toLowerCase();
        return (
          (item.nama !== null &&
            (item.nama || "").toString().toLowerCase().includes(val)) ||
          (item.kode !== null &&
            (item.kode || "").toString().toLowerCase().includes(val))
        );
      })
    : refPenggunaanBos;
  const totalDataTable = dataTable.length;
  /**
   * Filter Pagination
   */
  dataTable = dataTable.filter((v, i) => {
    let start = pageSize * (page - 1);
    let end = start + pageSize;

    return i >= start && i < end;
  });

  const columnTmp: any = [
    {
      title: "Kode",
      dataIndex: "kode",
      key: "kode",
      width: 200,
      onFilter: (value, record) => record.kode.indexOf(value) === 0,
      sorter: (a, b) => a.kode.length - b.kode.length,
    },
    {
      title: "Nama",
      dataIndex: "nama",
      width: 240,
      key: "nama",
      onFilter: (value, record) => record.nama.indexOf(value) === 0,
      sorter: (a, b) => a.nama.length - b.nama.length,
    },
    {
      title: "Aksi",
      key: "aksi",
      align: "center",
      width: 120,
      fixed: "right",
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

  kodeRole !== "super_admin_pusat" &&
    kodeRole !== "admin_pusat" &&
    delete columnTmp[3];

  const handleEdit = (record: any) => {
    setTitle("Edit");
    setOpenModal(true);
    setID(record.id);
    form.setFieldsValue({
      nama: record.nama,
      kode: record.kode,
    });
  };

  const handleDelete = async (record: any) => {
    try {
      await deletePenggunaanBos(record.id);
      let penggunaanBos = refPenggunaanBos.filter(
        (item: any) => item.id !== record.id,
      );

      notifAlert({
        type: "success",
        description: "Hapus data berhasil",
      });

      setTimeout(() => {
        dispatch(setStore({ penggunaanBos }));
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
      nama: values.nama,
      kode: values.kode,
    };
    const filterKegiatanBos = refPenggunaanBos.filter(
      (item: any) => !item.id.includes(id),
    );

    try {
      const res = await postPenggunaanBos(payload);
      const penggunaanBos = [...filterKegiatanBos, res];
      notifAlert({
        type: "success",
        description: "Data berhasil disimpan",
      });
      setTimeout(() => {
        dispatch(setStore({ penggunaanBos }));
      }, 100);
    } catch (error) {
      console.log(error);
    }

    setOpenModal(false);
  };

  const validateName = (_, values) => {
    const val = values.toLowerCase();

    const checkName: any =
      refPenggunaanBos
        .filter((item) => !item.id.includes(id))
        .filter(
          (item) =>
            item.nama !== null &&
            (item.nama || "").toString().toLowerCase() === val,
        ) || null;
    if (checkName.length) {
      return Promise.reject("Nama Sudah Digunakan!");
    } else {
      return Promise.resolve();
    }
  };

  const validateKode = (_, values) => {
    const val = values.toLowerCase();

    const checkKode: any =
      refPenggunaanBos
        .filter((item) => !item.id.includes(id))
        .filter(
          (item) =>
            item.kode !== null &&
            (item.kode || "").toString().toLowerCase() === val,
        ) || null;
    if (checkKode.length) {
      return Promise.reject("Kode Sudah Digunakan!");
    } else {
      return Promise.resolve();
    }
  };
  return (
    <>
      <BreadCrumb routes={itemBreadcrumb} title="Kegiatan BOS" />
      <div className="m-5 p-5 bg-white shadow-md rounded">
        <div className="mb-4 flex justify-end">
          {(kodeRole === "admin_pusat" || kodeRole === "super_admin_pusat") && (
            <div className="mr-4">
              <ButtonTambah onClick={handleTambah} />
            </div>
          )}
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
        title={`${title} Sumber Dana`}
        onCancel={() => setOpenModal(!openModal)}
        okText="Simpan"
        cancelText="Batal"
        onOk={() => form.submit()}>
        <Form
          form={form}
          key="formSumberDana"
          name="formSumberDana"
          layout="vertical"
          onFinish={handleSave}>
          <Form.Item
            label="Kode"
            name="kode"
            rules={[
              { required: true, message: "Kode tidak boleh kosong!" },
              { validator: validateKode },
            ]}>
            <Input placeholder="Kode" />
          </Form.Item>
          <Form.Item
            label="Nama"
            name="nama"
            rules={[
              { required: true, message: "Nama tidak boleh kosong!" },
              { validator: validateName },
            ]}>
            <Input placeholder="Nama" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default KegiatanBos;
