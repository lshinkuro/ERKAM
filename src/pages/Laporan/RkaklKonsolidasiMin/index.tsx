/** @format */

import React, { useState, useEffect, createRef } from "react";
import { BreadCrumb } from "../../../components";
import { Icon, Button } from "rsuite";
import { Alert, Select } from "antd";
import { Dropdown, DropdownItem } from "@windmill/react-ui";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatRupiah } from "../../../utils/helper";
import moment from "moment";
import "moment/locale/id";
import { PdfIcon, ExcelIcon } from "../../../icons";

//kalo mau pake data dummy, unComment ini
// import { dummy } from "./dummy/dummy";

function Index() {
  const ref = createRef<any>();
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Laporan" },
    { path: "/", breadcrumbName: "Laporan RKAKL Konsolidasi Min" },
  ];
  // Untuk Contoh data
  // const dataRKAKL = dummy;

  // Data Live API
  const dataRKAKL = JSON.parse(localStorage.getItem("laporan-rkakl")!) || [];

  const auth = JSON.parse(localStorage.getItem("auth")!) || [];
  const province = JSON.parse(localStorage.getItem("provdropdown")!) || [];
  const district = JSON.parse(localStorage.getItem("kabkotadropdown")!) || [];
  const [rencanaHeaders, setRencanaHeaders] = useState<any>([]);
  const [openDropdownExport, setOpenDropdownExport] = useState(false);

  let dataReport: any = [];
  const [tableData, setTableData] = useState<any>([]);
  const [provinceSelected, setProvinceSelected] = useState<any>("");
  const [districtSelected, setDistrictSelected] = useState<any>("");
  const [dataDistrictByProvince, setDataDistrictByProvince] = useState<any>([]);
  const [infoMessage, setInfoMessage] = useState<any>("");

  useEffect(() => {
    if (auth.group_role == "pusat") {
      setTableData([]);
    } else if (auth.group_role == "provinsi") {
      setProvinceSelected(auth.kantor_provinsi.kode_provinsi);
      setTableData(
        dataReport.filter(
          (dataX: any) =>
            dataX.kode_kabkota === auth.kantor_provinsi.kode_kabkota,
        ),
      );
    } else if (auth.group_role == "kabkota") {
      setTableData(
        dataReport.filter(
          (dataX: any) =>
            dataX.kode_kabkota === auth.kantor_kabkota.kode_kabkota,
        ),
      );
    }

    setDataDistrictByProvince(
      district.filter((dataX: any) => dataX.kode_provinsi === provinceSelected),
    );

    if (auth.group_role != "kabkota") {
      setTableData(
        dataReport.filter(
          (dataX: any) => dataX.kode_kabkota === districtSelected,
        ),
      );
    }

    if (!provinceSelected) {
      setInfoMessage("Untuk menampilkan data laporan, silahkan pilih Provinsi");
    } else {
      setInfoMessage("Silahkan Pilih Kabupaten Kota");
    }
  }, [provinceSelected, districtSelected]);

  dataRKAKL
    .map((dataX: any) => dataX)
    .forEach((element) => {
      dataReport.push({
        kantor_kabkota_id: element.rencanaRole.kantor_kabkota_id,
        kantor_provinsi_id: element.rencanaRole.kantor_provinsi_id,
        kantor_pusat_id: element.rencanaRole.kantor_pusat_id,
        kode_kabkota: element.rencanaRole.kode_kabkota,
        kode_provinsi: element.rencanaRole.kode_provinsi,
        madrasah_id: element.rencanaRole.madrasah_id,
        nama_kantor_kabkota: element.rencanaRole.nama_kantor_kabkota,
        nama_kantor_provinsi: element.rencanaRole.nama_kantor_provinsi,
        nama_kantor_pusat: element.rencanaRole.nama_kantor_pusat,
        nama_madrasah: element.rencanaRole.nama_madrasah,
        title: element.rencanaTitles.slice(0, 2),
        subTitle: element.rencanaTitles.slice(2),
        tableHeader: element.rencanaHeaders.slice(0, -1),
        kegiatans: element.rencanaHeaders.slice(4).map((dataX: any) => ({
          kode: dataX.kode,
          uraian: dataX.uraian,
          hargaSatuan: dataX.hargaSatuan,
          unitSatuan: dataX.unitSatuan,
          totalKuantitas: dataX.totalKuantitas,
          jumlahTotal: dataX.jumlahTotal,
          volumeOutput: dataX.volumeOutput,
          children: element.rencanaKegiatans.map((dataY: any) => ({
            deskripsi: dataY.deskripsi,
            kode: dataY.kode,
            children: dataY.rencanaKegiatans.map((dataZone: any) => ({
              jumlahTotal: dataZone.jumlahTotal,
              kodeJenisBelanja: dataZone.kodeJenisBelanja,
              namaJenisBelanja: dataZone.namaJenisBelanja,
              children: dataZone.rincianKegiatans.map((dataZtwo: any) => ({
                hargaSatuan: dataZtwo.hargaSatuan,
                jumlahTotal: dataZtwo.jumlahTotal,
                komponenBiayaNama: dataZtwo.komponenBiayaNama,
                totalKuantitas: dataZtwo.totalKuantitas,
                unitSatuan: dataZtwo.unitSatuan,
                volumeOutput: dataZtwo.volumeOutput,
              })),
            })),
          })),
        })),
      });
    });

  // console.log("PROVINCE: ", provinceSelected );
  // console.log("DISTRICT: ", dataDistrictByProvince );
  // console.log("TABLE DATA: ", dataRKAKL );

  const formatRupiahKhusus = (money: number) => {
    return new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 2,
    }).format(money);
  };

  function NewHandleExportPdf() {
    const doc = new jsPDF("landscape");
    // var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    var pageWidth =
      doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

    var pageSize = doc.internal.pageSize;
    var pageWidth = pageSize.getWidth()
      ? pageSize.getWidth()
      : pageSize.getWidth();

    doc.setFontSize(18);
    let titleY: any = 20;
    tableData.map((data: any) =>
      data.title.map((dataTitle: any, index: any) =>
        doc.text(
          `${dataTitle.uraian}`,
          pageWidth / 2,
          index == 0 ? titleY : (titleY += 10),
          { align: "center" },
        ),
      ),
    );

    doc.setFontSize(11);
    doc.setTextColor(100);
    let keyY: any = 40;
    let valueY: any = 40;
    tableData.map((data: any) =>
      data.subTitle.map((dataSubTitle: any, index: any) => {
        doc.text(`${dataSubTitle.kode}`, 14, index == 0 ? keyY : (keyY += 6));
        doc.text(
          `: ${
            Number.isNaN(Number(dataSubTitle.uraian)) === true
              ? dataSubTitle.uraian
              : formatRupiah(dataSubTitle.uraian)
          }`,
          94,
          index == 0 ? valueY : (valueY += 6),
        );
      }),
    );

    autoTable(doc, {
      html: "#tableData",
      startY: 100,
      showHead: "firstPage",
      theme: "grid",
    });

    var footerLeft = pageWidth / 2;
    var footerRight = footerLeft / 2 + pageWidth / 2;
    var footerPosY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(14);
    doc.text("Mengetahui", footerLeft / 2, footerPosY, { align: "center" });
    doc.text(
      `${moment().format("dddd")}, ${moment().format("LL")}`,
      footerRight,
      footerPosY,
      { align: "center" },
    );
    doc.text("Kepala Madrasah", footerLeft / 2, footerPosY + 8, {
      align: "center",
    });
    doc.text("Bendahara Madrasah", footerRight, footerPosY + 8, {
      align: "center",
    });
    doc.text("(...........................)", footerLeft / 2, footerPosY + 38, {
      align: "center",
    });
    doc.text("(...........................)", footerRight, footerPosY + 38, {
      align: "center",
    });

    doc.output("dataurlnewwindow", {
      filename: "laporan-rkakl-konsolidasi-min",
    });
    // doc.save('laporan-rkakl-konsolidasi-min');
  }

  function tableToExcel(table, name, filename) {
    let uri = "data:application/vnd.ms-excel;base64,",
      template =
        '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><title></title><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>',
      base64 = function (s) {
        return window.btoa(decodeURIComponent(encodeURIComponent(s)));
      },
      format = function (s, c) {
        return s.replace(/{(\w+)}/g, function (m, p) {
          return c[p];
        });
      };

    if (!table.nodeType) table = document.getElementById(table);
    var ctx = { worksheet: name || "Worksheet", table: table.innerHTML };

    var link = document.createElement("a");
    link.download = filename;
    link.href = uri + base64(format(template, ctx));
    link.click();
  }

  const columns = [
    { title: "Kode", dataIndex: "kode", key: "kode" },
    { title: "Uraian", dataIndex: "uraian", key: "uraian" },
    { title: "Volume Output", dataIndex: "volume", key: "volume" },
    {
      title: "Rincian Perhitungan",
      dataIndex: "rincianPerhitungan",
      key: "rincianPerhitungan",
      children: [{ title: "Jumlah", dataIndex: "jumlah", key: "jumlah" }],
    },
    { title: "Harga Satuan", dataIndex: "hargaSatuan", key: "hargaSatuan" },
    { title: "Jumlah Total", dataIndex: "jumlahTotal", key: "jumlahTotal" },
  ];

  return (
    <>
      <BreadCrumb
        routes={itemBreadcrumb}
        title="Laporan RKAKL Konsolidasi Min"
      />
      {auth.group_role == "pusat" ? (
        <div className="m-5 p-5 bg-white shadow-md rounded">
          <div>
            {tableData.length < 1 && districtSelected ? (
              <Alert message="Data Belum Tersedia" type="warning" showIcon />
            ) : tableData.length < 1 ? (
              <Alert message={infoMessage} type="info" showIcon />
            ) : (
              ""
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex items-center">
              <div className="w-1/3">Provinsi</div>
              <div className="w-2/3">
                <Select
                  autoFocus
                  showSearch
                  onChange={(e: any) => {
                    let [kode, nama] = e.split("-");
                    setProvinceSelected(kode);
                  }}
                  className="w-full"
                  placeholder="Pilih Provinsi"
                  options={
                    province
                      ? province.map((data: any, key: any) => {
                          return {
                            value: data.kode + "-" + data.nama,
                            label: data.nama,
                          };
                        })
                      : "Silahkan Sinkronkan Data"
                  }
                />
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-1/3">Kabupaten Kota</div>
              <div className="w-2/3">
                <Select
                  showSearch
                  onChange={(e: any) => {
                    let [kode, nama] = e.split("-");
                    setDistrictSelected(kode);
                  }}
                  className="w-full"
                  placeholder="Pilih Kabupaten Kota"
                  options={
                    dataDistrictByProvince
                      ? dataDistrictByProvince.map((data: any, key: any) => {
                          return {
                            value: data.kode + "-" + data.nama,
                            label: data.nama,
                          };
                        })
                      : "Silahkan Sinkronkan Data"
                  }
                />
              </div>
            </div>
          </div>
        </div>
      ) : auth.group_role == "provinsi" ? (
        <div className="m-5 p-5 bg-white shadow-md rounded">
          <div>
            {tableData.length < 1 && districtSelected ? (
              <Alert message="Data Belum Tersedia" type="warning" showIcon />
            ) : tableData.length < 1 ? (
              <Alert message={infoMessage} type="info" showIcon />
            ) : (
              ""
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex items-center">
              <div className="w-1/3">Kabupaten Kota</div>
              <div className="w-2/3">
                <Select
                  showSearch
                  onChange={(e: any) => {
                    let [kode, nama] = e.split("-");
                    setDistrictSelected(kode);
                  }}
                  className="w-full"
                  placeholder="Pilih Kabupaten Kota"
                  options={
                    dataDistrictByProvince
                      ? dataDistrictByProvince.map((data: any, key: any) => {
                          return {
                            value: data.kode + "-" + data.nama,
                            label: data.nama,
                          };
                        })
                      : "Silahkan Sinkronkan Data"
                  }
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="m-5 p-5 bg-white shadow-md rounded">
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
              <DropdownItem
                onClick={() => {
                  tableToExcel(
                    "tableData",
                    "laporan",
                    "laporan-rkakl-konsolidasi",
                  );
                }}>
                <ExcelIcon className="mx-2" /> Excel
              </DropdownItem>
              <DropdownItem onClick={() => NewHandleExportPdf()}>
                <PdfIcon className="mx-2" /> Pdf
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
        <div ref={ref} className="mt-2">
          {tableData.map((data: any) => (
            <>
              <table id="tableData">
                {data.title.map((dataTitle: any) => (
                  <thead>
                    <th colSpan={6} style={{ textAlign: "center" }}>
                      {dataTitle.uraian}
                    </th>
                  </thead>
                ))}
                <thead>
                  <th></th>
                </thead>
                {data.subTitle.map((dataSubTitle: any) => (
                  <thead className="mt-3">
                    <td
                      colSpan={6}
                      style={{
                        borderTop: "transparent",
                        borderRight: "transparent",
                        borderLeft: "transparent",
                        borderBottom: "transparent",
                      }}>
                      <div className="grid grid-cols-3 gap-4">
                        <span>{dataSubTitle.kode}</span>
                        <span className="col-span-2">
                          :{" "}
                          {Number.isNaN(Number(dataSubTitle.uraian)) === true
                            ? dataSubTitle.uraian
                            : formatRupiah(dataSubTitle.uraian)}
                        </span>
                      </div>
                    </td>
                  </thead>
                ))}
                <thead>
                  <th></th>
                </thead>
                <thead>
                  <tr>
                    <th style={{ fontSize: "12px", textAlign: "center" }}>
                      Kode
                    </th>
                    <th style={{ fontSize: "12px", textAlign: "center" }}>
                      Uraian
                    </th>
                    <th style={{ fontSize: "12px", textAlign: "center" }}>
                      Volume Output
                    </th>
                    <th style={{ fontSize: "12px", textAlign: "center" }}>
                      <div>
                        <div className="mb-2">Rincian Perhitungan</div>
                        <hr />
                        <div className="mt-2">Jumlah</div>
                      </div>
                    </th>
                    <th style={{ fontSize: "12px", textAlign: "center" }}>
                      <div>
                        <div>Harga Satuan</div>
                        <div>(Rp.)</div>
                      </div>
                    </th>
                    <th style={{ fontSize: "12px", textAlign: "center" }}>
                      <div>
                        <div>Jumlah Total</div>
                        <div>(Rp.)</div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.tableHeader.map((dataTableHeader: any) => (
                    <tr>
                      <td>{dataTableHeader.kode}</td>
                      <td>{dataTableHeader.uraian}</td>
                      <td style={{ textAlign: "center" }}>
                        {dataTableHeader.volumeOutput}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {dataTableHeader.unitSatuan}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {dataTableHeader.hargaSatuan
                          ? formatRupiahKhusus(dataTableHeader.hargaSatuan)
                          : ""}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {dataTableHeader.jumlahTotal
                          ? formatRupiahKhusus(dataTableHeader.jumlahTotal)
                          : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tbody>
                  {data.kegiatans.map((dataKegiatans: any) => (
                    <>
                      <tr>
                        <td>{dataKegiatans.kode}</td>
                        <td colSpan={5}>{dataKegiatans.uraian}</td>
                      </tr>
                      {dataKegiatans.children.map((dataX: any) => (
                        <>
                          <tr>
                            <td style={{ textAlign: "center" }}>
                              {dataX.kode}
                            </td>
                            <td colSpan={5}>{dataX.deskripsi}</td>
                          </tr>
                          {dataX.children.map((dataY: any) => (
                            <>
                              <tr>
                                <td style={{ textAlign: "right" }}>
                                  {dataY.kodeJenisBelanja}
                                </td>
                                <td colSpan={4}>
                                  <div style={{ marginLeft: "50px" }}>
                                    {dataY.namaJenisBelanja}
                                  </div>
                                </td>
                                <td style={{ textAlign: "right" }}>
                                  {formatRupiahKhusus(dataY.jumlahTotal)}
                                </td>
                              </tr>
                              {dataY.children.map((dataZ: any) => (
                                <>
                                  <tr>
                                    <td></td>
                                    <td colSpan={2}>
                                      <div style={{ marginLeft: "50px" }}>
                                        {"- " + dataZ.komponenBiayaNama}
                                      </div>
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                      {dataZ.totalKuantitas} {dataZ.unitSatuan}
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                      {formatRupiahKhusus(dataZ.hargaSatuan)}
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                      {formatRupiahKhusus(dataZ.jumlahTotal)}
                                    </td>
                                  </tr>
                                </>
                              ))}
                            </>
                          ))}
                        </>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
              <table id="tableFooter" className="mt-3">
                <thead>
                  <th colSpan={3} style={{ textAlign: "center" }}>
                    Mengetahui
                  </th>
                  <th colSpan={3} style={{ textAlign: "center" }}>
                    {moment().format("dddd")}, {moment().format("LL")}
                  </th>
                </thead>
                <thead>
                  <th colSpan={3} style={{ textAlign: "center" }}>
                    Kepala Madrasah
                  </th>
                  <th colSpan={3} style={{ textAlign: "center" }}>
                    Bendahara Madrasah
                  </th>
                </thead>
                <thead>
                  <th></th>
                </thead>
                <thead>
                  <th></th>
                </thead>
                <thead>
                  <th></th>
                </thead>
                <thead>
                  <th></th>
                </thead>
                <thead>
                  <th></th>
                </thead>
                <thead>
                  <th colSpan={3} style={{ textAlign: "center" }}>
                    (...............................)
                  </th>
                  <th colSpan={3} style={{ textAlign: "center" }}>
                    (...............................)
                  </th>
                </thead>
              </table>
            </>
          ))}
        </div>
      </div>
    </>
  );
}

export default Index;
