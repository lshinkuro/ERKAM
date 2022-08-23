/** @format */

import React, { useState, useEffect } from "react";
import { BreadCrumb } from "../../../components";
// import { useHistory } from "react-router-dom";
import * as realizationService from "../../../services/v2/realizationservice";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
// import * as XLSX from "xlsx";
// import { ExportToExcel } from '../../../components/Export/ExportToExcel';
// import { formatCurr } from '../../../utils/helper';
// import { FunnelPlotOutlined } from '@ant-design/icons';
import { PdfIcon, ExcelIcon } from "../../../icons";
import moment from "moment";
import "moment/locale/id";

import { Dropdown, DropdownItem } from "@windmill/react-ui";
import {
  Table,
  Input,
  InputGroup,
  Icon,
  Button,
  // Dropdown,
} from "rsuite";
import {
  Table as Tablea,
  Row,
  Col,
  Select,
  Radio,
  Space,
  DatePicker,
} from "antd";
const { Pagination } = Table;

let tableBody;
function LaporanRincianKeuangan() {
  // const refBank = JSON.parse(localStorage.getItem("rekening-belanja")!) || [];
  // const refSumberDana: any = JSON.parse(localStorage.getItem("rencana-pendapatan-definitif")!) || [];
  const refTipeKas: any =
    JSON.parse(localStorage.getItem("tipe-kas-controller")!) || [];
  const refRekening: any =
    JSON.parse(localStorage.getItem("rekening-belanja")!) || [];
  // const refPengeluaranPajak: any = JSON.parse(localStorage.getItem("realisasi-pengeluaran-pajak")!) || [];
  // const route = useHistory()
  // const item = ["Home", "Laporan", "Laporan Realisasi", "Laporan Rincian Keuangan"];
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Laporan" },
    { path: "/", breadcrumbName: "Laporan Realisasi" },
    { path: "/", breadcrumbName: "Laporan Rincian Keuangan" },
  ];
  const [page, setPage] = useState(1);
  const [displayLength, setDisplayLength] = useState(10);
  const auth: any = JSON.parse(localStorage.getItem("auth")!);
  const groupRole = auth.group_role;
  const refProvinsi: { kode: string; nama: string }[] = JSON.parse(
    localStorage.getItem("provdropdown")!,
  );
  const refKabkota: {
    kode: string;
    nama: string;
    kode_provinsi: string;
  }[] = JSON.parse(localStorage.getItem("kabkotadropdown")!);
  const refPajak: { kode: string; nama: string }[] =
    JSON.parse(localStorage.getItem("kbiaya/pajak")!) || [];
  // const [tipe, setTipe] = useState<any>('');
  // const [bulan, setBulan] = useState<any>('');
  const [provinsi, setProvinsi] = useState<any>(null);
  const [kabupaten, setKabupaten] = useState<any>(null);
  const [pajak, setPajak] = useState<any>(null);
  // const [madrasah, setMadrasah] = useState<any>(null);
  const [tableData, setTableData] = useState<any>([]);
  const [tableDataCount, setTableDataCount] = useState<any>([]);
  // const [openDropdown, setOpenDropdown] = useState(false);
  const [openDropdownExport, setOpenDropdownExport] = useState(false);
  const [dataTable, setDataTable] = useState<any>([]);
  const [dataMadrasah, setDataMadrasah] = useState<any>([]);

  const handleChangePage = (dataKey) => {
    setPage(dataKey);
  };
  const handleChangeLength = (dataKey) => {
    setPage(page);
    setDisplayLength(dataKey);
  };
  const data = tableData.filter((v, i) => {
    let start = displayLength * (page - 1);
    let end = start + displayLength;

    return i >= start && i < end;
  });

  const getData = async () => {
    const dataTmp: any[] = [];
    let datTmp =
      await realizationService.pengeluaranpajakService.getPengeluaranPajak(
        auth.tahun,
      );
    // let datTmp = refPengeluaranPajak;
    if (datTmp.length !== 0) {
      datTmp.map((e, i) => {
        let urai;
        if (e.kodeTipeKas === "rekening_bank") {
          urai =
            "Penerimaan " +
            e.namaSumberDana +
            ", Kas: " +
            refTipeKas
              .filter((p) => p.kode === e.kodeTipeKas)
              .map((p) => p.nama) +
            ", No Rekening: " +
            refRekening
              .filter((p) => p.id === e.rekeningBankId)
              .map((p) => p.no_rekening) +
            ", an: " +
            refRekening
              .filter((p) => p.id === e.rekeningBankId)
              .map((p) => p.no_rekening_nama) +
            ", " +
            refRekening
              .filter((p) => p.id === e.rekeningBankId)
              .map((p) => p.nama_bank);
        } else {
          urai = "Penerimaan " + e.namaSumberDana + ", Kas: " + e.kodeTipeKas;
        }

        return dataTmp.push({
          id: (i + 1).toString(),
          no: (i + 1).toString(),
          snp: moment(e.tanggalNota).format("dddd,DD MMM YYYY HH:mm:ss"),
          rencanaoutputkegiatan: e.realisasiNoReferensi,
          realisasicapaiankomulatig: e.noNotaFormat,
        });
      });
    }
    setTableData(dataTmp);
    setDataTable(dataTmp);
    setTableDataCount(dataTmp);
  };

  useEffect(() => {
    getData();
    if (groupRole === "madrasah") {
      setDataMadrasah(auth.madrasah);
    }
  }, [localStorage.getItem("auth")!]);

  const filterSearch = async (e) => {
    const search = e.toLowerCase();
    let tmpTable = dataTable;

    if (search) {
      const val = (tmpTable || "").filter((item) => {
        return (
          // (item.tanggal !== null &&
          //     (item.tanggal || '').toString().toLowerCase().includes(search)) ||
          // (item.nobukti !== null &&
          //     (item.nobukti || '').toString().toLowerCase().includes(search)) ||
          // (item.pajak !== null &&
          //     (item.pajak || '').toString().toLowerCase().includes(search)) ||
          // (item.nokode !== null &&
          //     (item.nokode || '').toString().toLowerCase().includes(search)) ||
          // (item.uraian !== null &&
          //     (item.uraian || '').toString().toLowerCase().includes(search)) ||
          item.no !== null &&
          (item.no || "").toString().toLowerCase().includes(search)
        );
      });
      setTableData(val);
      setTableDataCount(val);
      resetPagination();
    } else {
      setTableData(tmpTable);
      setTableDataCount(tmpTable);
      resetPagination();
    }
  };

  function resetPagination() {
    const data = tableData.filter((v, i) => {
      let start = displayLength * (page - 1);
      let end = start + displayLength;
      return i >= start && i < end;
    });
  }

  const columns = [
    {
      title: "No Urut",
      dataIndex: "no",
      key: "no",
      sorter: true,
    },
    {
      title: "SNP",
      dataIndex: "snp",
      key: "snp",
      sorter: true,
    },
    {
      title: "Rencana Output Kegiatan",
      dataIndex: "rencanaoutputkegiatan",
      key: "rencanaoutputkegiatan",
      sorter: true,
    },
    {
      title: "Realisasi Capaian Komulatif",
      dataIndex: "realisasicapaiankomulatif",
      key: "realisasicapaiankomulatif",
      sorter: true,
    },
  ];

  function handleExportPdf() {
    const doc = new jsPDF({
      putOnlyUsedFonts: true,
      orientation: "landscape",
      floatPrecision: 16,
    });
    var fline = 10;
    doc.setFont("times", "bold");
    doc.text("BUKU PEMBANTU KAS", 150, 10, { align: "center" });
    doc.text("BULAN : Januari 2021", 150, 18, { align: "center" });
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    doc.rect(225, 25, 60, 7);
    doc.rect(225, 25, 60, 25);
    doc.text("Format BOS K-2", 228, 30);
    doc.text("Diisi oleh Bendahara Madrasah", 228, 38);
    doc.text("Disimpan di Madrasah", 228, 48);
    doc.text("Nama Madrasah", fline, 30);
    doc.text(
      ": " + (dataMadrasah.length !== 0 && dataMadrasah.nama),
      fline + 40,
      30,
    );
    doc.text("NSM", fline, 35);
    doc.text(
      ": " + (dataMadrasah.length !== 0 && dataMadrasah.nsm),
      fline + 40,
      35,
    );
    doc.text("Kecamatan", fline, 40);
    doc.text(
      ": " + (dataMadrasah.length !== 0 && dataMadrasah.kode_kecamatan),
      fline + 40,
      40,
    );
    doc.text("Kabupaten / Kota", fline, 45);
    doc.text(
      ": " + (dataMadrasah.length !== 0 && dataMadrasah.kode_kabkota),
      fline + 40,
      45,
    );
    doc.text("Provinsi", fline, 50);
    doc.text(
      ": " + (dataMadrasah.length !== 0 && dataMadrasah.kode_provinsi),
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
      startY: 55,
      margin: { top: 10, left: 10, right: 10 },
      columns: headers,
      body: data,
      didDrawPage: (d) => las.push(d.cursor),
    });
    let lastLine = 5 + (las.length !== 0 ? las[0].y : 0);
    doc.text("Mengetahui,", fline, lastLine);
    doc.text(moment().format("dddd, DD MMMM YYYY"), 228, lastLine);
    doc.text("Kepala Madrasah", fline, lastLine + 5);
    doc.text("Bendahara Madrasah", 228, lastLine + 5);
    doc.text("Kepala Madrasah", fline, lastLine + 20);
    doc.text("Bendahara Madrasah", 228, lastLine + 20);
    doc.output("dataurlnewwindow", { filename: "laporan-pembantu-kas" });
    setOpenDropdownExport(!openDropdownExport);
  }

  function handleExportExcel() {
    setOpenDropdownExport(!openDropdownExport);
  }

  return (
    <>
      <BreadCrumb routes={itemBreadcrumb} title="Laporan Rincian Keuangan" />
      <div className="m-5 p-5 bg-white shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center">
            <div className="w-1/3">Tipe</div>
            <div className="w-2/3">
              <Select
                options={[]}
                placeholder="Tipe"
                className="w-full"
                showSearch
                allowClear
                value={pajak}
                // onChange={(e: any) => {
                //   handleChangeSelect(e, 'tipekas');
                // }}
              />
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-1/3">Sumber Dana</div>
            <div className="w-2/3">
              <Select
                options={
                  refPajak.length !== 0
                    ? refPajak.map((e) => {
                        return { value: e.kode, label: e.nama };
                      })
                    : []
                }
                placeholder="Sumber Dana"
                className="w-full"
                showSearch
                allowClear
                value={pajak}
                // onChange={(e: any) => {
                //   handleChangeSelect(e, 'tipekas');
                // }}
              />
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-1/3">Periode</div>
            <div className="w-2/3">
              <DatePicker picker="month" />
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-1/3">Provinsi</div>
            <div className="w-2/3">
              <Select
                options={
                  refProvinsi.length !== 0
                    ? refProvinsi.map((e) => {
                        return { value: e.kode, label: e.nama };
                      })
                    : []
                }
                placeholder="Provinsi"
                className="w-full"
                showSearch
                allowClear
                value={provinsi}
              />
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-1/3">Kabupaten / Kota</div>
            <div className="w-2/3">
              <Select
                options={
                  provinsi
                    ? refKabkota
                        .filter((e) => e.kode_provinsi === provinsi)
                        .map((e) => {
                          return { value: e.kode, label: e.nama };
                        })
                    : []
                }
                placeholder="Kabupaten / Kota"
                className="w-full"
                showSearch
                allowClear
                value={kabupaten}
              />
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-1/3">Madrasah</div>
            <div className="w-2/3">
              <Select
                options={
                  refPajak.length !== 0
                    ? refPajak.map((e) => {
                        return { value: e.kode, label: e.nama };
                      })
                    : []
                }
                placeholder="Madrasah"
                className="w-full"
                showSearch
                allowClear
                value={pajak}
                // onChange={(e: any) => {
                //   handleChangeSelect(e, 'tipekas');
                // }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="m-5 p-5 bg-white shadow-sm">
        <div className="flex justify-end">
          <div className="w-1/2">
            <div className="flex items-center justify-end">
              <div className="relative z-10">
                <Button
                  appearance="ghost"
                  onClick={() => setOpenDropdownExport(!openDropdownExport)}>
                  {" "}
                  <Icon icon="download" /> Export
                </Button>
                <Dropdown
                  align="right"
                  style={{ width: 90 }}
                  isOpen={openDropdownExport}
                  onClose={() => setOpenDropdownExport(false)}>
                  <DropdownItem onClick={handleExportExcel}>
                    <ExcelIcon className="mx-2" /> Excel
                  </DropdownItem>
                  <DropdownItem onClick={handleExportPdf}>
                    <PdfIcon className="mx-2" /> Pdf
                  </DropdownItem>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row lg:flex-row justify-around  items-center">
          <div className="flex-1">
            <div className="flex items-center">
              <InputGroup inside>
                <Input
                  type="text"
                  name="search"
                  className="h-8 py-1 w-full "
                  placeholder="Cari..."
                  onChange={(e) => filterSearch(e)}
                />
                <InputGroup.Addon>
                  <Icon icon="search" />
                </InputGroup.Addon>
              </InputGroup>
            </div>
          </div>
          <div className="flex-1">
            <div className="float-right">
              <Pagination
                className="pagination-justify-start"
                lengthMenu={[
                  { value: 10, label: 10 },
                  { value: 20, label: 20 },
                  { value: 40, label: 40 },
                ]}
                activePage={page}
                displayLength={displayLength}
                total={tableDataCount.length}
                ellipsis={true}
                boundaryLinks={true}
                onChangePage={handleChangePage}
                onChangeLength={handleChangeLength}
              />
            </div>
          </div>
        </div>
        <div className="w-full">
          <Tablea
            scroll={{ x: 1300 }}
            style={{ fontSize: 10 }}
            columns={columns}
            dataSource={data}
            bordered
            pagination={false}
          />
        </div>
        <div className="w-full">
          <Pagination
            lengthMenu={[
              { value: 10, label: 10 },
              { value: 20, label: 20 },
              { value: 40, label: 40 },
            ]}
            activePage={page}
            displayLength={displayLength}
            total={tableDataCount.length}
            ellipsis={true}
            boundaryLinks={true}
            onChangePage={handleChangePage}
            onChangeLength={handleChangeLength}
          />
        </div>
      </div>
    </>
  );
}

export default LaporanRincianKeuangan;
