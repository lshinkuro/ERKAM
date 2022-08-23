/** @format */

import React, { useEffect, useState } from "react";
import { BreadCrumb } from "../../../components";
// import moment from "moment";
// import "moment/locale/id";
import { Table, Space } from "antd";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import * as FileSaver from "file-saver";
// import * as XLSX from "xlsx";
import { formatRupiah, sheet_to_blob } from "../../../utils/helper";

import { useSelector } from "react-redux";
// import { ButtonDropdownExport } from "../../../components/Button";
// import InputSearch from "../../../components/InputSearch";
// import notifAlert from "../../../components/NotifAlert";
import { getMadrasah } from "../../../services/v2/usermanservice/madrasahservices";
import { getLaporanRapbmRekap } from "../../../services/v2/planningservice/laporanservices";
import FilterMadrasah from "../Component/FilterMadrasah";

const LaporanRapbm: React.FC = () => {
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Laporan" },
    { path: "/", breadcrumbName: "Laporan Rencana" },
    { path: "/", breadcrumbName: "RAPBM" },
  ];

  const auths = useSelector((state: any) => state.auth);
  const store = useSelector((state: any) => state.store);
  const auth = auths?.data || [];
  const groupRole = auth?.group_role || "";

  const [tableData, setTableData] = useState<any>([]);
  const [tmpMadrasah, setTmpMadrasah] = useState<any>([]);

  const [tmpFilter, setTmpFilter] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  let dataTable: any = [];

  tableData.length &&
    // eslint-disable-next-line array-callback-return
    tableData.map((item) => {
      let listTable: any = [
        {
          noUrut: "1",
          uraian: "SUMBER DANA",
          pendapatan: null,
          belanja: null,
          saldo: null,
        },
        {
          noUrut: "A.",
          uraian: item.namaSumberDana || "-",
          pendapatan:
            (item.totalPendapatan && formatRupiah(item.totalPendapatan)) || 0,
          belanja: null,
          saldo:
            (item.totalPendapatan && formatRupiah(item.totalPendapatan)) || 0,
        },
      ];
      let listPengeluaran: any = [
        {
          noUrut: "2",
          uraian: "BELANJA",
          pendapatan: null,
          belanja: null,
          saldo: null,
        },
        {
          noUrut: "A.",
          uraian: "BELANJA NON EDM",
          pendapatan: null,
          belanja: null,
          saldo: null,
        },
      ];
      let detailPengeluaran: any = [];
      item.pengeluaran.length &&
        // eslint-disable-next-line array-callback-return
        item.pengeluaran.map((items: any, i: number) => {
          let no = i + 1;
          let itemPengeluaran = {
            noUrut: `A.${no}`,
            uraian: items.namaSnp || null,
            pendapatan: null,
            belanja: (items.total && formatRupiah(items.total)) || 0,
            saldo: null,
          };
          detailPengeluaran.push(itemPengeluaran);
        });
      listPengeluaran = [...listPengeluaran, ...detailPengeluaran];
      listTable =
        (detailPengeluaran.length && [...listTable, ...listPengeluaran]) ||
        listTable;

      // listTable.push()
      let dataTotal: any = {
        nama: item.namaSumberDana || "-",
        totalPendapatan: item.totalPendapatan || 0,
        totalBelanja: item.totalPengeluaran || 0,
        listTable: listTable,
      };
      dataTable.push(dataTotal);
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
        const res = await getLaporanRapbmRekap(payload);
        setTableData(res || []);
        // setTmpData(res);
      }
    } else {
      const payload = {
        tahun: auth?.isTahun,
        madrasahId: auth?.madrasah?.id,
      };
      const res = await getLaporanRapbmRekap(payload);
      setTableData(res || []);
      // setTmpData(res);
      console.log(res);
    }

    setLoading(false);
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tmpFilter]);

  /**
   * Data untuk tabel children pertama
   */
  let columns: any = [
    {
      title: "No",
      key: "noUrut",
      // align: "center",
      dataIndex: "noUrut",
      width: 80,
    },
    {
      title: "Keterangan",
      key: "uraian",
      dataIndex: "uraian",
      // align: "center",
      width: 300,
    },
    {
      title: "Pendapatan",
      align: "center",
      key: "pendapatan",
      dataIndex: "pendapatan",
    },
    {
      title: "Belanja",
      align: "center",
      key: "belanja",
      dataIndex: "belanja",
    },
    {
      title: "Saldo",
      align: "center",
      key: "saldo",
      dataIndex: "saldo",
    },
  ];

  const handleChangeValues = (values) => {
    setTmpFilter(values);
  };

  return (
    <>
      <BreadCrumb routes={itemBreadcrumb} title="RAPBM" />
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
          {/* <InputSearch
            className="w-3/4"
            onChange={(e: any) => setSearch(e.currentTarget.value)}
          /> */}
        </div>
        <div className="w-full">
          {(dataTable.length &&
            dataTable.map((item, i) => {
              return (
                <Table
                  // sticky
                  // rowKey={(record) => record.id}
                  columns={columns}
                  dataSource={item.listTable}
                  // scroll={{ x: 1300 }}
                  showHeader={i > 0 ? false : true}
                  bordered
                  loading={loading}
                  summary={
                    () => (
                      <Table.Summary fixed="bottom">
                        <Table.Summary.Row
                          style={{
                            backgroundColor: `green`,
                            color: `#ffffff`,
                          }}>
                          <Table.Summary.Cell
                            index={0}
                            align="center"
                            colSpan={4}>
                            <strong>Total Belanja</strong>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={4} align="center">
                            {(item.totalBelanja &&
                              formatRupiah(item.totalBelanja)) ||
                              0}
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                        <Table.Summary.Row
                          style={{
                            backgroundColor: `green`,
                            color: `#ffffff`,
                          }}>
                          <Table.Summary.Cell
                            index={0}
                            align="center"
                            colSpan={4}>
                            <strong>
                              Sisa Saldo Sumber Dana {item.nama || ""}
                            </strong>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={4} align="center">
                            {formatRupiah(
                              item.totalPendapatan - item.totalBelanja,
                            )}
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                      </Table.Summary>
                    )
                    // )
                  }
                  pagination={false}
                />
              );
            })) || (
            <Table
              // sticky
              // rowKey={(record) => record.id}
              columns={columns}
              dataSource={[]}
              // scroll={{ x: 1300 }}
              showHeader={true}
              bordered
              summary={
                () => (
                  <Table.Summary fixed="bottom">
                    <Table.Summary.Row
                      style={{
                        backgroundColor: `green`,
                        color: `#ffffff`,
                      }}>
                      <Table.Summary.Cell index={0} align="center" colSpan={4}>
                        <strong>Total Belanja</strong>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={4} align="center">
                        0
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                    <Table.Summary.Row
                      style={{
                        backgroundColor: `green`,
                        color: `#ffffff`,
                      }}>
                      <Table.Summary.Cell index={0} align="center" colSpan={4}>
                        <strong>Sisa Saldo Sumber Dana</strong>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={4} align="center">
                        0
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                )
                // )
              }
              pagination={false}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default LaporanRapbm;
