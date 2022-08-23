/** @format */

import React, { useState, useEffect } from "react";
import { BreadCrumb } from "../../../../components";
import {
  Table,
  Select,
  Modal,
  Space,
  Button,
  Form,
  Input,
  Switch,
  Tag,
} from "antd";
import { useSelector } from "react-redux";
import { uuidv4 } from "../../../../utils/helper";
import {
  ButtonTableDelete,
  ButtonTableEdit,
  ButtonTambah,
} from "../../../../components/Button";
import notifAlert from "../../../../components/NotifAlert";
import InputSearch from "../../../../components/InputSearch";
import { getUsermanAll } from "../../../../services/v2/usermanservice";
import {
  deleteUsers,
  editUsers,
  postUsers,
} from "../../../../services/v2/usermanservice/managementservices";

const Provinsi = () => {
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Pengaturan" },
    { path: "/", breadcrumbName: "Managemen User" },
    { path: "/", breadcrumbName: "Kanwil" },
  ];
  const [form] = Form.useForm();
  const [search, setSearch] = useState<any>(null);
  const store = useSelector((state: any) => state.store);
  const authTmp = useSelector((state: any) => state.auth);
  const auth = authTmp?.data || null;
  const kodeRole = auth?.kode_role || null;
  const refProvinsi = store.provinsi || [];
  const [tmpRole, setTmpRole] = useState<any>([]);
  const [isLoading, setLoading] = useState(false);
  const [openModalAction, setOpenModalAction] = useState(false);
  const [tableData, setTableData] = useState<any>([]);
  const [title, setTitle] = useState("");
  const [id, setID] = useState("");

  const getData = async () => {
    setLoading(true);
    const res = await getUsermanAll("management-user/get-user", {
      activated: 1,
      group: "provinsi",
    });
    const refRole = await getUsermanAll("role", {
      activated: 1,
      group: "provinsi",
    });
    setTmpRole(refRole || []);
    setTableData(res || []);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const dataTable = search
    ? tableData.filter((item: any) => {
        const val = search.toLowerCase();
        return (
          (item.kode_role !== null &&
            (item.kode_role || "").toLowerCase().includes(val)) ||
          (item.profile.nik !== null &&
            (item.profile.nik || "").toLowerCase().includes(val)) ||
          (item.profile.nama !== null &&
            (item.profile.nama || "").toLowerCase().includes(val)) ||
          (item.profile.user.email !== null &&
            (item.profile.user.email || "").toLowerCase().includes(val))
        );
      })
    : tableData;

  function handleEdit(record: any) {
    setOpenModalAction(true);
    setTitle("Edit");
    setID(record.id);
    form.setFieldsValue({
      kodeRole: record.kode_role,
      nama: record.profile.nama,
      nik: record.profile.nik,
      status: record.profile.user.valid_email,
      email: record.profile.user.email,
      provinsi: record.kode_provinsi,
    });
  }

  const handleTambah = () => {
    setOpenModalAction(true);
    setTitle("Tambah");
    setID(uuidv4());
    form.resetFields();
  };

  const handleDelete = async (record: any) => {
    setLoading(true);
    try {
      await deleteUsers(record.id);
      getData();
      notifAlert({ type: "success", description: "Data berhasil dihapus" });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleSave = async (values: any) => {
    setLoading(true);
    let payload: any = {
      nik: values.nik,
      password: values.password,
      email: values.email,
      nama: values.nama,
      activated: 1,
      kode_role: values.kodeRole,
      kode_provinsi: values.provinsi,
      require_email: values.status ? 1 : 0,
    };
    if (title === "Tambah") {
      try {
        await postUsers(payload);
        getData();
        notifAlert({ type: "success", description: "Data berhasil disimpan" });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await editUsers(id, payload);
        getData();
        notifAlert({ type: "success", description: "Data berhasil disimpan" });
      } catch (error) {
        console.log(error);
      }
    }

    handleReset();
    setLoading(false);
  };

  const handleReset = () => {
    form.resetFields();
    setOpenModalAction(false);
  };

  const columns: any = [
    {
      title: "Provinsi",
      key: "provinsi",
      width: 200,
      onFilter: (value, record) => record.profile.nama.indexOf(value) === 0,
      sorter: (a, b) => a.profile.nama - b.nama,
      render: (record) => record.profile.nama,
    },
    {
      title: "Nama",
      key: "nama",
      width: 200,
      onFilter: (value, record) => record.profile.nama.indexOf(value) === 0,
      sorter: (a, b) => a.profile.nama - b.nama,
      render: (record) => record.profile.nama,
    },
    {
      title: "Username",
      key: "nik",
      width: 200,
      onFilter: (value, record) => record.profile.nik.indexOf(value) === 0,
      sorter: (a, b) => a.profile.nik - b.profile.nik,
      render: (record) => record.profile.nik,
    },
    {
      title: "Email",
      key: "email",
      width: 300,
      onFilter: (value, record) =>
        record.profile.user.email.indexOf(value) === 0,
      sorter: (a, b) => a.profile.user.email - b.profile.user.email,
      render: (record) => record.profile.user.email,
    },
    {
      title: "Role",
      key: "kode_role",
      width: 180,
      render: (record) => <Tag>{record.role.nama || "-"}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "activated",
      key: "status",
      fixed: "right",
      width: 120,
      render: (activated) =>
        activated ? <Tag color="#87d068">Aktif</Tag> : <Tag>Tidak Aktif</Tag>,
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
  return (
    <>
      <BreadCrumb routes={itemBreadcrumb} title="Kanwil" />
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
            columns={columns}
            dataSource={dataTable}
            bordered
            loading={isLoading}
            scroll={{ x: "1300" }}
          />
        </div>
      </div>
      <Modal
        visible={openModalAction}
        title={`${title} Kanwil`}
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
          <div>
            <Form.Item
              label="Provinsi"
              name="provinsi"
              rules={[
                { required: true, message: "Provinsi tidak boleh kosong!" },
              ]}>
              <Select
                showSearch
                optionFilterProp="children"
                placeholder="Pilih Provinsi">
                {refProvinsi?.length &&
                  refProvinsi.map((e: any, i: any) => {
                    return (
                      <Select.Option key={`prov${i}`} value={e.kode}>
                        {e.nama}
                      </Select.Option>
                    );
                  })}
              </Select>
            </Form.Item>
          </div>
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

export default Provinsi;
