/** @format */

import React, { useState } from "react";
import BreadCrumb from "../../../components/BreadCrumb";
import { useHistory } from "react-router-dom";
import { ExportToExcel } from "../../../components/Export/ExportToExcel";
import logo from "../../../assets/img/user-profile.png";
import { EditOutlined, DownloadOutlined } from "@ant-design/icons";

import {
  Row,
  Col,
  Card,
  Avatar,
  Divider,
  Button,
  Typography,
  Table,
} from "antd";
import { baseURL } from "../../../utils/api";
import { useDispatch, useSelector } from "react-redux";
import notifAlert from "../../../components/NotifAlert";
import InputSearch from "../../../components/InputSearch";
import { getReferenceAll } from "../../../services/v2/referenceservice";
import { setStore } from "../../../redux/actions";
const { Text } = Typography;

/**
 *
 * @returns Tampilan menu profile madrasah
 */
const ProfilMadrasah = () => {
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Profil Madrasah" },
  ];

  const route = useHistory();
  const dispatch = useDispatch();
  const store = useSelector((state: any) => state.store);
  const profile: any = store.profile.madrasah || [];
  const provinsi: any = store.provinsi || [];
  const kabkota: any = store.kabkota || [];
  const kecamatan: any = store.kecamatan || [];
  const rekeningBelanja: any = store.rekeningBelanja || [];
  const stafMadrasah: any = store.roleUser || [];
  const [refKelurahan, setRefKelurahan] = useState<any>([]);

  const getData = async () => {
    const tmpKelurahan = store.kelurahan || [];
    if (tmpKelurahan.length) {
      setRefKelurahan(tmpKelurahan);
    } else {
      const kelurahan = await getReferenceAll("kelurahan", { activated: 1 });
      setRefKelurahan(kelurahan);
      setTimeout(() => {
        dispatch(setStore({ kelurahan }));
      }, 100);
    }
  };

  React.useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <BreadCrumb
        routes={itemBreadcrumb}
        title="Profil Madrasah"
        extra={[
          <Button
            type="primary"
            onClick={() => {
              route.push("/profile-madrasah/edit");
            }}
            key="3">
            <EditOutlined />
            Edit Profil
          </Button>,
        ]}
      />
      <div className="p-5">
        <div className="mb-4">
          <Row gutter={[16, 16]}>
            <Col
              className="gutter-row"
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 8 }}
              lg={{ span: 8 }}
              xl={{ span: 8 }}>
              <Card
                className="default w-full bg-green-500"
                title="Logo Madrasah"
                headStyle={{
                  background: "green",
                  textAlign: "center",
                  color: "#fff",
                  fontWeight: "bold",
                }}
                bodyStyle={{ background: "#d1fae5" }}>
                <div className="flex flex-col items-center justify-center">
                  <div className="mb-1">
                    <Avatar
                      shape="square"
                      size={{
                        xs: 150,
                        sm: 150,
                        md: 200,
                        lg: 200,
                        xl: 200,
                        xxl: 200,
                      }}
                      src={
                        profile?.avatar !== null
                          ? `${baseURL}/v2/user-services/logo/` + profile?.logo
                          : logo
                      }
                    />
                  </div>
                  <Divider />
                  <Button
                    type="primary"
                    onClick={() => route.push("/profile-madrasah/edit")}
                    block>
                    <EditOutlined /> Edit Profil
                  </Button>
                </div>
              </Card>
            </Col>
            <Col
              className="gutter-row"
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 16 }}
              lg={{ span: 16 }}
              xl={{ span: 16 }}>
              <Card
                className="default w-full bg-green-500"
                title="Informasi Madrasah"
                headStyle={{
                  background: "green",
                  color: "#fff",
                  fontWeight: "bold",
                }}
                bodyStyle={{ background: "#d1fae5" }}>
                <Row gutter={[8, 8]}>
                  <Col
                    xs={{ span: 12 }}
                    sm={{ span: 12 }}
                    md={{ span: 8 }}
                    xl={{ span: 8 }}>
                    <Text strong>Nama Lembaga:</Text>
                    <p>{profile?.nama}</p>
                  </Col>

                  <Col
                    xs={{ span: 12 }}
                    sm={{ span: 12 }}
                    md={{ span: 8 }}
                    xl={{ span: 8 }}>
                    <Text strong>Ketua Komite:</Text>
                    <p>
                      {profile?.nik_komite}
                      <br />
                      {profile?.nama_komite}
                    </p>
                  </Col>

                  <Col
                    xs={{ span: 12 }}
                    sm={{ span: 12 }}
                    md={{ span: 8 }}
                    xl={{ span: 8 }}>
                    <Text strong>NSM:</Text>
                    <p className="overflow-ellipsis overflow-hidden">
                      {profile?.nsm}
                    </p>
                  </Col>
                  <Col
                    xs={{ span: 12 }}
                    sm={{ span: 12 }}
                    md={{ span: 8 }}
                    xl={{ span: 8 }}>
                    <Text strong>PPK:</Text>
                    <p className="overflow-ellipsis overflow-hidden">
                      {profile.kode_level_ppk
                        ? (profile.kode_level_ppk === "kankemenag" &&
                            "Kantor Kementrian Agama") ||
                          (profile.kode_level_ppk === "kanwil" &&
                            "Kantor Wilayah") ||
                          (profile.kode_level_ppk === "madrasah" && "Madrasah")
                        : "-"}
                    </p>
                  </Col>
                  <Col
                    xs={{ span: 12 }}
                    sm={{ span: 12 }}
                    md={{ span: 8 }}
                    xl={{ span: 8 }}>
                    <Text strong>NPSN:</Text>
                    <p className="overflow-ellipsis overflow-hidden">
                      {profile?.npsn}
                    </p>
                  </Col>
                  <Col
                    xs={{ span: 12 }}
                    sm={{ span: 12 }}
                    md={{ span: 8 }}
                    xl={{ span: 8 }}>
                    <Text strong>Status:</Text>
                    <p className="overflow-ellipsis overflow-hidden">
                      {profile.status
                        ? (profile.status === "n" && "Negeri") ||
                          (profile.status === "s" && "Swasta")
                        : "-"}
                    </p>
                  </Col>
                  <Col
                    xs={{ span: 12 }}
                    sm={{ span: 12 }}
                    md={{ span: 8 }}
                    xl={{ span: 8 }}>
                    <Text strong>Jenjang:</Text>
                    <p className="overflow-ellipsis overflow-hidden">
                      {profile?.jenjang?.nama}
                    </p>
                  </Col>

                  <Col
                    xs={{ span: 12 }}
                    sm={{ span: 12 }}
                    md={{ span: 8 }}
                    xl={{ span: 8 }}>
                    <Text strong>Telepon:</Text>
                    <p className="overflow-ellipsis overflow-hidden">
                      {profile?.telp}
                    </p>
                  </Col>
                  <Col
                    xs={{ span: 12 }}
                    sm={{ span: 12 }}
                    md={{ span: 8 }}
                    xl={{ span: 8 }}>
                    <Text strong>Email:</Text>
                    <p className="overflow-ellipsis overflow-hidden">
                      {profile?.email}
                    </p>
                  </Col>
                  <Col
                    xs={{ span: 12 }}
                    sm={{ span: 12 }}
                    md={{ span: 8 }}
                    xl={{ span: 8 }}>
                    <Text strong>Website:</Text>
                    <p className="overflow-ellipsis overflow-hidden">
                      {profile?.website}
                    </p>
                  </Col>
                  <Col
                    xs={{ span: 12 }}
                    sm={{ span: 12 }}
                    md={{ span: 8 }}
                    xl={{ span: 8 }}>
                    <Text strong>NPWP:</Text>
                    <p className="overflow-ellipsis overflow-hidden">
                      {profile?.npwp}
                    </p>
                  </Col>
                  <Col
                    xs={{ span: 12 }}
                    sm={{ span: 12 }}
                    md={{ span: 8 }}
                    xl={{ span: 8 }}>
                    <Text strong>Provinsi:</Text>
                    <p>
                      {profile?.kode_provinsi
                        ? provinsi?.length &&
                          provinsi
                            .filter(
                              (e: any) => e.kode === profile?.kode_provinsi,
                            )
                            .map((e: any) => e.nama)
                        : ""}
                    </p>
                  </Col>
                  <Col
                    xs={{ span: 12 }}
                    sm={{ span: 12 }}
                    md={{ span: 8 }}
                    xl={{ span: 8 }}>
                    <Text strong>Kabupaten/Kota:</Text>
                    <p>
                      {profile?.kode_kabkota
                        ? kabkota?.length &&
                          kabkota
                            .filter(
                              (e: any) => e.kode === profile?.kode_kabkota,
                            )
                            .map((e: any) => e.nama)
                        : ""}
                    </p>
                  </Col>

                  <Col
                    xs={{ span: 12 }}
                    sm={{ span: 12 }}
                    md={{ span: 8 }}
                    xl={{ span: 8 }}>
                    <Text strong>Kecamatan:</Text>
                    <p>
                      {profile?.kode_kecamatan
                        ? kecamatan?.length &&
                          kecamatan
                            .filter(
                              (e: any) => e.kode === profile?.kode_kecamatan,
                            )
                            .map((e: any) => e.nama)
                        : ""}
                    </p>
                  </Col>

                  <Col
                    xs={{ span: 12 }}
                    sm={{ span: 12 }}
                    md={{ span: 8 }}
                    xl={{ span: 8 }}>
                    <Text strong>Kelurahan/Desa:</Text>
                    <p>
                      {profile?.kode_kelurahan
                        ? refKelurahan?.length &&
                          refKelurahan
                            .filter(
                              (e: any) => e.kode === profile.kode_kelurahan,
                            )
                            .map((e: any) => e.nama)
                        : ""}
                    </p>
                  </Col>

                  <Col
                    xs={{ span: 12 }}
                    sm={{ span: 12 }}
                    md={{ span: 8 }}
                    xl={{ span: 8 }}>
                    <Text strong>RT:</Text>
                    <p>{profile?.rt}</p>
                  </Col>
                  <Col
                    xs={{ span: 12 }}
                    sm={{ span: 12 }}
                    md={{ span: 8 }}
                    xl={{ span: 8 }}>
                    <Text strong>RW:</Text>
                    <p>{profile?.rw}</p>
                  </Col>
                  <Col
                    xs={{ span: 12 }}
                    sm={{ span: 12 }}
                    md={{ span: 8 }}
                    xl={{ span: 8 }}>
                    <Text strong>Kode Pos:</Text>
                    <p>{profile?.kode_pos}</p>
                  </Col>
                  <Col
                    xs={{ span: 12 }}
                    sm={{ span: 12 }}
                    md={{ span: 12 }}
                    xl={{ span: 12 }}>
                    <Text strong>Alamat Lengkap:</Text>
                    <p>{profile?.alamat_jalan}</p>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </div>
        <div className="mb-4">
          <Card
            headStyle={{
              background: "green",
              color: "#fff",
              fontWeight: "bold",
            }}
            bodyStyle={{ background: "#d1fae5" }}
            title="Daftar Pengurus Madrasah">
            <TableUser params={stafMadrasah} />
          </Card>
        </div>
        <div className="mb-4">
          <Card
            headStyle={{
              background: "green",
              color: "#fff",
              fontWeight: "bold",
            }}
            bodyStyle={{ background: "#d1fae5" }}
            title="Daftar Rekening Bank">
            <TableRekeningBank params={rekeningBelanja} />
          </Card>
        </div>
      </div>
    </>
  );
};

