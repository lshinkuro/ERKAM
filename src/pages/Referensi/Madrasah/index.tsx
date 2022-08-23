/** @format */

import React, { useState, useEffect } from "react";
import { BreadCrumb } from "../../../components";
import { ExportToExcel } from "../../../components/Export/ExportToExcel";
import moment from "moment";
import "moment/locale/id";
import {
  Table,
  Space,
  Form,
  Modal,
  Input,
  Tooltip,
  Tag,
  Button,
  Descriptions,
} from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import notifAlert from "../../../components/NotifAlert";
import {
  getMadrasah,
  singleCode,
} from "../../../services/v2/usermanservice/madrasahservices";
import InputSearch from "../../../components/InputSearch";
import { ButtonExport } from "../../../components/Button";
import FilterMadrasah from "./FilterMadrasah";
import ModalSendMasal from "./ModalSendMasal";

const ReferensiMadrasah = () => {
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Referensi" },
    { path: "/", breadcrumbName: "Madrasah" },
  ];
  const [tableData, setTableData] = useState<any>([]);
  const [form] = Form.useForm();
  const store = useSelector((state: any) => state.store);
  const auths = useSelector((state: any) => state.auth);
  const refProvinsi = store.provinsi || [];
  const refKabkota = store.kabkota || [];
  const auth = auths.data || null;
  const kodeRole = auth?.kode_role;

  const [search, setSearch] = useState<any>(null);
  const [editData, setEditData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [filter, setFilter] = useState<any>({
    provinsi: null,
    kabkota: null,
    jenjang: [],
    status: null,
  });
  const [openModal, setOpenModal] = useState(false);
  const [openModalMasal, setOpenModalMasal] = useState(false);
  const [loading, setLoading] = useState(false);

  /** Filter Search */
  let dataTable: any = search
    ? tableData.filter((item: any) => {
        const val = search.toLowerCase();
        return (
          (item.nama !== null &&
            (item.nama || "").toString().toLowerCase().includes(val)) ||
          (item.npsn !== null &&
            (item.npsn || "").toString().toLowerCase().includes(val)) ||
          (item.email !== null &&
            (item.email || "").toString().toLowerCase().includes(val)) ||
          (item.kodeRegistrasi !== null &&
            (item.kodeRegistrasi || "")
              .toString()
              .toLowerCase()
              .includes(val)) ||
          (item.nsm !== null &&
            (item.nsm || "").toString().toLowerCase().includes(val))
        );
      })
    : tableData;
  dataTable =
    (filter.provinsi &&
      dataTable.filter((item) => item.kode_provinsi === filter.provinsi)) ||
    dataTable;
  dataTable =
    (filter.kabkota &&
      dataTable.filter((item) => item.kode_kabkota === filter.kabkota)) ||
    dataTable;
  dataTable =
    (filter.status &&
      dataTable.filter((item) => item.activated === filter.status)) ||
    dataTable;
  dataTable =
    (filter.jenjang.length &&
      dataTable.filter((item) => filter.jenjang.includes(item.jenjang.kode))) ||
    dataTable;
  const dataExport = dataTable;
  const totalDataTable = dataTable.length;
  /**
   * Filter Pagination
   */
  dataTable = dataTable.filter((v, i) => {
    let start = pageSize * (page - 1);
    let end = start + pageSize;

    return i >= start && i < end;
  });

  const columns: any = [
    {
      title: "Provinsi",
      dataIndex: "kode_provinsi",
      key: "kode_provinsi",
      width: 200,
      render: (kode_provinsi) =>
        refProvinsi
          .filter((item) => item.kode === kode_provinsi)
          .map((item) => item.nama),
    },
    {
      title: "Kab / Kota",
      dataIndex: "kode_kabkota",
      key: "kode_kabkota",
      width: 200,
      render: (kode_kabkota) =>
        refKabkota
          .filter((item) => item.kode === kode_kabkota)
          .map((item) => item.nama),
    },
    {
      title: "NSM",
      dataIndex: "nsm",
      key: "nsm",
      width: 200,
    },
    {
      title: "NPSN",
      dataIndex: "npsn",
      key: "npsn",
      width: 200,
    },
    {
      title: "Nama Madrasah",
      dataIndex: "nama",
      key: "nama",
      width: 200,
    },
    {
      title: "Jenjang",
      key: "kode",
      width: 200,
      render: (record) => record.jenjang.nama,
    },
    {
      title: "Kode Registrasi",
      dataIndex: "kodeRegistrasi",
      key: "kodeRegistrasi",
      width: 200,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 250,
    },
    {
      title: "Terakhir Terkirim",
      key: "tanggalKirim",
      width: 200,
      render: (record) =>
        record.activated === "1" &&
        moment(record.updated_at).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Status",
      dataIndex: "activated",
      key: "activated",
      width: 110,
      fixed: "right",
      align: "center",
      render: (activated) =>
        (activated === "0" && <Tag color="default">Tidak Aktif</Tag>) || (
          <Tag color="success">Aktif</Tag>
        ),
    },
    {
      title: "Aksi",
      key: "aksi",
      align: "center",
      width: 80,
      fixed: "right",
      render: (record) => (
        <Space>
          {record.activated === "0" && (
            <Tooltip title={"Kirim Kode Registrasi"}>
              <Button
                onClick={() => handleSendSingle(record)}
                style={{ background: "green", color: "white", borderRadius: 4 }}
                icon={<SendOutlined />}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const getData = async () => {
    setLoading(true);
    const res = await getMadrasah();
    setTableData(res);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleChange = (values) => {
    setFilter(values);
  };

  const handleSendSingle = (record: any) => {
    setOpenModal(true);
    setEditData(record);
    form.resetFields();
  };

  const handleExport = () => {
    try {
      let xls = dataExport.map((el: any) => {
        const prov = refProvinsi
          .filter((item) => item.kode === el.kode_provinsi)
          .map((item) => item.nama);
        const kab = refKabkota
          .filter((item) => item.kode === el.kode_kabkota)
          .map((item) => item.nama);
        return {
          NSM: el.nsm,
          "NAMA SEKOLAH": el.nama,
          PROVINSI: (prov.length && prov[0]) || null,
          KABUPATEN: (kab.length && kab[0]) || null,
          EMAIL: el.email,
        };
      });
      ExportToExcel(xls, "referensi-madrasah");

      notifAlert({
        type: "success",
        description: "Data berhasil di export",
      });
    } catch (error) {
      notifAlert({
        type: "error",
        description: "Data Gagal di export",
      });
    }
  };

  const handleSendRegistrasi = async (values: any) => {
    const namaProvinsi = refProvinsi
      .filter((item) => item.kode === editData?.kode_provinsi)
      .map((item) => item.nama);
    const namaKabkota = refKabkota
      .filter((item) => item.kode === editData?.kode_kabkota)
      .map((item) => item.nama);
    const payload = {
      nsm: editData?.nsm,
      namaSekolah: editData?.nama,
      namaProvinsi: (namaProvinsi.length && namaProvinsi[0]) || null,
      namaKabupaten: (namaKabkota.length && namaKabkota[0]) || null,
      email: values.email,
    };
    try {
      await singleCode(payload);
      notifAlert({
        type: "success",
        description:
          "Kami Telah Mengirimkan link Ke Alamat Email Yang Anda Masukkan untuk aktivasi akun anda",
      });
      getData();
    } catch (error) {
      console.log(error);
    }
    setOpenModal(false);
  };
  return (
    <>
      <BreadCrumb routes={itemBreadcrumb} title="Madrasah" />
      <FilterMadrasah handleChangeValues={handleChange} />
      <div className="m-5 p-5 bg-white shadow-md rounded">
        <div className="mb-4 flex justify-end">
          <div className="mr-4">
            <Space size={[8, 8]} wrap>
              {(kodeRole === "admin_pusat" ||
                kodeRole === "super_admin_pusat") && (
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={() => setOpenModalMasal(true)}>
                  Kirim Masal Reg Kode
                </Button>
              )}
              <ButtonExport onClick={handleExport} />
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
            columns={columns}
            scroll={{ x: "1300" }}
            dataSource={dataTable}
            loading={loading}
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
      <ModalSendMasal
        openModal={openModalMasal}
        handleClose={() => setOpenModalMasal(false)}
        data={tableData}
        handleLoad={getData}
        refProvinsi={refProvinsi}
        refKabkota={refKabkota}
      />
      <Modal
        key="sendSingle"
        visible={openModal}
        title={`Kirim Kode Registrasi Madrasah`}
        onCancel={() => setOpenModal(!openModal)}
        okText="Kirim"
        cancelText="Batal"
        onOk={() => form.submit()}>
        <Descriptions column={1} labelStyle={{ width: "25%" }}>
          <Descriptions.Item label="Nama">{editData?.nama}</Descriptions.Item>
          <Descriptions.Item label="NSM">{editData?.nsm}</Descriptions.Item>
          <Descriptions.Item label="Kode Registrasi">
            {editData?.kodeRegistrasi}
          </Descriptions.Item>
        </Descriptions>
        <Form
          key="formKirimRegistrasi"
          form={form}
          labelAlign="left"
          onFinish={handleSendRegistrasi}
          labelCol={{ span: 6 }}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Email Tidak Boleh Kosong!",
              },
              { type: "email", message: "Format penulisan email salah!" },
            ]}>
            <Input type="email" placeholder="Email" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ReferensiMadrasah;
