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
import { formatRupiah, sheet_to_blob, uuidv4 } from "../../../utils/helper";
import { useSelector } from "react-redux";
import { ButtonDropdownExport } from "../../../components/Button";
import InputSearch from "../../../components/InputSearch";
import notifAlert from "../../../components/NotifAlert";
import { getMadrasah } from "../../../services/v2/usermanservice/madrasahservices";
import {
  getLaporanDaftarSumberDana,
  getLaporanPertanggungJawabanBendaharaPengeluaran,
} from "../../../services/v2/realizationservice/laporanservices";
import FilterSumberDana from "../Component/FilterSumberDana";

const LaporanPertanggungJawaban = () => {
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Laporan" },
    { path: "/", breadcrumbName: "Laporan Penatausahaan" },
    { path: "/", breadcrumbName: "Pertanggung Jawaban" },
  ];

  const auths = useSelector((state: any) => state.auth);
  const store = useSelector((state: any) => state.store);
  // const refBank = store.rekeningBelanja || [];
  // const refTipeKas = store.tipeKas || [];
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
  const [sumberDana, setSumberDana] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  let dataTable: any = search
    ? tableData.filter((item: any) => {
        const val = search.toLowerCase();
        return (
          item.nama !== null &&
          (item.nama || "").toString().toLowerCase().includes(val)
        );
      })
    : tableData;
  dataTable = dataTable.map((item) => {
    return { ...item, key: uuidv4() };
  });
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
        kodeSumberDana: tmpFilter?.sumberDana,
      };

      const tmpSumberDana = await getLaporanDaftarSumberDana(payload);
      setSumberDana(
        tmpSumberDana.length
          ? tmpSumberDana.filter((item) => item.kode === "apbn_bos")
          : [],
      );
      if (tmpFilter?.sumberDana && tmpFilter?.madrasahId) {
        const res = await getLaporanPertanggungJawabanBendaharaPengeluaran(
          payload,
        );
        setTableData((res && res.items) || []);
        setTmpData(res);
      }
    } else {
      const payload = {
        tahun: auth?.isTahun,
        madrasahId: auth?.madrasah?.id,
        kodeSumberDana: tmpFilter?.sumberDana,
      };
      const tmpSumberDana = await getLaporanDaftarSumberDana(payload);
      setSumberDana(
        tmpSumberDana.length
          ? tmpSumberDana.filter((item) => item.kode === "apbn_bos")
          : [],
      );

      if (tmpFilter?.sumberDana) {
        const res = await getLaporanPertanggungJawabanBendaharaPengeluaran(
          payload,
        );
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

  const handleChangeValues = (values) => {
    setTmpFilter(values);
  };

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
   * Data untuk tabel children pertama
   */
  let columns: any = [
    {
      title: "No Urut",
      key: "noUrut",
      width: 80,
      render: (_, record, i: number) => i + 1 + (page - 1) * pageSize,
    },
    {
      title: "Nama",
      key: "nama",
      dataIndex: "nama",
      width: 250,
    },
    {
      title: "Penambahan",
      key: "totalPenambahan",
      dataIndex: "totalPenambahan",
      align: "right",
      width: 250,
      render: (totalPenambahan) => formatRupiah(totalPenambahan),
    },
    {
      title: "Pengurangan",
      key: "totalPengurangan",
      dataIndex: "totalPengurangan",
      align: "right",
      width: 250,
      render: (totalPengurangan) => formatRupiah(totalPengurangan),
    },
    {
      title: "Saldo Awal",
      key: "saldoAwal",
      dataIndex: "saldoAwal",
      align: "right",
      width: 250,
      render: (saldoAwal) => formatRupiah(saldoAwal),
    },
    {
      title: "Saldo Akhir",
      key: "saldoAkhir",
      dataIndex: "saldoAkhir",
      align: "right",
      width: 250,
      render: (saldoAkhir) => formatRupiah(saldoAkhir),
    },
  ];

  const expandedRowDetail = (record: any) => {
    const columnsDetail: any = [
      {
        title: "No Urut",
        key: "no",
        width: 80,
        render: (_, record, i: number) => i + 1 + (page - 1) * pageSize,
      },
      {
        title: "Nama",
        key: "nama",
        dataIndex: "nama",
        width: 250,
      },
      {
        title: "Penambahan",
        key: "penambahan",
        dataIndex: "penambahan",
        align: "right",
        width: 250,
        render: (penambahan) => formatRupiah(penambahan),
      },
      {
        title: "Pengurangan",
        key: "pengurangan",
        dataIndex: "pengurangan",
        align: "right",
        width: 250,
        render: (pengurangan) => formatRupiah(pengurangan),
      },
      {
        title: "Saldo Awal",
        key: "saldoAwal",
        dataIndex: "saldoAwal",
        align: "right",
        width: 250,
        render: (saldoAwal) => formatRupiah(saldoAwal),
      },
      {
        title: "Saldo Akhir",
        key: "saldoAkhir",
        dataIndex: "saldoAkhir",
        align: "right",
        width: 250,
        render: (saldoAkhir) => formatRupiah(saldoAkhir),
      },
    ];
    return (
      <Table
        rowKey={(record) => uuidv4()}
        columns={columnsDetail}
        dataSource={record.items}
        pagination={false}
        bordered
      />
    );
  };
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
    doc.text("LAPORAN PERTANGGUNGJAWABAN BENDAHARA PENGELUARAN", 150, 10, {
      align: "center",
    });
    doc.text(
      "Bulan : " +
        moment(tmpFilter?.periode).format("MMMM") +
        " " +
        moment(tmpFilter?.periode).format("YYYY"),
      150,
      18,
      { align: "center" },
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
        id: "nokode",
        dataKey: "nokode",
        padding: 0,
        header: "No Kode",
        width: 40,
      },
      {
        id: "nobukti",
        dataKey: "nobukti",
        padding: 0,
        header: "No Bukti",
        width: 40,
      },
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
        2: { halign: "center", cellWidth: 40 },
        3: { halign: "center", cellWidth: 40 },
        5: { halign: "right", cellWidth: 30 },
        6: { halign: "right", cellWidth: 30 },
        7: { halign: "right", cellWidth: 30 },
      },
      startY: 55,
      margin: { top: 10, left: 10, right: 10 },
      columns: headers,
      body: tableData.map((e, i) => {
        return {
          id: i + 1,
          tanggal: e.tanggalRealisasi
            ? moment(e.tanggalRealisasi).format("dddd,DD MMM YYYY HH:mm:ss")
            : "",
          nokode: e.noNotaFormat,
          nobukti: e.realisasiNoReferensi,
          debit: formatRupiah(e.debit),
          kredit: formatRupiah(e.credit),
          saldo: formatRupiah(e.saldo),
        };
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
    doc.output("dataurlnewwindow", { filename: "laporan-bku" });
    notifAlert({
      type: "success",
      description: "Data berhasil di export",
    });
  }

  function handleExportExcel() {
    // const dataMadrasah =
    //   (groupRole === "madrasah" && auth?.madrasah) ||
    //   tmpMadrasah.find((item) => item.id === tmpFilter?.madrasahId) ||
    //   null;
    // const fileType =
    //   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    // const fileExtension = ".xlsx";
    // var ws = XLSX.utils.json_to_sheet(
    //   [
    //     { A: "BUKU PEMBANTU KAS" },
    //     {
    //       A:
    //         "Periode : " +
    //         moment(tmpFilter?.periode).format("MMMM") +
    //         " " +
    //         moment(tmpFilter?.periode).format("YYYY"),
    //     },
    //     { A: "" },
    //     {
    //       A: "Nama Madrasah :" + (dataMadrasah && dataMadrasah?.nama),
    //     },
    //     { A: "NSM :" + (dataMadrasah && dataMadrasah?.nsm) },
    //     {
    //       A:
    //         "Kecamatan :" +
    //         (dataMadrasah && dataMadrasah?.kode_kecamatan
    //           ? refKecamatan
    //               .filter((e) => e.kode === dataMadrasah?.kode_kecamatan)
    //               .map((e) => e.nama)
    //           : "-"),
    //     },
    //     {
    //       A:
    //         "Kabupaten / Kota :" +
    //         (dataMadrasah && dataMadrasah?.kode_kabkota
    //           ? refKabkota
    //               .filter((e) => e.kode === dataMadrasah?.kode_kabkota)
    //               .map((e) => e.nama)
    //           : "-"),
    //     },
    //     {
    //       A:
    //         "Provinsi :" +
    //         (dataMadrasah && dataMadrasah?.kode_provinsi
    //           ? refProvinsi
    //               .filter((e) => e.kode === dataMadrasah?.kode_provinsi)
    //               .map((e) => e.nama)
    //           : "-"),
    //     },
    //   ],
    //   { skipHeader: true },
    // );
    // const merge = [
    //   { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } },
    //   { s: { r: 1, c: 0 }, e: { r: 1, c: 8 } },
    // ];
    // ws["!merges"] = merge;
    // ws["A1"].s = {
    //   font: {
    //     sz: 24,
    //     bold: true,
    //   },
    //   alignment: {
    //     vertical: "center",
    //     horizontal: "center",
    //   },
    // };
    // let dataTmp: any = [];
    // tableData.map((e, i) => {
    //   return dataTmp.push({
    //     "No Urut": i + 1,
    //     Tanggal: e.tanggalRealisasi
    //       ? moment(e.tanggalRealisasi).format("dddd,DD MMM YYYY HH:mm:ss")
    //       : "",
    //     "No Kode": e.noNotaFormat,
    //     "No Bukti": e.realisasiNoReferensi,
    //     Uraian: handleUraian(e),
    //     "Penerimaan (Debit)": formatRupiah(e.debit),
    //     "Pengeluaran (Kredit)": formatRupiah(e.credit),
    //     Saldo: formatRupiah(e.saldo),
    //   });
    // });
    // XLSX.utils.sheet_add_json(ws, dataTmp, { origin: "A10" });
    // ws["A10"].s = {
    //   fill: {
    //     patternType: "solid",
    //     bgColor: { rgb: "000000" }, // 'FFFFAA00',
    //     // fgColor: 'FFBBAA00'
    //   },
    //   font: {
    //     bold: true,
    //   },
    //   alignment: {
    //     vertical: "center",
    //     horizontal: "center",
    //   },
    // };
    // const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    // const excelBuffer = XLSX.write(wb, {
    //   bookType: "xlsx",
    //   type: "binary",
    //   bookSST: true,
    //   cellStyles: true,
    // });
    // const data = new Blob([sheet_to_blob(excelBuffer)], { type: fileType });
    // FileSaver.saveAs(data, "Buku-Kas-Umum" + fileExtension);
    // notifAlert({
    //   type: "success",
    //   description: "Data berhasil di export",
    // });
  }
  return (
    <>
      <BreadCrumb routes={itemBreadcrumb} title="Laporan Pertanggung Jawaban" />
      <FilterSumberDana
        handleChangeValues={handleChangeValues}
        groupRole={groupRole}
        sumberDana={sumberDana}
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
            // rowKey={(record) => record.id + uuidv4()}
            columns={columns}
            dataSource={dataTable}
            scroll={{ x: 1300 }}
            bordered
            loading={loading}
            summary={() =>
              tmpData && (
                <Table.Summary fixed="top">
                  <Table.Summary.Row style={{ backgroundColor: `#f1f1f1` }}>
                    <Table.Summary.Cell index={1} colSpan={3}>
                      <strong>Kementerian/Lembaga</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2}>
                      <strong>Unit Organisasi</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={3}>
                      <strong>Dokumen</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={4}>
                      <strong>Tanggal Dokumen</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={5}>
                      <strong>Penjelasan</strong>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                  <Table.Summary.Row style={{ backgroundColor: `#fafafa` }}>
                    <Table.Summary.Cell index={1} colSpan={3}>
                      {tmpData?.lembaga}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2}>
                      {tmpData?.unitOrganisasi}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={3}>
                      {tmpData?.dokumen}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={4}>
                      {tmpData?.tanggalDokumen}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={5}>
                      {tmpData?.penjelasan}
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )
            }
            expandable={{
              expandedRowRender: (record) => expandedRowDetail(record),
            }}
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

export default LaporanPertanggungJawaban;
