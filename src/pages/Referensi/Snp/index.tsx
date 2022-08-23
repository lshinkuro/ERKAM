/** @format */

import React, { useState } from "react";
import { BreadCrumb } from "../../../components";
import { ExportToExcel } from "../../../components/Export/ExportToExcel";
import moment from "moment";
import "moment/locale/id";

import { Table, DatePicker, Tag, Space, Form, Modal, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import notifAlert from "../../../components/NotifAlert";
import {
  ButtonExport,
  ButtonTableDelete,
  ButtonTableEdit,
  ButtonTambah,
} from "../../../components/Button";
import InputSearch from "../../../components/InputSearch";
import {
  deleteSnp,
  postSnp,
} from "../../../services/v2/referenceservice/snpkegiatanservices";
import { setStore } from "../../../redux/actions";
import { uuidv4 } from "../../../utils/helper";

/**
 * Tampilan awal SNP
 */
function Snp() {
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Referensi" },
    { path: "/", breadcrumbName: "Program dan Kegiatan" },
  ];
  // const route = useHistory();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const auths = useSelector((state: any) => state.auth);
  const store = useSelector((state: any) => state.store);
  const auth = auths.data;
  const kodeRole = auth?.kode_role;
  const refSnp = store.snp || [];
  const refKegiatan = store.kegiatan || [];
  const refSubKegiatan = store.subKegiatan || [];
  const [search, setSearch] = useState<any>(null);

  const tableDataKegiatan = refKegiatan;
  const tableDataSubKegiatan = refSubKegiatan;

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [id, setID] = useState<any>(null);
  const [title, setTitle] = useState<any>("");
  const [openModal, setOpenModal] = useState(false);

  /** Filter Search */
  let dataTable: any = search
    ? refSnp.filter((item: any) => {
        const val = search.toLowerCase();
        return (
          (item.nama !== null &&
            (item.nama || "").toString().toLowerCase().includes(val)) ||
          (item.kode !== null &&
            (item.kode || "").toString().toLowerCase().includes(val)) ||
          (item.tahun !== null &&
            (item.tahun || "").toString().toLowerCase().includes(val))
        );
      })
    : refSnp;
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
      title: "Tahun",
      dataIndex: "tahun",
      key: "tahun",
      onFilter: (value, record) => record.tahun.indexOf(value) === 0,
      sorter: (a, b) => a.tahun - b.tahun,
    },
    {
      title: "Standar Pendidikan",
      dataIndex: "nama",
      key: "nama",
      onFilter: (value, record) => record.nama.indexOf(value) === 0,
      sorter: (a, b) => a.nama.length - b.nama.length,
    },
    {
      title: "Total Kegiatan",
      dataIndex: "total_kegiatan",
      key: "total_kegiatan",
      onFilter: (value, record) => record.total_kegiatan.indexOf(value) === 0,
      sorter: (a, b) => a.total_kegiatan - b.total_kegiatan,
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

  /**
   * Data untuk tabel children pertama
   */
  const columnSubKegiatanTmp = [
    {
      title: "Kode",
      dataIndex: "kode",
      key: "kode",
    },
    {
      title: "Tahun",
      dataIndex: "tahun",
      key: "tahun",
    },
    {
      title: "Nama Sub Kegiatan",
      key: "nama",
      dataIndex: "nama",
    },
    {
      title: "BOS",
      children: [
        {
          title: "Kode",
          key: "kode_bos",
          dataIndex: "kode_bos",
        },
        {
          title: "Komponen",
          key: "nama_bos",
          dataIndex: "nama_bos",
        },
      ],
    },
  ];

  /**
   * Set data untuk tabel children kedua
   */
  const columnKegiatanTmp = [
    {
      title: "Kode",
      dataIndex: "kode_kegiatan",
      key: "kode_kegiatan",
    },
    {
      title: "Tahun",
      dataIndex: "tahun",
      key: "tahun",
    },
    {
      title: "Kegiatan",
      key: "nama",
      render: (record) => record.kegiatan.nama,
    },
    {
      title: "Madrasah",
      key: "madrasah",
      render: (record) =>
        record.kegiatan.madrasah === "0" ? (
          <Tag color="default">Tidak Aktif</Tag>
        ) : (
          <Tag color="success">Aktif</Tag>
        ),
    },
    {
      title: "Ra",
      key: "ra",
      render: (record) =>
        record.kegiatan.ra === "0" ? (
          <Tag color="default">Tidak Aktif</Tag>
        ) : (
          <Tag color="success">Aktif</Tag>
        ),
    },
    {
      title: "Total Sub Kegiatan",
      dataIndex: "total_sub_kegiatan",
      key: "total_sub_kegiatan",
    },
  ];

  kodeRole !== "super_admin_pusat" &&
    kodeRole !== "admin_pusat" &&
    delete columnTmp[4];

  /**
   * Set ketika user menambahkan data SNP
   */
  function handleTambah() {
    setTitle("Tambah");
    setID(uuidv4());
    setOpenModal(true);
    form.resetFields();
  }

  /**
   * Set ketika user mengubah data SNP
   */
  const handleEdit = async (record) => {
    setTitle("Edit");
    setOpenModal(true);
    setID(record.id);
    form.setFieldsValue({
      nama: record.nama,
      kode: record.kode,
      tahun: moment(`${record.tahun}-01-01`),
    });
  };

  /**
   * Mengambil data isian user dan dikirim ke API
   */
  const handleSave = async (values: any) => {
    const payload: any = {
      id: id,
      tahun: moment(values.tahun).format("YYYY"),
      activated: 1,
      nama: values.nama,
      kode: values.kode,
    };

    const filterSnp = refSnp.filter((item: any) => !item.id.includes(id));

    try {
      const res = await postSnp(payload);
      const snp = [...filterSnp, res];
      notifAlert({
        type: "success",
        description: "Data berhasil disimpan",
      });
      setTimeout(() => {
        dispatch(setStore({ snp }));
      }, 100);
    } catch (error) {
      console.log(error);
    }

    setOpenModal(false);
  };

  /**
   * Set ketika user akan menghapus data SNP
   */
  const handleDelete = async (record: any) => {
    try {
      await deleteSnp(record.id);
      let snp = refSnp.filter((item: any) => item.id !== record.id);

      notifAlert({
        type: "success",
        description: "Hapus data berhasil",
      });

      setTimeout(() => {
        dispatch(setStore({ snp }));
      }, 100);
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Membuka baris kedua pada tabel dalam baris pertama
   */
  const expandedRowKegiatan = (kegiatanArr) => {
    const kegiatanTmp: any = tableDataKegiatan
      .filter((e) => e.kode_snp === kegiatanArr.kode)
      .filter((e) => e.tahun === kegiatanArr.tahun);
    return (
      <Table
        columns={columnKegiatanTmp}
        expandable={{
          expandedRowRender: (record) => expandedRowSubKegiatan(record),
        }}
        rowKey={(record) => record.id}
        dataSource={kegiatanTmp}
        pagination={false}
        bordered
      />
    );
  };

  /**
   * Membuka baris ketiga pada baris kedua pada tabel
   */
  const expandedRowSubKegiatan = (subKegiatanArr) => {
    let subKegiatanTmp: any = tableDataSubKegiatan
      .filter((e) => e.kode_kegiatan === subKegiatanArr.kode_kegiatan)
      .filter((e) => e.tahun === subKegiatanArr.tahun);
    return (
      <Table
        rowKey={(record) => record.id}
        columns={columnSubKegiatanTmp}
        dataSource={subKegiatanTmp}
        pagination={false}
        bordered
      />
    );
  };

  /**
   * Mengexport data pada tabel dalam bentuk excel
   */
  function ExportExcel() {
    var dt: any = [];
    dataTable.map((dataX: any) => {
      return tableDataKegiatan
        .filter((dataY: any) => dataY.kode_snp === dataX.kode)
        .map((dataZ: any) => {
          return tableDataSubKegiatan
            .filter(
              (dataXY: any) => dataXY.kode_kegiatan === dataZ.kode_kegiatan,
            )
            .map((dataZA: any) => {
              return dt.push({
                kode_snp: dataX.kode,
                snp: dataX.nama,
                kode_kegiatan: dataZ.kode_kegiatan,
                nama_kegiatan: dataZ.kegiatan.nama,
                kode_sub_kegiatan: dataZA.kode,
                sub_kegiatan: dataZA.nama,
                kode_bos: dataZA.kode_bos,
                komponen_bos: dataZA.nama_bos,
              });
            });
        });
    });

    ExportToExcel(dt, "standarnasional.xls");
    notifAlert({ type: "success", description: "Export Berhasil" });
  }

  const validateName = (_, values) => {
    const val = values.toLowerCase();

    const checkName: any =
      refSnp
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
      refSnp
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
      <BreadCrumb routes={itemBreadcrumb} title="Program dan Kegiatan" />
      <div className="m-5 p-5 bg-white shadow-md rounded">
        <div className="mb-4 flex justify-end">
          <div className="mr-4">
            <Space size={[8, 8]} wrap>
              {(kodeRole === "admin_pusat" ||
                kodeRole === "super_admin_pusat") && (
                <ButtonTambah onClick={handleTambah} />
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
              expandedRowRender: (record) => expandedRowKegiatan(record),
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
        title={`${title} Program dan Kegiatan`}
        onCancel={() => setOpenModal(!openModal)}
        okText="Simpan"
        cancelText="Batal"
        onOk={() => form.submit()}>
        <Form
          form={form}
          key="formKegiatan"
          name="formKegiatan"
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
            label="Tahun"
            name="tahun"
            rules={[{ required: true, message: "Tahun tidak boleh kosong!" }]}>
            <DatePicker picker="year" placeholder="Tahun" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default Snp;
