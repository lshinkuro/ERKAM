/** @format */
import React from "react";
import {
  Avatar,
  Card,
  Col,
  Row,
  Statistic,
  Progress,
  Typography,
  Table,
} from "antd";
import { Line } from "@ant-design/charts";
import { Column } from "@ant-design/plots";
import BelanjaImage from "../../assets/img/dashboard/dashBelanja.png";
import SisaImage from "../../assets/img/dashboard/dashSisa.png";
import PendapatanImage from "../../assets/img/dashboard/dashPendapatan.png";
import { useSelector } from "react-redux";
import { formatRupiah } from "../../utils/helper";

const { Text } = Typography;
const Dashboard = () => {
  const store = useSelector((state: any) => state.store);
  const auths = useSelector((state: any) => state.auth);
  const auth = auths.data;
  const { laporanRapbmRekap, laporanApbmDashboard, laporanRapbmDashboard } =
    store;
  let dataTable: any = [];
  let dataChartColumn: any = [];
  let dataStatistic: any = {
    totalAnggaranPendapatan: 0,
    totalRealsiasiPendapatan: 0,
    totalPersenPendapatan: 0,
    totalAnggaranBelanja: 0,
    totalRealsiasiBelanja: 0,
    totalPersenBelanja: 0,
  };

  /** Data Buat Table dan Statistic Columns */
  if (auth.group_role === "madrasah") {
    /** Data Buat Chart Columns */
    laporanRapbmRekap.length &&
      // eslint-disable-next-line array-callback-return
      laporanRapbmRekap.map((item: any) => {
        let tmpPendapatan: any = {
          name: item.namaSumberDana,
          type: "Pendapatan",
          value: item.totalPendapatan,
        };
        dataChartColumn.push(tmpPendapatan);

        let tmpPengeluaran: any = {
          name: item.namaSumberDana,
          type: "Belanja",
          value: item.totalPengeluaran,
        };
        dataChartColumn.push(tmpPengeluaran);

        let tmpSisa: any = {
          name: item.namaSumberDana,
          type: "Sisa Saldo",
          value:
            parseInt(item.totalPendapatan) - parseInt(item.totalPengeluaran),
        };
        dataChartColumn.push(tmpSisa);
      });

    let tmpLaporanApbmDashboard: any = {};

    laporanApbmDashboard.length &&
      laporanApbmDashboard
        .filter((item: any) => item.madrasahId.includes(auth.madrasah.id))
        // eslint-disable-next-line array-callback-return
        .map((item: any) => {
          tmpLaporanApbmDashboard = { ...item };
        });
    let tmpLaporanRapbmDashboard: any = {};
    laporanRapbmDashboard.length &&
      laporanRapbmDashboard
        .filter((item: any) => item.madrasahId.includes(auth.madrasah.id))
        // eslint-disable-next-line array-callback-return
        .map((item: any) => {
          tmpLaporanRapbmDashboard = { ...item };
        });
    dataStatistic = {
      ...dataStatistic,
      ...tmpLaporanApbmDashboard,
      ...tmpLaporanRapbmDashboard,
      nsm: auth.madrasah.nsm,
      id: auth.madrasah.id,
    };
    dataTable.push(dataStatistic);

    /** Data Buat Table  */
  }

  const dataT = [
    { bulan: "Januari", value: 100, category: "Pendapatan" },
    { bulan: "Februari", value: 10, category: "Pendapatan" },
    { bulan: "Maret", value: 50, category: "Pendapatan" },
    { bulan: "April", value: 60, category: "Pendapatan" },
    { bulan: "Mei", value: 40, category: "Pendapatan" },
    { bulan: "Juni", value: 50, category: "Pendapatan" },
    { bulan: "Juli", value: 80, category: "Pendapatan" },
    { bulan: "Agustus", value: 70, category: "Pendapatan" },
    { bulan: "September", value: 30, category: "Pendapatan" },
    { bulan: "Oktober", value: 30, category: "Pendapatan" },
    { bulan: "November", value: 10, category: "Pendapatan" },
    { bulan: "Desember", value: 100, category: "Pendapatan" },
    { bulan: "Januari", value: 10, category: "Belanja" },
    { bulan: "Februari", value: 210, category: "Belanja" },
    { bulan: "Maret", value: 30, category: "Belanja" },
    { bulan: "April", value: 20, category: "Belanja" },
    { bulan: "Mei", value: 60, category: "Belanja" },
    { bulan: "Juni", value: 10, category: "Belanja" },
    { bulan: "Juli", value: 70, category: "Belanja" },
    { bulan: "Agustus", value: 20, category: "Belanja" },
    { bulan: "September", value: 10, category: "Belanja" },
    { bulan: "Oktober", value: 60, category: "Belanja" },
    { bulan: "November", value: 10, category: "Belanja" },
    { bulan: "Desember", value: 100, category: "Belanja" },
  ];

  const configLine = {
    data: dataT,
    xField: "bulan",
    yField: "value",
    seriesField: "category",
    point: {
      size: 5,
      shape: "diamond",
    },
    animation: true,
  };

  const config = {
    data: dataChartColumn,
    isGroup: true,
    xField: "name",
    yField: "value",
    seriesField: "type",
    animation: {
      appear: {
        animation: "path-in",
        duration: 1000,
      },
    },
  };
  return (
    <div className="p-5">
      <div className="mb-5">
        <Row gutter={[24, 24]}>
          <Col xl={8} lg={8} md={8} sm={24} xs={24}>
            <Card>
              <Row gutter={[24, 24]}>
                <Col span={6}>
                  <Avatar size={80} src={PendapatanImage} />
                </Col>
                <Col span={18}>
                  <div className="p-2">
                    <Text strong>Sisa Saldo</Text>
                    <Progress
                      percent={Math.round(
                        ((dataStatistic.totalRealisasiPendapatan -
                          dataStatistic.totalRealsiasiBelanja) /
                          (dataStatistic.totalAnggaranPendapatan -
                            dataStatistic.totalAnggaranBelanja)) *
                          100,
                      )}
                    />
                    <div className="flex">
                      <div className="flex-1">
                        <Statistic
                          title="Anggaran"
                          value={
                            dataStatistic.totalAnggaranPendapatan -
                            dataStatistic.totalAnggaranBelanja
                          }
                          prefix="Rp"
                          valueStyle={{ fontSize: 12 }}
                        />
                      </div>
                      <div className="flex-1">
                        <Statistic
                          title="Realisasi"
                          value={
                            !isNaN(
                              parseInt(dataStatistic.totalRealisasiPendapatan) -
                                parseInt(dataStatistic.totalRealsiasiBelanja),
                            )
                              ? parseInt(
                                  dataStatistic.totalRealisasiPendapatan,
                                ) -
                                parseInt(dataStatistic.totalRealsiasiBelanja)
                              : 0
                          }
                          prefix="Rp"
                          valueStyle={{ fontSize: 12 }}
                        />
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xl={8} lg={8} md={8} sm={24} xs={24}>
            <Card>
              <Row gutter={[24, 24]}>
                <Col span={6}>
                  <Avatar size={80} src={SisaImage} />
                </Col>
                <Col span={18}>
                  <div className="p-2">
                    <Text strong>Pendapatan</Text>
                    <Progress
                      percent={Math.round(
                        (dataStatistic.totalRealisasiPendapatan /
                          dataStatistic.totalAnggaranPendapatan) *
                          100,
                      )}
                    />
                    <div className="flex">
                      <div className="flex-1">
                        <Statistic
                          title="Anggaran"
                          value={dataStatistic.totalAnggaranPendapatan}
                          prefix="Rp"
                          valueStyle={{ fontSize: 12 }}
                        />
                      </div>
                      <div className="flex-1">
                        <Statistic
                          title="Realisasi"
                          value={dataStatistic.totalRealisasiPendapatan}
                          prefix="Rp"
                          valueStyle={{ fontSize: 12 }}
                        />
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xl={8} lg={8} md={8} sm={24} xs={24}>
            <Card>
              <Row gutter={[24, 24]}>
                <Col span={6}>
                  <Avatar size={80} src={BelanjaImage} />
                </Col>
                <Col span={18}>
                  <div className="p-2">
                    <Text strong>Belanja</Text>
                    <Progress
                      percent={Math.round(
                        (dataStatistic.totalRealsiasiBelanja /
                          dataStatistic.totalAnggaranBelanja) *
                          100,
                      )}
                    />
                    <div className="flex">
                      <div className="flex-1">
                        <Statistic
                          title="Anggaran"
                          value={dataStatistic.totalAnggaranBelanja}
                          prefix="Rp"
                          valueStyle={{ fontSize: 12 }}
                        />
                      </div>
                      <div className="flex-1">
                        <Statistic
                          title="Realisasi"
                          value={dataStatistic.totalRealsiasiBelanja}
                          prefix="Rp"
                          valueStyle={{ fontSize: 12 }}
                        />
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
      <div className="mb-5">
        <Card>
          <Table
            rowKey={(record: any) => record.id}
            columns={columns}
            dataSource={dataTable}
            bordered
            pagination={false}
          />
        </Card>
      </div>
      <div className="mb-5">
        <Row gutter={[24, 24]}>
          <Col xl={12} lg={12} md={12} sm={24} xs={24}>
            <Card title="Pendapatan Dan Kegiatan">
              <Column {...config} />
            </Card>
          </Col>
          <Col xl={12} lg={12} md={12} sm={24} xs={24}>
            <Card title="Anggaran Kas Belanja">
              <Line {...configLine} />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

const columns = [
  {
    title: "NSM",
    dataIndex: "nsm",
    key: "nsm",
    // onFilter: (value, record) => record.nama.indexOf(value) === 0,
    // sorter: (a, b) => a.nama.length - b.nama.length,
  },
  {
    title: "Madrasah",
    dataIndex: "madrasahNama",
    key: "madrasahNama",
    // onFilter: (value, record) => record.nama.indexOf(value) === 0,
    // sorter: (a, b) => a.nama.length - b.nama.length,
  },
  {
    title: "Pendapatan",
    children: [
      {
        title: "Anggaran",
        key: "totalAnggaranPendapatan",
        dataIndex: "totalAnggaranPendapatan",
        render: (totalAnggaranPendapatan) =>
          formatRupiah(totalAnggaranPendapatan),
      },
      {
        title: "Realisasi",
        key: "totalRealisasiPendapatan",
        dataIndex: "totalRealisasiPendapatan",
        render: (totalRealisasiPendapatan) =>
          formatRupiah(
            !isNaN(totalRealisasiPendapatan) ? totalRealisasiPendapatan : 0,
          ),
      },
    ],
  },
  {
    title: "Belanja",
    children: [
      {
        title: "Anggaran",
        key: "totalAnggaranBelanja",
        dataIndex: "totalAnggaranBelanja",
        render: (totalAnggaranBelanja) => formatRupiah(totalAnggaranBelanja),
      },
      {
        title: "Realisasi",
        key: "totalRealsiasiBelanja",
        dataIndex: "totalRealsiasiBelanja",
        render: (totalRealsiasiBelanja) => formatRupiah(totalRealsiasiBelanja),
      },
    ],
  },
  {
    title: "Sisa Saldo",
    children: [
      {
        title: "Anggaran",
        key: "totalAnggaranSisa",
        render: (record) => {
          let totalAnggaranSisa: number =
            record.totalAnggaranPendapatan - record.totalAnggaranBelanja;
          return formatRupiah(
            !isNaN(totalAnggaranSisa) ? totalAnggaranSisa : 0,
          );
        },
      },
      {
        title: "Realisasi",
        key: "totalRealisasiSisa",
        render: (record) => {
          let totalRealisasiSisa: number =
            record.totalRealisasiPendapatan - record.totalRealsiasiBelanja;
          return formatRupiah(
            !isNaN(totalRealisasiSisa) ? totalRealisasiSisa : 0,
          );
        },
      },
    ],
  },
];

export default Dashboard;
