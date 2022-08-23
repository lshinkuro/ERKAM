/** @format */

import React, { useState, useEffect } from "react";
import { BreadCrumb } from "../../../components";
import moment from "moment";
import "moment/locale/id";
import { Table, Space } from "antd";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { formatRupiah, sheet_to_blob } from "../../../utils/helper";

import { useSelector } from "react-redux";
import { ButtonDropdownExport } from "../../../components/Button";
import InputSearch from "../../../components/InputSearch";
import notifAlert from "../../../components/NotifAlert";
import { getMadrasah } from "../../../services/v2/usermanservice/madrasahservices";
import { getLaporanAPBM } from "../../../services/v2/realizationservice/laporanservices";
import FilterMadrasah from "../Component/FilterMadrasah";

const Apbm = () => {
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Laporan" },
    { path: "/", breadcrumbName: "Laporan Rencana" },
    { path: "/", breadcrumbName: "Realisasi APBM" },
  ];
  const auths = useSelector((state: any) => state.auth);
  const store = useSelector((state: any) => state.store);
  const refBank = store.rekeningBelanja || [];
  const refTipeKas = store.tipeKas || [];
  const refKabkota = store.kabkota || [];
  const refProvinsi = store.provinsi || [];
  const refKecamatan = store.kecamantan || [];
  const auth = auths?.data || [];
  const groupRole = auth?.group_role || "";

  const [tableData, setTableData] = useState<any>([]);
  const [tmpData, setTmpData] = useState<any>(null);
  const [tmpMadrasah, setTmpMadrasah] = useState<any>([]);
  const [search, setSearch] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [tmpFilter, setTmpFilter] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  let dataTable: any = search
    ? tableData.filter((item: any) => {
        const val = search.toLowerCase();
        return (
          (item.noNotaFormat !== null &&
            (item.noNotaFormat || "").toString().toLowerCase().includes(val)) ||
          (item.uraian !== null &&
            (item.uraian || "").toString().toLowerCase().includes(val)) ||
          (item.realisasiNoReferensi !== null &&
            (item.realisasiNoReferensi || "")
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

  const getData = async () => {
    setLoading(true);
    if (groupRole !== "madrasah") {
      const madrasah = await getMadrasah();
      setTmpMadrasah(madrasah);
      const payload = {
        tahun: auth?.isTahun,
        madrasahId: tmpFilter?.madrasahId,
      };
      if (tmpFilter?.madrasahId) {
        // const res = await getLaporanBKU(payload);
        // setTableData((res && res.items) || []);
        // setTmpData(res);
      }
    } else {
      const payload = {
        tahun: auth?.isTahun,
        madrasahId: auth?.madrasah?.id,
      };
      const res = await getLaporanAPBM(payload);
      // setTableData((res && res.items) || []);
      // setTmpData(res);
      console.log(res);
    }

    setLoading(false);
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tmpFilter]);

  const handleChangeValues = (values) => {
    setTmpFilter(values);
  };

  /**
   * Data untuk tabel children pertama
   */
  let columns: any = [
    {
      title: "No",
      key: "noUrut",
      align: "center",
      dataIndex: "noUrut",
      width: 80,
    },
    {
      title: "Uraian",
      key: "uraian",
      dataIndex: "uraian",
      align: "center",
      width: 300,
    },
    {
      title: "Pendapatan",
      align: "center",
      key: "pendapatan",
      children: [
        {
          title: "Anggaran",
          key: "anggaran",
          dataIndex: "jumlahPendapatan",
          width: 200,
        },
        {
          title: "Realisasi",
          key: "realisasiPendapatan",
          children: [
            {
              title: "Rupiah",
              key: "totalRealisasiPendapatan",
              dataIndex: "jumlahPendapatanRealisasi",
              width: 200,
            },
            {
              title: "%",
              key: "persenRealisasiPendapatan",
              dataIndex: "persenPendapatanRealisasi",
              width: 80,
            },
          ],
        },
      ],
    },
    {
      title: "Belanja",
      align: "center",
      key: "belanja",
      children: [
        {
          title: "Anggaran",
          key: "jumlahBelanja",
          dataIndex: "jumlahBelanja",
          width: 200,
        },
        {
          title: "Realisasi",
          key: "realisasiBelanja",
          children: [
            {
              title: "Rupiah",
              key: "jumlahBelanjaRealisasi",
              dataIndex: "jumlahBelanjaRealisasi",
              width: 200,
            },
            {
              title: "%",
              key: "persenBelanjaRealisasi",
              dataIndex: "persenBelanjaRealisasi",
              width: 80,
            },
          ],
        },
      ],
    },
    {
      title: "Saldo",
      align: "center",
      key: "saldo",
      children: [
        {
          title: "Rupiah",
          key: "totalSaldo",
          dataIndex: "totalSaldo",
          width: 200,
        },
        {
          title: "%",
          key: "persenToalSaldo",
          dataIndex: "persenToalSaldo",
          width: 80,
        },
      ],
    },
  ];
  return (
    <>
      <BreadCrumb routes={itemBreadcrumb} title="Laporan Realisasi APBM" />
      {groupRole !== "madrasah" && (
        <FilterMadrasah
          handleChangeValues={handleChangeValues}
          madrasah={tmpMadrasah}
        />
      )}
      <div className="m-5 p-5 bg-white shadow-md rounded">
        <div className="mb-4 flex justify-end">
          <div className="mr-4">
            <Space size={[8, 8]} wrap>
              {/* <ButtonDropdownExport handleExportFile={handleExportFile} /> */}
            </Space>
          </div>
          <InputSearch
            className="w-3/4"
            onChange={(e: any) => setSearch(e.currentTarget.value)}
          />
        </div>
        <div className="w-full">
          <Table
            sticky
            rowKey={(record) => record.id}
            columns={columns}
            dataSource={dataTable}
            scroll={{ x: 1300 }}
            bordered
            loading={loading}
            summary={
              () => (
                // tmpData && (

                <Table.Summary fixed="bottom">
                  <Table.Summary.Row
                    style={{ backgroundColor: `green`, color: `#ffffff` }}>
                    <Table.Summary.Cell index={0} align="center" colSpan={3}>
                      <strong>Total Belanja</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell
                      index={3}
                      align="center"></Table.Summary.Cell>
                    <Table.Summary.Cell
                      index={4}
                      align="center"></Table.Summary.Cell>
                    <Table.Summary.Cell
                      index={5}
                      align="center"></Table.Summary.Cell>
                    <Table.Summary.Cell index={6} align="center">
                      <strong>g</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={7} align="center">
                      <strong>h</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={8} align="center">
                      <strong>i = d - g</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={9} align="center">
                      <strong>j = i / d</strong>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )
              // )
            }
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

export default Apbm;
