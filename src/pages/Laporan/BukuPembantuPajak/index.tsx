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
import FilterPeriode from "../Component/FilterPeriode";
import { getMadrasah } from "../../../services/v2/usermanservice/madrasahservices";
import { getLaporanPembantuPajak } from "../../../services/v2/realizationservice/laporanservices";

/**
 * Tampilan awal Laporan buku pembantu pajak
 */
const BukuPembantuPajak = () => {
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Laporan" },
    { path: "/", breadcrumbName: "Laporan Penatausahaan" },
    { path: "/", breadcrumbName: "Buku Pembantu Pajak" },
  ];
  const auths = useSelector((state: any) => state.auth);
  const store = useSelector((state: any) => state.store);
  const refPajak = store.pajak || [];
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
          (item.noKode !== null &&
            (item.noKode || "").toString().toLowerCase().includes(val)) ||
          (item.uraian !== null &&
            (item.uraian || "").toString().toLowerCase().includes(val)) ||
          (item.noBukti !== null &&
            (item.noBukti || "").toString().toLowerCase().includes(val))
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
        tahun: moment(tmpFilter?.periode).format("YYYY"),
        bulan: moment(tmpFilter?.periode).format("MM"),
        madrasahId: tmpFilter?.madrasahId,
      };
      if (tmpFilter?.periode && tmpFilter?.madrasahId) {
        const res = await getLaporanPembantuPajak(payload);
        setTableData((res && res.items) || []);
        setTmpData(res);
      }
    } else {
      const payload = {
        tahun: moment(tmpFilter?.periode).format("YYYY"),
        bulan: moment(tmpFilter?.periode).format("MM"),
        madrasahId: auth?.madrasah?.id,
      };
      if (tmpFilter?.periode) {
        const res = await getLaporanPembantuPajak(payload);
        setTableData((res && res.items) || []);
        setTmpData(res);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tmpFilter]);

  const handleExportFile = (type) => {
    if (dataTable.length > 0) {
      if (type === "pdf") {
        handleExportPdf();
      } else if (type === "excel") {
        handleExportExcel();
      }
    } else {
      notifAlert({
        type: "warning",
        description:
          "Harap pilih data yang ingin di export melalui fungsi filter!",
      });
    }
  };

  /**
   * Set data kolom tabel
   */
  const columns: any = [
    {
      title: "Tanggal",
      dataIndex: "tanggal",
      key: "tanggal",
      width: 250,
      onFilter: (value, record) => record.tanggal.indexOf(value) === 0,
      sorter: (a, b) =>
        moment(a.tanggal).toDate().getTime() -
        moment(b.tanggal).toDate().getTime(),
      render: (tanggal) => moment(tanggal).format("dddd,DD MMM YYYY HH:mm:ss"),
    },
    {
      title: "No Bukti",
      dataIndex: "noBukti",
      key: "noBukti",
      width: 180,
      onFilter: (value, record) => record.noBukti.indexOf(value) === 0,
      sorter: (a, b) => a.noBukti.length - b.noBukti.length,
    },
    {
      title: "No Kode",
      dataIndex: "noKode",
      key: "noKode",
      width: 280,
      onFilter: (value, record) => record.noKode.indexOf(value) === 0,
      sorter: (a, b) => a.noKode.length - b.noKode.length,
    },
    {
      title: "Pajak",
      dataIndex: "pajak",
      key: "pajak",
      width: 150,
      onFilter: (value, record) => record.pajak.indexOf(value) === 0,
      sorter: (a, b) => a.pajak.length - b.pajak.length,
      render: (pajak) =>
        refPajak.filter((p) => p.kode === pajak).map((p) => p.nama),
    },
    {
      title: "Uraian",
      dataIndex: "uraian",
      key: "uraian",
      width: 400,
      onFilter: (value, record) => record.uraian.indexOf(value) === 0,
      sorter: (a, b) => a.uraian.length - b.uraian.length,
    },
    {
      title: "Penerimaan (Debit)",
      dataIndex: "debit",
      key: "debit",
      align: "right",
      width: 200,
      onFilter: (value, record) => record.debit.indexOf(value) === 0,
      sorter: (a, b) => a.debit - b.debit,
      render: (debit) => formatRupiah(debit),
    },
    {
      title: "Pengeluaran (Kredit)",
      dataIndex: "credit",
      key: "credit",
      align: "right",
      width: 200,
      onFilter: (value, record) => record.credit.indexOf(value) === 0,
      sorter: (a, b) => a.credit - b.credit,
      render: (credit) => formatRupiah(credit),
    },
    {
      title: "Saldo",
      dataIndex: "saldo",
      key: "saldo",
      align: "right",
      width: 200,
      onFilter: (value, record) => record.saldo.indexOf(value) === 0,
      sorter: (a, b) => a.saldo - b.saldo,
      render: (saldo) => formatRupiah(saldo),
    },
  ];

  const handleChangeValues = (values) => {
    setTmpFilter(values);
  };

  /**
   * Export ke PDF
   */
  function handleExportPdf() {
    const dataMadrasah =
      (groupRole === "madrasah" && auth?.madrasah) ||
      tmpMadrasah.find((item) => item.id === tmpFilter?.madrasahId) ||
      null;
    const doc = new jsPDF({
      putOnlyUsedFonts: true,
      orientation: "landscape",
      floatPrecision: 16,
    });
    var fline = 10;
    doc.setFont("times", "bold");
    doc.text("BUKU PEMBANTU PAJAK", 150, 10, { align: "center" });
    doc.text(
      "Periode : " + moment(tmpFilter?.periode).format("MMMM YYYY"),
      150,
      18,
      {
        align: "center",
      },
    );
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    doc.rect(225, 25, 60, 7);
    doc.rect(225, 25, 60, 25);
    doc.text("Format BOS K-2", 228, 30);
    doc.text("Diisi oleh Bendahara Madrasah", 228, 38);
    doc.text("Disimpan di Madrasah", 228, 48);
    doc.text("Nama Madrasah", fline, 30);
    doc.text(": " + (dataMadrasah && dataMadrasah?.nama), fline + 40, 30);
    doc.text("NSM", fline, 35);
    doc.text(": " + (dataMadrasah && dataMadrasah?.nsm), fline + 40, 35);
    doc.text("Kecamatan", fline, 40);
    doc.text(
      ": " +
        (dataMadrasah && dataMadrasah?.kode_kecamatan
          ? refKecamatan
              .filter((e) => e.kode === dataMadrasah?.kode_kecamatan)
              .map((e) => e.nama)
          : "-"),
      fline + 40,
      40,
    );
    doc.text("Kabupaten / Kota", fline, 45);
    doc.text(
      ": " +
        (dataMadrasah && dataMadrasah?.kode_kabkota
          ? refKabkota
              .filter((e) => e.kode === dataMadrasah?.kode_kabkota)
              .map((e) => e.nama)
          : "-"),
      fline + 40,
      45,
    );
    doc.text("Provinsi", fline, 50);
    doc.text(
      ": " +
        (dataMadrasah && dataMadrasah?.kode_provinsi
          ? refProvinsi
              .filter((e) => e.kode === dataMadrasah?.kode_provinsi)
              .map((e) => e.nama)
          : "-"),
      fline + 40,
      50,
    );

    var headers: any = [
      { id: "id", dataKey: "id", padding: 0, header: "No Urut", width: 22 },
      {
        id: "tanggal",
        dataKey: "tanggal",
        padding: 0,
        header: "Tanggal",
        width: 50,
      },
      {
        id: "nobukti",
        dataKey: "nobukti",
        padding: 0,
        header: "No Bukti",
        width: 40,
      },
      {
        id: "nokode",
        dataKey: "nokode",
        padding: 0,
        header: "No Kode",
        width: 40,
      },
      { id: "pajak", dataKey: "pajak", padding: 0, header: "Pajak", width: 26 },
      {
        id: "uraian",
        dataKey: "uraian",
        padding: 0,
        header: "Uraian",
        width: 70,
      },
      {
        id: "debit",
        dataKey: "debit",
        padding: 0,
        header: "Penerimaan (Debit)",
        width: 39,
      },
      {
        id: "kredit",
        dataKey: "kredit",
        padding: 0,
        header: "Pegeluaran (Kredit)",
        width: 39,
      },
      { id: "saldo", dataKey: "saldo", padding: 0, header: "Saldo", width: 39 },
    ];

    let las: any = [];
    autoTable(doc, {
      styles: { lineColor: 244, lineWidth: 0.1 },
      headStyles: {
        halign: "center",
        valign: "middle",
        fillColor: [0, 128, 0],
      }, // Cells in first column centered and green
      columnStyles: {
        0: { halign: "center", cellWidth: 12 },
        1: { halign: "center", cellWidth: 20 },
        4: { halign: "center", cellWidth: 18 },
        5: { halign: "left", cellWidth: 37 },
        6: { halign: "right", cellWidth: 28 },
        7: { halign: "right", cellWidth: 28 },
        8: { halign: "right", cellWidth: 28 },
      },
      startY: 55,
      margin: { top: 10, left: 10, right: 10 },
      columns: headers,
      body: tableData.map((e, i) => {
        return {
          id: i + 1,
          tanggal: moment(e.tanggal).format("dddd,DD MMM YYYY HH:mm:ss"),
          nobukti: e.noBukti,
          nokode: e.noKode,
          pajak: e.pajak,
          uraian: e.uraian,
          debit: formatRupiah(e.debit),
          kredit: formatRupiah(e.credit),
          saldo: formatRupiah(e.saldo),
        };
      }),
      // didParseCell: (d) => console.log(d),
      didDrawPage: (d) => las.push(d.cursor),
    });
    let lastLine = 7 + (las.length !== 0 ? las[0].y : 0);
    doc.text("Mengetahui,", fline, lastLine);
    doc.text(moment().format("dddd, DD MMMM YYYY"), 228, lastLine);
    doc.text("Kepala Madrasah", fline, lastLine + 5);
    doc.text("Bendahara Madrasah", 228, lastLine + 5);
    doc.text("(.................)", fline, lastLine + 20);
    doc.text("(.................)", 228, lastLine + 20);
    doc.output("dataurlnewwindow", { filename: "laporan-buku-pembantu-pajak" });
    notifAlert({
      type: "success",
      description: "Data berhasil di export",
    });
  }

  /**
   * Export ke excel
   */
  function handleExportExcel() {
    const dataMadrasah =
      (groupRole === "madrasah" && auth?.madrasah) ||
      tmpMadrasah.find((item) => item.id === tmpFilter?.madrasahId) ||
      null;
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    var ws = XLSX.utils.json_to_sheet(
      [
        { A: "BUKU PEMBANTU KAS" },
        { A: "Periode : " + moment(tmpFilter?.periode).format("MMMM YYYY") },
        { A: "" },
        {
          A: "Nama Madrasah :" + (dataMadrasah && dataMadrasah?.nama),
        },
        { A: "NSM :" + (dataMadrasah && dataMadrasah?.nsm) },
        {
          A:
            "Kecamatan :" +
            (dataMadrasah && dataMadrasah?.kode_kecamatan
              ? refKecamatan
                  .filter((e) => e.kode === dataMadrasah?.kode_kecamatan)
                  .map((e) => e.nama)
              : "-"),
        },
        {
          A:
            "Kabupaten / Kota :" +
            (dataMadrasah && dataMadrasah?.kode_kabkota
              ? refKabkota
                  .filter((e) => e.kode === dataMadrasah?.kode_kabkota)
                  .map((e) => e.nama)
              : "-"),
        },
        {
          A:
            "Provinsi :" +
            (dataMadrasah && dataMadrasah?.kode_provinsi
              ? refProvinsi
                  .filter((e) => e.kode === dataMadrasah?.kode_provinsi)
                  .map((e) => e.nama)
              : "-"),
        },
      ],
      { skipHeader: true },
    );
    const merge = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 8 } },
    ];
    ws["!merges"] = merge;
    ws["A1"].s = {
      font: {
        sz: 24,
        bold: true,
      },
      alignment: {
        vertical: "center",
        horizontal: "center",
      },
    };
    let dataTmp: any = [];
    tableData.map((e, i) => {
      return dataTmp.push({
        "No Urut": i + 1,
        Tanggal: moment(e.tanggal).format("dddd,DD MMM YYYY HH:mm:ss"),
        "No Bukti": e.noBukti,
        "No Kode": e.noKode,
        Pajak: e.pajak,
        Uraian: e.uraian,
        "Penerimaan (Debit)": formatRupiah(e.debit),
        "Pengeluaran (Kredit)": formatRupiah(e.credit),
        Saldo: formatRupiah(e.saldo),
      });
    });
    XLSX.utils.sheet_add_json(ws, dataTmp, { origin: "A10" });
    ws["A10"].s = {
      fill: {
        patternType: "solid",
        bgColor: { rgb: "000000" }, // 'FFFFAA00',
        // fgColor: 'FFBBAA00'
      },
      font: {
        bold: true,
      },
      alignment: {
        vertical: "center",
        horizontal: "center",
      },
    };
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    // var defaultCellStyle = { font: { name: "Verdana", sz: 11, color: "FF00FF88" }, fill: { fgColor: { rgb: "FFFFAA00" } } };
    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "binary",
      bookSST: true,
      cellStyles: true,
    });
    const data = new Blob([sheet_to_blob(excelBuffer)], { type: fileType });
    FileSaver.saveAs(data, "Buku-Pembantu-Pajak" + fileExtension);
    notifAlert({
      type: "success",
      description: "Data berhasil di export",
    });
  }
  return (
    <>
      <BreadCrumb routes={itemBreadcrumb} title="Laporan Buku Pembantu Pajak" />
      <FilterPeriode
        handleChangeValues={handleChangeValues}
        groupRole={groupRole}
        madrasah={tmpMadrasah}
      />
      <div className="m-5 p-5 bg-white shadow-md rounded">
        <div className="mb-4 flex justify-end">
          <div className="mr-4">
            <Space size={[8, 8]} wrap>
              <ButtonDropdownExport handleExportFile={handleExportFile} />
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
            rowKey={(record) => record.noNotaFormat}
            columns={columns}
            dataSource={dataTable}
            scroll={{ x: 1300 }}
            bordered
            loading={loading}
            summary={() =>
              tmpData && (
                <Table.Summary fixed="top">
                  <Table.Summary.Row style={{ backgroundColor: `#f1f1f1` }}>
                    <Table.Summary.Cell index={0} colSpan={5}>
                      <strong>Saldo Awal</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2}>-</Table.Summary.Cell>
                    <Table.Summary.Cell index={3}>-</Table.Summary.Cell>
                    <Table.Summary.Cell index={4} align="right">
                      {formatRupiah(tmpData?.saldoAwal)}
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )
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

export default BukuPembantuPajak;
