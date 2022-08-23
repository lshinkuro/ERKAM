/** @format */

import React, { useState } from "react";
import { BreadCrumb } from "../../../components";
import {
  Table,
  Select,
  Modal,
  Space,
  Button,
  Form,
  Input,
  Switch,
  Alert,
  Tag,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { uuidv4 } from "../../../utils/helper";
import {
  ButtonTableDelete,
  ButtonTableEdit,
  ButtonTambah,
} from "../../../components/Button";
import notifAlert from "../../../components/NotifAlert";
import { setStore } from "../../../redux/actions";
import InputSearch from "../../../components/InputSearch";

const StaffMadrasah = () => {
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Pengaturan" },
    { path: "/", breadcrumbName: "Managemen User" },
    { path: "/", breadcrumbName: "Staf Madrasah" },
  ];
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [search, setSearch] = useState<any>(null);
  const store = useSelector((state: any) => state.store);
  const authTmp = useSelector((state: any) => state.auth);
  const auth = authTmp.data || [];

  const roleAuth = auth?.kode_role || null;
  const tmpRole = store.role || [];
  const tmpStafMadrasah = store.stafMadrasah || [];
  const [isLoading, setIsLoading] = useState(false);
  const [openModalAction, setOpenModalAction] = useState(false);
  const [title, setTitle] = useState("");
  const [id, setID] = useState("");
  let columns: any = columnTmp || [];

  if (roleAuth === "kepala_madrasah" || roleAuth === "bendahara_madrasah") {
    columns = [
      ...columns,
      {
        title: "Role",
        dataIndex: "kode_role",
        key: "kode_role",
        render: (kode_role) =>
          tmpRole.filter((e) => e.kode === kode_role).map((e) => e.nama),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        fixed: "right",
        width: 100,
        render: (status) =>
          status ? <Tag color="green">Aktif</Tag> : <Tag>Tidak Aktif</Tag>,
      },
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
    ? tmpStafMadrasah.filter((item: any) => {
        const val = search.toLowerCase();
        return (
          (item.kode_role !== null &&
            (item.kode_role || "").toLowerCase().includes(val)) ||
          (item.nik !== null && (item.nik || "").toLowerCase().includes(val)) ||
          (item.nama !== null &&
            (item.nama || "").toLowerCase().includes(val)) ||
          (item.email !== null &&
            (item.email || "").toLowerCase().includes(val))
        );
      })
    : tmpStafMadrasah;

  function handleEdit(record: any) {
    setOpenModalAction(true);
    setTitle("Ubah");
    setID(record.id);
    form.setFieldsValue({
      kodeRole: record.kode_role,
      nama: record.nama,
      nik: record.nik,
      status: record.status,
      email: record.email,
    });
  }

  const handleTambah = () => {
    setOpenModalAction(true);
    setTitle("Tambah");
    setID(uuidv4());
    form.resetFields();
  };

  const handleDelete = async (record: any) => {
    setIsLoading(true);
    try {
      const stafMadrasah = tmpStafMadrasah.filter(
        (item: any) => !item.id.includes(record.id),
      );

      setTimeout(() => {
        dispatch(setStore({ stafMadrasah }));
      }, 100);
      notifAlert({ type: "success", description: "Data berhasil dihapus" });
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const handleSave = async (values: any) => {
    setIsLoading(true);
    let payload: any = {
      id: id,
      nik: values.nik,
      nama: values.nama,
      kode_role: values.kodeRole,
      password: values.password,
      email: values.email,
      status: values.status,
      tahun: auth.isTahun,
      activated: 1,
    };

    let filterStafMadrasah = tmpStafMadrasah.filter(
      (item: any) => !item.id.includes(id),
    );

    try {
      const stafMadrasah = [...filterStafMadrasah, payload];
      setTimeout(() => {
        dispatch(setStore({ stafMadrasah }));
      }, 100);
      notifAlert({ type: "success", description: "Data berhasil disimpan" });
    } catch (error) {
      console.log(error);
    }
    setOpenModalAction(false);
    setIsLoading(false);
  };

  return (
    <>
      <BreadCrumb routes={itemBreadcrumb} title="Staf Madrasah" />
      <div className="m-5 p-5 bg-white shadow-md rounded">
        <div className="mb-4 flex justify-end">
          {roleAuth === "bendahara_madrasah" ||
            (roleAuth === "kepala_madrasah" && (
              <div className="mr-4">
                <ButtonTambah
                  onClick={handleTambah}
                  disabled={tmpStafMadrasah.length === 8 ? true : false}
                />
              </div>
            ))}

          <InputSearch
            className="w-3/4"
            onChange={(e: any) => setSearch(e.currentTarget.value)}
          />
        </div>
        <div className="w-full mb-4">
          <Alert message="Batasan staf madrasah 8 akun" type="info" showIcon />
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
        title={`${title} Staf Madrasah`}
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
          <Form.Item
            label="Role"
            name="kodeRole"
            rules={[{ required: true, message: "Role tidak boleh kosong!" }]}>
            <Select
              showSearch
              optionFilterProp="children"
              placeholder="Pilih Role">
              {tmpRole?.length &&
                tmpRole
                  .filter((item: any) => !item.kode.includes("kepala_madrasah"))
                  .map((e: any, i: any) => {
                    return (
                      <Select.Option key={`role${i}`} value={e.kode}>
                        {e.nama}
                      </Select.Option>
                    );
                  })}
            </Select>
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
            label="NIK"
            name="nik"
            rules={[
              {
                required: true,
                message: "NIK tidak boleh kosong!",
              },
            ]}>
            <Input type="number" placeholder="NIK" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                type: "email",
                message: "Email tidak valid!",
              },
              {
                required: true,
                message: "Email tidak boleh kosong!",
              },
            ]}>
            <Input type="email" placeholder="Email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Password tidak boleh kosong!",
              },
            ]}>
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item label="Status" name="status" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

const columnTmp: any = [
  {
    title: "NIK",
    dataIndex: "nik",
    key: "nik",
    onFilter: (value, record) => record.nik.indexOf(value) === 0,
    sorter: (a, b) => a.nik - b.nik,
  },
  {
    title: "Nama",
    dataIndex: "nama",
    key: "nama",
    onFilter: (value, record) => record.nama.indexOf(value) === 0,
    sorter: (a, b) => a.nama - b.nama,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    onFilter: (value, record) => record.email.indexOf(value) === 0,
    sorter: (a, b) => a.email - b.email,
  },
];

export default StaffMadrasah;
