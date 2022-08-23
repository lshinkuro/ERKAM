/** @format */

import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { BreadCrumb } from "../../../../components";
import { formatRupiah } from "../../../../utils/helper";
import { Table, Badge } from "antd";
import moment from "moment";
import "moment/locale/id";
import { useSelector } from "react-redux";
import { getRealisasiPendapatanLogs } from "../../../../services/v2/realizationservice/pendapatanservices";

function LogRealisasiPendapatan() {
  const route = useHistory();

  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Realisasi" },
    { path: "/", breadcrumbName: "Pendapatan" },
    { path: "/", breadcrumbName: "Log" },
  ];
  // const [dataTable, setDataTable]: any = React.useState<any>([]);

  const store = useSelector((state: any) => state.store);
  const refRekeningBelanja = store.rekeningBelanja || [];
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
    const dataTmp = await getRealisasiPendapatanLogs();
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
      render: (action) => (
        <>
          <Badge
            status={
              (action === "Tambah" && "success") ||
              (action === "Persetujuan" && "processing") ||
              (action === "Edit" && "warning") ||
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
      key: "nonota",
      render: (record) => record.logs.no_nota_format,
    },
    {
      title: "Sumber Dana",
      key: "sumberDana",
      render: (record) => record.logs.rencana_pendapatan_name,
    },
    {
      title: "Tipe Kas",
      key: "tipeKas",
      render: (record) => record.logs.nama_tipe_kas,
    },
    {
      title: "No Rekening",
      key: "noRekening",
      render: (record) =>
        refRekeningBelanja
          .filter((item: any) => item.id.includes(record.logs.rekening_bank_id))
          .map((item) => item.no_rekening),
    },
    {
      title: "Nama Bank",
      key: "namaBank",
      render: (record) => record.logs.nama_rekening_bank,
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
      key: "noReferensi",
      render: (record) => record.logs.keterangan,
    },
    {
      title: "Jumlah",
      key: "jumlah",
      render: (record) => formatRupiah(record.logs.jumlah),
    },
    {
      title: "Status",
      key: "status",
      fixed: "right",
      render: (record) => (
        <>
          <Badge
            status={
              (record.logs.status === "Selesai" && "success") ||
              (record.logs.status === "Menunggu Tanggal Realisasi" &&
                "processing") ||
              (record.logs.status === "Menunggu" && "warning") ||
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
        title="Log Realisasi Pendapatan"
        back={true}
        toBack={() => route.goBack()}
      />
      <div className="m-5 p-5 bg-white shadow-sm">
        <div className="w-full">
          <Table
            rowKey={(record) => record.id}
            columns={columns}
            loading={loading}
            dataSource={tmpDataTable}
            bordered
            scroll={{ x: "130vw" }}
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

export default LogRealisasiPendapatan;
