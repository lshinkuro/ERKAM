/** @format */

/** @format */

import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { BreadCrumb } from "../../../../components";

import { formatRupiah } from "../../../../utils/helper";
import moment from "moment";
import "moment/locale/id";
import { Table, Badge } from "antd";
import { useSelector } from "react-redux";
import { getRealisasiPengembalianDanaLogs } from "../../../../services/v2/realizationservice/pengembaliandanaservices";

const LogRealisasiPengeluaranDana = () => {
  const route = useHistory();
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Realisasi" },
    { path: "/", breadcrumbName: "Pengembalian Dana" },
    { path: "/", breadcrumbName: "Log" },
  ];
  const store = useSelector((state: any) => state.store);
  const tmpTipeKas = store.tipeKas || [];
  const tmpSumberDana = store.rencanaPendapatanDefinitif || [];

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

  const getData = async () => {
    setLoading(true);
    const dataTmp = await getRealisasiPengembalianDanaLogs();
    console.log(dataTmp);
    setDataTable(dataTmp);
    setLoading(false);
  };

  useEffect(() => {
    getData();
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
      render: (action) => (
        <>
          <Badge
            status={
              (action === "Tambah" && "success") ||
              (action === "Edit" && "warning") ||
              (action === "Persetujuan" && "processing") ||
              (action === "Hapus" && "error") ||
              "default"
            }
            text={action}
          />
        </>
      ),
    },
    {
      title: "Dibuat Oleh",
      key: "username",
      dataIndex: "username",
    },
    {
      title: "No Nota",
      key: "noNota",
      render: (record) => record.logs.no_nota_format,
    },
    {
      title: "Sumber Dana",
      key: "sumberDana",
      render: (record) =>
        tmpSumberDana.length &&
        tmpSumberDana
          .filter((item: any) => item.id === record.logs.rencana_pendapatan_id)
          .map((item) => item.nama_sumber_dana),
    },
    {
      title: "Tipe Kas",
      key: "tipeKas",
      render: (record) =>
        tmpTipeKas.length &&
        tmpTipeKas
          .filter((item: any) => item.kode === record.logs.kode_tipe_kas)
          .map((item) => item.nama),
    },
    {
      title: "Keterangan",
      key: "keterangan",
      render: (record) => record.logs.keterangan,
    },
    {
      title: "Tanggal Nota",
      key: "tanggalNota",
      render: (record) =>
        record.logs.tanggal_nota
          ? moment(record.logs.tanggal_nota).format("dddd,DD MMM YYYY HH:mm:ss")
          : "-",
    },
    {
      title: "Tanggal Realisasi",
      key: "tanggalRealisasi",
      render: (record) =>
        record.logs.tanggal_realisasi
          ? moment(record.logs.tanggal_realisasi).format(
              "dddd,DD MMM YYYY HH:mm:ss",
            )
          : "-",
    },
    {
      title: "No Referensi",
      key: "nama_sumber_dana",
      render: (record) => record.logs.realisasi_no_referensi,
    },
    {
      title: "Jumlah",
      key: "Jumlah",
      align: "right",
      render: (record) => formatRupiah(record.logs.grand_total),
    },
    {
      title: "Status",
      fixed: "right",
      key: "nama_sumber_dana",
      render: (record) => (
        <>
          <Badge
            status={
              (record.logs.status === "Selesai" && "success") ||
              (record.logs.status === "Menunggu" && "warning") ||
              (record.logs.status === "Menunggu Tanggal Realisasi" &&
                "processing") ||
              (record.logs.status === "Tidak Disetujui" && "error") ||
              "default"
            }
            text={record.logs.status}
          />
        </>
      ),
    },
  ];
  return (
    <>
      <BreadCrumb
        routes={itemBreadcrumb}
        title="Log Pengembalian Dana"
        back={true}
        toBack={() => route.goBack()}
      />
      <div className="m-5 p-5 bg-white shadow-sm">
        <div className="w-full">
          <Table
            rowKey={(record) => record.id}
            columns={columns}
            loading={loading}
            tableLayout="auto"
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

export default LogRealisasiPengeluaranDana;
