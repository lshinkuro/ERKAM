/** @format */

import React, { useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { uuidv4 } from "../../../../utils/helper";
import {
  ButtonTableDelete,
  ButtonTableEdit,
  ButtonTambah,
} from "../../../../components/Button";
import notifAlert from "../../../../components/NotifAlert";
import { setStore } from "../../../../redux/actions";
import InputSearch from "../../../../components/InputSearch";
import { getUsermanAll } from "../../../../services/v2/usermanservice";
import {
  deleteUsers,
  editUsers,
  postUsers,
} from "../../../../services/v2/usermanservice/managementservices";

const Pengawas = () => {
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Pengaturan" },
    { path: "/", breadcrumbName: "Managemen User" },
    { path: "/", breadcrumbName: "Pengawas" },
  ];
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [search, setSearch] = useState<any>(null);
  const store = useSelector((state: any) => state.store);
  const authTmp = useSelector((state: any) => state.auth);
  const auth = authTmp?.data || null;
  const roleAuth = auth?.kode_role;
  const tmpUsers = store.users || [];
  const tmpRole = store.role || [];
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
        width: "100%",
        render: (kode_role) =>
          tmpRole.filter((e) => e.kode === kode_role).map((e) => e.nama),
      },
      {
        title: "Status",
        dataIndex: "activated",
        key: "status",
        fixed: "right",
        width: "100%",
        render: (activated) =>
          activated ? <Tag color="#87d068">Aktif</Tag> : <Tag>Tidak Aktif</Tag>,
      },
      {
        title: "Aksi",
        fixed: "right",
        width: "100%",
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
    ? tmpUsers.filter((item: any) => {
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
    : tmpUsers;

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
      await deleteUsers(record.id);
      const users = await getUsermanAll("management-user/get-user", {
        activated: 1,
        group: auth?.group_role,
      });

      setTimeout(() => {
        dispatch(setStore({ users }));
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
      nik: values.nik,
      password: values.password,
      email: values.email,
      nama: values.nama,
      activated: 1,
      kode_role: values.kodeRole,
      kode_kabkota: auth?.madrasah?.kode_kabkota,
      kode_provinsi: auth?.madrasah?.kode_provinsi,
      require_email: values.status ? 1 : 0,
      madrasah_id: auth?.madrasah?.id,
      kantor_kabkota_id: auth?.madrasah?.kantor_kabkota_id,
      kantor_provinsi_id: auth?.madrasah?.kantor_provinsi_id,
      kantor_pusat_id: auth?.madrasah?.kantor_pusat_id,
    };
    if (title === "Tambah") {
      try {
        await postUsers(payload);
        const users = await getUsermanAll("management-user/get-user", {
          activated: 1,
          group: auth?.group_role,
        });
        notifAlert({ type: "success", description: "Data berhasil disimpan" });
        setTimeout(() => {
          dispatch(setStore({ users }));
        }, 100);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await editUsers(id, payload);
        const users = await getUsermanAll("management-user/get-user", {
          activated: 1,
          group: auth?.group_role,
        });
        notifAlert({ type: "success", description: "Data berhasil disimpan" });
        setTimeout(() => {
          dispatch(setStore({ users }));
        }, 100);
      } catch (error) {
        console.log(error);
      }
    }

    handleReset();
    setIsLoading(false);
  };

  const handleReset = () => {
    form.resetFields();
    setOpenModalAction(false);
  };
  return (
    <>
      <BreadCrumb routes={itemBreadcrumb} title="Pengawas" />
      <div className="m-5 p-5 bg-white shadow-md rounded">
        <div className="mb-4 flex justify-end">
          {roleAuth === "bendahara_madrasah" ||
            (roleAuth === "kepala_madrasah" && (
              <div className="mr-4">
                <ButtonTambah
                  onClick={handleTambah}
                  disabled={tmpUsers.length === 8 ? true : false}
                />
              </div>
            ))}

          <InputSearch
            className="w-3/4"
            onChange={(e: any) => setSearch(e.currentTarget.value)}
          />
        </div>
        {/* <div className="w-full mb-4">
          <Alert message="Batasan staf madrasah 8 akun" type="info" showIcon />
        </div> */}
        <div className="w-full">
          <Table
            rowKey={(record) => record.id}
            columns={columns}
            dataSource={dataTable}
            bordered
            loading={isLoading}
            tableLayout="auto"
            scroll={{ x: "1300" }}
          />
        </div>
      </div>
      <Modal
        visible={openModalAction}
        title={`${title} Staf Madrasah`}
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
    key: "nik",
    width: "100%",
    onFilter: (value, record) => record.profile.nik.indexOf(value) === 0,
    sorter: (a, b) => a.profile.nik - b.profile.nik,
    render: (record) => record.profile.nik,
  },
  {
    title: "Nama",
    key: "nama",
    width: "100%",
    onFilter: (value, record) => record.profile.nama.indexOf(value) === 0,
    sorter: (a, b) => a.profile.nama - b.nama,
    render: (record) => record.profile.nama,
  },
  {
    title: "Email",
    key: "email",
    width: "100%",
    onFilter: (value, record) => record.profile.user.email.indexOf(value) === 0,
    sorter: (a, b) => a.profile.user.email - b.profile.user.email,
    render: (record) => record.profile.user.email,
  },
];

export default Pengawas;
