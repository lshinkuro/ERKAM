/** @format */

import React, { useState, useEffect } from "react";
import { BreadCrumb } from "../../../../components";
import { Table, Row, Col, Select, DatePicker, Pagination } from "antd";
import { formatRupiah } from "../../../../utils/helper";
import { Dropdown, DropdownItem } from "@windmill/react-ui";
import { FunnelPlotOutlined } from "@ant-design/icons";
import {
  Input,
  InputGroup,
  Icon,
  Button,
  // Dropdown,
} from "rsuite";
import { PdfIcon, ExcelIcon } from "../../../../icons";
import { ExportToExcel } from "../../../../components/Export/ExportToExcel";

function LaporanRKAKL() {
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Laporan" },
    { path: "/", breadcrumbName: "Laporan RKAKL" },
  ];
  const dataRKAKL = JSON.parse(localStorage.getItem("laporan-rkakl")!) || [];
  const [rencanaHeaders, setRencanaHeaders] = useState<any>([]);
  const [rencanaKegiatans, setRencanaKegiatans] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [displayLength, setDisplayLength] = useState(10);
  // const [tableDataCount, setTableDataCount] = useState<any>([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openDropdownExport, setOpenDropdownExport] = useState(false);
  const [isLoadingExport, setIsLoadingExport] = useState(false);

  let dataHeader: any;
  let dataRencanaKegiatans: any;
  let lastIndex: any;
  let minusLastIndex: any;
  let zeroZeroFour: any = [];
  let newData: any = [];
  let dataTable: any;
  let sum = 0;

  useEffect(() => {
    setRencanaHeaders(dataRKAKL.map((dataX: any) => dataX.rencanaHeaders));
    setRencanaKegiatans(dataRKAKL.map((dataX: any) => dataX.rencanaKegiatans));
  }, []);

  rencanaHeaders.forEach((element) => {
    dataHeader = element;
    lastIndex = element[element.length - 1];
    minusLastIndex = element.slice(0, -1);
    // newData.push(element.slice(0, -1))
  });

  rencanaKegiatans.forEach((element) => {
    dataRencanaKegiatans = element;
  });

  minusLastIndex?.push({
    kode: lastIndex?.kode,
    uraian: lastIndex?.uraian,
    children: dataRencanaKegiatans?.map((dataX: any, indexX: any) => ({
      key: indexX.toString(),
      kode: dataX?.kode,
      uraian: dataX?.deskripsi,
      children: dataX.rencanaKegiatans.map((dataY: any, indexY: any) => ({
        key: indexY.toString(),
        kode: dataY?.kodeJenisBelanja,
        uraian: dataY?.namaJenisBelanja,
        jumlahTotal: formatRupiah(dataY?.jumlahTotal),
        children: dataY.rincianKegiatans.map((dataZ: any, indexZ: any) => ({
          key: indexZ.toString(),
          uraian: dataZ?.komponenBiayaNama,
          // volume: dataZ?.totalKuantitas,
          jumlah: dataZ?.totalKuantitas + "  " + dataZ?.unitSatuan,
          hargaSatuan: formatRupiah(dataZ?.hargaSatuan),
          jumlahTotal: formatRupiah(dataZ?.jumlahTotal),
        })),
      })),
    })),
  });

  // console.log("HEADERS: ", minusLastIndex);
  // console.log("HEADERS: ", rencanaKegiatans.map((dataX: any) => dataX.map((dataY: any) => dataY.kode)));
  // console.log("HEADERS: ", rencanaKegiatans.map((dataX: any) => dataX.map((dataY: any) => dataY.rencanaKegiatans.map((dataZ: any) => dataZ.rincianKegiatans.map((dataXX: any) => dataXX.unitSatuan)))));

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

  const handleChangePage = (dataKey) => {
    setPage(dataKey);
  };

  const handleChangeLength = (dataKey) => {
    setPage(page);
    setDisplayLength(dataKey);
  };
  function showTotal(total) {
    return `Total ${total} items`;
  }

  function onChange(pageNumber) {
    console.log("Page: ", pageNumber);
  }
  const filterSearch = async (e) => {
    const search = e.toLowerCase();
  };
  function downloadExcel() {
    setIsLoadingExport(true);
    // try {
    //     let xls = tableData.map((el: any) => {
    //         let prov;
    //         refProvinsi.map((e) => {
    //             if (e.value === el.kode_provinsi) {
    //                 prov = e.label;
    //             }
    //         });
    //         let kab;
    //         refKabupaten.map((e) => {
    //             if (e.kode === el.kode_kabkota) {
    //                 kab = e.nama;
    //             }
    //         });
    //         return { 'NSM': el.nsm, 'NAMA SEKOLAH': el.nama, 'PROVINSI': prov, 'KABUPATEN': kab, 'EMAIL': el.email }
    //     }
    //     );
    ExportToExcel(minusLastIndex, "laporan-rkakl");

    // Notification["success"]({
    //     title: "Success",
    //     description: "Data berhasil di export"
    // });

    // } catch (error) {
    //     Notification["error"]({
    //         title: "Error",
    //         description: "Data Gagal di export"
    //     });
    // }
    setIsLoadingExport(false);
  }

  const jumlahnya = dataRKAKL.map((data1) =>
    data1.rencanaKegiatans.map((data2) =>
      data2.rencanaKegiatans.map((data3) => data3.jumlahTotal),
    ),
  );

  // const penjumlahan = jumlahnya.reduce((total, jml)=>total + jumlahnya, 0)

  // console.log("tambah", penjumlahan  );

  return (
    <>
      <BreadCrumb routes={itemBreadcrumb} title="Laporan RKAKL" />
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
                  <DropdownItem>
                    <ExcelIcon className="mx-2" onClick={downloadExcel} /> Excel
                  </DropdownItem>
                  <DropdownItem>
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
              {/* <Dropdown overlay={filter} trigger={['click']} className="mx-3" placement="bottomCenter"> */}
              <div className="relative">
                <div
                  onClick={() => setOpenDropdown(!openDropdown)}
                  className="mx-3 cursor-pointer w-full p-2 flex items-center"
                  aria-label="Notifications"
                  aria-haspopup="true">
                  Filter <FunnelPlotOutlined className="mx-2" />
                </div>
                <div className="relative z-10">
                  <Dropdown
                    style={{ padding: "0", borderRadius: "0", width: 400 }}
                    isOpen={openDropdown}
                    onClose={() => setOpenDropdown(false)}>
                    {/* <Row>
                    <Col span={8} className="bg-green-500 text-white p-2">Tipe Data</Col>
                    <Col span={16} className="bg-white p-2">
                      <div className="flex">
                        <div className="flex-1">
                          <p>Tipe</p>
                          <p><Select options={[]} placeholder="Tipe" className="w-full" /></p>
                        </div>
                        <div className="flex-1">
                          <p>Sumber Dana</p>
                          <p><Select options={[]} placeholder="Sumber Dana" className="w-full" /></p>
                        </div>
                      </div>
                    </Col>
                  </Row> */}
                    <Row>
                      <Col span={8} className="bg-green-500 text-white p-2">
                        Periode
                      </Col>
                      <Col span={16} className="bg-white p-2">
                        <div className="flex">
                          <div className="flex-1">
                            <p>Pilih Tahun</p>
                            <p>
                              {" "}
                              <DatePicker picker="year" />
                            </p>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={8} className="bg-green-500 text-white p-2">
                        Area
                      </Col>
                      <Col span={16} className="bg-white p-2">
                        <div className="flex">
                          <div className="flex-1">
                            <p>Provinsi</p>
                            <p>
                              <Select
                                options={[]}
                                placeholder="Provinsi"
                                className="w-full"
                              />
                            </p>
                          </div>
                          <div className="flex-1">
                            <p>Kabupatan / Kota</p>
                            <p>
                              <Select
                                options={[]}
                                placeholder="Kabupatan / Kota"
                                className="w-full"
                              />
                            </p>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={8} className="bg-green-500 text-white p-2">
                        Madrasah
                      </Col>
                      <Col span={16} className="bg-white p-2">
                        <div className="flex">
                          <div className="w-1/2">
                            <p>Madrasah</p>
                            <p>
                              <Select
                                options={[]}
                                placeholder="Madrasah"
                                className="w-full"
                              />
                            </p>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="float-right">
              <Pagination
                size="small"
                // total={50}
                // disabled
                // showTotal={showTotal}
                showSizeChanger
                // showQuickJumper
              />
            </div>
          </div>
        </div>
        <div className="mt-5 z-0">
          <Table
            bordered
            columns={columns}
            dataSource={minusLastIndex}
            pagination={false}
          />
        </div>
      </div>
    </>
  );
}

export default LaporanRKAKL;
