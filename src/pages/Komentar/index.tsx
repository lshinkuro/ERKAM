/** @format */

import React, { useState, useEffect } from "react";
import { BreadCrumb } from "../../components";
import {
  Table,
  Select,
  Space,
  Form,
  Modal,
  Input,
  Badge
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import notifAlert from "../../components/NotifAlert";
import { ButtonTableDelete, ButtonTableEdit } from "../../components/Button";
import InputSearch from "../../components/InputSearch";
import { getComments } from "../../services/v2/notificationservice/comment";

const Komentar = () => {
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Komentar" },
  ];
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const auths = useSelector((state: any) => state.auth);
  const store = useSelector((state: any) => state.store);
  const auth = auths.data;
  const kodeRole = auth?.kode_role;
  const [search, setSearch] = useState<any>(null);
  const [madrasah, setMadrasah] = useState<any>(null);
  const [menupage, setMenupage] = useState<any>(null);

  const [tableData, setTableData] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [id, setID] = useState<any>(null);
  const [title, setTitle] = useState<any>("");
  const [action, setAction] = useState<any>("");
  const [openModal, setOpenModal] = useState(false);

  /** Filter Search */
  let dataTable: any = search
    ? tableData.filter((item: any) => {
        const val = search.toLowerCase();
        return (
          (item.kodeRole !== null &&
            (item.kodeRole || "").toString().toLowerCase().includes(val)) ||
          (item.message !== null &&
            (item.message || "").toString().toLowerCase().includes(val))
        );
      })
    : tableData;
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
      title: "User Role",
      dataIndex: "kodeRole",
      key: "kodeRole",
      onFilter: (value, record) => record.kodeRole.indexOf(value) === 0,
      sorter: (a, b) => a.kodeRole - b.kodeRole,
    },
    {
      title: "Madrasah",
      dataIndex: "madrasahId",
      key: "madrasahId",
      onFilter: (value, record) => record.madrasahId.indexOf(value) === 0,
      sorter: (a, b) => a.madrasahId.length - b.madrasahId.length,
    },
    {
      title: "Menu Page",
      dataIndex: "menuPage",
      key: "menuPage",
    },
    {
      title: "Komentar",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Status",
      dataIndex: "notificationStatus",
      key: "notificationStatus",
      width: 180,
      render: (notificationStatus) => (
        <Badge
          status={
            (notificationStatus === "READ" && "success") ||
            (notificationStatus === "NOT_READ" && "error") ||
            "default"
          }
          text={
            notificationStatus === "NOT_READ" ? "Belum Dibaca" : "Sudah Dibaca"
          }
        />
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

  const handleEdit = (record: any) => {};

  const handleDelete = async (record: any) => {};

  const handleSave = async (record: any) => {};

  const getData = async () => {
    try {
      const res = await getComments();
      console.log(res);
      setTableData(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <BreadCrumb routes={itemBreadcrumb} title="Komentar" />
      <div className="m-5 p-5 bg-white shadow-md rounded">
        <div className="mb-4 flex justify-end">
          <div className="mr-4">
            <Space size={[8, 8]} wrap>
              {(kodeRole === "admin_pusat" ||
                kodeRole === "super_admin_pusat") && (
                // <Dropdown overlay={menuAdd} placement="bottomLeft">
                //   <Button type="primary" icon={<PlusOutlined />}>
                //     Tambah <DownOutlined />
                //   </Button>
                // </Dropdown>
                <></>
              )}
            </Space>
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
        title={`${title} ${action} Belanja`}
        onCancel={() => setOpenModal(!openModal)}
        okText="Simpan"
        cancelText="Batal"
        onOk={() => form.submit()}>
        <Form
          form={form}
          key="formBelanja"
          name="formBelanja"
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
          {action === "Jenis" && (
            <>
              <Form.Item
                label="Kategori Belanja"
                name="kategori"
                rules={[
                  {
                    required: true,
                    message: "Kategori Belanja tidak boleh kosong!",
                  },
                ]}>
                {/* <Select placeholder="Kategori Belanja" showSearch>
                  {refKategoriBelanja.length &&
                    refKategoriBelanja.map((item) => (
                      <Select.Option key={item} value={item.kode}>
                        {item.nama}
                      </Select.Option>
                    ))}
                </Select> */}
              </Form.Item>
              <Form.Item
                label="Keterangan"
                name="deskripsi"
                rules={[
                  {
                    required: true,
                    message: "Keterangan tidak boleh kosong!",
                  },
                ]}>
                <Input.TextArea placeholder="Keterangan" />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default Komentar;
