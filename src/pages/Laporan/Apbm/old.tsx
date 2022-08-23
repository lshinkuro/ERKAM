/** @format */

import React, { useState, useEffect } from "react";
import { BreadCrumb } from "../../../components";
import * as ReportAPBM from "../../../services/v2/realizationservice/laporan/apbm";
import * as ReportRAPBMRekap from "../../../services/v2/planningservice/laporan/apbm";
import { formatRupiah } from "../../../utils/helper";

import { Main } from "./style";

import { Loader } from "rsuite";

import FilterLaporan2 from "./component/filter2";
import { useLocation } from "react-router-dom";

const Apbm = () => {
  const location = useLocation();
  const state: any = location.state || [];
  const auth = JSON.parse(localStorage.getItem("auth")!) || [];
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Laporan" },
    { path: "/", breadcrumbName: "Laporan Rencana" },
    { path: "/", breadcrumbName: "APBM" },
  ];

  const [dataAPBM, setDataAPBM]: any = React.useState<any>([]);
  const dataAPBMLocal: any =
    JSON.parse(localStorage.getItem("laporan-apbm")!) || [];
  const [dataRAPBMRekap, setDataRAPBMRekap]: any = React.useState<any>([]);
  const dataRAPBMRekapLokal: any =
    JSON.parse(localStorage.getItem("laporan-rapbm-rekap")!) || [];
  const [rowRAPBMRekap, setRowRAPBMRekap]: any = React.useState<any>([]);

  const [tahun, setTahun] = useState<any>(auth.tahun);
  const [provinsi, setProvinsi] = useState<any>(state.provinsi || null);
  const [kabupaten, setKabupaten] = useState<any>(state.kabupaten || null);
  const [madrasah, setMadrasah] = useState<any>(state.madrasahId || null);
  const [tableLoading, setTableLoading] = useState<boolean>(true);

  const getAllDataAPBM = () => {
    if (navigator.onLine) {
      let urlPrep;
      urlPrep = `tahun=${tahun ? tahun : new Date().getFullYear()}`;
      if (auth.group_role !== "madrasah") {
        urlPrep += `&madrasahId=${madrasah}`;
      }
      ReportAPBM.browse(urlPrep).then((data) => {
        let tmpData;
        tmpData = [];

        // console.log("Realisasi Asli", data)
        data.forEach((row) => {
          let realisasiBiayas;
          realisasiBiayas = [];
          if (row.realisasiBiayas.length > 0) {
            row.realisasiBiayas.forEach((row2) => {
              realisasiBiayas[row2.rencanaRincianKegiatanId] = {
                biaya: row2.biaya,
              };
            });
          }
          tmpData[row.rencanaPendapatanId] = {
            totalRealisasiPendapatan: row.totalRealisasiPendapatan,
            realisasiBiayas: realisasiBiayas,
          };
        });
        // console.log("Realisasi", tmpData)
        setDataAPBM(tmpData);
      });
    } else {
      let tmpData;
      tmpData = [];
      dataAPBMLocal.forEach((row) => {
        let realisasiBiayas;
        realisasiBiayas = [];
        if (row.realisasiBiayas.length > 0) {
          row.realisasiBiayas.forEach((row2) => {
            realisasiBiayas[row2.rencanaRincianKegiatanId] = {
              biaya: row2.biaya,
            };
          });
        }
        tmpData[row.rencanaPendapatanId] = {
          totalRealisasiPendapatan: row.totalRealisasiPendapatan,
          realisasiBiayas: realisasiBiayas,
        };
      });
      setDataAPBM(tmpData);
    }
  };

  const getAllDataRAPBMRekap = () => {
    if (navigator.onLine) {
      let urlPrep;
      urlPrep = `tahun=${tahun ? tahun : new Date().getFullYear()}`;
      if (auth.group_role !== "madrasah") {
        urlPrep += `&madrasahId=${madrasah}`;
      }
      ReportRAPBMRekap.browse(urlPrep).then((data) => {
        setDataRAPBMRekap(data);
      });
    } else {
      setDataRAPBMRekap(dataRAPBMRekapLokal);
    }
  };

  useEffect(() => {
    if (madrasah !== "" || madrasah !== null) {
      setTableLoading(true);
      getAllDataAPBM();
      getAllDataRAPBMRekap();
    }
  }, [madrasah, tahun]);

  useEffect(() => {
    getAllDataAPBM();
    getAllDataRAPBMRekap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let tmpRowRAPBMRekap;
    tmpRowRAPBMRekap = [];
    let i = 10;
    dataRAPBMRekap.forEach((value) => {
      tmpRowRAPBMRekap.push([
        "1",
        "SUMBER DANA",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ]);
      const totalRealisasiPendapatan =
        dataAPBM[value.rencanaPendapatanId] !== undefined
          ? dataAPBM[value.rencanaPendapatanId].totalRealisasiPendapatan
          : 0;
      const persenPendapatan = Math.round(
        (totalRealisasiPendapatan / value.totalPendapatan) * 100,
      );
      tmpRowRAPBMRekap.push([
        i.toString(36).toUpperCase(),
        value.namaSumberDana,
        value.totalPendapatan,
        totalRealisasiPendapatan,
        `${persenPendapatan}%`,
        "",
        "",
        "",
        totalRealisasiPendapatan,
        "",
      ]);
      let totalBiayas = 0;
      let tmpRealisasiPendapatan = totalRealisasiPendapatan;
      if (value.pengeluaran.length > 0) {
        // Belanja
        tmpRowRAPBMRekap.push(["2", "BELANJA", "", "", "", "", "", "", "", ""]);
        let j = 10;
        value.pengeluaran.forEach((value2) => {
          tmpRowRAPBMRekap.push([
            j.toString(36).toUpperCase(),
            value2.namaSnp,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ]);
          if (value2.items.length > 0) {
            let k = 10;
            value2.items.forEach((value3) => {
              if (dataAPBM[value.rencanaPendapatanId] !== undefined) {
                const realisasiBiaya =
                  dataAPBM[value.rencanaPendapatanId].realisasiBiayas[
                    value3.recanaRincianKegiatanId
                  ] !== undefined
                    ? dataAPBM[value.rencanaPendapatanId].realisasiBiayas[
                        value3.recanaRincianKegiatanId
                      ].biaya
                    : 0;
                const persenBiaya = Math.round(
                  (realisasiBiaya / value3.amount) * 100,
                );
                tmpRealisasiPendapatan -= value3.amount;
                tmpRowRAPBMRekap.push([
                  j.toString(36).toUpperCase() + `.${k - 9}`,
                  value3.namaJenisBelanja,
                  "",
                  "",
                  "",
                  value3.amount,
                  realisasiBiaya,
                  `${persenBiaya}%`,
                  tmpRealisasiPendapatan,
                  "",
                ]);
                totalBiayas += realisasiBiaya;
              } else {
                tmpRowRAPBMRekap.push([
                  j.toString(36).toUpperCase() + `.${k - 9}`,
                  value3.namaJenisBelanja,
                  "",
                  "",
                  "",
                  value3.amount,
                  0,
                  0,
                  "",
                  "",
                ]);
              }
              k += 1;
            });
          }
          j += 1;
        });
      }
      i += 1;
      tmpRowRAPBMRekap.push([
        "",
        "TOTAL",
        value.totalPendapatan,
        totalRealisasiPendapatan,
        totalRealisasiPendapatan === 0
          ? "0%"
          : `${Math.round(
              (totalRealisasiPendapatan / value.totalPendapatan) * 100,
            )}%`,
        value.totalPengeluaran,
        totalBiayas,
        totalBiayas === 0
          ? "0%"
          : `${Math.round((totalBiayas / value.totalPengeluaran) * 100)}%`,
        tmpRealisasiPendapatan,
        `${Math.round(
          (tmpRealisasiPendapatan / totalRealisasiPendapatan) * 100,
        )}%`,
      ]);
      tmpRowRAPBMRekap.push([
        "",
        `SISA SALDO SUMBER DANA ${value.namaSumberDana}`,
        "",
        "",
        "",
        "",
        "",
        "",
        tmpRealisasiPendapatan,
        "",
      ]);
    });
    // tmpRowRAPBMRekap.push(["", "", "", "", "", "", "", "", "", ""])
    setRowRAPBMRekap(tmpRowRAPBMRekap);
    setTableLoading(false);
  }, [dataRAPBMRekap]);

  const PendapatanRow = ({ row }) => {
    if (row[0] === "") {
      return (
        <tr>
          <td style={{ textAlign: "right", backgroundColor: "#d5d6d7" }}>
            {row[0]}
          </td>
          <td
            style={{
              textAlign: "center",
              borderLeft: "1px solid #d5d6d7",
              backgroundColor: "#d5d6d7",
            }}>
            <strong>{row[1]}</strong>
          </td>
          <td
            style={{
              textAlign: "right",
              borderLeft: "1px solid #d5d6d7",
              backgroundColor: "#d5d6d7",
            }}>
            {row[2] !== "" ? formatRupiah(row[2]) : ""}
          </td>
          <td
            style={{
              textAlign: "right",
              borderLeft: "1px solid #d5d6d7",
              backgroundColor: "#d5d6d7",
            }}>
            {row[3] !== "" ? formatRupiah(row[3]) : ""}
          </td>
          <td
            style={{
              textAlign: "right",
              borderLeft: "1px solid #d5d6d7",
              backgroundColor: "#d5d6d7",
            }}>
            {row[4] !== "" ? row[4] : ""}
          </td>
          <td
            style={{
              textAlign: "right",
              borderLeft: "1px solid #d5d6d7",
              backgroundColor: "#d5d6d7",
            }}>
            {row[5] !== "" ? formatRupiah(row[5]) : ""}
          </td>
          <td
            style={{
              textAlign: "right",
              borderLeft: "1px solid #d5d6d7",
              backgroundColor: "#d5d6d7",
            }}>
            {row[6] !== "" ? formatRupiah(row[6]) : ""}
          </td>
          <td
            style={{
              textAlign: "right",
              borderLeft: "1px solid #d5d6d7",
              backgroundColor: "#d5d6d7",
            }}>
            {row[7] !== "" ? row[7] : ""}
          </td>
          <td
            style={{
              textAlign: "right",
              borderLeft: "1px solid #d5d6d7",
              backgroundColor: "#d5d6d7",
            }}>
            {row[8] !== "" ? formatRupiah(row[8]) : ""}
          </td>
          <td
            style={{
              textAlign: "right",
              borderLeft: "1px solid #d5d6d7",
              backgroundColor: "#d5d6d7",
            }}>
            {row[9] !== "" ? row[9] : ""}
          </td>
        </tr>
      );
    }
    return (
      <tr>
        <td style={{ textAlign: "right" }}>{row[0]}</td>
        <td style={{ textAlign: "left", borderLeft: "1px solid #d5d6d7" }}>
          {row[1]}
        </td>
        <td style={{ textAlign: "right", borderLeft: "1px solid #d5d6d7" }}>
          {row[2] !== "" ? formatRupiah(row[2]) : ""}
        </td>
        <td style={{ textAlign: "right", borderLeft: "1px solid #d5d6d7" }}>
          {row[3] !== "" ? formatRupiah(row[3]) : ""}
        </td>
        <td style={{ textAlign: "right", borderLeft: "1px solid #d5d6d7" }}>
          {row[4] !== "" ? row[4] : ""}
        </td>
        <td style={{ textAlign: "right", borderLeft: "1px solid #d5d6d7" }}>
          {row[5] !== "" ? formatRupiah(row[5]) : ""}
        </td>
        <td style={{ textAlign: "right", borderLeft: "1px solid #d5d6d7" }}>
          {row[6] !== "" ? formatRupiah(row[6]) : ""}
        </td>
        <td style={{ textAlign: "right", borderLeft: "1px solid #d5d6d7" }}>
          {row[7] !== "" ? row[7] : ""}
        </td>
        <td style={{ textAlign: "right", borderLeft: "1px solid #d5d6d7" }}>
          {row[8] !== "" ? formatRupiah(row[8]) : ""}
        </td>
        <td style={{ textAlign: "right", borderLeft: "1px solid #d5d6d7" }}>
          {row[9] !== "" ? row[9] : ""}
        </td>
      </tr>
    );
  };

  const createTableUI = () => {
    return (
      <>
        <table>
          <thead
            style={{
              backgroundColor: "#008000",
              color: "#FFFFFF",
            }}>
            <tr>
              <th style={{ textAlign: "center" }} rowSpan={3}>
                No
              </th>
              <th
                style={{ textAlign: "center", borderLeft: "1px solid #d5d6d7" }}
                rowSpan={3}>
                Uraian
              </th>
              <th
                style={{ textAlign: "center", borderLeft: "1px solid #d5d6d7" }}
                colSpan={3}>
                PENDAPATAN
              </th>
              <th
                style={{ textAlign: "center", borderLeft: "1px solid #d5d6d7" }}
                colSpan={3}>
                BELANJA
              </th>
              <th
                style={{ textAlign: "center", borderLeft: "1px solid #d5d6d7" }}
                colSpan={2}
                rowSpan={2}>
                SALDO
              </th>
            </tr>
            <tr>
              <th
                style={{ textAlign: "center", borderLeft: "1px solid #d5d6d7" }}
                rowSpan={2}>
                Anggaran
              </th>
              <th
                style={{ textAlign: "center", borderLeft: "1px solid #d5d6d7" }}
                colSpan={2}>
                Realisasi
              </th>
              <th
                style={{ textAlign: "center", borderLeft: "1px solid #d5d6d7" }}
                rowSpan={2}>
                Anggaran
              </th>
              <th
                style={{ textAlign: "center", borderLeft: "1px solid #d5d6d7" }}
                colSpan={2}>
                Realisasi
              </th>
            </tr>
            <tr>
              <th
                style={{
                  textAlign: "center",
                  borderLeft: "1px solid #d5d6d7",
                }}>
                Rupiah
              </th>
              <th
                style={{
                  textAlign: "center",
                  borderLeft: "1px solid #d5d6d7",
                }}>
                %
              </th>
              <th
                style={{
                  textAlign: "center",
                  borderLeft: "1px solid #d5d6d7",
                }}>
                Rupiah
              </th>
              <th
                style={{
                  textAlign: "center",
                  borderLeft: "1px solid #d5d6d7",
                }}>
                %
              </th>
              <th
                style={{
                  textAlign: "center",
                  borderLeft: "1px solid #d5d6d7",
                }}>
                Rupiah
              </th>
              <th
                style={{
                  textAlign: "center",
                  borderLeft: "1px solid #d5d6d7",
                }}>
                %
              </th>
            </tr>
            <tr>
              <th
                style={{
                  textAlign: "center",
                  borderLeft: "1px solid #d5d6d7",
                }}>
                a
              </th>
              <th
                style={{
                  textAlign: "center",
                  borderLeft: "1px solid #d5d6d7",
                }}>
                b
              </th>
              <th
                style={{
                  textAlign: "center",
                  borderLeft: "1px solid #d5d6d7",
                }}>
                c
              </th>
              <th
                style={{
                  textAlign: "center",
                  borderLeft: "1px solid #d5d6d7",
                }}>
                d
              </th>
              <th
                style={{
                  textAlign: "center",
                  borderLeft: "1px solid #d5d6d7",
                }}>
                e
              </th>
              <th
                style={{
                  textAlign: "center",
                  borderLeft: "1px solid #d5d6d7",
                }}>
                f
              </th>
              <th
                style={{
                  textAlign: "center",
                  borderLeft: "1px solid #d5d6d7",
                }}>
                g
              </th>
              <th
                style={{
                  textAlign: "center",
                  borderLeft: "1px solid #d5d6d7",
                }}>
                h
              </th>
              <th
                style={{
                  textAlign: "center",
                  borderLeft: "1px solid #d5d6d7",
                }}>
                i = d-f
              </th>
              <th
                style={{
                  textAlign: "center",
                  borderLeft: "1px solid #d5d6d7",
                }}>
                j = i/d
              </th>
            </tr>
          </thead>
          <tbody>
            {rowRAPBMRekap.length > 0 ? (
              rowRAPBMRekap.map((rowData, index) => {
                if (rowData) return <PendapatanRow key={index} row={rowData} />;
              })
            ) : (
              <tr>
                {tableLoading ? (
                  <td
                    style={{ textAlign: "center", height: "100px" }}
                    colSpan={10}>
                    <Loader content="Loading..." />
                  </td>
                ) : (
                  <td
                    style={{ textAlign: "center", height: "100px" }}
                    colSpan={10}>
                    No Data Please Check Filter
                  </td>
                )}
              </tr>
            )}
          </tbody>
        </table>
      </>
    );
  };

  return (
    <>
      <BreadCrumb routes={itemBreadcrumb} title="APBM" />
      <Main>
        <FilterLaporan2
          setTahun={setTahun}
          setProvinsi={setProvinsi}
          setKabupaten={setKabupaten}
          setMadrasah={setMadrasah}
          defaultKabupaten={kabupaten}
          defaultProvinsi={provinsi}
          defaultMadrasah={madrasah}
        />
      </Main>
      <Main>{createTableUI()}</Main>
    </>
  );
};

export default Apbm;
