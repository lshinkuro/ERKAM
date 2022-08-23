/** @format */

import React, { useState } from "react";
import { useHistory } from "react-router";
import { BreadCrumb } from "../../../../components";

import { Table, Space, Tag } from "antd";
import { ButtonTableDetail } from "../../../../components/Button";
import InputSearch from "../../../../components/InputSearch";
import { useSelector } from "react-redux";

const OutputKegiatanList = () => {
  const route = useHistory();
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Realisasi" },
    { path: "/", breadcrumbName: "Output Kegiatan" },
    { path: "/", breadcrumbName: "List" },
  ];
  const [search, setSearch] = useState<any>(null);
  const store = useSelector((state: any) => state.store);
  const tmpRealisasiOutputKegiatan = store.realisasiOutputKegiatan || [];
  const tmpRencanaKegiatanDefinitif = store.rencanaKegiatanDefinitif || [];
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  /** Filter Search */
  let dataTable: any = search
    ? tmpRencanaKegiatanDefinitif.filter((item: any) => {
        const val = search.toLowerCase();
        return (
          (item.nama_snp !== null &&
            (item.nama_snp || "").toString().toLowerCase().includes(val)) ||
          (item.nama_kegiatan !== null &&
            (item.nama_kegiatan || "")
              .toString()
              .toLowerCase()
              .includes(val)) ||
          (item.nama_sub_kegiatan !== null &&
            (item.nama_sub_kegiatan || "")
              .toString()
              .toLowerCase()
              .includes(val))
        );
      })
    : tmpRencanaKegiatanDefinitif;
  let totalDataTable = dataTable.length;

  /**
   * Filter Pagination
   */
  dataTable = dataTable.filter((v, i) => {
    let start = pageSize * (page - 1);
    let end = start + pageSize;

    return i >= start && i < end;
  });

  /**
   * Data untuk tabel children pertama
   */
  let columns: any = [
    {
      title: "Standar Nasional",
      dataIndex: "nama_snp",
      key: "nama_snp",
      width: "100%",
      onFilter: (value, record) => record.nama_snp.indexOf(value) === 0,
      sorter: (a, b) => a.nama_snp.localeCompare(b.nama_snp),
    },
    {
      title: "Kegiatan",
      key: "nama_kegiatan",
      dataIndex: "nama_kegiatan",
      width: "100%",
      onFilter: (value, record) => record.nama_kegiatan.indexOf(value) === 0,
      sorter: (a, b) => a.nama_kegiatan.localeCompare(b.nama_kegiatan),
    },
    {
      title: "Sub Kegiatan",
      dataIndex: "nama_sub_kegiatan",
      key: "nama_sub_kegiatan",
      width: "100%",
      onFilter: (value, record) =>
        record.nama_sub_kegiatan.indexOf(value) === 0,
      sorter: (a, b) => a.nama_sub_kegiatan.localeCompare(b.nama_sub_kegiatan),
    },
    {
      title: "Sasaran",
      key: "kelompokSasaran",
      width: "100%",
      render: (record) =>
        record.kelompok_sasaran.length
          ? record.kelompok_sasaran.map((item) => (
              <Tag key={`${record.id}${item}`} color="#00b1cc">
                {item}
              </Tag>
            ))
          : "-",
    },
    {
      title: "Indikator Output",
      children: [
        {
          title: "Output",
          key: "indikator_output",
          // dataKey: "indikator_output",
          width: "100%",
          render: (record) => record.indikator_output,
        },
        {
          title: "Target",
          key: "outputTarget",
          width: "100%",
          render: (record) =>
            record.indikator_output_target +
            " " +
            record.indikator_output_satuan,
        },
        {
          title: "Capaian",
          key: "output",
          render: (record) =>
            customTotalRincian(
              record.id,
              "capaian",
              record.indikator_output_target,
            ),
        },
      ],
    },
    {
      title: "Total Rincian",
      key: "totalRincian",
      width: "100%",
      render: (record) => customTotalRincian(record.id, "total"),
    },
    {
      title: "Disetujui",
      key: "realisasiNoReferensi",
      width: "100%",
      render: (record) => customTotalRincian(record.id, "approve"),
    },
    {
      title: "Aksi",
      key: "aksi",
      width: "100%",
      fixed: "right",
      render: (record) => (
        <Space>
          <ButtonTableDetail
            tooltips="Rincian"
            onClick={() =>
              route.push({
                pathname: "output-kegiatan/rincian/" + record.id,
                state: record,
              })
            }
          />
        </Space>
      ),
    },
  ];

  function customTotalRincian(id, column, target?) {
    let total: any = [];
    switch (column) {
      case "capaian":
        total = tmpRealisasiOutputKegiatan.filter((item) =>
          item.rencanaKegiatanId.includes(id),
        );
        total = total.filter((item) =>
          item.kepalaMadrasahApproved.includes("DISETUJUI"),
        );
        var qty: any = 0;
        total.length &&
          // eslint-disable-next-line array-callback-return
          total.map((e: any) => {
            qty = parseInt(qty) + parseInt(e.qtyOutput);
          });
        qty = Math.round((parseInt(qty) / parseInt(target)) * 100);

        return qty + "%";
      case "total":
        total = tmpRealisasiOutputKegiatan.filter((item) =>
          item.rencanaKegiatanId.includes(id),
        );
        return total.length;
      case "approve":
        total = tmpRealisasiOutputKegiatan.filter((item) =>
          item.rencanaKegiatanId.includes(id),
        );
        total = total.filter((item) =>
          item.kepalaMadrasahApproved.includes("DISETUJUI"),
        );
        return total.length;
    }
  }

  return (
    <>
      <BreadCrumb routes={itemBreadcrumb} title="Realisasi Output Kegiatan" />
      <div className="m-5 p-5 bg-white shadow-md rounded">
        <div className="mb-4 flex justify-end">
          <InputSearch
            className="w-3/4"
            onChange={(e: any) => setSearch(e.currentTarget.value)}
          />
        </div>
        <div className="w-full">
          <Table
            rowKey={(record) => record.id}
            columns={columns}
            dataSource={dataTable}
            scroll={{ x: "1300" }}
            tableLayout="auto"
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
    </>
  );
};

export default OutputKegiatanList;
