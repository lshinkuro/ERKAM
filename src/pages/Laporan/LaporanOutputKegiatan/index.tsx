/** @format */

import React, { useState, useEffect } from "react";
import { BreadCrumb } from "../../../components";

// import autoTable from 'jspdf-autotable';
// import jsPDF from 'jspdf';
// import { ExportToExcel } from '../../../components/Export/ExportToExcel';
import { formatCurr } from "../../../utils/helper";
// import { FunnelPlotOutlined } from '@ant-design/icons';
// import { PdfIcon, ExcelIcon } from '../../../icons';
// import moment from "moment";
// import 'moment/locale/id';

// import { Dropdown, DropdownItem } from "@windmill/react-ui";

import { Table } from "antd";

const LaporanOutputKegiatan = () => {
  // const refBank = JSON.parse(localStorage.getItem("rekening-belanja")!) || [];
  // const refSumberDana: any =
  //   JSON.parse(localStorage.getItem("rencana-pendapatan-definitif")!) || [];
  // const refTipeKas: any = JSON.parse(localStorage.getItem("tipe-kas-controller")!) || [];
  // const refRekening: any = JSON.parse(localStorage.getItem("rekening-belanja")!) || [];
  // const route = useHistory();
  // const item = ["Home", "Laporan", "Laporan Realisasi", "Laporan Output Kegiatan"];
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Laporan" },
    { path: "/", breadcrumbName: "Laporan Realisasi" },
    { path: "/", breadcrumbName: "Laporan Output Kegiatan" },
  ];
  // const [page, setPage] = useState(1);
  // const [displayLength, setDisplayLength] = useState(10);
  // const auth: any = JSON.parse(localStorage.getItem("auth")!);
  // const groupRole = auth.group_role;
  // const refProvinsi: { kode: string; nama: string }[] = JSON.parse(localStorage.getItem("provdropdown")!);
  // const refKabkota: {
  //     kode: string;
  //     nama: string;
  //     kode_provinsi: string;
  // }[] = JSON.parse(localStorage.getItem("kabkotadropdown")!);
  // const refPajak: { kode: string; nama: string }[] = JSON.parse(localStorage.getItem("kbiaya/pajak")!) || [];
  // const [tipe, setTipe] = useState<any>('');
  // const [bulan, setBulan] = useState<any>('');
  // const [provinsi, setProvinsi] = useState<any>(null);
  // const [kabupaten, setKabupaten] = useState<any>(null);
  const [pajak, setPajak] = useState<any>(null);
  // const [madrasah, setMadrasah] = useState<any>(null);
  const [tableData, setTableData] = useState<any>([]);
  const [tableDataCount, setTableDataCount] = useState<any>([]);
  // const [openDropdown, setOpenDropdown] = useState(false);
  // const [openDropdownExport, setOpenDropdownExport] = useState(false);
  const [dataTable, setDataTable] = useState<any>([]);
  const [dataMadrasah, setDataMadrasah] = useState<any>([]);

  const getData = async () => {
    const dataTmp: any = [
      {
        key: 1,
        no: 1,
        snp: "PENGEMBANGAN STANDAR ISI",
        rencanaOutputKegiatan: 300645494,
        triwulan1: 6750,
        triwulan2: 6750,
        triwulan3: 6750,
        triwulan4: 6750,
        kegiatans: [
          {
            key: 1,
            no: 1,
            kegiatan: "Pengelolaan Kurikulum 2013",
            rencanaOutputKegiatan: 300645494,
            triwulan1: 6750,
            triwulan2: 6750,
            triwulan3: 6750,
            triwulan4: 6750,
            subkegiatans: [
              {
                key: 1,
                no: 1,
                subkegiatan:
                  "Penyusunan Pembagian Tugas Guru dan Jadwal Pelajaran",
                satuan: "Buah",
                rencanaOutputKegiatan: 300645494,
                triwulan1: 6750,
                triwulan2: 6750,
                triwulan3: 6750,
                triwulan4: 6750,
              },
            ],
          },
        ],
      },
      {
        key: 2,
        no: 2,
        snp: "PENGEMBANGAN STANDAR ISI",
        rencanaOutputKegiatan: 300645494,
        triwulan1: 6750,
        triwulan2: 6750,
        triwulan3: 6750,
        triwulan4: 6750,
        kegiatans: [
          {
            key: 1,
            no: 1,
            kegiatan: "Pengelolaan Kurikulum 2013",
            rencanaOutputKegiatan: 300645494,
            triwulan1: 6750,
            triwulan2: 6750,
            triwulan3: 6750,
            triwulan4: 6750,
            subkegiatans: [
              {
                key: 1,
                no: 1,
                subkegiatan:
                  "Penyusunan Pembagian Tugas Guru dan Jadwal Pelajaran",
                satuan: "Buah",
                rencanaOutputKegiatan: 300645494,
                triwulan1: 6750,
                triwulan2: 6750,
                triwulan3: 6750,
                triwulan4: 6750,
              },
            ],
          },
        ],
      },
    ];
    // let datTmp = await realizationService.pengeluaranpajakService.getPengeluaranPajak(auth.tahun);
    // let datTmp = refPengeluaranPajak;
    // if (datTmp.length !== 0) {
    //     datTmp.map((e, i) => {
    //         let urai;
    //         if (e.kodeTipeKas === 'rekening_bank') {
    //             urai = "Penerimaan " + e.namaSumberDana + ", Kas: " + refTipeKas.filter(p => p.kode === e.kodeTipeKas).map(p => p.nama) +
    //                 ", No Rekening: " + refRekening.filter((p) => p.id === e.rekeningBankId).map(p => p.no_rekening) + ", an: " + refRekening.filter((p) => p.id === e.rekeningBankId).map(p => p.no_rekening_nama) + ", " + refRekening.filter((p) => p.id === e.rekeningBankId).map(p => p.nama_bank);
    //         } else {
    //             urai = "Penerimaan " + e.namaSumberDana + ", Kas: " + e.kodeTipeKas;
    //         }

    //         return dataTmp.push({
    //             id: (i + 1).toString(),
    //             no: (i + 1).toString(),
    //             snp: moment(e.tanggalNota).format('dddd,DD MMM YYYY HH:mm:ss'),
    //             rencanaoutputkegiatan: e.realisasiNoReferensi,
    //             realisasicapaiankomulatig: e.noNotaFormat,
    //         });
    //     });
    // }
    setTableData(dataTmp);
    setDataTable(dataTmp);
    setTableDataCount(dataTmp);
  };

  const columns = [
    {
      title: "No Urut",
      dataIndex: "no",
      key: "no",
      onFilter: (value, record) => record.no.indexOf(value) === 0,
      sorter: (a, b) => a.no - b.no,
    },
    {
      title: "SNP",
      dataIndex: "snp",
      key: "snp",
      onFilter: (value, record) => record.snp.indexOf(value) === 0,
      sorter: (a, b) => a.snp.length - b.snp.length,
    },
    {
      title: "Rencana Output Kegiatan",
      dataIndex: "rencanaOutputKegiatan",
      key: "rencanaOutputKegiatan",
      onFilter: (value, record) =>
        record.rencanaOutputKegiatan.indexOf(value) === 0,
      sorter: (a, b) => a.rencanaOutputKegiatan - b.rencanaOutputKegiatan,
      render: (rencanaOutputKegiatan) => formatCurr(rencanaOutputKegiatan),
    },
    {
      title: "Realisasi Capaian Komulatif",
      children: [
        {
          title: "Triwulan 1",
          dataIndex: "triwulan1",
          key: "triwulan1",
          onFilter: (value, record) => record.triwulan1.indexOf(value) === 0,
          sorter: (a, b) => a.triwulan1 - b.triwulan1,
          render: (triwulan1) => formatCurr(triwulan1),
        },
        {
          title: "Triwulan 2",
          dataIndex: "triwulan2",
          key: "triwulan2",
          onFilter: (value, record) => record.triwulan2.indexOf(value) === 0,
          sorter: (a, b) => a.triwulan2 - b.triwulan2,
          render: (triwulan2) => formatCurr(triwulan2),
        },
        {
          title: "Triwulan 3",
          dataIndex: "triwulan3",
          key: "triwulan3",
          onFilter: (value, record) => record.triwulan3.indexOf(value) === 0,
          sorter: (a, b) => a.triwulan3 - b.triwulan3,
          render: (triwulan3) => formatCurr(triwulan3),
        },
        {
          title: "Triwulan 4",
          dataIndex: "triwulan4",
          key: "triwulan4",
          onFilter: (value, record) => record.triwulan4.indexOf(value) === 0,
          sorter: (a, b) => a.triwulan4 - b.triwulan4,
          render: (triwulan4) => formatCurr(triwulan4),
        },
      ],
    },
  ];

  const expandedRowKegiatan = (kegiatanArr) => {
    const columnsKegiatan = [
      {
        title: "No Urut",
        dataIndex: "no",
        key: "no",
        onFilter: (value, record) => record.no.indexOf(value) === 0,
        sorter: (a, b) => a.no - b.no,
      },
      {
        title: "Kegiatan",
        dataIndex: "kegiatan",
        key: "kegiatan",
        onFilter: (value, record) => record.kegiatan.indexOf(value) === 0,
        sorter: (a, b) => a.kegiatan.length - b.kegiatan.length,
      },
      {
        title: "Rencana Output Kegiatan",
        dataIndex: "rencanaOutputKegiatan",
        key: "rencanaOutputKegiatan",
        onFilter: (value, record) =>
          record.rencanaOutputKegiatan.indexOf(value) === 0,
        sorter: (a, b) => a.rencanaOutputKegiatan - b.rencanaOutputKegiatan,
        render: (rencanaOutputKegiatan) => formatCurr(rencanaOutputKegiatan),
      },
      {
        title: "Realisasi Capaian Komulatif",
        children: [
          {
            title: "Triwulan 1",
            dataIndex: "triwulan1",
            key: "triwulan1",
            onFilter: (value, record) => record.triwulan1.indexOf(value) === 0,
            sorter: (a, b) => a.triwulan1 - b.triwulan1,
            render: (triwulan1) => formatCurr(triwulan1),
          },
          {
            title: "Triwulan 2",
            dataIndex: "triwulan2",
            key: "triwulan2",
            onFilter: (value, record) => record.triwulan2.indexOf(value) === 0,
            sorter: (a, b) => a.triwulan2 - b.triwulan2,
            render: (triwulan2) => formatCurr(triwulan2),
          },
          {
            title: "Triwulan 3",
            dataIndex: "triwulan3",
            key: "triwulan3",
            onFilter: (value, record) => record.triwulan3.indexOf(value) === 0,
            sorter: (a, b) => a.triwulan3 - b.triwulan3,
            render: (triwulan3) => formatCurr(triwulan3),
          },
          {
            title: "Triwulan 4",
            dataIndex: "triwulan4",
            key: "triwulan4",
            onFilter: (value, record) => record.triwulan4.indexOf(value) === 0,
            sorter: (a, b) => a.triwulan4 - b.triwulan4,
            render: (triwulan4) => formatCurr(triwulan4),
          },
        ],
      },
    ];

    return (
      <Table
        columns={columnsKegiatan}
        expandable={{
          expandedRowRender: (record) => expandedRowSubKegiatan(record),
        }}
        dataSource={kegiatanArr.kegiatans}
        pagination={false}
        bordered
      />
    );
  };

  const expandedRowSubKegiatan = (subKegiatanArr) => {
    const columnsKegiatan = [
      {
        title: "No Urut",
        dataIndex: "no",
        key: "no",
        onFilter: (value, record) => record.no.indexOf(value) === 0,
        sorter: (a, b) => a.no - b.no,
      },
      {
        title: "Sub Kegiatan",
        dataIndex: "subkegiatan",
        key: "subkegiatan",
        onFilter: (value, record) => record.subkegiatan.indexOf(value) === 0,
        sorter: (a, b) => a.subkegiatan.length - b.subkegiatan.length,
      },
      {
        title: "Rencana Output Kegiatan",
        dataIndex: "rencanaOutputKegiatan",
        key: "rencanaOutputKegiatan",
        onFilter: (value, record) =>
          record.rencanaOutputKegiatan.indexOf(value) === 0,
        sorter: (a, b) => a.rencanaOutputKegiatan - b.rencanaOutputKegiatan,
        render: (rencanaOutputKegiatan) => formatCurr(rencanaOutputKegiatan),
      },
      {
        title: "Satuan",
        dataIndex: "satuan",
        key: "satuan",
        onFilter: (value, record) => record.satuan.indexOf(value) === 0,
        sorter: (a, b) => a.satuan.length - b.satuan.length,
      },
      {
        title: "Realisasi Capaian Komulatif",
        children: [
          {
            title: "Triwulan 1",
            dataIndex: "triwulan1",
            key: "triwulan1",
            onFilter: (value, record) => record.triwulan1.indexOf(value) === 0,
            sorter: (a, b) => a.triwulan1 - b.triwulan1,
            render: (triwulan1) => formatCurr(triwulan1),
          },
          {
            title: "Triwulan 2",
            dataIndex: "triwulan2",
            key: "triwulan2",
            onFilter: (value, record) => record.triwulan2.indexOf(value) === 0,
            sorter: (a, b) => a.triwulan2 - b.triwulan2,
            render: (triwulan2) => formatCurr(triwulan2),
          },
          {
            title: "Triwulan 3",
            dataIndex: "triwulan3",
            key: "triwulan3",
            onFilter: (value, record) => record.triwulan3.indexOf(value) === 0,
            sorter: (a, b) => a.triwulan3 - b.triwulan3,
            render: (triwulan3) => formatCurr(triwulan3),
          },
          {
            title: "Triwulan 4",
            dataIndex: "triwulan4",
            key: "triwulan4",
            onFilter: (value, record) => record.triwulan4.indexOf(value) === 0,
            sorter: (a, b) => a.triwulan4 - b.triwulan4,
            render: (triwulan4) => formatCurr(triwulan4),
          },
        ],
      },
    ];

    return (
      <Table
        columns={columnsKegiatan}
        dataSource={subKegiatanArr.subkegiatans}
        pagination={false}
        bordered
      />
    );
  };

  return (
    <>
      <BreadCrumb routes={itemBreadcrumb} title="Laporan Output Kegiatan" />

      <div className="m-5 p-5 bg-white shadow-sm">
        <div className="w-full">
          <Table
            scroll={{ x: 1300 }}
            style={{ fontSize: 10 }}
            expandable={{
              expandedRowRender: (record) => expandedRowKegiatan(record),
            }}
            columns={columns}
            dataSource={[]}
            bordered
            pagination={false}
          />
        </div>
      </div>
    </>
  );
};

export default LaporanOutputKegiatan;
