/** @format */

import React, { useEffect, useState } from "react";
import { Menu, Dropdown, DatePicker, Button } from "antd";
import moment from "moment";
import { Select } from "@windmill/react-ui";
import {
  Icon,
  // IconButton,
  Table,
  Input,
  InputGroup,
  Form,
  // FormControl,
  Notification,
} from "rsuite";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as laporanRapbmService from "../../../services/v2/planningservice/laporan/rapbm";
import {
  drillDownProv,
  drillDownKab,
  drillDownMad,
} from "../../../services/v2/usermanservice/organisasiservice";
import { BreadCrumb } from "../../../components";
import { ExportToExcel } from "../../../components/Export/ExportToExcel";
import { formatRupiah } from "../../../utils/helper";
import { InfoIcon } from "../../../icons";
import { WrapSelect, LabelSelect, Main } from "./style";
import "./styles/style.css";

const { Column, HeaderCell, Cell, Pagination } = Table;

interface ICell {
  [index: string]: any;
  index: number | string;
  namaSumberDana: string;
  totalPendapatan: number | string | null;
  totalPengeluaran: number | string | null;
  saldo: number | string;
}

const formatNominal = (param: number): string => {
  return formatRupiah(param).replace("Rp", "").replace(" ", "");
};

const formatDataTable = (datas: any[]): ICell[] => {
  const formattedDatatabal: ICell[] = [];
  datas.forEach((el) => {
    formattedDatatabal.push({
      index: 1,
      namaSumberDana: "SUMBER DANA",
      totalPendapatan: "",
      totalPengeluaran: "",
      saldo: "",
    });
    formattedDatatabal.push({
      index: "A.",
      namaSumberDana: el.namaSumberDana.toUpperCase(),
      totalPendapatan: formatNominal(el.totalPendapatan),
      totalPengeluaran: "",
      saldo: formatNominal(el.totalPendapatan),
    });
    formattedDatatabal.push({
      index: "",
      namaSumberDana: "",
      totalPendapatan: "",
      totalPengeluaran: "",
      saldo: "",
    });
    formattedDatatabal.push({
      index: 2,
      namaSumberDana: "BELANJA",
      totalPendapatan: "",
      totalPengeluaran: "",
      saldo: "",
    });
    formattedDatatabal.push({
      index: "A.",
      namaSumberDana: "BELANJA NON EDM",
      totalPendapatan: "",
      totalPengeluaran: "",
      saldo: "",
    });
    el.pengeluaran.forEach((data, index) => {
      formattedDatatabal.push({
        index: `A.${index + 1}`,
        namaSumberDana: data.namaSnp.toUpperCase(),
        totalPendapatan: "",
        totalPengeluaran: formatNominal(data.total),
        saldo: "",
      });
    });
    formattedDatatabal.push({
      index: "",
      namaSumberDana: "TOTAL BELANJA",
      totalPendapatan: null,
      totalPengeluaran: null,
      saldo: formatNominal(el.totalPengeluaran),
    });
    formattedDatatabal.push({
      index: "",
      namaSumberDana: `SISA SALDO SUMBER DANA ${el.namaSumberDana.toUpperCase()}`,
      totalPendapatan: null,
      totalPengeluaran: null,
      saldo: formatNominal(el.totalPendapatan - el.totalPengeluaran),
    });
  });
  return formattedDatatabal;
};

const AlertSelectFilter = (props: { select: string }): JSX.Element => {
  return (
    <div className="w-full flex p-5 bg-blue-100 border-none mb-4">
      <div className="flex items-center">
        <div className="mr-3">
          <InfoIcon className="w-6" style={{ fill: "#0092c6" }} />
        </div>
        <div>
          <div className="text-gray-500 text-sm">
            Pilih {props.select} melalui filter
          </div>
        </div>
      </div>
    </div>
  );
};

