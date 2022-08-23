/** @format */

import React, { useState, useRef, useEffect, createRef } from "react";
import { useHistory } from "react-router";

// Component
import { BreadCrumb } from "../../../components";
import styled from "styled-components";
import { Table, Menu, Col, Row, DatePicker, Alert, Select } from "antd";
import { Dropdown, DropdownItem, TableCell } from "@windmill/react-ui";
import { Button, Input, InputGroup, Icon, Form, SelectPicker } from "rsuite";
import { PdfIcon, ExcelIcon } from "../../../icons";
import moment from "moment";
import "moment/locale/id";
import autoTable from "jspdf-autotable";
import { formatRupiah } from "../../../utils/helper";

import { jsPDF } from "jspdf";
// import { ExportToExcel } from '../../../components/Export/ExportToExcel';

const itemBreadcrumb = [
  { path: "/", breadcrumbName: "Home" },
  { path: "/", breadcrumbName: "Laporan" },
  { path: "/", breadcrumbName: "Laporan Keuangan Realisasi" },
];

const LaporanRealisasi = () => {
  const ref = createRef<any>();
  const route = useHistory();
  const componentRef = useRef<any | null>();

  // State
  const dataRKAKL =
    JSON.parse(localStorage.getItem("realisasi/laporan-rekap-keuangan")!) || [];
  const auth = JSON.parse(localStorage.getItem("auth")!) || [];
  const [rencanaHeaders, setRencanaHeaders] = useState<any>([]);
  const [rencanaKegiatans, setRencanaKegiatans] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [openDropdownExport, setOpenDropdownExport] = useState(false);
  const [rencanaTitles, setRencanaTitles] = useState<any>([]);
  const [displayLength, setDisplayLength] = useState(10);

  const dataMadrasah =
    JSON.parse(localStorage.getItem("referensi-madrasah")!) || [];
  const province = JSON.parse(localStorage.getItem("provdropdown")!) || [];
  const district = JSON.parse(localStorage.getItem("kabkotadropdown")!) || [];

  let dataReport: any = [];
  const [tableData, setTableData] = useState<any>([]);
  const [provinceSelected, setProvinceSelected] = useState<any>("");
  const [districtSelected, setDistrictSelected] = useState<any>("");
  const [madrasahSelected, setMadrasahSelected] = useState<any>("");
  const [dataDistrictByProvince, setDataDistrictByProvince] = useState<any>([]);
  const [dataMadrasahByDistrict, setMadrasahByDistrict] = useState<any>([]);
  const [infoMessage, setInfoMessage] = useState<any>("");

  useEffect(() => {
    if (auth.group_role == "pusat") {
      // setTableData([]);
      setTableData(
        dataReport.filter(
          (dataX: any) => dataX.nama_madrasah === madrasahSelected,
        ),
      );
    } else if (auth.group_role == "provinsi") {
      setProvinceSelected(auth.kantor_provinsi.kode_provinsi);
      setTableData(
        dataReport.filter(
          (dataX: any) =>
            dataX.kode_kabkota === auth.kantor_provinsi.kode_kabkota,
        ),
      );
    } else if (auth.group_role == "kabkota") {
      setDistrictSelected(auth.kantor_kabkota.kode_kabkota);
      setTableData(
        dataReport.filter(
          (dataX: any) =>
            dataX.kode_kabkota === auth.kantor_kabkota.kode_kabkota,
        ),
      );
    } else if (auth.group_role == "madrasah") {
      setTableData(
        dataReport.filter(
          (dataX: any) => dataX.nama_madrasah === auth.madrasah.nama,
        ),
      );
    }

    setDataDistrictByProvince(
      district.filter((dataX: any) => dataX.kode_provinsi === provinceSelected),
    );
    setMadrasahByDistrict(
      dataMadrasah.filter(
        (data1: any) => data1.kode_kabkota === districtSelected,
      ),
    );
    // setTableData(dataReport.filter((dataX: any) => dataX.nama_madrasah === madrasahSelected))
    setRencanaHeaders(dataRKAKL.map((dataX: any) => dataX.rencanaHeaders));
    setRencanaKegiatans(dataRKAKL.map((dataX: any) => dataX.rencanaKegiatans));
    setRencanaTitles(dataRKAKL.map((dataX: any) => dataX.rencanaTitles));
    // if (madrasahSelected) {
    //     setTableData(dataReport.filter((dataX: any) => dataX.nama_madrasah === madrasahSelected))
    //   }
    //   if (auth.group_role != "kabkota") {
    //     setTableData(dataReport.filter((dataX: any) => dataX.kode_kabkota === districtSelected));
    //   }
    if (auth.group_role != "madrasah") {
      setTableData(
        dataReport.filter(
          (dataX: any) => dataX.nama_madrasah === madrasahSelected,
        ),
      );
    }

    handleAlert();
  }, [provinceSelected, districtSelected, madrasahSelected]);

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
            nama_madrasah: element.rencanaRole.nama_madrasah,
            deskripsi: dataY.deskripsi,
            kode: dataY.kode,
            deskripsiMoney: dataY.deskripsiMoney,
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
                realisasiMoney: dataZtwo?.realisasiMoney,
                realisasiPercent: dataZtwo?.realisasiPercent,
                saldoMoney: dataZtwo?.saldoMoney,
                saldoPercent: dataZtwo?.saldoPercent,
              })),
            })),
          })),
        })),
      });
    });

  console.log("dataReport", dataReport);

  console.log(
    "cek data saldo money",
    dataRKAKL.map((dataX: any) =>
      dataX.rencanaKegiatans.map((dataY) => dataY.rincianKegiatans?.saldoMoney),
    ),
  );

  let dataHeader: any;
  let dataRencanaKegiatans: any;
  let lastIndex: any;
  let minusLastIndex: any;
  let dataRencanaTitles: any;

  rencanaHeaders.forEach((element) => {
    dataHeader = element;
    lastIndex = element[element.length - 1];
    minusLastIndex = element.slice(0, -1);
    // newData.push(element.slice(0, -1))
  });

  rencanaKegiatans.forEach((element) => {
    dataRencanaKegiatans = element;
  });

  rencanaTitles.forEach((element) => {
    dataRencanaTitles = element;
  });

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
    // dataRencanaTitles
    //   ?.map((dataX: any) => dataX)
    //   .splice(0, 2)
    //   .map((dataY: any, index: any) =>
    //     doc.text(
    //       `${dataY.uraian}`,
    //       pageWidth / 2,
    //       index == 0 ? titleY : (titleY += 10),
    //       { align: "center" },
    //     ),
    //   );

    doc.setFontSize(11);
    doc.setTextColor(100);
    let keyY: any = 40;
    let valueY: any = 40;
    // dataRencanaTitles
    //   ?.map((dataX: any) => dataX)
    //   .slice(2)
    //   .map((dataY: any, index: any) => {
    //     doc.text(`${dataY.kode}`, 14, index == 0 ? keyY : (keyY += 6));
    //     doc.text(
    //       `: ${
    //         Number.isNaN(Number(dataY.uraian)) === true
    //           ? dataY.uraian
    //           : formatRupiah(dataY.uraian)
    //       }`,
    //       94,
    //       index == 0 ? valueY : (valueY += 6),
    //     );
    //   });

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

    doc.output("dataurlnewwindow", { filename: "laporan-rkakl-rekap" });
    // doc.save('laporan-rkakl-konsolidasi-min');
  }

  function HandleExportPdfrincian() {
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
    // dataRencanaTitles
    //   ?.map((dataX: any) => dataX)
    //   .splice(0, 2)
    //   .map((dataY: any, index: any) =>
    //     doc.text(
    //       `${dataY.uraian}`,
    //       pageWidth / 2,
    //       index == 0 ? titleY : (titleY += 10),
    //       { align: "center" },
    //     ),
    //   );

    doc.setFontSize(11);
    doc.setTextColor(100);
    let keyY: any = 40;
    let valueY: any = 40;
    // dataRencanaTitles
    //   ?.map((dataX: any) => dataX)
    //   .slice(2)
    //   .map((dataY: any, index: any) => {
    //     doc.text(`${dataY.kode}`, 14, index == 0 ? keyY : (keyY += 6));
    //     doc.text(
    //       `: ${
    //         Number.isNaN(Number(dataY.uraian)) === true
    //           ? dataY.uraian
    //           : formatRupiah(dataY.uraian)
    //       }`,
    //       94,
    //       index == 0 ? valueY : (valueY += 6),
    //     );
    //   });

    autoTable(doc, {
      html: "#tableDataRinci",
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

    doc.output("dataurlnewwindow", { filename: "laporan-rkakl-rincian" });
    // doc.save('laporan-rkakl-konsolidasi-min');
  }

  let tmpAuth: any = JSON.parse(localStorage.getItem("auth")!) || "";
  let role = tmpAuth.nama_role || "";
  let groupRole = tmpAuth.group_role || "";
  let kantor_pusat_id = "";
  let kantor_provinsi_id = "";
  let kantor_kabkota_id = "";
  let madrasah_id = "";

  function checkRole() {
    if (groupRole === "pusat") {
      console.log("pusat");
      kantor_pusat_id = tmpAuth.kantor_pusat?.id;
    } else if (groupRole === "provinsi") {
      console.log("provinsi");
      kantor_provinsi_id = tmpAuth.kantor_provinsi?.id;
      kantor_pusat_id = tmpAuth.kantor_provinsi?.kantor_pusat_id;
    } else if (groupRole === "kabkota") {
      console.log("kabkota");
      kantor_provinsi_id = tmpAuth.kantor_provinsi?.id;
      kantor_pusat_id = tmpAuth.kantor_provinsi?.kantor_pusat_id;
      kantor_kabkota_id = tmpAuth.kantor_kabkota?.id;
    } else if (groupRole === "madrasah") {
      console.log("madrasah");
      kantor_provinsi_id = tmpAuth.kantor_provinsi?.id;
      kantor_pusat_id = tmpAuth.kantor_provinsi?.kantor_pusat_id;
      kantor_kabkota_id = tmpAuth.kantor_kabkota?.id;
      madrasah_id = tmpAuth.madrasah?.id;
    }
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

  // const columns = [
  //   { title: 'Kode', dataIndex: 'kode', key: 'kode' },
  //   { title: 'Uraian', dataIndex: 'uraian', key: 'uraian' },
  //   { title: 'Volume Output', dataIndex: 'volume', key: 'volume' },
  //   { title: 'Rincian Perhitungan', dataIndex: 'rincianPerhitungan', key: 'rincianPerhitungan', children: [{ title: 'Jumlah', dataIndex: 'jumlah', key: 'jumlah', }] },
  //   { title: 'Harga Satuan', dataIndex: 'hargaSatuan', key: 'hargaSatuan' },
  //   { title: 'Jumlah Total', dataIndex: 'jumlahTotal', key: 'jumlahTotal' },
  // ];

  useEffect(() => {
    checkRole();
  }, []);

  // handel Export PDF
  function handleExportPdf() {
    let element = componentRef.current;
    const doc = new jsPDF("landscape");
    doc.html(componentRef.current, {
      callback: function (doc) {
        let output = doc.output("dataurlnewwindow", {
          filename: "laporan-erkam",
        });
        console.log(output);
        // doc.save('laporan-rkam.pdf');
      },
      x: 10,
      y: 10,
    });
  }

  const menuExport = () => {
    const handleClickExcel = () => {
      // ExportToExcel(dataExportExcel, 'laporan-erkam');
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

  // hanldleAlert
  const handleAlert = () => {
    if (groupRole === "pusat") {
      setInfoMessage("Harap Pilih Provinsi Melalui Filter");
      if (provinceSelected) {
        setInfoMessage("Harap Pilih Kabkota Melalui Filter");
        if (districtSelected) {
          setInfoMessage("Harap Pilih Madrasah Melaui Filter");
        }
      }
    } else if (groupRole === "provinsi") {
      setInfoMessage("Harap Pilih KabKota Melalui Filter");
      if (districtSelected) {
        setInfoMessage("Harap Pilih Madrasah Melalui Filter");
        if (madrasahSelected) {
          setInfoMessage("Rekap Keuangan");
        }
      }
    } else if (groupRole === "kabkota") {
      setInfoMessage("Harap Pilih Madrasah Melalui Filter");
      if (madrasahSelected) {
        setInfoMessage("Rekap Keuangan");
      }
    } else {
      setInfoMessage("Rekap Keuangan");
    }
  };

  const formatRupiahKhusus = (money: number) => {
    return new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 2,
    }).format(money);
  };

  return (
    <>
      <BreadCrumb
        routes={itemBreadcrumb}
        title="Laporan Keuangan Realisasi"
        toBack={() => route.goBack()}
      />
      {/* <Main>
            <div className="mb-8"> */}
      {auth.group_role == "pusat" ? (
        <Main>
          <div className="m-5 p-5 bg-white shadow-md rounded">
            <div>
              {/* {
                  groupRole === "madrasah" ? "" 
                  : 
                  <Alert
                    message={infoMessage}
                    type="info"
                    showIcon
                  />
                } */}
              {tableData.length < 1 && madrasahSelected ? (
                <Alert message="Data Belum Tersedia" type="warning" showIcon />
              ) : tableData.length < 1 ? (
                <Alert message={infoMessage} type="info" showIcon />
              ) : (
                // tableData.length < 1
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
                <div className="w-1/3">Madrasah</div>
                <div className="w-2/3">
                  <Select
                    autoFocus
                    showSearch
                    onChange={(e: any) => {
                      let [nama] = e.split("-");
                      setMadrasahSelected(nama);
                    }}
                    className="w-full"
                    placeholder="Pilih Madrasah"
                    options={
                      dataMadrasahByDistrict
                        ? dataMadrasahByDistrict.map((data: any) => {
                            return {
                              value: data.nama,
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
        </Main>
      ) : auth.group_role == "provinsi" ? (
        <Main>
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
              <div className="flex items-center">
                <div className="w-1/3">Madrasah</div>
                <div className="w-2/3">
                  <Select
                    autoFocus
                    showSearch
                    onChange={(e: any) => {
                      let [nama] = e.split("-");
                      setMadrasahSelected(nama);
                    }}
                    className="w-full"
                    placeholder="Pilih Madrasah"
                    options={
                      dataMadrasahByDistrict
                        ? dataMadrasahByDistrict.map((data: any) => {
                            return {
                              value: data.nama,
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
        </Main>
      ) : auth.group_role == "kabkota" ? (
        <Main>
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
                <div className="w-1/3">Madrasah</div>
                <div className="w-2/3">
                  <Select
                    autoFocus
                    showSearch
                    onChange={(e: any) => {
                      let [nama] = e.split("-");
                      setMadrasahSelected(nama);
                    }}
                    className="w-full"
                    placeholder="Pilih Madrasah"
                    options={
                      dataMadrasahByDistrict
                        ? dataMadrasahByDistrict.map((data: any) => {
                            return {
                              value: data.nama,
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
        </Main>
      ) : (
        ""
      )}
      {/* </div>
          </Main> */}
      <Main>
        {/* <div className="bg-white shadow-sm">
              <div className="flex justify-between">
                <div className="w-1/2">
                  <div className="w-1/2 flex items-center mb-6" >
                    <InputGroup inside>
                      <Input type="text" name="search" className="h-8 py-1 w-full " placeholder="Cari..."  />
                      <InputGroup.Addon>
                        <Icon icon="search" />
                      </InputGroup.Addon>
                    </InputGroup>
                  </div>
                </div>
                <div className="w-1/2 flex justify-end">
                  <div className="flex">
                    <div className="">
                      <Dropdown overlay={menuExport()} placement="bottomLeft">
                        <Button>Export</Button>
                      </Dropdown>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
        <div>
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
                    <DropdownItem
                      onClick={() => {
                        tableToExcel("tableData", "laporan", "laporan-rkakl");
                      }}>
                      <ExcelIcon className="mx-2" /> Excel Rekap
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => {
                        tableToExcel(
                          "tableDataRinci",
                          "laporan",
                          "laporan-rkakl",
                        );
                      }}>
                      <ExcelIcon className="mx-2" /> Excel Rincian
                    </DropdownItem>
                    <DropdownItem onClick={() => NewHandleExportPdf()}>
                      <PdfIcon className="mx-2" /> Pdf Rekap
                    </DropdownItem>
                    <DropdownItem onClick={() => HandleExportPdfrincian()}>
                      <PdfIcon className="mx-2" /> Pdf Rincian
                    </DropdownItem>
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="mt-5 z-0">
            {/* <Table bordered columns={columns} dataSource={minusLastIndex} pagination={false}/> */}
            {/* TABEL REKAP        */}
            <div className="hidden">
              <div ref={ref} className="mt-2">
                {tableData.map((data: any) => (
                  <>
                    <table id="tableData">
                      <div className="hidden">
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
                                  {Number.isNaN(Number(dataSubTitle.uraian)) ===
                                  true
                                    ? dataSubTitle.uraian
                                    : formatRupiah(dataSubTitle.uraian)}
                                </span>
                              </div>
                            </td>
                          </thead>
                        ))}
                      </div>
                      <thead>
                        <th></th>
                      </thead>
                      <thead style={{ background: "green", color: "white" }}>
                        <tr>
                          <th
                            rowSpan={2}
                            colSpan={1}
                            style={{ fontSize: "12px", textAlign: "center" }}>
                            Kode
                          </th>
                          <th
                            rowSpan={2}
                            colSpan={1}
                            style={{ fontSize: "12px", textAlign: "center" }}>
                            Uraian
                          </th>
                          <th
                            rowSpan={2}
                            colSpan={1}
                            style={{ fontSize: "12px", textAlign: "center" }}>
                            Volume Output
                          </th>
                          <th
                            rowSpan={2}
                            colSpan={1}
                            style={{ fontSize: "12px", textAlign: "center" }}>
                            <div>
                              <div className="mb-2">Rincian Perhitungan</div>
                              <hr />
                              <div className="mt-2">Jumlah</div>
                            </div>
                          </th>
                          <th
                            rowSpan={2}
                            colSpan={1}
                            style={{ fontSize: "12px", textAlign: "center" }}>
                            <div>
                              <div>Harga Satuan</div>
                              <div>(Rp.)</div>
                            </div>
                          </th>
                          <th
                            rowSpan={2}
                            colSpan={1}
                            style={{ fontSize: "12px", textAlign: "center" }}>
                            <div>
                              <div>Jumlah Total</div>
                              <div>(Rp.)</div>
                            </div>
                          </th>
                          <th
                            rowSpan={1}
                            colSpan={2}
                            style={{ fontSize: "12px", textAlign: "center" }}>
                            Realisasi
                          </th>
                          <th
                            rowSpan={1}
                            colSpan={2}
                            style={{ fontSize: "12px", textAlign: "center" }}>
                            Saldo
                          </th>
                        </tr>
                        <tr>
                          <th>%</th>
                          <th>Jumlah</th>
                          <th>%</th>
                          <th>Jumlah</th>
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
                                ? formatRupiahKhusus(
                                    dataTableHeader.hargaSatuan,
                                  )
                                : ""}
                            </td>
                            <td style={{ textAlign: "right" }}>
                              {dataTableHeader.jumlahTotal
                                ? formatRupiahKhusus(
                                    dataTableHeader.jumlahTotal,
                                  )
                                : ""}
                            </td>
                            <td style={{ textAlign: "right" }}>
                              {dataTableHeader.jumlahTotal
                                ? formatRupiahKhusus(
                                    dataTableHeader.jumlahTotal,
                                  )
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
                                  <td colSpan={4}>{dataX.deskripsi}</td>
                                  <td>{dataX.deskripsiMoney}</td>
                                </tr>
                              </>
                            ))}
                          </>
                        ))}
                      </tbody>
                    </table>
                  </>
                ))}
              </div>
            </div>

            {/* TABEL RINCIAN */}

            <div ref={ref} className="mt-2">
              {tableData.map((data: any) => (
                <>
                  <table id="tableDataRinci">
                    <div className="hidden">
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
                                {Number.isNaN(Number(dataSubTitle.uraian)) ===
                                true
                                  ? dataSubTitle.uraian
                                  : formatRupiah(dataSubTitle.uraian)}
                              </span>
                            </div>
                          </td>
                        </thead>
                      ))}
                    </div>
                    <thead>
                      <th></th>
                    </thead>
                    <thead style={{ background: "green", color: "white" }}>
                      <tr>
                        <th
                          rowSpan={2}
                          colSpan={1}
                          style={{ fontSize: "12px", textAlign: "center" }}>
                          Kode
                        </th>
                        <th
                          rowSpan={2}
                          colSpan={1}
                          style={{ fontSize: "12px", textAlign: "center" }}>
                          Uraian
                        </th>
                        <th
                          rowSpan={2}
                          colSpan={1}
                          style={{ fontSize: "12px", textAlign: "center" }}>
                          Volume Output
                        </th>
                        <th
                          rowSpan={2}
                          colSpan={1}
                          style={{ fontSize: "12px", textAlign: "center" }}>
                          <div>
                            <div className="mb-2">Rincian Perhitungan</div>
                            <hr />
                            <div className="mt-2">Jumlah</div>
                          </div>
                        </th>
                        <th
                          rowSpan={2}
                          colSpan={1}
                          style={{ fontSize: "12px", textAlign: "center" }}>
                          <div>
                            <div>Harga Satuan</div>
                            <div>(Rp.)</div>
                          </div>
                        </th>
                        <th
                          rowSpan={2}
                          colSpan={1}
                          style={{ fontSize: "12px", textAlign: "center" }}>
                          <div>
                            <div>Jumlah Total</div>
                            <div>(Rp.)</div>
                          </div>
                        </th>

                        <th
                          rowSpan={1}
                          colSpan={2}
                          style={{ fontSize: "12px", textAlign: "center" }}>
                          Realisasi
                        </th>
                        <th
                          rowSpan={1}
                          colSpan={2}
                          style={{ fontSize: "12px", textAlign: "center" }}>
                          Saldo
                        </th>
                      </tr>
                      <tr>
                        <th>%</th>
                        <th>Jumlah</th>
                        <th>%</th>
                        <th>Jumlah</th>
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
                                <td colSpan={4}>{dataX.deskripsi}</td>
                                <td>{dataX.deskripsiMoney}</td>
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
                                          {dataZ.totalKuantitas}{" "}
                                          {dataZ.unitSatuan}
                                        </td>
                                        <td style={{ textAlign: "right" }}>
                                          {formatRupiahKhusus(
                                            dataZ.hargaSatuan,
                                          )}
                                        </td>
                                        <td style={{ textAlign: "right" }}>
                                          {formatRupiahKhusus(
                                            dataZ.jumlahTotal,
                                          )}
                                        </td>
                                        <td>{dataZ.realisasiPercent}</td>
                                        <td style={{ textAlign: "right" }}>
                                          {/* {dataZ.realisasiMoney !== undefined ? formatRupiahKhusus(dataZ.realisasiMoney) : 0}
                                           */}
                                          {dataZ.realisasiMoney}
                                        </td>
                                        <td>{dataZ.saldoPercent}</td>
                                        <td style={{ textAlign: "right" }}>
                                          {dataZ.saldoMoney !== undefined
                                            ? formatRupiahKhusus(
                                                dataZ.saldoMoney,
                                              )
                                            : 0}
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
                </>
              ))}
            </div>
          </div>
        </div>
      </Main>
    </>
  );
};

export default LaporanRealisasi;

// Main Component Style
export const Main = styled.div.attrs({
  className: "m-5 p-5 bg-white shadow-md rounded",
})``;

export const WrapSelect = styled.div.attrs({
  className: "flex justify-center items-center",
})``;
export const LabelSelect = styled.div.attrs({
  className: "mr-2 text-sm block",
})``;
