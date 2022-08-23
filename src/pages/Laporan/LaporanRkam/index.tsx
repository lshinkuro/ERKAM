/** @format */

import React, { useEffect, useState } from "react";
import moment from "moment";
import "moment/locale/id";
import { Menu, Dropdown, Button, DatePicker, Table, Space } from "antd";
import { BreadCrumb } from "../../../components";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { ExportToExcel } from "../../../components/Export/ExportToExcel";
import { formatRupiah } from "../../../utils/helper";

import * as laporanRkamService from "../../../services/v2/planningservice/laporan/rkam";
import { useSelector } from "react-redux";
import { ButtonExport } from "../../../components/Button";
import InputSearch from "../../../components/InputSearch";
import { getLaporanErkam } from "../../../services/v2/planningservice/laporanservices";

const LaporanRkam = () => {
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Laporan" },
    { path: "/", breadcrumbName: "RKAM" },
  ];
  const auths = useSelector((state: any) => state.auth);
  const auth = auths?.data || [];
  const store = useSelector((state: any) => state.store);
  // console.log(store);
  // const refProvinsi: { kode: string; nama: string }[] = store.provinsi || [];
  // const refKabkota: {
  //   kode: string;
  //   nama: string;
  //   kode_provinsi: string;
  // }[] = store.kabkota || [];
  // const refKecamatan: {
  //   kode: string;
  //   nama: string;
  // }[] = store.kecamatan || [];
  const [tableData, setTableData] = useState<any>([]);
  const [search, setSearch] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  let dataTable: any = search
    ? tableData.filter((item: any) => {
        const val = search.toLowerCase();
        return (
          (item.rencanaKegiatan.nama_snp !== null &&
            (item.rencanaKegiatan.nama_snp || "")
              .toString()
              .toLowerCase()
              .includes(val)) ||
          (item.rencanaKegiatan.nama_kegiatan !== null &&
            (item.rencanaKegiatan.nama_kegiatan || "")
              .toString()
              .toLowerCase()
              .includes(val)) ||
          (item.rencanaKegiatan.nama_sub_kegiatan !== null &&
            (item.rencanaKegiatan.nama_sub_kegiatan || "")
              .toString()
              .toLowerCase()
              .includes(val)) ||
          (item.komponenBiayaNama !== null &&
            (item.komponenBiayaNama || "")
              .toString()
              .toLowerCase()
              .includes(val))
        );
      })
    : tableData;

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
      title: "No Urut",
      key: "noUrut",
      width: 300,
      render: (record) => record.rencanaKegiatan.nama_snp,
    },
    {
      title: "Sumber Dana",
      key: "sumberDana",
      width: 300,
      render: (record) => record.rencanaKegiatan.nama_kegiatan,
    },
    {
      title: "Rencana Pendapatan (Rupiah)",
      key: "subKegiatan",
      width: 300,
      render: (record) => record.rencanaKegiatan.nama_sub_kegiatan,
    },
    {
      title: "Rencana Belanja (Rupiah)",
      key: "komponenBiayaNama",
      dataIndex: "komponenBiayaNama",
      width: 300,
    },
    {
      title: "Tahap 1",
      key: "jumlahTotal",
      dataIndex: "jumlahTotal",
      align: "right",
      width: 200,
      render: (jumlahTotal) => formatRupiah(jumlahTotal),
    },
    {
      title: "Tahap 2",
      key: "jumlahTotal",
      dataIndex: "jumlahTotal",
      align: "right",
      width: 200,
      render: (jumlahTotal) => formatRupiah(jumlahTotal),
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      // const res = await getLaporanErkam({
      //   tahun: auths?.isTahun,
      //   madrasahId: auth?.madrasah?.id,
      // });
      // console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(store);
  return (
    <>
      <BreadCrumb routes={itemBreadcrumb} title="RKAM" />
      <div className="m-5 p-5 bg-white shadow-md rounded">
        <div className="mb-4 flex justify-end">
          <div className="mr-4">
            <Space size={[8, 8]} wrap>
              <ButtonExport />
            </Space>
          </div>
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

export default LaporanRkam;
