/** @format */

import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { BreadCrumb } from "../../../../components";
import moment from "moment";
import "moment/locale/id";
import { Table, Space, Form } from "antd";
import { useSelector } from "react-redux";
import { formatRupiah, uuidv4 } from "../../../../utils/helper";
import {
  ButtonLog,
  ButtonTableDetail,
  ButtonTableEditBlue,
} from "../../../../components/Button";
import InputSearch from "../../../../components/InputSearch";
import ModalListRincian from "../Component/ModalListRincian";
import FilterPengeluaranKegiatan from "../Component/FilterPengeluaranKegiatan";

const PengeluaranKegiatan = () => {
  const route = useHistory();
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Realisasi" },
    { path: "/", breadcrumbName: "Pengeluaran Kegiatan" },
    { path: "/", breadcrumbName: "List" },
  ];
  const store = useSelector((state: any) => state.store);
  const tmpPendapatanDefinitif = store.rencanaPendapatanDefinitif || [];
  const tmpRencanaRincianKegiatanDefinitif =
    (store.rencanaRincianKegiatanDefinitif.length &&
      store.rencanaRincianKegiatanDefinitif.filter(
        (item: any) => item.kepalaMadrasahApproved === "1",
      )) ||
    [];
  const [form] = Form.useForm();
  const [search, setSearch] = useState<any>(null);
  const [sumberDana, setSumberDana] = useState<any>(null);
  const [ketersediaanNota, setKetersediaanNota] = useState<any>(null);
  const [waktuPelaksanaan, setWaktuPelaksanaan] = useState<any>(null);
  const [dataEdit, setDataEdit] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);
  const [title, setTitle] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const listMonth = moment.months();
  let filterListSumber: any = [];
  tmpRencanaRincianKegiatanDefinitif &&
    tmpRencanaRincianKegiatanDefinitif.map((item) =>
      item.alokasiPendapatan.map((items) =>
        filterListSumber.push(items.rencana_pendapatan.id),
      ),
    );
  const listSumber: any =
    tmpPendapatanDefinitif.filter((item) =>
      filterListSumber.includes(item.id),
    ) || [];

  /** Filter Search */
  let dataTable: any = search
    ? tmpRencanaRincianKegiatanDefinitif.filter((item: any) => {
        const val = search.toLowerCase();
        return (
          (item.rencanaKegiatan.nama_snp !== null &&
            (item.rencanaKegiatan.nama_snp || "")
              .toString()
              .toLowerCase()
              .includes(val)) ||
          (item.rencanaKegiatan.nama_kegiatan !== null &&
            (item.rencanaKegiatan.nama_kegiatan || "")
              .toString()
              .toLowerCase()
              .includes(val)) ||
          (item.rencanaKegiatan.nama_sub_kegiatan !== null &&
            (item.rencanaKegiatan.nama_sub_kegiatan || "")
              .toString()
              .toLowerCase()
              .includes(val)) ||
          (item.komponenBiayaNama !== null &&
            (item.komponenBiayaNama || "")
              .toString()
              .toLowerCase()
              .includes(val))
        );
      })
    : tmpRencanaRincianKegiatanDefinitif;
  dataTable =
    (ketersediaanNota &&
      dataTable.filter((item) => item.ketersediaanNota === ketersediaanNota)) ||
    dataTable;
  dataTable =
    (waktuPelaksanaan &&
      dataTable.filter((item) => {
        if (
          item.rencanaKegiatan.bulan_pelaksanaan_start <= waktuPelaksanaan &&
          item.rencanaKegiatan.bulan_pelaksanaan_end >= waktuPelaksanaan
        ) {
          return true;
        }
        return false;
      })) ||
    dataTable;
  dataTable =
    (sumberDana &&
      dataTable.filter((item) => {
        return item.alokasiPendapatan.some(
          (items) => items.rencana_pendapatan.id === sumberDana,
        );
      })) ||
    dataTable;
  let totalDataTable = dataTable.length;

  /**
   * Filter Pagination
   */
  dataTable = dataTable.filter((v, i) => {
    let start = pageSize * (page - 1);
    let end = start + pageSize;

    return i >= start && i < end;
  });

  /**
   * Data untuk tabel children pertama
   */
  let columns: any = [
    {
      title: "SNP",
      key: "snp",
      width: 300,
      render: (record) => record.rencanaKegiatan.nama_snp,
    },
    {
      title: "Kegiatan",
      key: "kegiatan",
      width: 300,
      render: (record) => record.rencanaKegiatan.nama_kegiatan,
    },
    {
      title: "Sub Kegiatan",
      key: "subKegiatan",
      width: 300,
      render: (record) => record.rencanaKegiatan.nama_sub_kegiatan,
    },
    {
      title: "Komponen Biaya",
      key: "komponenBiayaNama",
      dataIndex: "komponenBiayaNama",
      width: 300,
    },
    {
      title: "Sumber Dana (Rupiah)",
      key: "sumberDana",
      width: 300,
      render: (record) =>
        record.alokasiPendapatan.length &&
        record.alokasiPendapatan.map((item: any) => (
          <div key={uuidv4()} className="flex justify-between">
            <div>{item.rencana_pendapatan.nama_sumber_dana}</div>
            <div>{formatRupiah(item.jumlah)}</div>
          </div>
        )),
    },
    {
      title: "Total (Rupiah)",
      key: "jumlahTotal",
      dataIndex: "jumlahTotal",
      align: "right",
      width: 200,
      render: (jumlahTotal) => formatRupiah(jumlahTotal),
    },
    {
      title: "Waktu Pelaksanaan",
      key: "waktuPelaksanaan",
      width: 200,
      render: (record) =>
        listMonth[record.rencanaKegiatan.bulan_pelaksanaan_start - 1] +
        " - " +
        listMonth[record.rencanaKegiatan.bulan_pelaksanaan_end - 1],
    },
    {
      title: "Aksi",
      key: "aksi",
      width: 120,
      align: "center",
      fixed: "right",
      render: (record) => (
        <Space>
          <ButtonTableEditBlue
            tooltips="Lihat Rincian"
            onClick={() => handleRincian(record)}
          />
          <ButtonTableDetail
            tooltips="Rincian Pembuatan Nota"
            onClick={() =>
              route.push({
                pathname: "list/nota/" + record.id,
                state: record,
              })
            }
          />
        </Space>
      ),
    },
  ];

  const handleRincian = (record: any) => {
    setTitle("Informasi");
    setOpenModal(true);
    setDataEdit(record);
    console.log(record);
  };

  const handleChangeValues = (values) => {
    for (let obj in values) {
      switch (obj) {
        case "sumberDana":
          setSumberDana(values.sumberDana || null);
          break;
        case "ketersediaanNota":
          setKetersediaanNota(values.ketersediaanNota || null);
          break;
        case "waktuPelaksanaan":
          setWaktuPelaksanaan(values.waktuPelaksanaan || null);
          break;
      }
    }
  };

  return (
    <>
      <BreadCrumb
        routes={itemBreadcrumb}
        title="Realisasi Pengeluaran Kegiatan"
      />
      <FilterPengeluaranKegiatan
        form={form}
        tmpListMonth={listMonth}
        tmpSumberDana={listSumber}
        handleChangeValues={handleChangeValues}
      />
      <div className="m-5 p-5 bg-white shadow-md rounded">
        <div className="mb-4 flex justify-end">
          <div className="mr-4">
            <Space size={[8, 8]} wrap>
              <ButtonLog
                onClick={() =>
                  route.push({
                    pathname: "logs",
                  })
                }
              />
            </Space>
          </div>
          <InputSearch
            className="w-3/4"
            onChange={(e: any) => setSearch(e.currentTarget.value)}
          />
        </div>
        <div className="w-full">
          <Table
            rowKey={(record) => record.id}
            columns={columns}
            dataSource={dataTable}
            scroll={{ x: "1300" }}
            bordered
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
      <ModalListRincian
        openModal={openModal}
        data={dataEdit}
        handleClose={() => setOpenModal(false)}
        title={title}
      />
    </>
  );
};

export default PengeluaranKegiatan;
