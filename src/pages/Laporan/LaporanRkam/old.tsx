/** @format */

import React, { useEffect } from "react";
import moment from "moment";
import { Menu, Dropdown, Button, DatePicker } from "antd";
import { Select } from "@windmill/react-ui";
import {
  Icon,
  IconButton,
  Table,
  Input,
  InputGroup,
  Form,
  Notification,
} from "rsuite";
import { WrapSelect, LabelSelect, Main } from "./style";
import { InfoIcon } from "../../../icons";
import { BreadCrumb } from "../../../components";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { ExportToExcel } from "../../../components/Export/ExportToExcel";
import { formatRupiah } from "../../../utils/helper";
import {
  drillDownProv,
  drillDownKab,
  drillDownMad,
} from "../../../services/v2/usermanservice/organisasiservice";
import * as laporanRkamService from "../../../services/v2/planningservice/laporan/rkam";
import {
  getReferensiRencanaRincianKegiatanDropdown,
  getReferensiSumberDana,
} from "../../../services/reference";
import "./styles/style.css";

const { Column, HeaderCell, Cell, Pagination } = Table;

const ExpandCell = ({
  rowData,
  dataKey,
  expandedRowKeys,
  onChange,
  ...props
}) => {
  return (
    <Cell {...props}>
      <IconButton
        size="xs"
        appearance="subtle"
        onClick={() => {
          onChange(rowData);
        }}
        icon={
          <Icon
            icon={
              expandedRowKeys.some((key) => key === rowData[dataKey])
                ? "minus-square-o"
                : "plus-square-o"
            }
          />
        }
      />
    </Cell>
  );
};

const handleExpandedHelper = (
  rowData,
  rowKey: string,
  expandedRowKeys,
  setExpandedRowKeys,
) => {
  let open: boolean = false;
  const nextExpandedRowKeys: any[] = [];
  expandedRowKeys.forEach((key) => {
    if (key === rowData[rowKey]) {
      open = true;
    } else {
      nextExpandedRowKeys.push(key);
    }
  });

  if (!open) {
    nextExpandedRowKeys.push(rowData[rowKey]);
  }
  setExpandedRowKeys(nextExpandedRowKeys);
};

const getTotalNestedField = (data: object, field: string): number => {
  if (Array.isArray(data)) {
    return data.reduce((total, obj) => obj[field] + total, 0);
  } else {
    const keys = Object.keys(data);
    if (keys.length > 0) {
      return keys.reduce(
        (total, key) => getTotalNestedField(data[key], field) + total,
        0,
      );
    }
    return 0;
  }
};

const getNestedField = (value: string, data: object): string[] => {
  return Object.keys(data).filter((key1) => {
    return (
      key1.toLowerCase().includes(value) ||
      Object.keys(data[key1]).filter((key2) => {
        return key2.toLowerCase().includes(value);
      }).length > 0
    );
  });
};

const formatNominal = (param: number): string => {
  return formatRupiah(param).replace("Rp", "").replace(" ", "");
};

