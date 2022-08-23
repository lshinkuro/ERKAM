/** @format */

import React, { useState } from "react";
import { BreadCrumb } from "../../../components";
import { ExportToExcel } from "../../../components/Export/ExportToExcel";

import {
  Table,
  Select,
  Space,
  Form,
  Modal,
  Input,
  Menu,
  Dropdown,
  Button,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import notifAlert from "../../../components/NotifAlert";
import {
  ButtonExport,
  ButtonTableDelete,
  ButtonTableEdit,
} from "../../../components/Button";
import { DownOutlined, PlusOutlined } from "@ant-design/icons";
import InputSearch from "../../../components/InputSearch";
import { setStore } from "../../../redux/actions";
import { uuidv4 } from "../../../utils/helper";
import {
  deleteJenisBelanja,
  deleteKategoriBelanja,
  postJenisBelanja,
  postKategoriBelanja,
} from "../../../services/v2/referenceservice/jenisbelanja";

const JenisBelanja = () => {
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Referensi" },
    { path: "/", breadcrumbName: "Jenis Belanja" },
  ];

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const auths = useSelector((state: any) => state.auth);
  const store = useSelector((state: any) => state.store);
  const auth = auths.data;
  const kodeRole = auth?.kode_role;
  const [search, setSearch] = useState<any>(null);
  const refJenisBelanja = store.jenisBelanja || [];
  const refKategoriBelanja = store.kategoriBelanja || [];
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [id, setID] = useState<any>(null);
  const [title, setTitle] = useState<any>("");
  const [action, setAction] = useState<any>("");
  const [openModal, setOpenModal] = useState(false);

  /** Filter Search */
  let dataTable: any = search
    ? refKategoriBelanja.filter((item: any) => {
        const val = search.toLowerCase();
        return (
          (item.nama !== null &&
            (item.nama || "").toString().toLowerCase().includes(val)) ||
          (item.kode !== null &&
            (item.kode || "").toString().toLowerCase().includes(val))
        );
      })
    : refKategoriBelanja;
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
      onFilter: (value, record) => record.kode.indexOf(value) === 0,
      sorter: (a, b) => a.kode - b.kode,
    },
    {
      title: "Kategori",
      dataIndex: "nama",
      key: "nama",
      onFilter: (value, record) => record.nama.indexOf(value) === 0,
      sorter: (a, b) => a.nama.length - b.nama.length,
    },
    {
      title: "Total Jenis Belanja",
      dataIndex: "total_jenis_belanja",
      key: "total_jenis_belanja",
      onFilter: (value, record) =>
        record.total_jenis_belanja.indexOf(value) === 0,
      sorter: (a, b) =>
        a.total_jenis_belanja.length - b.total_jenis_belanja.length,
    },
    {
      title: "Aksi",
      key: "aksi",
      align: "center",
      width: 120,
      fixed: "right",
      render: (record) => (
        <Space>
          <ButtonTableEdit onClick={() => handleEdit(record, "kategori")} />
          <ButtonTableDelete
            onClick={() => {
              Modal.confirm({
                title: "Perhatian",
                content: "Yakin Hapus Data?",
                onOk() {
                  return handleDelete(record, "kategori");
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

  /**
   * Data untuk tabel children pertama
   */
  const columnJenisTmp: any = [
    {
      title: "Kode",
      dataIndex: "kode",
      key: "kode",
    },
    {
      title: "Jenis Belanja",
      dataIndex: "nama",
      key: "nama",
    },
    {
      title: "Keterangan",
      dataIndex: "deskripsi",
      key: "deskripsi",
    },
    {
      title: "Aksi",
      key: "aksi",
      align: "center",
      width: 120,
      fixed: "right",
      render: (record) => (
        <Space>
          <ButtonTableEdit onClick={() => handleEdit(record, "jenis")} />
          <ButtonTableDelete
            onClick={() => {
              Modal.confirm({
                title: "Perhatian",
                content: "Yakin Hapus Data?",
                onOk() {
                  return handleDelete(record, "jenis");
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
    delete columnTmp[3] &&
    delete columnJenisTmp[3];

  /**
   * Membuka baris kedua pada tabel dalam baris pertama
   */
  const expandedRowJenis = (jenisArr: any) => {
    let jenisTmp: any = jenisArr.list_jenis_belanja || [];
    return (
      <Table
        rowKey={(record) => record.id}
        columns={columnJenisTmp}
        dataSource={jenisTmp}
        pagination={false}
        bordered
      />
    );
  };

  const handleDelete = async (record: any, action: string) => {
    if (action === "kategori") {
      try {
        await deleteKategoriBelanja(record.id);
        let kategoriBelanja = refKategoriBelanja.filter(
          (item: any) => item.id !== record.id,
        );

        notifAlert({
          type: "success",
          description: "Hapus data berhasil",
        });

        setTimeout(() => {
          dispatch(setStore({ kategoriBelanja }));
        }, 100);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await deleteJenisBelanja(record.id);
        let tmpKategoriBelanja: any = null;
        let tmpJenisBelanja: any = [];
        refKategoriBelanja.length &&
          refKategoriBelanja
            .filter((item: any) => item.kode === record.kode_kategori)
            // eslint-disable-next-line array-callback-return
            .map((item: any) => {
              tmpKategoriBelanja = { ...item };
              tmpJenisBelanja = item.list_jenis_belanja;
            });
        const filterTmpJenis = tmpJenisBelanja.filter(
          (item) => !item.id.includes(record.id),
        );
        const newKategori: any = {
          ...tmpKategoriBelanja,
          list_jenis_belanja: filterTmpJenis,
          total_jenis_belanja: filterTmpJenis.length,
        };
        handleUpdateJenisBelanja(newKategori);
        notifAlert({
          type: "success",
          description: "Hapus data berhasil",
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleUpdateJenisBelanja = (kategoriData: any) => {
    let filterKategoriBelanja = refKategoriBelanja.filter(
      (item: any) => !item.id.includes(kategoriData?.id),
    );
    const kategoriBelanja = [...filterKategoriBelanja, kategoriData];
    setTimeout(() => {
      dispatch(setStore({ kategoriBelanja }));
    }, 100);
  };

  const handleEdit = (record: any, action: string) => {
    setTitle("Edit");
    setID(record.id);

    if (action === "kategori") {
      setAction("Kategori");
      setOpenModal(true);
      form.setFieldsValue({ kode: record.kode, nama: record.nama });
    } else {
      setAction("Jenis");
      setOpenModal(true);
      form.setFieldsValue({
        kode: record.kode,
        nama: record.nama,
        deskripsi: record.deskripsi,
        kategori: record.kode_kategori,
      });
    }
  };
  /**
   * Mengexport data pada tabel dalam bentuk excel
   */
  function ExportExcel() {
    var dt: any = [];
    // eslint-disable-next-line array-callback-return
    refKategoriBelanja.map((item: any) => {
      item.list_jenis_belanja.map((items) => {
        return dt.push({
          kode_kategori: item.kode,
          kategori: item.nama,
          kode_jenis: items.kode,
          jenis: items.nama,
          deskripsi: items.deskripsi,
        });
      });
    });

    ExportToExcel(dt, "jenis_belanja");
  }

  const handleSave = async (values: any) => {
    if (action === "Kategori") {
      const payload = {
        id: id,
        kode: values.kode,
        nama: values.nama,
        activated: "1",
      };
      const filterKategoriBelanja = refKategoriBelanja.filter(
        (item) => !item.id.includes(id),
      );
      try {
        const res = await postKategoriBelanja(payload);
        const listJenis =
          refJenisBelanja.filter((item) => item.kode_kategori === res.kode) ||
          [];
        const tmpRes = {
          ...res,
          total_jenis_belanja: listJenis.length,
          list_jenis_belanja: listJenis,
        };
        const kategoriBelanja = [...filterKategoriBelanja, tmpRes];
        notifAlert({
          type: "success",
          description: "Data berhasil disimpan",
        });
        setTimeout(() => {
          dispatch(setStore({ kategoriBelanja }));
        }, 100);
      } catch (error) {
        console.log(error);
      }
    } else {
      const payload = {
        id: id,
        activated: "1",
        kode: values.kode,
        nama: values.nama,
        kode_kategori: values.kategori,
        deskripsi: values.deskripsi,
      };

      try {
        const res = await postJenisBelanja(payload);
        let listJenis: any =
          refJenisBelanja.filter(
            (item) => item.kode_kategori === res.kode_kategori,
          ) || [];
        listJenis =
          listJenis.length && listJenis.filter((item) => !item.id.includes(id));
        const tmpList = [...listJenis, res];
        let filterKategori: any = null;
        refKategoriBelanja
          .filter((item) => item.kode === res.kode_kategori)
          .map((item) => (filterKategori = item));
        const newKategori = {
          ...filterKategori,
          total_jenis_belanja: tmpList.length,
          list_jenis_belanja: tmpList,
        };
        handleUpdateJenisBelanja(newKategori);
        notifAlert({
          type: "success",
          description: "Data berhasil disimpan",
        });
        console.log(payload);
      } catch (error) {
        console.log(error);
      }
    }
    setOpenModal(false);
  };

  const validateName = (_, values) => {
    const val = values.toLowerCase();
    const tmpData =
      action === "Kategori" ? refKategoriBelanja : refJenisBelanja;
    const checkName: any =
      tmpData
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
    const tmpData =
      action === "Kategori" ? refKategoriBelanja : refJenisBelanja;
    const checkKode: any =
      tmpData
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
  const handleTambah = (action: any) => {
    setOpenModal(true);
    setTitle("Tambah");
    setID(uuidv4());
    setAction(action);
    form.resetFields();
  };

  const menuAdd = () => (
    <Menu>
      <Menu.Item key={uuidv4()} onClick={() => handleTambah("Kategori")}>
        Kategori Belanja
      </Menu.Item>
      <Menu.Item key={uuidv4()} onClick={() => handleTambah("Jenis")}>
        Jenis Belanja
      </Menu.Item>
    </Menu>
  );
  return (
    <>
      <BreadCrumb routes={itemBreadcrumb} title="Jenis Belanja" />
      <div className="m-5 p-5 bg-white shadow-md rounded">
        <div className="mb-4 flex justify-end">
          <div className="mr-4">
            <Space size={[8, 8]} wrap>
              {(kodeRole === "admin_pusat" ||
                kodeRole === "super_admin_pusat") && (
                <Dropdown overlay={menuAdd} placement="bottomLeft">
                  <Button type="primary" icon={<PlusOutlined />}>
                    Tambah <DownOutlined />
                  </Button>
                </Dropdown>
              )}
              <ButtonExport onClick={ExportExcel} />
            </Space>
          </div>
          <InputSearch
            className="w-3/4"
            onChange={(e: any) => setSearch(e.currentTarget.value)}
          />
        </div>
        <div className="w-full">
          <Table
            expandable={{
              expandedRowRender: (record) => expandedRowJenis(record),
            }}
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
                <Select placeholder="Kategori Belanja" showSearch>
                  {refKategoriBelanja.length &&
                    refKategoriBelanja.map((item) => (
                      <Select.Option key={item} value={item.kode}>
                        {item.nama}
                      </Select.Option>
                    ))}
                </Select>
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

export default JenisBelanja;
