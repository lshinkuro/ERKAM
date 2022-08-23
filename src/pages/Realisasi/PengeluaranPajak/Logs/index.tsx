/** @format */

import React, { useState, useEffect } from "react";
import { BreadCrumb } from "../../../../components";
import { useHistory } from "react-router-dom";
import { formatRupiah } from "../../../../utils/helper";
import moment from "moment";
import "moment/locale/id";
import { Table, Badge } from "antd";
import { useSelector } from "react-redux";
import { getRealisasiPengeluaranPajakLogs } from "../../../../services/v2/realizationservice/pengeluaranpajakservices";

function Logs() {
  const route = useHistory();
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Realisasi" },
    { path: "/", breadcrumbName: "Pengeluaran Pajak" },
    { path: "/", breadcrumbName: "Log" },
  ];
  const store = useSelector((state: any) => state.store);
  const refTipeKas: any = store.tipeKas || [];
  const refPajak: any = store.pajak || [];
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
    let dataTmp = await getRealisasiPengeluaranPajakLogs();
    setDataTable(dataTmp);
  };

  useEffect(() => {
    getData();
  }, []);

  const expandedRowRender = (record) => {
    const tmpNota = record.logs.no_nota_format;
    const columns = [
      {
        title: "Jenis Pajak",
        dataIndex: "jenispajak",
        key: "jenispajak",
        render: (jenispajak) =>
          refPajak.filter((e) => e.kode === jenispajak).map((e) => e.nama),
      },
      {
        title: "No Nota",
        key: "nonota",
        dataIndex: "nonota",
      },
      {
        title: "Total",
        key: "total",
        dataIndex: "total",
        render: (total) => formatRupiah(total),
      },
    ];
    const dataExpand = record.logs.pajak_details.map((e) => {
      let x: any = {
        jenispajak: record.logs.kode_pajak,
        nonota: tmpNota,
        total: e.grandTotal,
      };
      return x;
    });

    return (
      <Table
        columns={columns}
        dataSource={dataExpand}
        pagination={false}
        bordered
      />
    );
  };
  return (
    <>
      <BreadCrumb
        back={true}
        toBack={() => route.goBack()}
        routes={itemBreadcrumb}
        title={"Log Pengeluaran Pajak"}
      />
      <div className="m-5 p-5 bg-white shadow-sm">
        <div className="w-full">
          <Table
            expandable={{ expandedRowRender }}
            rowKey={(record) => record.id}
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
            scroll={{ x: 1900 }}>
            <Table.Column
              title="Tanggal"
              align="center"
              key="createAt"
              dataIndex="createAt"
              render={(createdAt) =>
                moment(createdAt).format("dddd,DD MMM YYYY HH:mm:ss")
              }
            />
            <Table.Column
              title="Aksi"
              align="center"
              key="action"
              dataIndex="action"
              render={(action) => (
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
              )}
            />
            <Table.Column
              title="Dibuat Oleh"
              align="center"
              key="username"
              dataIndex="username"
            />
            <Table.Column
              title="Jenis Pajak"
              align="center"
              key="id"
              render={(record) =>
                record.logs.kode_pajak
                  ? refPajak
                      .filter((e) => e.kode === record.logs.kode_pajak)
                      .map((e) => e.nama)
                  : ""
              }
            />
            <Table.Column
              title="Sumber Dana"
              key="id"
              align="center"
              render={(record) => record.logs.nama_sumber_dana}
            />
            <Table.Column
              title="Tipe Kas"
              key="id"
              align="center"
              render={(record) =>
                record.logs.kode_tipe_kas
                  ? refTipeKas
                      .filter((e) => e.kode === record.logs.kode_tipe_kas)
                      .map((e) => e.nama)
                  : ""
              }
            />
            <Table.Column
              title="Keterangan"
              key="id"
              align="center"
              render={(record) =>
                record.logs.keterangan ? record.logs.keterangan : ""
              }
            />
            <Table.Column
              title="Tanggal Nota"
              key="id"
              align="center"
              render={(record) =>
                record.logs.tanggal_nota
                  ? moment(record.logs.tanggal_nota).format(
                      "dddd,DD MMM YYYY HH:mm:ss",
                    )
                  : ""
              }
            />
            <Table.Column
              title="Tanggal Realisasi"
              key="id"
              align="center"
              render={(record) =>
                record.logs.tanggal_realisasi
                  ? moment(record.logs.tanggal_realisasi).format(
                      "dddd,DD MMM YYYY HH:mm:ss",
                    )
                  : "-"
              }
            />
            <Table.Column
              title="No Referensi"
              key="id"
              align="center"
              render={(record) =>
                record.logs.realisasi_no_referensi
                  ? record.logs.realisasi_no_referensi
                  : "-"
              }
            />
            <Table.Column
              title="Jumlah"
              key="id"
              align="right"
              render={(record) =>
                record.logs.grand_total
                  ? formatRupiah(record.logs.grand_total)
                  : ""
              }
            />
            <Table.Column
              title="Status"
              key="id"
              fixed="right"
              align="center"
              render={(record) => (
                <>
                  <Badge
                    status={
                      (record.logs.status === "Menunggu" && "warning") ||
                      (record.logs.status === "Selesai" && "success") ||
                      (record.logs.status === "Tidak Disetujui" && "error") ||
                      (record.logs.status === "Menunggu Tanggal Realisasi" &&
                        "processing") ||
                      "default"
                    }
                    text={record.logs.status}
                  />
                </>
              )}
            />
          </Table>
        </div>
      </div>
    </>
  );
}
export default Logs;
