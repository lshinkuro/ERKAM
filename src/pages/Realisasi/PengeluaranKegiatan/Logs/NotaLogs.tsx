/** @format */

import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { BreadCrumb } from "../../../../components";
import { formatRupiah, toTitleCase } from "../../../../utils/helper";
import moment from "moment";
import "moment/locale/id";
import { Table, Badge } from "antd";
import { useSelector } from "react-redux";
import { getRealisasiRincianPengeluaranKegiatanLogs } from "../../../../services/v2/realizationservice/pengeluarankegiatanservices";

const LogsNotaPengeluaranKegiatan = () => {
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Realisasi" },
    { path: "/", breadcrumbName: "Pengeluaran Kegiatan" },
    { path: "/", breadcrumbName: "Nota" },
    { path: "/", breadcrumbName: "Log" },
  ];
  const route = useHistory();
  const dataState: any = route ? route.location.state : null;
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

  const getData = async () => {
    setLoading(true);
    const dataTmp = await getRealisasiRincianPengeluaranKegiatanLogs(
      auth.isTahun,
      dataState,
    );
    console.log(dataTmp);
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
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) =>
        moment(createdAt).format("dddd,DD MMM YYYY HH:mm:ss"),
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
      key: "createdByUsername",
      dataIndex: "createdByUsername",
    },
    {
      title: "No Nota",
      key: "noNota",
      render: (record) => record.biaya.noNotaFormat,
    },

    {
      title: "Sumber Dana",
      key: "sumberDana",
      render: (record) =>
        record.biaya?.biayaSumberDanas?.map((item) => item.namaSumberDana) ||
        "-",
    },
    {
      title: "Tipe Kas",
      key: "tipeKas",
      render: (record) =>
        record.biaya?.biayaSumberDanas?.map((item) => item.namaTipeKas) || "-",
    },
    {
      title: "Keterangan",
      key: "keterangan",
      render: (record) => record.biaya.keterangan,
    },
    {
      title: "Sub Total",
      key: "subTotal",
      render: (record) => formatRupiah(record.biaya.grandSubTotal),
    },
    {
      title: "Pajak",
      key: "pajak",
      render: (record) => formatRupiah(record.biaya.grandPajak),
    },
    {
      title: "Pajak Terhutang",
      key: "pajakTerhutang",
      render: (record) => formatRupiah(record.biaya.grandPajakTerutang),
    },
    {
      title: "Total",
      key: "total",
      render: (record) => formatRupiah(record.biaya.grandTotal),
    },
    {
      title: "Tanggal Nota",
      key: "tanggalNota",
      render: (record) =>
        record.biaya.tanggalNota
          ? moment(record.biaya.tanggalNota).format("dddd,DD MMM YYYY HH:mm:ss")
          : "-",
    },
    {
      title: "Tanggal Realisasi",
      key: "tanggalRealisasi",
      render: (record) =>
        record.biaya.tanggalRealisasi
          ? moment(record.biaya.tanggalRealisasi).format(
              "dddd,DD MMM YYYY HH:mm:ss",
            )
          : "-",
    },
    {
      title: "Status",
      fixed: "right",
      key: "status",
      render: (record) => (
        <>
          <Badge
            status={
              (record.biaya.status === "SELESAI" && "success") ||
              ((record.biaya.status === "MENUNGGU_DISETUJUI" ||
                record.biaya.status === "MENUNGGU" ||
                record.biaya.status === "MENUNGGU_REALISASI") &&
                "warning") ||
              (record.biaya.status === "DISETUJUI" && "processing") ||
              (record.biaya.status === "DITOLAK" && "error") ||
              "default"
            }
            text={record.biaya.status && toTitleCase(record.biaya.status)}
          />
        </>
      ),
    },
  ];

  const expandedRowRender = (record) => {
    const columnsExpand = [
      {
        title: "Kategori",
        dataIndex: "komponenBiayaKategori",
        key: "komponenBiayaKategori",
      },
      {
        title: "Nama",
        key: "komponenBiayaNama",
        dataIndex: "komponenBiayaNama",
      },
      {
        title: "Spesifikasi",
        key: "komponenBiayaSpesifikasi",
        dataIndex: "komponenBiayaSpesifikasi",
      },
      {
        title: "Satuan",
        key: "komponenBiayaSatuan",
        dataIndex: "komponenBiayaSatuan",
      },
      {
        title: "Kuantitas",
        key: "kuantitas",
        dataIndex: "kuantitas",
      },
      {
        title: "Harga Satuan",
        key: "hargaSatuan",
        dataIndex: "hargaSatuan",
        render: (hargaSatuan) => formatRupiah(hargaSatuan),
      },
      {
        title: "Biaya Pajak",
        key: "biayaPajak",
        children: [
          {
            title: "PPN",
            key: "biayaPpn",
            dataIndex: "biayaPpn",
            render: (biayaPpn) => formatRupiah(biayaPpn),
          },
          {
            title: "PPH21",
            key: "biayaPph21",
            dataIndex: "biayaPph21",
            render: (biayaPph21) => formatRupiah(biayaPph21),
          },
          {
            title: "PPH22",
            key: "biayaPph22",
            dataIndex: "biayaPph22",
            render: (biayaPph22) => formatRupiah(biayaPph22),
          },
          {
            title: "PPH23",
            key: "biayaPph23",
            dataIndex: "biayaPph23",
            render: (biayaPph23) => formatRupiah(biayaPph23),
          },
          {
            title: "Sub Total",
            key: "grandSubTotal",
            dataIndex: "grandSubTotal",
            render: (grandSubTotal) => formatRupiah(grandSubTotal),
          },
        ],
      },
      {
        title: "Total",
        key: "Total",
        children: [
          {
            title: "Pajak",
            key: "grandPajak",
            dataIndex: "grandPajak",
            render: (grandPajak) => formatRupiah(grandPajak),
          },
          {
            title: "Pajak Terhutang",
            key: "grandPajakTerutang",
            dataIndex: "grandPajakTerutang",
            render: (grandPajakTerutang) => formatRupiah(grandPajakTerutang),
          },
          {
            title: "Grand Total",
            key: "grandTotal",
            dataIndex: "grandTotal",
            render: (grandTotal) => formatRupiah(grandTotal),
          },
        ],
      },
    ];

    const dataExpand = record.biaya.biayaDetails || [];

    return (
      <Table
        columns={columnsExpand}
        dataSource={dataExpand}
        pagination={false}
        bordered
      />
    );
  };

  return (
    <>
      <BreadCrumb
        routes={itemBreadcrumb}
        title="Log Nota Realisasi Pengeluaran Kegiatan"
        back={true}
        toBack={() => route.goBack()}
      />
      <div className="m-5 p-5 bg-white shadow-sm">
        <div className="w-full">
          <Table
            expandable={{ expandedRowRender }}
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
export default LogsNotaPengeluaranKegiatan;
