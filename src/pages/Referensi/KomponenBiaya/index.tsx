/** @format */

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { BreadCrumb } from "../../../components";
import { Table, Space, Tag } from "antd";
import { ExportToExcel } from "../../../components/Export/ExportToExcel";
import {
  ButtonEdit,
  ButtonExport,
  ButtonTambah,
} from "../../../components/Button";
import InputSearch from "../../../components/InputSearch";
import { formatRupiah } from "../../../utils/helper";
import { getReferenceAll } from "../../../services/v2/referenceservice";
import FilterKomponentBiaya from "./Component/FilterKomponentBiaya";
import notifAlert from "../../../components/NotifAlert";
import { setStore } from "../../../redux/actions";
import ModalSetHarga from "./Component/ModalSetHarga";

// const { TreeNode } = TreeSelect;

const KomponenBiaya = () => {
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Referensi" },
    { path: "/", breadcrumbName: "Komponen Biaya" },
  ];

  const route = useHistory();
  const auths = useSelector((state: any) => state.auth);
  const store = useSelector((state: any) => state.store);
  const auth = auths?.data;
  const kodeRole = auth?.kode_role;
  const groupRole = auth?.group_role;
  const refProvinsi = store.provinsi || [];
  const refKabkota = store.kabkota || [];
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const dispatch = useDispatch();
  const [search, setSearch] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  // const tmpRefKomponenBiaya = store.komponenBiaya || [];
  const [tmpFilter, setTmpFilter] = useState<any>(null);
  const tmpProvinsi = store.provinsi || [];
  const tmpKabkota = store.kabkota || [];
  const [tmpRefKomponenBiaya, setTmpRefKomponenBiaya] = useState<any>([]);

  const getData = async (tmpFilter) => {
    setLoading(true);
    const refKomponenBiaya = store.komponenBiaya || [];

    if (groupRole === "madrasah") {
      if (refKomponenBiaya.length) {
        setTmpRefKomponenBiaya(refKomponenBiaya);
      } else {
        const komponenBiaya = await getReferenceAll("komponen-biaya", {
          tahun: auth?.isTahun,
          kode_provinsi: auth?.madrasah.kode_provinsi,
          kode_kabkota: auth?.madrasah.kode_kabkota,
        });
        setTmpRefKomponenBiaya(komponenBiaya);
        setTimeout(() => {
          dispatch(setStore({ komponenBiaya }));
        }, 100);
      }
    }
    if (groupRole === "kabkota" && tmpFilter?.kabkota) {
      // if (refKomponenBiaya.length) {
      //   setTmpRefKomponenBiaya(refKomponenBiaya);
      // } else {
      const komponenBiaya = await getReferenceAll("komponen-biaya", {
        tahun: auth?.isTahun,
        kode_provinsi: auth?.kantor_kabkota.kode_provinsi,
        kode_kabkota: tmpFilter?.kabkota,
      });
      setTmpRefKomponenBiaya(komponenBiaya);
      setTimeout(() => {
        dispatch(setStore({ komponenBiaya }));
      }, 100);
      // }
    }
    if (
      (groupRole === "pusat" || groupRole === "provinsi") &&
      tmpFilter?.kabkota
    ) {
      // if (refKomponenBiaya.length) {
      //   setTmpRefKomponenBiaya(refKomponenBiaya);
      // } else {
      const komponenBiaya = await getReferenceAll("komponen-biaya", {
        tahun: auth?.isTahun,
        kode_provinsi: tmpFilter?.provinsi,
        kode_kabkota: tmpFilter?.kabkota,
      });

      setTmpRefKomponenBiaya(komponenBiaya);
      setTimeout(() => {
        dispatch(setStore({ komponenBiaya }));
      }, 100);
      // }
    }
    setLoading(false);
  };

  React.useEffect(() => {
    getData(tmpFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tmpFilter]);

  let dataTable: any = search
    ? tmpRefKomponenBiaya.filter((item: any) => {
        const val = search.toLowerCase();
        return (
          (item.tahun !== null &&
            (item.tahun || "").toString().toLowerCase().includes(val)) ||
          (item.nama_kategori !== null &&
            (item.nama_kategori || "")
              .toString()
              .toLowerCase()
              .includes(val)) ||
          // (item.kode !== null &&
          //   (item.kode || "").toString().toLowerCase().includes(val)) ||
          (item.nama !== null &&
            (item.nama || "").toString().toLowerCase().includes(val))
        );
      })
    : tmpRefKomponenBiaya;

  dataTable = tmpFilter?.kategoriKomponenBiaya
    ? dataTable.filter(
        (item: any) => item.kode_kategori === tmpFilter?.kategoriKomponenBiaya,
      )
    : dataTable;

  dataTable = tmpFilter?.jenisBelanja
    ? dataTable.filter((item: any) =>
        item.jenis_belanja.includes(tmpFilter?.jenisBelanja),
      )
    : dataTable;
  let totalDataTable = dataTable.length;
  /**
   * Filter Pagination
   */
  // dataTable = dataTable.sort((a, b) => a.kode.localeCompare(b.kode));
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
      title: "Kategori",
      dataIndex: "nama_kategori",
      key: "nama_kategori",
      width: "100%",
    },
    {
      title: "Nama",
      key: "nama",
      dataIndex: "nama",
      width: "100%",
    },
    {
      title: "Kode",
      key: "kode",
      width: "100%",
      dataIndex: "kode",
    },
    {
      title: "Provinsi",
      key: "kode_provinsi",
      width: "100%",
      dataIndex: "kode_provinsi",
      render: (kode_provinsi) =>
        tmpProvinsi.length &&
        tmpProvinsi
          .filter((item: any) => item.kode.includes(kode_provinsi))
          .map((item: any) => item.nama),
    },
    {
      title: "Kab / Kota",
      key: "kode_kabkota",
      width: "100%",
      dataIndex: "kode_kabkota",
      render: (kode_kabkota) =>
        tmpKabkota.length &&
        tmpKabkota
          .filter((item: any) => item.kode.includes(kode_kabkota))
          .map((item: any) => item.nama),
    },
    {
      title: "Akun Belanja",
      key: "jenis_belanja",
      width: "100%",
      dataIndex: "jenis_belanja",
      render: (jenis_belanja) =>
        ((jenis_belanja || jenis_belanja.length) &&
          jenis_belanja.map((item: any) => (
            <Tag key={item} color="blue">
              {item}
            </Tag>
          ))) ||
        "-",
    },
    {
      title: "Spesifikasi",
      key: "spesifikasi",
      width: "100%",
      dataIndex: "spesifikasi",
    },
    {
      title: "Satuan",
      key: "satuan",
      width: "100%",
      dataIndex: "satuan",
    },
    {
      title: "Harga",
      children: [
        {
          title: "Harga 1",
          key: "harga_1",
          width: "100%",
          dataIndex: "harga_1",
          render: (harga_1) => formatRupiah(harga_1),
        },
        {
          title: "Harga 2",
          key: "harga_2",
          width: "100%",
          dataIndex: "harga_2",
          render: (harga_2) => formatRupiah(harga_2),
        },
        {
          title: "Harga 3",
          key: "harga_3",
          width: "100%",
          dataIndex: "harga_3",
          render: (harga_3) => formatRupiah(harga_3),
        },
      ],
    },
  ];

  const handleTambah = () => {
    route.push("komponen-biaya/add");
  };

  // const dataSelectKategoriBiaya = treeNested(tmpKategoriKomponenBiaya);
  // const dataSelectJenisBiaya = treeNestedBelanja(tmpKategoriBelanja);

  const handleChangeValues = (values: any) => {
    setTmpFilter(values);
  };

  const handleExport = () => {
    try {
      let xls = tmpRefKomponenBiaya.map((el: any) => {
        return {
          Tahun: el.tahun,
          Kategori: el.nama_kategori,
          "Kode Kategori": el.kode_kategori,
          "Kode Provinsi": el.kode_provinsi,
          "Kode Kabkota": el.kode_kabkota,
          Kode: el.kode,
          Nama: el.nama,
          Spesifikasi: el.spesifikasi,
          Satuan: el.satuan,
          "Harga 1": el.harga_1,
          "Harga 2": el.harga_2,
          "Harga 3": el.harga_3,
        };
      });
      ExportToExcel(xls, "referensi-komponen-biaya");

      notifAlert({
        type: "success",
        description: "Data berhasil di export",
      });
    } catch (error) {
      notifAlert({
        type: "error",
        description: "Data Gagal di export",
      });
    }
  };

  const handleSetHarga = () => {
    setOpenModal(true);
  };

  return (
    <>
      <BreadCrumb routes={itemBreadcrumb} title="Komponen Biaya" />
      <FilterKomponentBiaya handleChangeValues={handleChangeValues} />
      <div className="m-5 p-5 bg-white shadow-md rounded">
        <div className="mb-4 flex justify-end">
          <div className="mr-4">
            <Space size={[8, 8]} wrap>
              {kodeRole === `admin_pusat` && (
                <ButtonTambah
                  title="Tambah Komponen"
                  onClick={handleTambah}
                  // disabled={btnAction}
                />
              )}
              {kodeRole === `admin_kabkota` && (
                <ButtonEdit
                  title="Set Harga"
                  onClick={handleSetHarga}

                  // disabled={btnAction}
                />
              )}
              <ButtonExport
                title="Export"
                onClick={handleExport}
                disabled={tmpRefKomponenBiaya.length ? false : true}
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
            rowKey={(record) => record.komponen_biaya_harga_id}
            columns={columns}
            dataSource={dataTable}
            loading={loading}
            scroll={{ x: "1300" }}
            tableLayout="auto"
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
      <ModalSetHarga
        openModal={openModal}
        handleClose={() => setOpenModal(false)}
        refProvinsi={refProvinsi}
        refKabkota={refKabkota}
      />
    </>
  );
};

export default KomponenBiaya;
