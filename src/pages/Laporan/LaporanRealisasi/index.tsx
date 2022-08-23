/** @format */

import React, { useState, useEffect } from "react";
import { BreadCrumb } from "../../../components";
import moment from "moment";
import "moment/locale/id";
import { Table, Space, Typography, Descriptions } from "antd";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import * as FileSaver from "file-saver";
// import * as XLSX from "xlsx";
import { formatRupiah, sheet_to_blob } from "../../../utils/helper";

import { useSelector } from "react-redux";
import { ButtonDropdownExport, ButtonExport } from "../../../components/Button";
// import InputSearch from "../../../components/InputSearch";
// import notifAlert from "../../../components/NotifAlert";
import { getLaporanRealisasi } from "../../../services/v2/realizationservice/laporanservices";
import { getMadrasah } from "../../../services/v2/usermanservice/madrasahservices";
const { Text } = Typography;
const LaporanRealisasi = () => {
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Laporan" },
    { path: "/", breadcrumbName: "Laporan Realisasi" },
    { path: "/", breadcrumbName: "Keuangan Realisasi" },
  ];
  const auths = useSelector((state: any) => state.auth);
  const store = useSelector((state: any) => state.store);
  // const refBank = store.rekeningBelanja || [];
  // const refTipeKas = store.tipeKas || [];
  // const refKabkota = store.kabkota || [];
  // const refProvinsi = store.provinsi || [];
  // const refKecamatan = store.kecamantan || [];
  const auth = auths?.data || [];
  const groupRole = auth?.group_role || "";
  const [tableData, setTableData] = useState<any>([]);
  //  const [tmpData, setTmpData] = useState<any>(null);
  const [tmpMadrasah, setTmpMadrasah] = useState<any>([]);
  // const [search, setSearch] = useState<any>(null);
  // const [page, setPage] = useState(1);
  // const [pageSize, setPageSize] = useState(10);
  const [tmpFilter, setTmpFilter] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  let dataTable: any = [];
  let dataHeaders: any =
    (tableData.length && tableData[0].rencanaHeaders) || [];
  let dataRole: any = (tableData.length && tableData[0].rencanaRole) || null;

  let dataRincian: any =
    (tableData.length && tableData[0].rencanaKegiatans) || [];
  dataHeaders.length &&
    // eslint-disable-next-line array-callback-return
    dataHeaders.map((item) => {
      let tmpDataHeader: any = {
        kode: item.kode || null,
        uraian: item.uraian || null,
        volumeOutput: item.volumeOutput || null,
        rincianPerhitungan: `${item.totalKuantitas || ""} ${
          item.unitSatuan || ""
        }`,
        hargaSatuan:
          (item.hargaSatuan && formatRupiah(item.hargaSatuan)) || null,
        jumlahTotal:
          (item.jumlahTotal && formatRupiah(item.jumlahTotal)) || null,
      };
      dataTable.push(tmpDataHeader);
    });
  dataRincian.length &&
    // eslint-disable-next-line array-callback-return
    dataRincian.map((item) => {
      let tmpDataRincian: any = {
        kode: item.kode || null,
        uraian: item.deskripsi || null,
        volumeOutput: null,
        rincianPerhitungan: null,
        hargaSatuan: null,
        jumlahTotal: null,
      };
      dataTable.push(tmpDataRincian);
      item.rencanaKegiatans.length &&
        // eslint-disable-next-line array-callback-return
        item.rencanaKegiatans.map((items) => {
          let tmpDataRencana: any = {
            kode: items.kodeJenisBelanja || null,
            uraian: items.namaJenisBelanja || null,
            volumeOutput: null,
            rincianPerhitungan: null,
            hargaSatuan: null,
            jumlahTotal:
              (items.jumlahTotal && formatRupiah(items.jumlahTotal)) || null,
          };
          dataTable.push(tmpDataRencana);
          items.rincianKegiatans.length &&
            // eslint-disable-next-line array-callback-return
            items.rincianKegiatans.map((itemss) => {
              let tmpDataRencanaRincian: any = {
                kode: null,
                uraian: itemss.komponenBiayaNama || null,
                volumeOutput: itemss.volumeOutput || null,
                rincianPerhitungan: `${item.totalKuantitas || ""} ${
                  item.unitSatuan || ""
                }`,
                hargaSatuan:
                  (itemss.jumlahTotal && formatRupiah(itemss.jumlahTotal)) ||
                  null,
                jumlahTotal:
                  (itemss.jumlahTotal && formatRupiah(itemss.jumlahTotal)) ||
                  null,
              };
              dataTable.push(tmpDataRencanaRincian);
            });
        });
    });
  let columns: any = [
    {
      title: "Kode",
      key: "kode1",
      align: "center",
      children: [
        {
          title: "1",
          dataIndex: "kode",
          key: "kode",
          width: 180,
        },
      ],
    },
    {
      title: "Uraian",
      key: "uraian2",
      align: "center",
      children: [
        {
          title: "2",
          dataIndex: "uraian",
          key: "uraian",
          width: 550,
        },
      ],
    },
    {
      title: "Volume Output",
      key: "volumeOutput3",
      align: "center",
      children: [
        {
          title: "3",
          dataIndex: "volumeOutput",
          key: "volumeOutput",
          width: 250,
        },
      ],
    },
    {
      title: "Rincian Perhitungan (Jumlah)",
      key: "rincianPerhitungan4",
      align: "center",
      children: [
        {
          title: "4",
          dataIndex: "rincianPerhitungan",
          key: "rincianPerhitungan",
          width: 250,
        },
      ],
    },
    {
      title: "Harga Satuan",
      key: "hargaSatuan5",
      align: "center",
      children: [
        {
          title: "5",
          dataIndex: "hargaSatuan",
          key: "hargaSatuan",
          width: 250,
        },
      ],
      // render: (jumlahTotal) => formatRupiah(jumlahTotal),
    },
    {
      title: "Jumlah Total",
      key: "jumlahTotal6",
      align: "center",
      children: [
        {
          title: "6",
          dataIndex: "jumlahTotal",
          key: "jumlahTotal",
          width: 250,
        },
      ],
      // render: (jumlahTotal) => formatRupiah(jumlahTotal),
    },
  ];
  // let dataTable: any = search
  //   ? tableData.filter((item: any) => {
  //       const val = search.toLowerCase();
  //       return (
  //         (item.noNotaFormat !== null &&
  //           (item.noNotaFormat || "").toString().toLowerCase().includes(val)) ||
  //         (item.uraian !== null &&
  //           (item.uraian || "").toString().toLowerCase().includes(val)) ||
  //         (item.realisasiNoReferensi !== null &&
  //           (item.realisasiNoReferensi || "")
  //             .toString()
  //             .toLowerCase()
  //             .includes(val))
  //       );
  //     })
  //   : tableData;

  // let totalDataTable = dataTable.length;

  /**
   * Filter Pagination
   */
  // dataTable = dataTable.filter((v, i) => {
  //   let start = pageSize * (page - 1);
  //   let end = start + pageSize;

  //   return i >= start && i < end;
  // });

  const getData = async () => {
    setLoading(true);
    if (groupRole !== "madrasah") {
      const madrasah = await getMadrasah();
      setTmpMadrasah(madrasah);
      const payload = {
        tahun: auth.isTahun,
      };
      const res = await getLaporanRealisasi(payload);
      setTableData(res || []);
      // setTmpData(res);
    } else {
      const payload = {
        tahun: auth.isTahun,
      };
      const res = await getLaporanRealisasi(payload);
      setTableData(res || []);
      // setTmpData(res);
      console.log(res);
    }

    setLoading(false);
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tmpFilter]);

  return (
    <>
      <BreadCrumb routes={itemBreadcrumb} title="Laporan Keuangan Realisasi" />
      <div className="m-5 p-5 bg-white shadow-md rounded">
        <div className="mb-4 flex justify-end">
          <div className="mr-4">
            <Space size={[8, 8]} wrap>
              <ButtonExport />
            </Space>
          </div>
          {/* <InputSearch
            className="w-3/4"
            onChange={(e: any) => setSearch(e.currentTarget.value)}
          /> */}
        </div>
        <div className="w-full">
          <div className="text-center">
            <Text strong>RINCIAN ANGGARAN BELANJA</Text>
          </div>
          <div className="text-center mb-10">
            <Text strong>
              KELOMPOK RINCIAN OUTPUT (OUTPUT) KEGIATAN T.A. {auths?.isTahun}
            </Text>
          </div>
          <div className="mb-2">
            <Descriptions
              column={1}
              // bordered
              labelStyle={{ fontWeight: 600 }}
              size={"small"}>
              <Descriptions.Item label="Kementerian Negara/Lembaga">
                Kementerian Agama
              </Descriptions.Item>
              <Descriptions.Item label="Unit Eselon II/Satker/Madrasah">
                {dataRole && dataRole?.nama_kantor_kabkota} /{" "}
                {dataRole && dataRole?.nama_madrasah}
              </Descriptions.Item>
              <Descriptions.Item label="Kegiatan">
                Pengelolaan dan Pembinaan Pendidikan Madrasah
              </Descriptions.Item>
              <Descriptions.Item label="Sasaran Kegiatan">
                {" "}
                &nbsp;
              </Descriptions.Item>
              <Descriptions.Item label="Indikator Kinerja Kegiatan">
                Siswa MI Penerima BOS
              </Descriptions.Item>
              <Descriptions.Item label="Kelompok Rincian Output (RO) Kegiatan">
                Bantuan Pendidikan Dasar dan Menengah
              </Descriptions.Item>
              <Descriptions.Item label="Indikator Rincian Output (RO) Kegiatan">
                Realisasi Penyediaan Dukungan Operasional Penyelenggaraan
                Pendidikan
              </Descriptions.Item>
              <Descriptions.Item label="Volume">1 (Satu)</Descriptions.Item>
              <Descriptions.Item label="Satuan Ukur">Layanan</Descriptions.Item>
              <Descriptions.Item label="Alokasi Dana">-</Descriptions.Item>
            </Descriptions>
          </div>
        </div>
        <div className="w-full">
          <Table
            sticky
            rowKey={(record) => record.id}
            columns={columns}
            dataSource={dataTable}
            scroll={{ x: "1300" }}
            bordered
            pagination={false}
            // pagination={{
            //   total: totalDataTable,
            //   position: ["bottomRight"],
            //   defaultPageSize: pageSize,
            //   defaultCurrent: page,
            //   showTotal: (total) => `Total ${total} items`,
            //   onChange(page, pageSize) {
            //     setPage(page);
            //     setPageSize(pageSize);
            //   },
            // }}
          />
        </div>
      </div>
    </>
  );
};

export default LaporanRealisasi;
