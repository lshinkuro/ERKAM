/** @format */

import React, { useEffect, useState } from "react";
import { Table, Button, Input, InputGroup, Icon } from "rsuite";
import { Grid, Row, Col } from "rsuite";
import BelanjaImage from "../../../../src/assets/img/dashboard/dashBelanja.png";
import SisaImage from "../../../../src/assets/img/dashboard/dashSisa.png";
import PendapatanImage from "../../../../src/assets/img/dashboard/dashPendapatan.png";
import * as ReportAPBM from "../../../services/v2/realizationservice/laporan/apbm";
import * as ReportRAPBMRekap from "../../../services/v2/planningservice/laporan/apbm";
import { formatRupiah } from "../../../utils/helper";
import { useHistory } from "react-router-dom";

import { Skeleton, Card } from "antd";
const { Column, HeaderCell, Cell, Pagination } = Table;
const { Meta } = Card;

const ApbmDashboard = () => {
  let history = useHistory();
  const refMadrasah: any =
    JSON.parse(localStorage.getItem("referensi-madrasah")!) || [];
  const auth: any = JSON.parse(localStorage.getItem("auth")!) || "";
  const [loading, setLoading] = useState<boolean>(true);

  const [dataAPBMDashboard, setDataAPBMDashboard] = useState<any>([]);
  const [dataRAPBMRekapDashboard, setDataRAPBMRekapDashboard] = useState<any>(
    [],
  );
  const dataRAPBMRekapLokalDashboard: any =
    JSON.parse(localStorage.getItem("laporan-apbm-dashboard")!) || [];

  const [totalPendapatan, setTotalPendapatan] = useState<any>(0);
  const [totalRealisasiPendapatan, setTotalRealisasiPendapatan] =
    useState<any>(0);
  const [persenPendapatan, setPersenPendapatan] = useState<any>(0);
  const [totalPengeluaran, setTotalPengeluaran] = useState<any>(0);
  const [totalRealisasiPengeluaran, setTotalRealisasiPengeluaran] =
    useState<any>(0);
  const [persenPengeluaran, setPersenPengeluaran] = useState<any>(0);
  const [totalSisa, setTotalSisa] = useState<any>(0);
  const [persenSisa, setPersenSisa] = useState<any>(0);
  const [tableDashboard, setTableDashboard] = useState<any>([]);
  const [tableDashboardSearch, setTableDashboardSearch] = useState<any>([]);

  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();

  const [page, setPage] = useState(1);
  const [displayLength, setDisplayLength] = useState(10);

  const getAllDataAPBMDashboard = () => {
    let tmpData;
    tmpData = [];
    if (navigator.onLine) {
      ReportAPBM.browseDashboard(
        `tahun=${auth.tahun ? auth.tahun : new Date().getFullYear()}`,
      ).then((data) => {
        setDataAPBMDashboard(data);
      });
    } else {
      setDataAPBMDashboard(tmpData);
    }
  };

  const getAllDataRAPBMRekapDashboard = () => {
    if (navigator.onLine) {
      ReportRAPBMRekap.browseDashboard(
        `tahun=${auth.tahun ? auth.tahun : new Date().getFullYear()}`,
      ).then((data) => {
        setDataRAPBMRekapDashboard(data);
      });
    } else {
      setDataRAPBMRekapDashboard(dataRAPBMRekapLokalDashboard);
    }
  };

  useEffect(() => {
    getAllDataAPBMDashboard();
    getAllDataRAPBMRekapDashboard();
  }, []);

  useEffect(() => {
    if (dataRAPBMRekapDashboard.length > 0 && dataAPBMDashboard.length > 0) {
      let tmpTableDashboard: any = [];
      tmpTableDashboard = dataRAPBMRekapDashboard.map((data, key) => {
        const tmpDataAPBMDashboard =
          dataAPBMDashboard.filter((item) => {
            return item.madrasahId === data.madrasahId;
          })[0] || [];

        const tmpMadrasah =
          refMadrasah.filter((item) => {
            return item.id === data.madrasahId;
          })[0] || [];

        const tmptotalRealisasiPendapatan = tmpDataAPBMDashboard
          ? tmpDataAPBMDashboard.totalRealisasiPendapatan
          : 0;
        const tmptotalRealsiasiBelanja = tmpDataAPBMDashboard
          ? tmpDataAPBMDashboard.totalRealsiasiBelanja
          : 0;
        return {
          id: key + 1,
          kantorKabkotaId: data.kantorKabkotaId,
          kantorProvinsiId: data.kantorProvinsiId,
          kantorPusatId: data.kantorPusatId,
          madrasahId: data.madrasahId,
          nsm: tmpMadrasah.nsm ? tmpMadrasah.nsm : "-",
          provinsi: tmpMadrasah.kode_provinsi ? tmpMadrasah.kode_provinsi : "-",
          kabupaten: tmpMadrasah.kode_kabkota ? tmpMadrasah.kode_kabkota : "-",
          madrasahNama: data.madrasahNama,
          totalAnggaranPendapatan: data.totalAnggaranPendapatan,
          totalRealisasiPendapatan: tmptotalRealisasiPendapatan,
          persenPendapatan:
            Math.round(
              ((tmptotalRealisasiPendapatan / data.totalAnggaranPendapatan) *
                100 +
                Number.EPSILON) *
                100,
            ) / 100,
          totalRealsiasiBelanja: tmptotalRealsiasiBelanja,
          totalAnggaranBelanja: data.totalAnggaranBelanja,
          persenBelanja:
            Math.round(
              ((tmptotalRealsiasiBelanja / data.totalAnggaranBelanja) * 100 +
                Number.EPSILON) *
                100,
            ) / 100,
          sisaSaldoRealisasi:
            tmptotalRealisasiPendapatan - tmptotalRealsiasiBelanja,
        };
      });

      setTableDashboard(tmpTableDashboard);
      setTableDashboardSearch(tmpTableDashboard);
      console.log("DAPBMTableDashboard", tmpTableDashboard);
      // Create Summary Dashbard Data

      const tmpTotalPendapatan = tmpTableDashboard.reduce(
        (a, b) => a + b.totalAnggaranPendapatan,
        0,
      );
      setTotalPendapatan(tmpTotalPendapatan);
      const tmpTotalRealisasiPendapatan = tmpTableDashboard.reduce(
        (a, b) => a + b.totalRealisasiPendapatan,
        0,
      );
      setTotalRealisasiPendapatan(tmpTotalRealisasiPendapatan);
      setPersenPendapatan(
        Math.round(
          ((tmpTotalRealisasiPendapatan / tmpTotalPendapatan) * 100 +
            Number.EPSILON) *
            100,
        ) / 100,
      );

      const tmpTotalPengeluaran = tmpTableDashboard.reduce(
        (a, b) => a + b.totalAnggaranBelanja,
        0,
      );
      setTotalPengeluaran(tmpTotalPengeluaran);
      const tmpTotalRealisasiPengeluaran = tmpTableDashboard.reduce(
        (a, b) => a + b.totalRealsiasiBelanja,
        0,
      );
      setTotalRealisasiPengeluaran(tmpTotalRealisasiPengeluaran);
      setPersenPengeluaran(
        Math.round(
          ((tmpTotalRealisasiPengeluaran / tmpTotalPengeluaran) * 100 +
            Number.EPSILON) *
            100,
        ) / 100,
      );

      const tmpSisa = tmpTotalRealisasiPendapatan - tmpTotalPengeluaran;
      const tmpPersenSisa =
        Math.round(
          ((tmpSisa / tmpTotalRealisasiPendapatan) * 100 + Number.EPSILON) *
            100,
        ) / 100;
      setTotalSisa(tmpSisa);
      setPersenSisa(tmpPersenSisa);

      setLoading(false);
    }
  }, [dataRAPBMRekapDashboard, dataAPBMDashboard]);

  const handleChangePage = (dataKey) => {
    setPage(dataKey);
  };

  const handleChangeLength = (dataKey) => {
    setPage(page);
    setDisplayLength(dataKey);
  };

  function filterSearch(e) {
    const search = e.toLowerCase();
    const dataForSearch = tableDashboardSearch;
    let tmpTable = dataForSearch;

    if (search.length > 1) {
      const val = (tmpTable || "").filter((item) => {
        return (
          (item.nsm !== null &&
            (item.nsm || "").toLowerCase().includes(search)) ||
          (item.madrasahNama !== null &&
            (item.madrasahNama || "").toLowerCase().includes(search))
        );
      });
      setTableDashboard(val);
      resetPagination();
    } else {
      setTableDashboard(tmpTable);
      resetPagination();
    }
  }

  function resetPagination() {
    const data = tableDashboard.filter((v, i) => {
      let start = displayLength * (page - 1);
      let end = start + displayLength;
      return i >= start && i < end;
    });
  }

  const renderTable = () => {
    return (
      <>
        <div className="flex items center justify-between">
          <div className="flex">
            <div
              className="items center max-w-lg"
              style={{ marginTop: "12px", width: "350px" }}>
              <InputGroup inside>
                <Input
                  type="text"
                  name="search"
                  className="h-8 py-1 w-full pl-3"
                  placeholder="Cari..."
                  onChange={(e) => {
                    filterSearch(e);
                  }}
                />
                <InputGroup.Addon>
                  <Icon icon="search" />
                </InputGroup.Addon>
              </InputGroup>
            </div>
          </div>
          <Pagination
            lengthMenu={[
              { value: 10, label: 10 },
              { value: 20, label: 20 },
              { value: 40, label: 40 },
            ]}
            activePage={page}
            displayLength={displayLength}
            total={tableDashboard.length}
            ellipsis={true}
            boundaryLinks={true}
            onChangePage={handleChangePage}
            onChangeLength={handleChangeLength}
          />
        </div>

        <Table
          data={tableDashboard}
          sortColumn={sortColumn}
          sortType={sortType}
          loading={loading}
          onRowClick={(data) => {
            console.log(data);
          }}>
          <Column width={50} align="center">
            <HeaderCell>No</HeaderCell>
            <Cell dataKey="id" />
          </Column>
          <Column width={150} align="center">
            <HeaderCell>NSM</HeaderCell>
            <Cell dataKey="nsm" />
          </Column>
          <Column width={200} align="center">
            <HeaderCell>Madrasah</HeaderCell>
            <Cell dataKey="madrasahNama" />
          </Column>
          <Column width={350} align="center">
            <HeaderCell>Realisasi Pendapatan</HeaderCell>
            <Cell style={{ textAlign: "right" }}>
              {(rowData) => {
                return formatRupiah(rowData.totalRealisasiPendapatan);
              }}
            </Cell>
          </Column>
          <Column width={300} align="center">
            <HeaderCell>Realisasi Belanja</HeaderCell>
            <Cell style={{ textAlign: "right" }}>
              {(rowData) => {
                return formatRupiah(rowData.totalRealsiasiBelanja);
              }}
            </Cell>
          </Column>
          <Column width={300} align="center">
            <HeaderCell>Saldo</HeaderCell>
            <Cell style={{ textAlign: "right" }}>
              {(rowData) => {
                return formatRupiah(rowData.sisaSaldoRealisasi);
              }}
            </Cell>
          </Column>
          <Column width={100} align="center">
            <HeaderCell>Aksi</HeaderCell>
            <Cell>
              {(rowData) => {
                return (
                  <Button
                    style={{ margin: 0, padding: 0 }}
                    appearance="link"
                    onClick={() => {
                      auth.group_role === "madrasah"
                        ? history.push("/laporan/apbm")
                        : history.push({
                            pathname: "/laporan/apbm",
                            state: {
                              provinsi: rowData.provinsi,
                              kabupaten: rowData.kabupaten,
                              madrasahId: rowData.madrasahId,
                            },
                          });
                    }}>
                    Rincian
                  </Button>
                );
              }}
            </Cell>
          </Column>
        </Table>
      </>
    );
  };

  return (
    <>
      <Grid fluid>
        <Row style={{ marginBottom: "30px" }}>
          <Col xs={24} sm={24} md={8}>
            <Card style={{ width: "100%", margin: 5, display: "inline-block" }}>
              <Skeleton loading={loading} avatar active>
                <Meta
                  avatar={<img src={PendapatanImage} alt="Pendapatan" />}
                  title="Sisa Saldo"
                  description={
                    <>
                      <p
                        style={{
                          textAlign: "right",
                          fontSize: "48px",
                          marginBottom: "0px",
                        }}>
                        {persenSisa}%
                      </p>
                      <table style={{ margin: "0px" }}>
                        <tr style={{ border: "0px" }}>
                          <td style={{ textAlign: "right" }}>
                            <p
                              style={{
                                textAlign: "right",
                                fontSize: "24px",
                                fontWeight: "bolder",
                                marginBottom: "0px",
                              }}>
                              {formatRupiah(totalSisa)}
                            </p>
                          </td>
                        </tr>
                      </table>
                    </>
                  }
                />
              </Skeleton>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Card style={{ width: "100%", margin: 5, display: "inline-block" }}>
              <Skeleton loading={loading} avatar active>
                <Meta
                  avatar={<img src={SisaImage} alt="Sisa" />}
                  title="Pendapatan"
                  description={
                    <>
                      <p
                        style={{
                          textAlign: "right",
                          fontSize: "48px",
                          marginBottom: "0px",
                        }}>
                        {persenPendapatan}%
                      </p>
                      <table style={{ margin: "0px" }}>
                        <tr style={{ border: "0px" }}>
                          <td style={{ textAlign: "right" }}>
                            <small style={{ textAlign: "right" }}>
                              Anggaran
                            </small>
                            <br />
                            <p
                              style={{
                                textAlign: "right",
                                fontWeight: "bolder",
                                marginBottom: "0px",
                              }}>
                              {formatRupiah(totalPendapatan)}
                            </p>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <small style={{ textAlign: "right" }}>
                              Realisasi
                            </small>
                            <br />
                            <p
                              style={{
                                textAlign: "right",
                                fontWeight: "bolder",
                                marginBottom: "0px",
                              }}>
                              {formatRupiah(totalRealisasiPendapatan)}
                            </p>
                          </td>
                        </tr>
                      </table>
                    </>
                  }
                />
              </Skeleton>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Card
              style={{ width: "100%", margin: 5, display: "inline-block" }}
              loading={false}>
              <Skeleton loading={loading} avatar active>
                <Meta
                  avatar={<img src={BelanjaImage} alt="Belanja" />}
                  title="Pengeluaran"
                  description={
                    <>
                      <p
                        style={{
                          textAlign: "right",
                          fontSize: "48px",
                          marginBottom: "0px",
                        }}>
                        {persenPengeluaran}%
                      </p>
                      <table style={{ margin: "0px" }}>
                        <tr style={{ border: "0px" }}>
                          <td style={{ textAlign: "right" }}>
                            <small style={{ textAlign: "right" }}>
                              Anggaran
                            </small>
                            <br />
                            <p
                              style={{
                                textAlign: "right",
                                fontWeight: "bolder",
                                marginBottom: "0px",
                              }}>
                              {formatRupiah(totalPengeluaran)}
                            </p>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <small style={{ textAlign: "right" }}>
                              Realisasi
                            </small>
                            <br />
                            <p
                              style={{
                                textAlign: "right",
                                fontWeight: "bolder",
                                marginBottom: "0px",
                              }}>
                              {formatRupiah(totalRealisasiPengeluaran)}
                            </p>
                          </td>
                        </tr>
                      </table>
                    </>
                  }
                />
              </Skeleton>
            </Card>
          </Col>
        </Row>
        {renderTable()}
      </Grid>
    </>
  );
};

export default ApbmDashboard;
