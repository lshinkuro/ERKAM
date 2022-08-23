/** @format */

import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Table, Badge, Tag } from "antd";
import moment from "moment";
import "moment/locale/id";
import { BreadCrumb } from "../../../../../../components";
import { getPlanningAll } from "../../../../../../services/v2/planningservice";

const RincianDefinitifLogs = () => {
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Rencana" },
    { path: "/", breadcrumbName: "Pagu Definitif" },
    { path: "/", breadcrumbName: "Belanja" },
    { path: "/", breadcrumbName: "Rincian" },
    { path: "/", breadcrumbName: "Log" },
  ];

  const route = useHistory();
  const location = useLocation<any>();
  const rencanaKegiatanID: any = location.state;
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [dataTable, setDataTable] = useState<any>([]);

  const totalDataTable: any = dataTable.length;
  let tmpDataTable = dataTable.filter((v, i) => {
    let start = pageSize * (page - 1);
    let end = start + pageSize;

    return i >= start && i < end;
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getData = async (rencanaKegiatanID) => {
    setLoading(true);
    const dataTmp = await getPlanningAll(
      "rencana-rincian-kegiatan-definitif/logs/rencana",
      {
        rencanaKegiatanId: rencanaKegiatanID,
      },
    );
    setDataTable(dataTmp);
    setLoading(false);
  };

  useEffect(() => {
    getData(rencanaKegiatanID);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rencanaKegiatanID]);

  /**
   * Data untuk tabel children pertama
   */
  let columns: any = [
    {
      title: "Tanggal",
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at) =>
        moment(created_at).format("dddd,DD MMM YYYY HH:mm:ss"),
    },
    {
      title: "Aksi",
      key: "action",
      dataIndex: "action",
      render: (action) =>
        (action === "new" && (
          <>
            <Badge status="success" text="Tambah" />
          </>
        )) ||
        (action === "edit" && (
          <>
            <Badge status="warning" text="Ubah" />
          </>
        )) ||
        (action === "delete" && (
          <>
            <Badge status="error" text="Hapus" />
          </>
        )) ||
        (action === "approve" && (
          <>
            <Badge status="processing" text="Approval" />
          </>
        )),
    },
    {
      title: "Dibuat Oleh",
      key: "createdByUsername",
      dataIndex: "createdByUsername",
    },
    {
      title: "Komponen",
      key: "komponen",
      render: (record) => record.rencanaRincianKegiatan.komponenBiayaNama,
    },
    {
      title: "Jenis Belanja",
      key: "akunBelanja",
      render: (record) => record.rencanaRincianKegiatan.namaJenisBelanja,
    },
    {
      title: "Pajak",
      key: "pajak",
      render: (record) => record.rencanaRincianKegiatan.pajak,
    },
    {
      title: "Tipe Pencairan",
      key: "tipePencairan",
      render: (record) => record.rencanaRincianKegiatan.tipePencairanNama,
    },
    {
      title: "Status",
      key: "status",
      render: (record) => {
        let color: any =
          (record.rencanaRincianKegiatan.status === "MENUNGGU" && "#ffca27") ||
          (record.rencanaRincianKegiatan.status === "DITOLAK" && "#f44436") ||
          (record.rencanaRincianKegiatan.status === "DISETUJUI" && "#008000");
        return <Tag color={color}> {record.rencanaRincianKegiatan.status}</Tag>;
      },
    },
  ];
  return (
    <>
      <BreadCrumb
        back={true}
        toBack={() => route.goBack()}
        routes={itemBreadcrumb}
        title={"Log Rincian Belanja Definitif"}
      />
      <div className="m-5 p-5 bg-white shadow-sm">
        <div className="w-full">
          <Table
            rowKey={(record) => record.id}
            columns={columns}
            loading={loading}
            dataSource={tmpDataTable}
            bordered
            scroll={{ x: "100vw" }}
            pagination={{
              total: totalDataTable,
              position: ["topRight", "bottomRight"],
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
    </>
  );
};

export default RincianDefinitifLogs;
