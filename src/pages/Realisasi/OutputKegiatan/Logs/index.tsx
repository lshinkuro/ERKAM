/** @format */

import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";

import { BreadCrumb } from "../../../../components";
import moment from "moment";
import "moment/locale/id";
import { Table, Badge } from "antd";
import { useSelector } from "react-redux";
import { getRealisasiOutputKegiatanLogs } from "../../../../services/v2/realizationservice/outputkegiatanservices";
import { toTitleCase } from "../../../../utils/helper";

const Logs = () => {
  const route = useHistory();
  const rincianData: any = route ? route.location.state : null;
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Realisasi" },
    { path: "/", breadcrumbName: "Output Kegiatan" },
    { path: "/", breadcrumbName: "Rincian" },
    { path: "/", breadcrumbName: "Log" },
  ];
  const store = useSelector((state: any) => state.store);
  const auths = useSelector((state: any) => state.auth);
  const refSumberDana = store.rencanaPendapatanDefinitif || [];
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
    let dataTmp = await getRealisasiOutputKegiatanLogs(auths.isTahun);
    dataTmp =
      dataTmp.length &&
      dataTmp.filter((item: any) =>
        item.outputKegiatan.rencana_kegiatan_id.includes(rincianData?.id),
      );
    setDataTable(dataTmp);
    setLoading(false);
  };

  useEffect(() => {
    if (rincianData === undefined) {
      route.goBack();
    } else {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rincianData]);

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
              (action === "Update" && "warning") ||
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
      title: "Sumber Dana",
      key: "sumberDana",
      render: (record) =>
        refSumberDana
          .filter((item: any) =>
            item.id.includes(record.outputKegiatan.rencana_pendapatan_id),
          )
          .map((item) => item.nama_sumber_dana),
    },
    {
      title: "Realisasi Output",
      key: "realisasiOutput",
      render: (record) =>
        record.outputKegiatan.qty_output +
        " " +
        rincianData?.indikator_output_satuan,
    },

    {
      title: "Tanggal Realisasi",
      key: "tanggalRealisasi",
      render: (record) =>
        record.outputKegiatan.tanggal_realisasi
          ? moment(record.outputKegiatan.tanggal_realisasi).format(
              "dddd,DD MMM YYYY HH:mm:ss",
            )
          : "-",
    },

    {
      title: "Status",
      key: "status",
      fixed: "right",
      render: (record) => (
        <>
          <Badge
            status={
              (record.outputKegiatan.kepala_madrasah_approved === "DISETUJUI" &&
                "success") ||
              (record.outputKegiatan.kepala_madrasah_approved ===
                "Menunggu Tanggal Realisasi" &&
                "processing") ||
              (record.outputKegiatan.kepala_madrasah_approved === "MENUNGGU" &&
                "warning") ||
              (record.outputKegiatan.kepala_madrasah_approved === "DITOLAK" &&
                "error") ||
              "default"
            }
            text={toTitleCase(record.outputKegiatan.kepala_madrasah_approved)}
          />
        </>
      ),
    },
  ];

  return (
    <>
      <BreadCrumb
        back={true}
        toBack={() => route.goBack()}
        routes={itemBreadcrumb}
        title={"Log Rincian Output Kegiatan"}
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
};

export default Logs;
