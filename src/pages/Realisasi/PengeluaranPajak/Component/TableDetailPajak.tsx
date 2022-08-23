/** @format */

import React from "react";
import { Table } from "antd";
import { formatRupiah } from "../../../../utils/helper";
// import { ButtonTableEditBlue } from "../../../../components/Button";

type tableTypePajak = {
  data: any;
  store: any;
};
const TableDetailPajak = ({ data, store }: tableTypePajak) => {
  const tmpBiaya = store.realisasiBiaya || [];

  /**
   * Set data kolom tabel
   */
  const columns = [
    {
      title: "Kategori",
      key: "kategori",
      render: (record) => record.biayaDetails[0].komponenBiayaKategori || "-",
    },
    {
      title: "Nama Komponen",
      key: "namaKompoenet",
      render: (record) => record.biayaDetails[0].komponenBiayaNama || "-",
    },
    {
      title: "Spesifikasi",
      key: "Spesifikasi",
      render: (record) =>
        record.biayaDetails[0].komponenBiayaSpesifikasi || "-",
    },
    {
      title: "No Nota",
      dataIndex: "biayaId",
      key: "biayaId",
      render: (biayaId) =>
        (biayaId &&
          tmpBiaya
            .filter((item) => item.id.includes(biayaId))
            .map((item) => item.noNotaFormat)) ||
        "-",
    },
    {
      title: "Total",
      dataIndex: "grandTotal",
      key: "grandTotal",
      // align:"right",
      render: (grandTotal) => formatRupiah(grandTotal),
    },
    // {
    //   title: "Aksi",
    //   key: "aksi",
    //   width: "15%",
    //   render: (record) => <ButtonTableEditBlue tooltips="Lihat Rincian" />,
    // },
  ];
  return (
    <Table
      rowKey={(record) => record.id}
      columns={columns}
      pagination={false}
      dataSource={data}
      bordered
    />
  );
};
export default TableDetailPajak;
