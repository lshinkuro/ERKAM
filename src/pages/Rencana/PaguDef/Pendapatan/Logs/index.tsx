/** @format */

import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import moment from "moment";
import "moment/locale/id";
import { Table, Badge } from "antd";
import { BreadCrumb } from "../../../../../components";
import { formatRupiah } from "../../../../../utils/helper";
import { getRencanaPendapatanDefinitifLogs } from "../../../../../services/v2/planningservice/rencanapendapatandefinitif";

const PaguDefPendapatanLogs = () => {
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Rencana" },
    { path: "/", breadcrumbName: "Pagu Definitif" },
    { path: "/", breadcrumbName: "Pendapatan" },
    { path: "/", breadcrumbName: "Log" },
  ];
  const route = useHistory();
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [dataTable, setDataTable] = useState<any>([]);
  /**
   * Filter Pagination
   */
  const totalDataTable: any = dataTable.length;
  let tmpDataTable = dataTable.filter((v, i) => {
    let start = pageSize * (page - 1);
    let end = start + pageSize;

    return i >= start && i < end;
  });

  const getData = async () => {
    let dataTmp = await getRencanaPendapatanDefinitifLogs();
    setDataTable(dataTmp);
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
      render: (action) =>
        (action === "add" && (
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
        )),
    },
    {
      title: "Dibuat Oleh",
      key: "created_by_username",
      dataIndex: "created_by_username",
    },
    {
      title: "Sumber Dana",
      key: "nama_sumber_dana",
      render: (record) => record.logs.nama_sumber_dana,
    },
    {
      title: "Keterangan",
      key: "keterangan",
      render: (record) => record.logs.keterangan,
    },
    {
      title: "Jumlah",
      key: "Jumlah",
      align: "right",
      render: (record) => formatRupiah(record.logs.jumlah),
    },
  ];
  return (
    <>
      <BreadCrumb
        back={true}
        toBack={() => route.goBack()}
        routes={itemBreadcrumb}
        title={"Log Definitif Pendapatan"}
      />
      <div className="m-5 p-5 bg-white shadow-sm">
        <div className="w-full">
          <Table
            rowKey={(record) => record.id}
            columns={columns}
            dataSource={tmpDataTable}
            bordered
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
export default PaguDefPendapatanLogs;
