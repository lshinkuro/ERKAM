/** @format */

import React, { useState, useEffect } from "react";
import { BreadCrumb } from "../.././../../../components";
import { useHistory } from "react-router-dom";
import { Table, Badge, Tag } from "antd";
import moment from "moment";
import "moment/locale/id";
import { getRencanaKegiatanIndikatifLogs } from "../../../../../services/v2/planningservice/rencanakegiatanindikatif";
import { useSelector } from "react-redux";

function BelanjaDefinitifLogs() {
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Rencana" },
    { path: "/", breadcrumbName: "Pagu Definitif" },
    { path: "/", breadcrumbName: "Belanja" },
    { path: "/", breadcrumbName: "Log" },
  ];

  const route = useHistory();
  const auth = useSelector((state: any) => state.auth);
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
  const getData = async () => {
    setLoading(true);
    const dataTmp = await getRencanaKegiatanIndikatifLogs({
      tahun: auth.isTahun,
    });
    setDataTable(dataTmp);
    setLoading(false);
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        (action === "add" && (
          <>
            <Badge status="success" text="Tambah" />
          </>
        )) ||
        (action === "update" && (
          <>
            <Badge status="warning" text="Ubah" />
          </>
        )) ||
        (action === "delete" && (
          <>
            <Badge status="error" text="Hapus" />
          </>
        )),
    },
    {
      title: "Dibuat Oleh",
      key: "createdByUsername",
      dataIndex: "createdByUsername",
    },
    {
      title: "Standar Nasional",
      key: "standarNasional",
      render: (record) => record.rencanaKegiatanIndikatif.nama_snp,
    },
    {
      title: "Kegiatan",
      key: "kegiatan",
      render: (record) => record.rencanaKegiatanIndikatif.nama_kegiatan,
    },
    {
      title: "Sub Kegiatan",
      key: "kegiatan",
      render: (record) => record.rencanaKegiatanIndikatif.nama_sub_kegiatan,
    },
    {
      title: "Mulai",
      key: "mulai",
      render: (record) =>
        record.rencanaKegiatanIndikatif.bulan_pelaksanaan_start &&
        moment(
          record.rencanaKegiatanIndikatif.tahun +
            "-" +
            record.rencanaKegiatanIndikatif.bulan_pelaksanaan_start +
            "-01",
        ).format("MMMM"),
    },
    {
      title: "Berakhir",
      key: "berakhir",
      render: (record) =>
        record.rencanaKegiatanIndikatif.bulan_pelaksanaan_end &&
        moment(
          record.rencanaKegiatanIndikatif.tahun +
            "-" +
            record.rencanaKegiatanIndikatif.bulan_pelaksanaan_end +
            "-01",
        ).format("MMMM"),
    },
    {
      title: "Sasaran",
      key: "sasaran",
      render: (record) =>
        record.rencanaKegiatanIndikatif.kelompok_sasaran.length &&
        record.rencanaKegiatanIndikatif.kelompok_sasaran.map((item: any) => {
          return (
            <Tag key={`${record.id}${item}`} color={"#00b1cc"}>
              {item}
            </Tag>
          );
        }),
    },
    {
      title: "Indikator Output",
      children: [
        {
          title: "Output",
          key: "indikatorOutput",
          render: (record) => record.rencanaKegiatanIndikatif.indikator_output,
        },
        {
          title: "Target",
          key: "indikatorTarget",
          render: (record) =>
            record.rencanaKegiatanIndikatif.indikator_output_target,
        },
        {
          title: "Satuan",
          key: "satuanOutput",
          render: (record) =>
            record.rencanaKegiatanIndikatif.indikator_output_satuan,
        },
      ],
    },
    {
      title: "Indikator Hasil",
      children: [
        {
          title: "Output",
          key: "indikatorHasil",
          render: (record) => record.rencanaKegiatanIndikatif.indikator_hasil,
        },
        {
          title: "Target",
          key: "targetHasil",
          render: (record) =>
            record.rencanaKegiatanIndikatif.indikator_hasil_target,
        },
        {
          title: "Satuan",
          key: "satuanHasil",
          render: (record) =>
            record.rencanaKegiatanIndikatif.indikator_hasil_satuan,
        },
      ],
    },
  ];
  return (
    <>
      <BreadCrumb
        back={true}
        toBack={() => route.goBack()}
        routes={itemBreadcrumb}
        title={"Log Belanja Definitif"}
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
}

export default BelanjaDefinitifLogs;