const LaporanRapbm: React.FC = () => {
  const currentYear = localStorage.getItem("curTahunFromSelListOnHeader")!;
  const auth: any = JSON.parse(localStorage.getItem("auth")!);
  const groupRole = auth.group_role;
  const [originalDataReport, setOriginalDataReport] = useState<any[]>([]);
  const [dataTable, setDataTable] = useState<ICell[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [kantorPusatId, setKantorPusatId] = React.useState<string>("");
  const [kantorProvinsiId, setKantorProvinsiId] = React.useState("");
  const [showFilterProvinsi, setShowFilterProvinsi] =
    React.useState<boolean>(false);
  const [showFilterKotaKab, setShowFilterKotaKab] =
    React.useState<boolean>(false);
  const [showFilterMadrasah, setShowFilterMadrasah] =
    React.useState<boolean>(false);
  const [listKantorProvinsi, setListKantorProvinsi] = React.useState<any[]>([]);
  const [listKantorKotaKab, setListKantorKotaKab] = React.useState<any[]>([]);
  const [listMadrasah, setListMadrasah] = React.useState<
    {
      nama: string;
      id: string;
      nsm: string;
      kode_kecamatan: string;
      kode_kabkota: string;
      kode_provinsi: string;
    }[]
  >([]);
  const [selectedYear, setSelectedYear] = React.useState<string>(currentYear);
  const [selectedProvinsi, setSelectedProvinsi] = React.useState("");
  const [selectedKabkota, setSelectedKabkota] = React.useState("");
  const [selectedMadrasah, setSelectedMadrasah] = React.useState("");
  const [dataMadrasah, setDataMadrasah] = useState<any>({});
  const [page, setPage] = React.useState(1);
  const [displayLength, setDisplayLength] = React.useState(10);
  const [tableDataCount, setTableDataCount] = React.useState<number>(0);
  const refProvinsi: { kode: string; nama: string }[] = JSON.parse(
    localStorage.getItem("provdropdown")!,
  );
  const refKabkota: {
    kode: string;
    nama: string;
    kode_provinsi: string;
  }[] = JSON.parse(localStorage.getItem("kabkotadropdown")!);
  const refKecamatan: {
    kode: string;
    nama: string;
  }[] = JSON.parse(localStorage.getItem("kecamatan")!);
  useEffect(() => {
    if (groupRole === "madrasah") {
      setDataMadrasah(auth.madrasah);
    }
    getDropDownFilter();
  }, []);
  useEffect(() => {
    setDataTable(formatDataTable(handleDataPagination(originalDataReport)));
  }, [page, displayLength, tableDataCount]);
  useEffect(() => {
    if (listMadrasah.length > 0 && selectedMadrasah) {
      const finding = listMadrasah.find(
        (madrasah) => madrasah.id === selectedMadrasah,
      );
      console.log("finding ", finding);
      setDataMadrasah(
        listMadrasah.find((madrasah) => madrasah.id === selectedMadrasah),
      );
    }
  }, [listMadrasah, selectedMadrasah]);
  const getDropDownFilter = (): void => {
    if (auth.kantor_pusat) {
      setKantorPusatId(auth.kantor_pusat.id);
      setShowFilterProvinsi(true);
      setShowFilterKotaKab(true);
      setShowFilterMadrasah(true);
      drillDownProv(auth.kantor_pusat.id).then((res) => {
        setListKantorProvinsi(res.data.return);
      });
    } else if (auth.kantor_provinsi) {
      setKantorPusatId(auth.kantor_provinsi.kantor_pusat_id);
      setKantorProvinsiId(auth.kantor_provinsi.id);
      setSelectedProvinsi(auth.kantor_provinsi.kode_provinsi);
      setShowFilterKotaKab(true);
      setShowFilterMadrasah(true);
      drillDownKab({
        pusat: auth.kantor_provinsi.kantor_pusat_id,
        prov: auth.kantor_provinsi.id,
      }).then((res) => {
        setListKantorKotaKab(res.data.return);
      });
    } else if (auth.kantor_kabkota) {
      setSelectedKabkota(auth.kantor_kabkota.kode_kabkota);
      setShowFilterMadrasah(true);
      drillDownMad({
        pusat: auth.kantor_kabkota.kantor_pusat_id,
        prov: auth.kantor_kabkota.kantor_provinsi_id,
        kab: auth.kantor_kabkota.id,
      }).then((res) => {
        setListMadrasah(
          res.data.return.map((mad) => ({
            nama: mad.nama,
            id: mad.id,
            nsm: mad.nsm,
            kode_kecamatan: mad.kode_kecamatan,
            kode_kabkota: mad.kode_kabkota,
            kode_provinsi: mad.kode_provinsi,
          })),
        );
      });
    } else {
      setSelectedMadrasah(auth.madrasah.id);
      setLoading(true);
      getLaporanRapbm(selectedYear, auth.madrasah.id);
    }
  };
  const getLaporanRapbm = (year: string, madrasahId: string): void => {
    laporanRapbmService.browse({ tahun: year, madrasahId }).then((res) => {
      setOriginalDataReport(res);
      setTableDataCount(res.length);
      setDataTable(formatDataTable(handleDataPagination(res)));
      setLoading(false);
    });
  };
  const handleExportPdf = () => {
    const doc = new jsPDF({
      putOnlyUsedFonts: true,
      orientation: "landscape",
      floatPrecision: 16,
    });
    const fline = 10;
    doc.setFont("times", "bold");
    doc.text("LAPORAN RAPBM", 150, 10, { align: "center" });
    doc.text(`Tahun : ${selectedYear}`, 150, 18, { align: "center" });
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    doc.rect(225, 25, 60, 7);
    doc.rect(225, 25, 60, 25);
    doc.text("Format BOS K-2", 228, 30);
    doc.text("Diisi oleh Bendahara Madrasah", 228, 38);
    doc.text("Disimpan di Madrasah", 228, 48);
    doc.text("Nama Madrasah", fline, 30);
    doc.text(
      ": " + (Object.keys(dataMadrasah).length > 0 && dataMadrasah.nama),
      fline + 40,
      30,
    );
    doc.text("NSM", fline, 35);
    doc.text(
      ": " + (Object.keys(dataMadrasah).length > 0 && dataMadrasah.nsm),
      fline + 40,
      35,
    );
    doc.text("Kecamatan", fline, 40);
    doc.text(
      ": " +
        (Object.keys(dataMadrasah).length > 0 && dataMadrasah.kode_kecamatan
          ? refKecamatan
              .filter((e) => e.kode === dataMadrasah.kode_kecamatan)
              .map((e) => e.nama)
          : "-"),
      fline + 40,
      40,
    );
    doc.text("Kabupaten / Kota", fline, 45);
    doc.text(
      ": " +
        (Object.keys(dataMadrasah).length > 0 && dataMadrasah.kode_kabkota
          ? refKabkota
              .filter((e) => e.kode === dataMadrasah.kode_kabkota)
              .map((e) => e.nama)
          : "-"),
      fline + 40,
      45,
    );
    doc.text("Provinsi", fline, 50);
    doc.text(
      ": " +
        (Object.keys(dataMadrasah).length > 0 && dataMadrasah.kode_provinsi
          ? refProvinsi
              .filter((e) => e.kode === dataMadrasah.kode_provinsi)
              .map((e) => e.nama)
          : "-"),
      fline + 40,
      50,
    );

    const headers: any = [
      {
        id: "index",
        dataKey: "index",
        padding: 0,
        header: "No Urut",
        width: 25,
      },
      {
        id: "namaSumberDana",
        dataKey: "namaSumberDana",
        padding: 0,
        header: "Sumber Dana",
        width: 25,
      },
      {
        id: "totalPendapatan",
        dataKey: "totalPendapatan",
        padding: 0,
        header: "Total Pendapatan",
        width: 25,
      },
      {
        id: "totalPengeluaran",
        dataKey: "totalPengeluaran",
        padding: 0,
        header: "Total Pengeluaran",
        width: 25,
      },
      { id: "saldo", dataKey: "saldo", padding: 0, header: "Saldo", width: 25 },
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
        1: { halign: "left", cellWidth: "auto" },
        2: { halign: "right", cellWidth: "auto" },
        3: { halign: "right", cellWidth: "auto" },
        4: { halign: "right", cellWidth: "auto" },
      },
      startY: 55,
      margin: { top: 10, left: 10, right: 10 },
      columns: headers,
      body: formatDataTable(originalDataReport).map((data) => {
        const row: { [index: string]: any }[] = [];
        Object.keys(data).forEach((el) => {
          if (
            (data.namaSumberDana === "TOTAL BELANJA" ||
              data.namaSumberDana.includes("SISA SALDO")) &&
            ["totalPendapatan", "totalPengeluaran"].includes(el)
          ) {
            return;
          }
          const cell: { [index: string]: any } = {
            content: data[el] ?? "",
            colSpan: 1,
          };
          if (
            el === "namaSumberDana" &&
            (data[el] === "TOTAL BELANJA" || data[el].includes("SISA SALDO"))
          ) {
            cell.colSpan = 3;
            cell.styles = { halign: "center" };
          }
          row.push(cell);
        });
        return row;
      }),
      didDrawPage: (d) => las.push(d.cursor),
    });
    let lastLine = 7 + (las.length !== 0 ? las[0].y : 0);
    doc.text("Mengetahui,", fline, lastLine);
    doc.text(moment().format("dddd, DD MMMM YYYY"), 228, lastLine);
    doc.text("Kepala Madrasah", fline, lastLine + 5);
    doc.text("Bendahara Madrasah", 228, lastLine + 5);
    doc.text("(.................)", fline, lastLine + 20);
    doc.text("(.................)", 228, lastLine + 20);
    doc.output("dataurlnewwindow", { filename: "laporan-rapbm-rekap" });
    Notification["success"]({
      title: "Success",
      description: "Data berhasil di export",
    });
  };

  const handleClickExcel = () => {
    ExportToExcel(formatDataTable(originalDataReport), "laporan-rapbm");
  };

  const menuExport = (): JSX.Element => {
    return (
      <Menu>
        <Menu.Item key={1} onClick={handleExportPdf}>
          PDF
        </Menu.Item>
        <Menu.Item key={2} onClick={handleClickExcel}>
          Excel
        </Menu.Item>
      </Menu>
    );
  };
  const handleSearch = (val: string): void => {
    const term = val.toLowerCase();
    setDataTable(
      formatDataTable(
        handleDataPagination(
          originalDataReport.filter(
            (data) =>
              data.namaSumberDana.toLowerCase().includes(term) ||
              data.pengeluaran
                .map((peng) => peng.namaSnp)
                .filter((peng) => peng.toLowerCase().includes(term)).length > 0,
          ),
        ),
      ),
    );
  };
  const handleDataPagination = (datas: any[]) => {
    return datas.filter((v, i) => {
      const start = displayLength * (page - 1);
      const end = start + displayLength;
      return i >= start && i < end;
    });
  };
  const handleChangePage = (dataKey: number): void => {
    setPage(dataKey);
  };
  const handleChangeLength = (dataKey: number): void => {
    setPage(page);
    setDisplayLength(dataKey);
  };
  const handleChangeProvinsi: React.ChangeEventHandler<HTMLSelectElement> = (
    e,
  ) => {
    setSelectedProvinsi(e.currentTarget.value);
    setSelectedKabkota("");
    setSelectedMadrasah("");
    const filtered = listKantorProvinsi.filter(
      (kantor) => kantor.kode_provinsi === e.currentTarget.value,
    );
    if (filtered.length > 0) {
      setKantorProvinsiId(filtered[0].id);
      const params = {
        pusat: kantorPusatId,
        prov: filtered[0].id,
      };
      drillDownKab(params).then((res) => {
        setListKantorKotaKab(res.data.return);
      });
    }
  };
  const handleChangeKotaKab: React.ChangeEventHandler<HTMLSelectElement> = (
    e,
  ) => {
    setSelectedKabkota(e.target.value);
    setSelectedMadrasah("");
    const filtered = listKantorKotaKab.filter(
      (kantor) => kantor.kode_kabkota === e.currentTarget.value,
    );
    if (filtered.length > 0) {
      const params = {
        pusat: kantorPusatId,
        prov: kantorProvinsiId,
        kab: filtered[0].id,
      };
      drillDownMad(params).then((res) => {
        console.log("res get madrasah ", res);
        setListMadrasah(
          res.data.return.map((mad) => ({
            nama: mad.nama,
            id: mad.id,
            nsm: mad.nsm,
            kode_kecamatan: mad.kode_kecamatan,
            kode_kabkota: mad.kode_kabkota,
            kode_provinsi: mad.kode_provinsi,
          })),
        );
      });
    }
  };
  const handleChangeMadrasah: React.ChangeEventHandler<HTMLSelectElement> = (
    e,
  ) => {
    setSelectedMadrasah(e.target.value);
    setLoading(true);
    getLaporanRapbm(selectedYear, e.target.value);
  };
  const handleChangeYear = (
    value: moment.Moment | null,
    dateString: string,
  ): void => {
    setSelectedYear(dateString);
    if (selectedMadrasah) {
      setLoading(true);
      getLaporanRapbm(dateString, selectedMadrasah);
    }
  };
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Laporan" },
    { path: "/", breadcrumbName: "Laporan RAPBM" },
  ];
  return (
    <React.Fragment>
      <BreadCrumb routes={itemBreadcrumb} title="Laporan RAPBM" />
      <Main>
        <Form>
          <div className="grid grid-cols-2 rapbm-rekap__filter">
            <WrapSelect>
              <div className="w-1/3">
                <LabelSelect>Tahun</LabelSelect>
              </div>
              <div className="w-2/3">
                <DatePicker
                  picker="year"
                  allowClear={false}
                  value={moment(selectedYear)}
                  onChange={handleChangeYear}
                  placeholder="Pilih Tahun"
                  style={{ width: "100%" }}
                />
              </div>
            </WrapSelect>
            {showFilterProvinsi && (
              <WrapSelect>
                <div className="w-1/3">
                  <LabelSelect>Provinsi</LabelSelect>
                </div>
                <div className="w-2/3">
                  <Select
                    className="mt-1 mb-1 text-gray-500 table-cell"
                    value={selectedProvinsi}
                    onChange={handleChangeProvinsi}>
                    <option value="">Pilih Provinsi</option>
                    {refProvinsi &&
                      refProvinsi.map((el) => {
                        return (
                          <option key={el.kode} value={el.kode}>
                            {el.nama}
                          </option>
                        );
                      })}
                  </Select>
                </div>
              </WrapSelect>
            )}
            {showFilterKotaKab && (
              <WrapSelect>
                <div className="w-1/3">
                  <LabelSelect>Kota/Kab</LabelSelect>
                </div>
                <div className="w-2/3">
                  <Select
                    className="mt-1 mb-1 text-gray-500 table-cell"
                    disabled={
                      !selectedProvinsi || listKantorKotaKab.length === 0
                    }
                    value={selectedKabkota}
                    onChange={handleChangeKotaKab}>
                    <option value="">Pilih Kab/Kota</option>
                    {refKabkota &&
                      refKabkota
                        .filter((el) => el.kode_provinsi === selectedProvinsi)
                        .map((el) => {
                          return (
                            <option key={el.kode} value={el.kode}>
                              {el.nama}
                            </option>
                          );
                        })}
                  </Select>
                </div>
              </WrapSelect>
            )}
            {showFilterMadrasah && (
              <WrapSelect>
                <div className="w-1/3">
                  <LabelSelect>Madrasah</LabelSelect>
                </div>
                <div className="w-2/3">
                  <Select
                    disabled={!selectedKabkota || listMadrasah.length === 0}
                    value={selectedMadrasah}
                    onChange={handleChangeMadrasah}
                    className="mt-1 mb-1 text-gray-500 table-cell">
                    <option value="">Pilih Madrasah</option>
                    {listMadrasah.map((el) => {
                      return (
                        <option key={el.id} value={el.id}>
                          {el.nama}
                        </option>
                      );
                    })}
                  </Select>
                </div>
              </WrapSelect>
            )}
          </div>
        </Form>
      </Main>
      <Main className="table-rapbm-wrapper">
        {showFilterProvinsi && !selectedProvinsi ? (
          <AlertSelectFilter select="provinsi" />
        ) : showFilterKotaKab && !selectedKabkota ? (
          <AlertSelectFilter select="kab/kota" />
        ) : (
          showFilterMadrasah &&
          !selectedMadrasah && <AlertSelectFilter select="madrasah" />
        )}
        <div className="flex justify-end">
          <Dropdown overlay={menuExport()} placement="bottomLeft">
            <Button>Export</Button>
          </Dropdown>
        </div>
        <div className="md:flex md:items-center mt-3 justify-between">
          <div className="md:w-1/3">
            <InputGroup inside>
              <Input
                type="text"
                name="search"
                className="h-8 py-1 w-full pl-3"
                onChange={(e) => handleSearch(e)}
                placeholder="Cari..."
              />
              <InputGroup.Addon>
                <Icon icon="search" />
              </InputGroup.Addon>
            </InputGroup>
          </div>
          <Pagination
            lengthMenu={[
              { value: 10, label: 10 },
              { value: 20, label: 20 },
              { value: 40, label: 40 },
            ]}
            activePage={page}
            displayLength={displayLength}
            total={tableDataCount}
            ellipsis={true}
            boundaryLinks={true}
            onChangePage={handleChangePage}
            onChangeLength={handleChangeLength}
          />
        </div>
        <Table
          data={dataTable}
          loading={loading}
          autoHeight
          wordWrap
          hover={false}
          cellBordered
          renderEmpty={() => (
            <div className="flex justify-center items-center h-full">
              <h3>Data Tidak Ditemukan</h3>
            </div>
          )}>
          <Column align="center" verticalAlign="top">
            <HeaderCell></HeaderCell>
            <Cell dataKey="index" />
          </Column>
          <Column width={300} verticalAlign="top" colSpan={3}>
            <HeaderCell>Keterangan</HeaderCell>
            <Cell dataKey="namaSumberDana" />
          </Column>
          <Column minWidth={120} flexGrow={1} align="right" verticalAlign="top">
            <HeaderCell>Pendapatan</HeaderCell>
            <Cell dataKey="totalPendapatan" />
          </Column>
          <Column minWidth={120} flexGrow={1} align="right" verticalAlign="top">
            <HeaderCell>Belanja</HeaderCell>
            <Cell dataKey="totalPengeluaran" />
          </Column>
          <Column minWidth={120} flexGrow={1} align="right" verticalAlign="top">
            <HeaderCell>Saldo</HeaderCell>
            <Cell dataKey="saldo" />
          </Column>
        </Table>
      </Main>
    </React.Fragment>
  );
};

export default LaporanRapbm;