const TableUser = ({ params }) => {
  const [search, setSearch] = useState<any>(null);
  const tmpTableData: any = params;
  const [isLoadingExport, setIsLoadingExport] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  let tableData = search
    ? tmpTableData.filter((item: any) => {
        const val = search.toLowerCase();
        return (
          (item.profile.nama !== null &&
            (item.profile.nama || "").toLowerCase().includes(val)) ||
          (item.profile.nik !== null &&
            (item.profile.nik || "").toLowerCase().includes(val)) ||
          (item.profile.user.email !== null &&
            (item.profile.user.email || "").toLowerCase().includes(val)) ||
          (item.role.nama !== null &&
            (item.role.nama || "").toLowerCase().includes(val))
        );
      })
    : tmpTableData;
  /**
   * Filter Pagination
   */
  const totalDataTable: any = tableData.length;
  let tmpDataTable = tableData.filter((v, i) => {
    let start = pageSize * (page - 1);
    let end = start + pageSize;

    return i >= start && i < end;
  });

  function handleButtonExport() {
    setIsLoadingExport(true);
    try {
      let xls = tableData.map((el: any) => {
        return {
          NAMA: el.profile.nama,
          NIK: el.profile.nik,
          EMAIL: el.profile.user.email,
          ROLE: el.role.nama,
        };
      });
      ExportToExcel(xls, "daftar-pengurus-madrasah");
      notifAlert({ type: "success", description: "Data berhasil di export" });
    } catch (error) {
      notifAlert({ type: "error", description: "Data Gagal di export" });
    }
    setIsLoadingExport(false);
  }

  return (
    <>
      <div className="flex mb-3">
        <div className="flex-1">
          <InputSearch
            key="seacrhPengurus"
            placeholder="Cari..."
            onChange={(e: any) => setSearch(e.currentTarget.value)}
          />
        </div>
        <div className="flex-1 ">
          <div className="float-right">
            <Button
              key="butPengurus"
              type="default"
              loading={isLoadingExport}
              onClick={handleButtonExport}>
              <DownloadOutlined />
              Export
            </Button>
          </div>
        </div>
      </div>
      <Table
        rowKey={(record) => record.id}
        columns={columsDaftarPengurus}
        dataSource={tmpDataTable}
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
    </>
  );
};

