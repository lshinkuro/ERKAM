/** @format */

import React, { useState } from "react";
import { BreadCrumb } from "../../../components";
import { Table, Input, Space, Form, Modal, Tag, Switch } from "antd";
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
  deleteSumberDana,
  postSumberDana,
} from "../../../services/v2/referenceservice/sumberdanaservices";

const SumberDanaMadrasah = () => {
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Referensi" },
    { path: "/", breadcrumbName: "Sumber Dana Madrasah" },
  ];
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const store = useSelector((state: any) => state.store);
  const auths = useSelector((state: any) => state.auth);
  const auth = auths.data || null;
  const kodeRole = auth?.kode_role;
  const refSumberDana = store.sumberDana || [];
  const [search, setSearch] = useState<any>(null);
  const [id, setID] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [title, setTitle] = useState<any>("");
  const [openModal, setOpenModal] = useState(false);

  /** Filter Search */
  let dataTable: any = search
    ? refSumberDana.filter((item: any) => {
        const val = search.toLowerCase();
        return (
          (item.nama !== null &&
            (item.nama || "").toString().toLowerCase().includes(val)) ||
          (item.tahun !== null &&
            (item.tahun || "").toString().toLowerCase().includes(val))
        );
      })
    : refSumberDana;
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
      title: "Sumber Dana",
      dataIndex: "nama",
      width: 240,
      key: "nama",
      onFilter: (value, record) => record.nama.indexOf(value) === 0,
      sorter: (a, b) => a.nama.length - b.nama.length,
    },
    {
      title: "Madrasah Negeri",
      dataIndex: "madrasah_n",
      width: 100,
      key: "madrasah_n",
      onFilter: (value, record) => record.madrasah_n.indexOf(value) === 0,
      sorter: (a, b) => a.madrasah_n - b.madrasah_n,
      render: (madrasah_n) =>
        (madrasah_n === "0" && <Tag color="default">Tidak Aktif</Tag>) || (
          <Tag color="success">Aktif</Tag>
        ),
    },
    {
      title: "Madrasah Swasta",
      dataIndex: "madrasah_s",
      width: 100,
      key: "madrasah_s",
      onFilter: (value, record) => record.madrasah_s.indexOf(value) === 0,
      sorter: (a, b) => a.madrasah_s - b.madrasah_s,
      render: (madrasah_s) =>
        (madrasah_s === "0" && <Tag color="default">Tidak Aktif</Tag>) || (
          <Tag color="success">Aktif</Tag>
        ),
    },
    {
      title: "Ra",
      dataIndex: "ra",
      width: 100,
      key: "ra",
      onFilter: (value, record) => record.ra.indexOf(value) === 0,
      sorter: (a, b) => a.ra - b.ra,
      render: (ra) =>
        (ra === "0" && <Tag color="default">Tidak Aktif</Tag>) || (
          <Tag color="success">Aktif</Tag>
        ),
    },
    {
      title: "BOS",
      dataIndex: "bos",
      width: 100,
      key: "bos",
      onFilter: (value, record) => record.bos.indexOf(value) === 0,
      sorter: (a, b) => a.bos - b.bos,
      render: (bos) =>
        (bos === "0" && <Tag color="default">Tidak Aktif</Tag>) || (
          <Tag color="success">Aktif</Tag>
        ),
    },
    {
      title: "BKBA",
      dataIndex: "bkba",
      width: 100,
      key: "bkba",
      onFilter: (value, record) => record.bkba.indexOf(value) === 0,
      sorter: (a, b) => a.bkba - b.bkba,
      render: (bkba) =>
        (bkba === "0" && <Tag color="default">Tidak Aktif</Tag>) || (
          <Tag color="success">Aktif</Tag>
        ),
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
    delete columnTmp[6];

  const handleEdit = (record: any) => {
    setTitle("Edit");
    setOpenModal(true);
    setID(record.id);
    form.setFieldsValue({
      nama: record.nama,
      kode: record.kode,
      madrasah_n: record.madrasah_n === "1" ? true : false,
      madrasah_s: record.madrasah_s === "1" ? true : false,
      ra: record.ra === "1" ? true : false,
      bos: record.bos === "1" ? true : false,
      bkba: record.bkba === "1" ? true : false,
    });
  };

  const handleDelete = async (record: any) => {
    try {
      await deleteSumberDana(record.id);
      let sumberDana = refSumberDana.filter(
        (item: any) => item.id !== record.id,
      );

      notifAlert({
        type: "success",
        description: "Hapus data berhasil",
      });

      setTimeout(() => {
        dispatch(setStore({ sumberDana }));
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
      madrasah_n: values.madrasah_n ? "1" : "0",
      madrasah_s: values.madrasah_s ? "1" : "0",
      ra: values.ra ? "1" : "0",
      bos: values.bos ? "1" : "0",
      bkba: values.bkba ? "1" : "0",
    };
    const filterSumberDana = refSumberDana.filter(
      (item: any) => !item.id.includes(id),
    );

    try {
      const res = await postSumberDana(payload);
      const sumberDana = [...filterSumberDana, res];
      notifAlert({
        type: "success",
        description: "Data berhasil disimpan",
      });
      setTimeout(() => {
        dispatch(setStore({ sumberDana }));
      }, 100);
    } catch (error) {
      console.log(error);
    }

    setOpenModal(false);
  };

  const validateName = (_, values) => {
    const val = values.toLowerCase();

    const checkName: any =
      refSumberDana
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
      refSumberDana
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
      <BreadCrumb routes={itemBreadcrumb} title="Sumber Dana Madrasah" />
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
          <Form.Item
            label="Madrasah Negeri"
            name="madrasah_n"
            valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item
            label="Madrasah Swasta"
            name="madrasah_s"
            valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="Ra" name="ra" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="BOS" name="bos" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="BKBA" name="bkba" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SumberDanaMadrasah;