const getSumberDana = (): Promise<any> => {
  return localStorage.getItem("referensi-sumberdana")
    ? Promise.resolve(JSON.parse(localStorage.getItem("referensi-sumberdana")!))
    : getReferensiSumberDana();
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

const TableLevel1 = ({
  data,
  loading,
  displayLength,
  page,
  defaultExpandAllRows,
  rencanaKegiatanDropdown,
  sumberDanaOptions,
}) => {
  let displayTahap1 = false;
  displayTahap1 = Object.keys(data).includes("apbn_bos_semester_1");
  const rowKey = "kodeSumberDana";
  const dataTable = Object.keys(data)
    .map((el, index) => {
      const rencanaBelanja = formatNominal(
        getTotalNestedField(data[el], "total"),
      );
      const rencanaPendapatan = formatNominal(
        getTotalNestedField(data[el], "totalPendapatan"),
      );
      return {
        [rowKey]: el,
        namaSumberDana: sumberDanaOptions.find(
          (sumberDana) => sumberDana.value === el,
        )?.label,
        rencanaPendapatan,
        rencanaBelanja,
        no_urut: index + 1,
      };
    })
    .filter((v, i) => {
      const start = displayLength * (page - 1);
      const end = start + displayLength;
      return i >= start && i < end;
    });
  const [expandedRowKeys, setExpandedRowKeys] = React.useState<any[]>([]);
  const handleExpanded = (rowData, dataKey) => {
    handleExpandedHelper(rowData, rowKey, expandedRowKeys, setExpandedRowKeys);
  };
  return (
    <Table
      wordWrap
      cellBordered
      autoHeight
      loading={loading}
      hover={false}
      data={dataTable}
      rowKey={rowKey}
      expandedRowKeys={expandedRowKeys}
      defaultExpandAllRows={defaultExpandAllRows}
      rowExpandedHeight={300}
      renderEmpty={() => (
        <div className="flex justify-center items-center h-full">
          <h3>Data Tidak Ditemukan</h3>
        </div>
      )}
      renderRowExpanded={(rowData) => {
        return (
          <TableLevel2
            data={data[rowData[rowKey]]}
            rencanaKegiatanDropdown={rencanaKegiatanDropdown}
            displayTahap1={displayTahap1}
          />
        );
      }}>
      <Column width={70} align="center">
        <HeaderCell></HeaderCell>
        <ExpandCell
          rowData={data}
          dataKey={rowKey}
          expandedRowKeys={expandedRowKeys}
          onChange={handleExpanded}
        />
      </Column>
      <Column width={150} verticalAlign="top">
        <HeaderCell>No Urut</HeaderCell>
        <Cell dataKey="no_urut" />
      </Column>
      <Column width={280} verticalAlign="top">
        <HeaderCell>Sumber Dana</HeaderCell>
        <Cell dataKey="namaSumberDana" />
      </Column>
      <Column width={280} verticalAlign="top" align="right">
        <HeaderCell>Rencana Pendapatan (dalam Rp.)</HeaderCell>
        <Cell dataKey="rencanaPendapatan" />
      </Column>
      <Column width={280} verticalAlign="top" align="right">
        <HeaderCell>Rencana Belanja (dalam Rp.)</HeaderCell>
        <Cell dataKey="rencanaBelanja" />
      </Column>
      <Column width={150} verticalAlign="top" align="right">
        <HeaderCell>Tahap 1</HeaderCell>
        <Cell dataKey={displayTahap1 ? "rencanaBelanja" : ""} />
      </Column>
      <Column width={150} verticalAlign="top" align="right">
        <HeaderCell>Tahap 2</HeaderCell>
        <Cell dataKey={displayTahap1 ? "" : "rencanaBelanja"} />
      </Column>
    </Table>
  );
};

const TableLevel2 = ({ data, displayTahap1, rencanaKegiatanDropdown }) => {
  const rowKey = "namaKegiatan";
  const dataTable = Object.keys(data).map((el, index) => {
    const rencanaBelanja = formatNominal(
      getTotalNestedField(data[el], "total"),
    );
    return {
      [rowKey]: el,
      rencanaBelanja,
      no_urut: index + 1,
    };
  });
  const [expandedRowKeys, setExpandedRowKeys] = React.useState<any[]>([]);
  const handleExpanded = (rowData, dataKey) => {
    handleExpandedHelper(rowData, rowKey, expandedRowKeys, setExpandedRowKeys);
  };
  return (
    <Table
      wordWrap
      cellBordered
      autoHeight
      showHeader={false}
      hover={false}
      data={dataTable}
      rowKey={rowKey}
      expandedRowKeys={expandedRowKeys}
      rowExpandedHeight={300}
      renderRowExpanded={(rowData) => {
        return (
          <TableLevel3
            data={data[rowData[rowKey]]}
            rencanaKegiatanDropdown={rencanaKegiatanDropdown}
            displayTahap1={displayTahap1}
          />
        );
      }}>
      <Column width={70} align="center">
        <HeaderCell></HeaderCell>
        <ExpandCell
          rowData={data}
          dataKey={rowKey}
          expandedRowKeys={expandedRowKeys}
          onChange={handleExpanded}
        />
      </Column>
      <Column width={150} verticalAlign="top">
        <HeaderCell>No Urut</HeaderCell>
        <Cell dataKey="no_urut" />
      </Column>
      <Column width={300} verticalAlign="top">
        <HeaderCell>Kegiatan</HeaderCell>
        <Cell>
          {(rowData) => (
            <div>
              <h3>Kegiatan</h3>
              <p>{rowData.namaKegiatan}</p>
            </div>
          )}
        </Cell>
      </Column>
      <Column width={280} verticalAlign="top" align="right">
        <HeaderCell>Rencana Belanja (dalam Rp.)</HeaderCell>
        <Cell dataKey="rencanaBelanja" />
      </Column>
      <Column width={150} verticalAlign="top" align="right">
        <HeaderCell>Tahap 1</HeaderCell>
        <Cell dataKey={displayTahap1 ? "rencanaBelanja" : ""} />
      </Column>
      <Column width={150} verticalAlign="top" align="right">
        <HeaderCell>Tahap 2</HeaderCell>
        <Cell dataKey={displayTahap1 ? "" : "rencanaBelanja"} />
      </Column>
    </Table>
  );
};

const TableLevel3 = ({ data, displayTahap1, rencanaKegiatanDropdown }) => {
  const rowKey = "namaSubKegiatan";
  const dataTable = Object.keys(data).map((el, index) => {
    const rencanaBelanja = formatNominal(
      getTotalNestedField(data[el], "total"),
    );
    return {
      [rowKey]: el,
      rencanaBelanja,
      no_urut: index + 1,
    };
  });
  const [expandedRowKeys, setExpandedRowKeys] = React.useState<any[]>([]);
  const handleExpanded = (rowData, dataKey) => {
    handleExpandedHelper(rowData, rowKey, expandedRowKeys, setExpandedRowKeys);
  };
  return (
    <Table
      wordWrap
      cellBordered
      autoHeight
      hover={false}
      showHeader={false}
      data={dataTable}
      rowKey={rowKey}
      expandedRowKeys={expandedRowKeys}
      rowExpandedHeight={300}
      renderRowExpanded={(rowData) => {
        return (
          <TableLevel4
            data={data[rowData[rowKey]]}
            rencanaKegiatanDropdown={rencanaKegiatanDropdown}
            displayTahap1={displayTahap1}
          />
        );
      }}>
      <Column width={70} align="center">
        <HeaderCell></HeaderCell>
        <ExpandCell
          rowData={data}
          dataKey={rowKey}
          expandedRowKeys={expandedRowKeys}
          onChange={handleExpanded}
        />
      </Column>
      <Column width={150} verticalAlign="top">
        <HeaderCell>No Urut</HeaderCell>
        <Cell dataKey="no_urut" />
      </Column>
      <Column width={300} verticalAlign="top">
        <HeaderCell>Sub Kegiatan</HeaderCell>
        <Cell>
          {(rowData) => (
            <div>
              <h3>Sub-Kegiatan</h3>
              <p>{rowData.namaSubKegiatan}</p>
            </div>
          )}
        </Cell>
      </Column>
      <Column width={280} verticalAlign="top" align="right">
        <HeaderCell>Rencana Belanja (dalam Rp.)</HeaderCell>
        <Cell dataKey="rencanaBelanja" />
      </Column>
      <Column width={150} verticalAlign="top" align="right">
        <HeaderCell>Tahap 1</HeaderCell>
        <Cell dataKey={displayTahap1 ? "rencanaBelanja" : ""} />
      </Column>
      <Column width={150} verticalAlign="top" align="right">
        <HeaderCell>Tahap 2</HeaderCell>
        <Cell dataKey={displayTahap1 ? "" : "rencanaBelanja"} />
      </Column>
    </Table>
  );
};

const TableLevel4 = ({ data, displayTahap1, rencanaKegiatanDropdown }) => {
  const rowKey = "namaKategori";
  const dataTable = Object.keys(data).map((el, index) => {
    const kompBiaya = rencanaKegiatanDropdown.find((komp) => komp.id === el);
    return {
      ...data[el][0],
      [rowKey]: kompBiaya?.nama_kategori || "",
      namaKomponen: kompBiaya?.nama || "",
      no_urut: index + 1,
      hargaSatuanRupiah: formatRupiah(data[el][0]["hargaSatuan"]),
      totalRupiah: formatRupiah(data[el][0]["total"]),
    };
  });
  return (
    <Table wordWrap cellBordered hover={false} autoHeight data={dataTable}>
      <Column width={150} verticalAlign="top">
        <HeaderCell>No Urut</HeaderCell>
        <Cell dataKey="no_urut" />
      </Column>
      <Column width={300} verticalAlign="top">
        <HeaderCell>Kategori</HeaderCell>
        <Cell dataKey="namaKategori" />
      </Column>
      <Column width={280} verticalAlign="top">
        <HeaderCell>Nama</HeaderCell>
        <Cell dataKey="namaKomponen" />
      </Column>
      <Column width={150} verticalAlign="top" align="right">
        <HeaderCell>Harga Satuan</HeaderCell>
        <Cell dataKey="hargaSatuanRupiah" />
      </Column>
      <Column width={150} verticalAlign="top" align="center">
        <HeaderCell>Jumlah</HeaderCell>
        <Cell dataKey="totalKuantitas" />
      </Column>
      <Column width={150} verticalAlign="top" align="right">
        <HeaderCell>Total Harga</HeaderCell>
        <Cell dataKey="totalRupiah" />
      </Column>
      <Column width={150} verticalAlign="top" align="right">
        <HeaderCell>Tahap 1</HeaderCell>
        <Cell dataKey={displayTahap1 ? "totalRupiah" : ""} />
      </Column>
      <Column width={150} verticalAlign="top" align="right">
        <HeaderCell>Tahap 2</HeaderCell>
        <Cell dataKey={displayTahap1 ? "" : "totalRupiah"} />
      </Column>
    </Table>
  );
};

const LaporanRkam = (): JSX.Element => {
  const currentYear = localStorage.getItem("curTahunFromSelListOnHeader")!;
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
  const refKecamatan: {
    kode: string;
    nama: string;
  }[] = JSON.parse(localStorage.getItem("kecamatan")!);
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Laporan" },
    { path: "/", breadcrumbName: "Laporan RKAM" },
  ];
  const [page, setPage] = React.useState(1);
  const [displayLength, setDisplayLength] = React.useState(10);
  const [rencanaKegiatanDropdown, setRencanaKegiatanDropdown] = React.useState<
    {
      id: string;
      nama: string;
      nama_kategori: string;
      satuan: string;
      [key: string]: any;
    }[]
  >([]);
  const [tableData, setTableData] = React.useState<any>({});
  const [dataExport, setDataExport] = React.useState<any[]>([]);
  const [displayedTableData, setDisplayedTableData] = React.useState<any>({});
  const [tableDataCount, setTableDataCount] = React.useState<number>(0);
  const [sumberDanaOptions, setSumberDanaOptions] = React.useState<
    {
      label: string;
      value: string;
    }[]
  >([{ label: "Semua", value: "semua" }]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [defaultExpandAllRows, setDefaultExpandAllRows] =
    React.useState<boolean>(false);
  // const [openDropdownFilter, setOpenDropdownFilter] = React.useState(false);
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
  const [dataMadrasah, setDataMadrasah] = React.useState<any>({});
  const [selectedSumberDana, setSelectedSumberDana] = React.useState("");
  const [selectedYear, setSelectedYear] = React.useState<string>(currentYear);
  const [selectedProvinsi, setSelectedProvinsi] = React.useState("");
  const [selectedKabkota, setSelectedKabkota] = React.useState("");
  const [selectedMadrasah, setSelectedMadrasah] = React.useState("");

  useEffect(() => {
    if (groupRole === "madrasah") {
      setDataMadrasah(auth.madrasah);
    }
    getDropDownFilter();
    getSumberDana().then((res) => {
      setSumberDanaOptions([
        ...sumberDanaOptions,
        ...res.map((data) => ({ label: data.nama, value: data.kode })),
      ]);
    });
  }, []);

  useEffect(() => {
    if (
      rencanaKegiatanDropdown.length > 0 &&
      Object.keys(displayedTableData).length > 0
    ) {
      handleDataExport(displayedTableData, sumberDanaOptions);
    }
  }, [rencanaKegiatanDropdown, displayedTableData]);

  useEffect(() => {
    if (listMadrasah.length > 0 && selectedMadrasah) {
      setDataMadrasah(
        listMadrasah.find((madrasah) => madrasah.id === selectedMadrasah),
      );
    }
  }, [listMadrasah, selectedMadrasah]);

  const getDropDownFilter = (): void => {
    const auth: any = JSON.parse(localStorage.getItem("auth")!);
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
      getListTable(selectedYear, auth.madrasah.id);
    }
  };

  function handleExportPdf() {
    const doc = new jsPDF({
      putOnlyUsedFonts: true,
      orientation: "landscape",
      floatPrecision: 16,
    });
    const fline = 10;
    doc.setFont("times", "bold");
    doc.text("LAPORAN RKAM", 150, 10, { align: "center" });
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
        id: "kode",
        dataKey: "kode",
        padding: 0,
        header: "No Kode",
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
        id: "uraian",
        dataKey: "uraian",
        padding: 0,
        header: "Uraian",
        width: 25,
      },
      {
        id: "koefisien",
        dataKey: "koefisien",
        padding: 0,
        header: "Koefisien",
        width: 25,
      },
      {
        id: "harga",
        dataKey: "harga",
        padding: 0,
        header: "Harga",
        width: 25,
      },
      {
        id: "pajak",
        dataKey: "pajak",
        padding: 0,
        header: "Pajak",
        width: 25,
      },
      {
        id: "jumlah",
        dataKey: "jumlah",
        padding: 0,
        header: "Jumlah",
        width: 25,
      },
      {
        id: "tahap_1",
        dataKey: "tahap_1",
        padding: 0,
        header: "Tahap 1",
        width: 25,
      },
      {
        id: "tahap_2",
        dataKey: "tahap_2",
        padding: 0,
        header: "Tahap 2",
        width: 25,
      },
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
        5: { halign: "right", cellWidth: 25 },
        7: { halign: "right", cellWidth: 25 },
        8: { halign: "right", cellWidth: 25 },
        9: { halign: "right", cellWidth: 25 },
      },
      startY: 55,
      margin: { top: 10, left: 10, right: 10 },
      columns: headers,
      body: dataExport,
      didDrawPage: (d) => las.push(d.cursor),
    });
    let lastLine = 7 + (las.length !== 0 ? las[0].y : 0);
    doc.text("Mengetahui,", fline, lastLine);
    doc.text(moment().format("dddd, DD MMMM YYYY"), 228, lastLine);
    doc.text("Kepala Madrasah", fline, lastLine + 5);
    doc.text("Bendahara Madrasah", 228, lastLine + 5);
    doc.text("(.................)", fline, lastLine + 20);
    doc.text("(.................)", 228, lastLine + 20);

    doc.output("dataurlnewwindow", { filename: "laporan-rkam" });
    Notification["success"]({
      title: "Success",
      description: "Data berhasil di export",
    });
  }

  const menuExport = (): JSX.Element => {
    const handleClickExcel = () => {
      const dataExportExcel = dataExport.map((data) => {
        const { level, kodeSumberDana, ...deletedLevelKey } = data;
        return deletedLevelKey;
      });
      ExportToExcel(dataExportExcel, "laporan-erkam");
    };
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

  const getListTable = (year: string, madrasahId: string): void => {
    getSumberDana()
      .then((res) => {
        setSumberDanaOptions([
          ...sumberDanaOptions,
          ...res.map((data) => ({ label: data.nama, value: data.kode })),
        ]);
        return getReferensiRencanaRincianKegiatanDropdown(selectedYear);
      })
      .then((res) => {
        setRencanaKegiatanDropdown(res);
      })
      .then(() => laporanRkamService.browse(year, madrasahId))
      .then((res) => {
        setTableData(res);
        setDisplayedTableData(res);
        setTableDataCount(Object.keys(res).length);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleDataExport = (
    laporanBySumberDana: any,
    sumberDanaOptions,
  ): void => {
    const modifiedDataExport: any[] = [];
    let index = 0;
    // level 1, sumber dana
    Object.keys(laporanBySumberDana).forEach((kodeSumberDana) => {
      index += 1;
      modifiedDataExport.push({
        index,
        namaSumberDana: sumberDanaOptions.find(
          (sumberDana) => sumberDana.value === kodeSumberDana,
        )?.label,
      });
      // level 2, kegiatan
      const sumberDana = laporanBySumberDana[kodeSumberDana];
      Object.keys(sumberDana).forEach((namaKegiatan) => {
        index += 1;
        const firstKegiatan = sumberDana[namaKegiatan];
        const firstSubKegiatan = firstKegiatan[Object.keys(firstKegiatan)[0]];
        const kode =
          firstSubKegiatan[Object.keys(firstSubKegiatan)[0]][0].kodeKegiatan;
        modifiedDataExport.push({
          index,
          uraian: namaKegiatan,
          kode,
          jumlah: formatNominal(
            getTotalNestedField(sumberDana[namaKegiatan], "total"),
          ),
          tahap_1:
            kodeSumberDana === "apbn_bos_semester_1"
              ? formatNominal(
                  getTotalNestedField(sumberDana[namaKegiatan], "total"),
                )
              : "",
          tahap_2:
            kodeSumberDana === "apbn_bos_semester_1"
              ? ""
              : formatNominal(
                  getTotalNestedField(sumberDana[namaKegiatan], "total"),
                ),
        });
        const kegiatan = laporanBySumberDana[kodeSumberDana][namaKegiatan];
        // level 3, sub kegiatan
        Object.keys(kegiatan).forEach((namasubKegiatan) => {
          index += 1;
          const kode =
            kegiatan[namasubKegiatan][
              Object.keys(kegiatan[namasubKegiatan])[0]
            ][0]["kodeSubKegiatan"];
          modifiedDataExport.push({
            index,
            uraian: `> ${namasubKegiatan}`,
            kode,
            jumlah: formatNominal(
              getTotalNestedField(kegiatan[namasubKegiatan], "total"),
            ),
            tahap_1:
              kodeSumberDana === "apbn_bos_semester_1"
                ? formatNominal(
                    getTotalNestedField(kegiatan[namasubKegiatan], "total"),
                  )
                : "",
            tahap_2:
              kodeSumberDana === "apbn_bos_semester_1"
                ? ""
                : formatNominal(
                    getTotalNestedField(kegiatan[namasubKegiatan], "total"),
                  ),
          });
          // level 4, komponen biaya
          Object.keys(
            laporanBySumberDana[kodeSumberDana][namaKegiatan][namasubKegiatan],
          ).forEach((komponenBiaya) => {
            const subKegiatan =
              laporanBySumberDana[kodeSumberDana][namaKegiatan][
                namasubKegiatan
              ];
            const komponenBiayaDetail = rencanaKegiatanDropdown.find(
              (comp) => comp.id === komponenBiaya,
            );
            let nama: string;
            let namaKategori: string;
            let satuan: string;
            nama = namaKategori = satuan = "";
            if (komponenBiayaDetail) {
              ({
                nama,
                nama_kategori: namaKategori,
                satuan,
              } = komponenBiayaDetail);
            }
            index += 1;
            modifiedDataExport.push({
              index,
              uraian: `>> ${nama} \n :+: ${namaKategori}`,
              koefisien: `${subKegiatan[komponenBiaya][0]["totalKuantitas"]} ${satuan}`,
              harga: formatNominal(
                subKegiatan[komponenBiaya][0]["hargaSatuan"],
              ),
              pajak: subKegiatan[komponenBiaya][0]["pajak"],
              jumlah: formatNominal(subKegiatan[komponenBiaya][0]["total"]),
              tahap_1:
                kodeSumberDana === "apbn_bos_semester_1"
                  ? formatNominal(subKegiatan[komponenBiaya][0]["total"])
                  : "",
              tahap_2:
                kodeSumberDana === "apbn_bos_semester_1"
                  ? ""
                  : formatNominal(subKegiatan[komponenBiaya][0]["total"]),
            });
          });
        });
      });
    });
    console.log("modifiedDataExport ", modifiedDataExport);
    setDataExport(modifiedDataExport);
  };

  const handleChangePage = (dataKey: number): void => {
    setPage(dataKey);
  };

  const handleChangeLength = (dataKey: number): void => {
    setPage(page);
    setDisplayLength(dataKey);
  };

  const handleChangeFilterSumberDana = (value: string): void => {
    setSelectedSumberDana(value);
    const filtered = Object.keys(tableData).find((key) => key === value);
    if (value === "semua") {
      setDisplayedTableData(tableData);
      setTableDataCount(Object.keys(tableData).length);
    } else if (filtered) {
      setDisplayedTableData({ [filtered]: tableData[filtered] });
      setTableDataCount(1);
    } else {
      setDisplayedTableData({});
      setTableDataCount(0);
    }
  };

  const handleSearch = (val: string): void => {
    const results = getNestedField(val.toLowerCase(), tableData);
    if (val.length === 0) {
      setDisplayedTableData(tableData);
    } else {
      const resultSearch = {};
      results.forEach((result) => {
        resultSearch[result] = tableData[result];
      });
      setDisplayedTableData(resultSearch);
      setDefaultExpandAllRows(true);
    }
  };

  const handleChangeYear = (
    value: moment.Moment | null,
    dateString: string,
  ): void => {
    setSelectedYear(dateString);
    if (selectedMadrasah) {
      setLoading(true);
      getListTable(dateString, selectedMadrasah);
    }
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
        if (res) {
          setListKantorKotaKab(res.data.return);
        } else {
          setListKantorKotaKab([]);
        }
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
        if (res) {
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
        } else {
          setListMadrasah([]);
        }
      });
    }
  };
  const handleChangeMadrasah: React.ChangeEventHandler<HTMLSelectElement> = (
    e,
  ) => {
    setSelectedMadrasah(e.target.value);
    setLoading(true);
    getListTable(selectedYear, e.target.value);
  };

  return (
    <React.Fragment>
      <BreadCrumb routes={itemBreadcrumb} title="Laporan RKAM" />
      <Main>
        <Form>
          <div className="grid grid-cols-2 rkam__filter">
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
            <WrapSelect>
              <div className="w-1/3">
                <LabelSelect>Sumber Dana</LabelSelect>
              </div>
              <div className="w-2/3">
                <Select
                  className="mt-1 mb-1 text-gray-500 table-cell"
                  value={selectedSumberDana}
                  disabled={sumberDanaOptions.length === 0}
                  onChange={(e) =>
                    handleChangeFilterSumberDana(e.target.value)
                  }>
                  {sumberDanaOptions.map((el) => {
                    return (
                      <option key={el.value} value={el.value}>
                        {el.label}
                      </option>
                    );
                  })}
                </Select>
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
      <Main>
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
        <div className="md:flex md:items-center justify-between mt-3">
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
        <TableLevel1
          data={displayedTableData}
          loading={loading}
          displayLength={displayLength}
          defaultExpandAllRows={defaultExpandAllRows}
          page={page}
          rencanaKegiatanDropdown={rencanaKegiatanDropdown}
          sumberDanaOptions={sumberDanaOptions}
        />
      </Main>
    </React.Fragment>
  );
};

export default LaporanRkam;