const TableRekeningBank = ({ params }) => {
  const tmpTableData: any = params;
  const [search, setSearch] = useState<any>(null);
  const [isLoadingExport, setIsLoadingExport] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const tableData = search
    ? tmpTableData.filter((item: any) => {
        const val = search.toLowerCase();
        return (
          (item.kode_bank !== null &&
            (item.kode_bank || "").toLowerCase().includes(val)) ||
          (item.nama_bank !== null &&
            (item.nama_bank || "").toLowerCase().includes(val)) ||
          (item.no_rekening !== null &&
            (item.no_rekening || "").toLowerCase().includes(val)) ||
          (item.keterangan !== null &&
            (item.keterangan || "").toLowerCase().includes(val)) ||
          (item.no_rekening_nama !== null &&
            (item.no_rekening_nama || "").toLowerCase().includes(val)) ||
          (item.kode_tipe_rekening !== null &&
            (item.kode_tipe_rekening || "").toLowerCase().includes(val)) ||
          (item.cabang_bank !== null &&
            (item.cabang_bank || "").toLowerCase().includes(val))
        );
      })
    : tmpTableData;

  /**
   * Filter Pagination
   */
  const totalDataTable: any = tableData.length;
  let tmpDataTable = tableData.filter((v, i) => {
    let start = pageSize * (page - 1);
    let end = start + pageSize;

    return i >= start && i < end;
  });

  function handleButtonExport() {
    setIsLoadingExport(true);
    try {
      let xls = tableData.map((el: any) => {
        return {
          "KODE BANK": el.kode_bank,
          "NAMA BANK": el.nama_bank,
          CABANG: el.cabang_bank,
          "NO REKENING": el.no_rekening,
          "NAMA NO REKENING": el.no_rekening_nama,
          KETERANGAN: el.keterangan,
          "TIPE REKENING": el.kode_tipe_rekening,
        };
      });
      ExportToExcel(xls, "data-rekening-bank");
      notifAlert({ type: "success", description: "Data berhasil di export" });
    } catch (error) {
      notifAlert({ type: "error", description: "Data Gagal di export" });
    }
    setIsLoadingExport(false);
  }

  return (
    <>
      <div className="flex mb-3">
        <div className="flex-1">
          <InputSearch
            key="searhRekening"
            placeholder="Cari..."
            onChange={(e: any) => setSearch(e.currentTarget.value)}
          />
        </div>
        <div className="flex-1 ">
          <div className="float-right">
            <Button
              key="butRekBank"
              type="default"
              loading={isLoadingExport}
              onClick={handleButtonExport}>
              <DownloadOutlined />
              Export
            </Button>
          </div>
        </div>
      </div>
      <div className="">
        <Table
          rowKey={(record) => record.id}
          // scroll={{ x: 1500 }}
          columns={columsDaftarRekening}
          dataSource={tmpDataTable}
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
    </>
  );
};

