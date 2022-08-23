/** @format */

import React, { useState } from "react";
import { BreadCrumb } from "../../../components";
import moment from "moment";
import "moment/locale/id";
import { Table, DatePicker, Input, Space, Form, Modal, Tag } from "antd";
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
  deleteTahun,
  postTahun,
} from "../../../services/v2/referenceservice/tahun";

const Tahun = () => {
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Referensi" },
    { path: "/", breadcrumbName: "Tahun" },
  ];
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const store = useSelector((state: any) => state.store);
  const auths = useSelector((state: any) => state.auth);
  const auth = auths.data || null;
  const kodeRole = auth?.kode_role;
  const refTahun = store.tahun || [];
  const [search, setSearch] = useState<any>(null);
  const [id, setID] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [title, setTitle] = useState<any>("");
  const [openModal, setOpenModal] = useState(false);

  /** Filter Search */
  let dataTable: any = search
    ? refTahun.filter((item: any) => {
        const val = search.toLowerCase();
        return (
          (item.nama !== null &&
            (item.nama || "").toString().toLowerCase().includes(val)) ||
          (item.tahun !== null &&
            (item.tahun || "").toString().toLowerCase().includes(val))
        );
      })
    : refTahun;
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
      title: "Tahun",
      dataIndex: "tahun",
      key: "tahun",
      onFilter: (value, record) => record.tahun.indexOf(value) === 0,
      sorter: (a, b) => a.tahun - b.tahun,
    },
    {
      title: "Nama",
      dataIndex: "nama",
      key: "nama",
      onFilter: (value, record) => record.nama.indexOf(value) === 0,
      sorter: (a, b) => a.nama.length - b.nama.length,
    },
    {
      title: "Status",
      dataIndex: "activated",
      key: "activated",
      onFilter: (value, record) => record.activated.indexOf(value) === 0,
      sorter: (a, b) => a.activated - b.activated,
      render: (activated) =>
        (activated === "0" && <Tag color="default">Tidak Aktif</Tag>) || (
          <Tag color="success">Aktif</Tag>
        ),
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

  kodeRole !== "super_admin_pusat" &&
    kodeRole !== "admin_pusat" &&
    delete columnTmp[3];

  const handleEdit = (record: any) => {
    setTitle("Edit");
    setOpenModal(true);
    setID(record.id);
    form.setFieldsValue({
      tahun: moment(`${record.tahun}-01-01`),
      nama: record.nama,
    });
  };

  const handleDelete = async (record: any) => {
    try {
      await deleteTahun(record.id);
      let tahun = refTahun.filter((item: any) => item.id !== record.id);

      notifAlert({
        type: "success",
        description: "Hapus data berhasil",
      });
      setTimeout(() => {
        dispatch(setStore({ tahun }));
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
      tahun: moment(values.tahun).format("YYYY"),
      activated: 1,
      nama: values.nama,
    };
    const filterTahun = refTahun.filter((item: any) => !item.id.includes(id));

    try {
      const res = await postTahun(payload);
      const tahun = [...filterTahun, res];
      notifAlert({
        type: "success",
        description: "Data berhasil disimpan",
      });
      setTimeout(() => {
        dispatch(setStore({ tahun }));
      }, 100);
    } catch (error) {
      console.log(error);
    }

    setOpenModal(false);
  };

  function disabledYear(current) {
    let listTahun: any = [];

    refTahun &&
      refTahun
        .filter((item) => !item.id.includes(id))
        .map((item) => listTahun.push(item.tahun));

    return listTahun.includes(current.year());
  }

  const validateName = (_, values) => {
    const val = values.toLowerCase();

    const checkName: any =
      refTahun
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

  return (
    <>
      <BreadCrumb routes={itemBreadcrumb} title="Tahun" />
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
        title={`${title} Tahun`}
        onCancel={() => setOpenModal(!openModal)}
        okText="Simpan"
        cancelText="Batal"
        onOk={() => form.submit()}>
        <Form
          form={form}
          key="formTahun"
          name="formTahun"
          layout="vertical"
          onFinish={handleSave}>
          <Form.Item
            label="Tahun"
            name="tahun"
            rules={[{ required: true, message: "Tahun tidak boleh kosong!" }]}>
            <DatePicker
              picker="year"
              disabledDate={disabledYear}
              placeholder="Tahun"
            />
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

export default Tahun;