/** Columns Daftar Pengurus */
const columsDaftarPengurus = [
  {
    title: "NIK",
    key: "nik",
    onFilter: (value, record) => record.profile.nik.indexOf(value) === 0,
    sorter: (a, b) => a.profile.nik - b.profile.nik,
    render: (record) => record.profile.nik,
  },
  {
    title: "NAMA",
    key: "nama",
    onFilter: (value, record) => record.profile.nama.indexOf(value) === 0,
    sorter: (a, b) => a.profile.nama.length - b.profile.nama.length,
    render: (record) => record.profile.nama,
  },
  {
    title: "EMAIL",
    key: "email",
    onFilter: (value, record) => record.profile.user.email.indexOf(value) === 0,
    sorter: (a, b) => a.profile.user.email.length - b.profile.user.email.length,
    render: (record) => record.profile.user.email,
  },
  {
    title: "ROLE",
    // dataIndex: "kode_role",
    key: "kode_role",
    onFilter: (value, record) => record.role.nama.indexOf(value) === 0,
    sorter: (a, b) => a.role.nama.length - b.role.nama.length,
    render: (record) => record.role.nama,
  },
];

/** Columns Daftar Rekening */
const columsDaftarRekening = [
  {
    title: "KODE BANK",
    dataIndex: "kode_bank",
    key: "kode_bank",
    onFilter: (value, record) => record.kode_bank.indexOf(value) === 0,
    sorter: (a, b) => a.kode_bank - b.kode_bank,
  },
  {
    title: "NAMA BANK",
    dataIndex: "nama_bank",
    key: "nama_bank",
    onFilter: (value, record) => record.nama_bank.indexOf(value) === 0,
    sorter: (a, b) => a.nama_bank.length - b.nama_bank.length,
  },
  {
    title: "CABANG",
    dataIndex: "cabang_bank",
    key: "cabang_bank",
    onFilter: (value, record) => record.cabang_bank.indexOf(value) === 0,
    sorter: (a, b) => a.cabang_bank.length - b.cabang_bank.length,
  },
  {
    title: "NO REKENING",
    dataIndex: "no_rekening",
    key: "no_rekening",
    onFilter: (value, record) => record.no_rekening.indexOf(value) === 0,
    sorter: (a, b) => a.no_rekening.length - b.no_rekening.length,
  },
  {
    title: "NAMA REKENING",
    dataIndex: "no_rekening_nama",
    key: "no_rekening_nama",
    onFilter: (value, record) => record.no_rekening_nama.indexOf(value) === 0,
    sorter: (a, b) => a.no_rekening_nama.length - b.no_rekening_nama.length,
  },
  {
    title: "KETERANGAN",
    dataIndex: "keterangan",
    key: "keterangan",
  },
  {
    title: "TIPE REKENING",
    dataIndex: "kode_tipe_rekening",
    key: "kode_tipe_rekening",
  },
];
export default ProfilMadrasah;
