/** @format */

import React, { useState } from "react";
import { BreadCrumb } from "../../../../components";
import moment from "moment";
import { formatRupiah, toTitleCase, uuidv4 } from "../../../../utils/helper";
import { useHistory } from "react-router-dom";

import { Table, Space, Badge, Modal } from "antd";
import "moment/locale/id";
import { useDispatch, useSelector } from "react-redux";
import {
  ButtonLog,
  ButtonTableApproval,
  ButtonTableDelete,
  ButtonTableDetail,
  ButtonTableEdit,
  ButtonTableEditBlue,
  ButtonTambah,
} from "../../../../components/Button";
import InputSearch from "../../../../components/InputSearch";
import HeaderNotaPengeluaranKegiatan from "../Component/HeaderNotaPengeluaranKegiatan";
import notifAlert from "../../../../components/NotifAlert";
import { setStore } from "../../../../redux/actions";
import ModalApprovalPengeluaranKegiatan from "../Component/ModalApprovalPengeluaranKegiatan";
import {
  deleteRealisasiPengeluaranKegiatan,
  editRealisasiPengeluaranKegiatan,
  postRealisasiPengeluaranKegiatan,
} from "../../../../services/v2/realizationservice/pengeluarankegiatanservices";
import ModalPengeluaranKegiatan from "../Component/ModalPengeluaranKegiatan";
import { getReferenceAll } from "../../../../services/v2/referenceservice";
import { getRealizationAll } from "../../../../services/v2/realizationservice";
import ModalTanggalRealisasiPengeluaranKegiatan from "../Component/ModalTanggalRealisasi";

const ListNota = () => {
  const route = useHistory();
  const dataState: any = route ? route.location.state : null;
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Realisasi" },
    { path: "/", breadcrumbName: "Pengeluaran Kegiatan" },
    { path: "/", breadcrumbName: "List" },
    { path: "/", breadcrumbName: "Nota" },
    { path: "/", breadcrumbName: "Rincian" },
  ];

  const store = useSelector((state: any) => state.store);
  const auths = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const tmpRekeningBelanja = store.rekeningBelanja || [];
  const auth = auths?.data;
  const kodeRole = auth?.kode_role;
  let tmpRealisasiBiaya = store.realisasiBiaya || [];

  const [search, setSearch] = useState<any>(null);
  const [id, setID] = useState<any>(null);
  const [dataEdit, setDataEdit] = useState<any>(null);
  const [title, setTitle] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openModalApproval, setOpenModalApproval] = useState(false);
  const [openModalTanggal, setOpenModalTanggal] = useState(false);
  const [tmpRefKomponenBiaya, setTmpRefKomponenBiaya] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  /** Filter Search */
  tmpRealisasiBiaya =
    (tmpRealisasiBiaya.length &&
      tmpRealisasiBiaya.filter((item: any) =>
        item.rencanaRincianKegiatanId.includes(dataState?.id),
      )) ||
    [];

  let dataTable: any = search
    ? tmpRealisasiBiaya.filter((item: any) => {
        const val = search.toLowerCase();
        return (
          (item.noNotaFormat !== null &&
            (item.noNotaFormat || "").toString().toLowerCase().includes(val)) ||
          (item.keterangan !== null &&
            (item.keterangan || "").toString().toLowerCase().includes(val))
        );
      })
    : tmpRealisasiBiaya;
  let totalDataTable = dataTable.length;

  /**
   * Filter Pagination
   */
  dataTable = dataTable.filter((v, i) => {
    let start = pageSize * (page - 1);
    let end = start + pageSize;

    return i >= start && i < end;
  });

  const getData = async () => {
    const refKomponenBiaya = store.komponenBiaya || [];
    if (refKomponenBiaya.length) {
      setTmpRefKomponenBiaya(refKomponenBiaya);
    } else {
      const komponenBiaya = await getReferenceAll("komponen-biaya", {
        tahun: auth?.isTahun,
        kode_provinsi: auth?.madrasah?.kode_provinsi,
        kode_kabkota: auth?.madrasah?.kode_kabkota,
      });
      setTmpRefKomponenBiaya(komponenBiaya);
      setTimeout(() => {
        dispatch(setStore({ komponenBiaya }));
      }, 100);
    }
  };

  React.useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /**
   * Data untuk tabel children pertama
   */
  let columns: any = [
    {
      title: "No Nota",
      key: "noNotaFormat",
      dataIndex: "noNotaFormat",
      width: 280,
    },
    {
      title: "Keterangan",
      key: "keterangan",
      dataIndex: "keterangan",
      width: 200,
    },
    {
      title: "Sub Total (Rupiah)",
      key: "grandSubTotal",
      dataIndex: "grandSubTotal",
      align: "right",
      width: 200,
      render: (grandSubTotal) => formatRupiah(grandSubTotal),
    },
    {
      title: "Pajak (Rupiah)",
      key: "grandPajak",
      align: "right",
      dataIndex: "grandPajak",
      width: 200,
      render: (grandPajak) => formatRupiah(grandPajak),
    },
    {
      title: "Pajak Terhutang (Rupiah)",
      key: "grandPajakTerutang",
      align: "right",
      dataIndex: "grandPajakTerutang",
      width: 200,
      render: (grandPajakTerutang) => formatRupiah(grandPajakTerutang),
    },
    {
      title: "Total (Rupiah)",
      key: "grandTotal",
      align: "right",
      dataIndex: "grandTotal",
      width: 200,
      render: (grandTotal) => formatRupiah(grandTotal),
    },
    {
      title: "Tanggal Nota",
      key: "tanggalNota",
      dataIndex: "tanggalNota",
      width: 200,
      render: (tanggalNota) =>
        tanggalNota
          ? moment(tanggalNota).format("dddd,DD MMM YYYY HH:mm:ss")
          : "-",
    },
    {
      title: "Tanggal Realisasi",
      key: "tanggalRealisasi",
      dataIndex: "tanggalRealisasi",
      width: 200,
      render: (tanggalRealisasi) =>
        tanggalRealisasi
          ? moment(tanggalRealisasi).format("dddd,DD MMM YYYY HH:mm:ss")
          : "-",
    },

    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      width: 200,
      fixed: "right",
      render: (status) => (
        <>
          <Badge
            style={{ textTransform: "capitalize" }}
            status={
              (status === "SELESAI" && "success") ||
              ((status === "MENUNGGU" || status === "MENUNGGU_DISETUJUI") &&
                "warning") ||
              ((status === "DISETUJUI" || status === "MENUNGGU_REALISASI") &&
                "processing") ||
              (status === "DITOLAK" && "error") ||
              "default"
            }
            text={status && toTitleCase(status)}
          />
        </>
      ),
    },
    {
      title: "Aksi",
      key: "aksi",
      width: 180,
      fixed: "right",
      render: (record) => (
        <Space>
          <ButtonTableEditBlue
            tooltips="Lihat Detail"
            onClick={() => handleDetailApprove(record, "Detail")}
          />
          {kodeRole === "kepala_madrasah" && (
            <ButtonTableApproval
              tooltips="Approval"
              onClick={() => handleDetailApprove(record, "Approval")}
            />
          )}
          {kodeRole === "bendahara_madrasah" && (
            <>
              {record.status === "MENUNGGU_REALISASI" && (
                <ButtonTableDetail
                  tooltips="Set Tanggal Realisasi"
                  onClick={() => handleTanggalRealisasi(record)}
                />
              )}
              {record.status !== "SELESAI" && (
                <ButtonTableEdit onClick={() => handleEdit(record)} />
              )}
              <ButtonTableDelete
                onClick={() => {
                  Modal.confirm({
                    title: "Perhatian",
                    content: "Yakin Hapus Data?",
                    onOk() {
                      return handleDelete(record);
                    },
                    onCancel() {},
                    okText: "Hapus",
                    cancelText: "Batal",
                    okType: "danger",
                  });
                }}
              />
            </>
          )}
        </Space>
      ),
    },
  ];

  const handleTanggalRealisasi = (record: any) => {
    setOpenModalTanggal(true);
    setTitle("Set Tanggal Realisasi");
    setDataEdit(record);
    setID(record.id);
  };

  const handleDetailApprove = (record: any, action: any) => {
    setTitle(action);
    setDataEdit(record);
    setID(record.id);
    setOpenModalApproval(true);
  };

  const handleSaveApproval = async (action: any) => {
    setLoading(true);
    try {
      const payload = {
        id: id,
        approveStatus: action,
        keterangan: "",
      };
      await editRealisasiPengeluaranKegiatan(payload, id, "approval/");
      const realisasiBiaya = await getRealizationAll("biaya", {
        tahun: auths.isTahun,
      });
      const realisasiPendapatanHeader = await getRealizationAll(
        "pendapatan/header",
        {
          tahun: auths.isTahun,
        },
      );
      notifAlert({
        type: "success",
        description: "Data Berhasil di simpan",
      });
      setTimeout(() => {
        dispatch(setStore({ realisasiBiaya, realisasiPendapatanHeader }));
      }, 100);
    } catch (error) {
      console.log(error);
    }
    setOpenModalApproval(false);
    setLoading(false);
  };

  const handleSaveTanggal = async (values: any) => {
    setLoading(true);
    try {
      await postRealisasiPengeluaranKegiatan(values, "/realisasi");
      const realisasiBiaya = await getRealizationAll("biaya", {
        tahun: auths.isTahun,
      });
      const realisasiPendapatanHeader = await getRealizationAll(
        "pendapatan/header",
        {
          tahun: auths.isTahun,
        },
      );
      notifAlert({
        type: "success",
        description: "Data Berhasil di simpan",
      });
      setTimeout(() => {
        dispatch(setStore({ realisasiBiaya, realisasiPendapatanHeader }));
      }, 100);
    } catch (error) {
      console.log(error);
    }
    setOpenModalTanggal(false);
    setLoading(false);
  };

  const handleEdit = (record: any) => {
    setTitle("Edit");
    setID(record.id);
    setDataEdit(record);
    setOpenModal(true);
  };

  const handleDelete = async (record: any) => {
    setLoading(true);
    try {
      await deleteRealisasiPengeluaranKegiatan(record.id);
      const realisasiBiaya = await getRealizationAll("biaya", {
        tahun: auths.isTahun,
      });
      const realisasiPendapatanHeader = await getRealizationAll(
        "pendapatan/header",
        {
          tahun: auths.isTahun,
        },
      );

      setTimeout(() => {
        dispatch(setStore({ realisasiBiaya, realisasiPendapatanHeader }));
      }, 100);
      notifAlert({
        type: "success",
        description: "Data Berhasil di hapus",
      });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleSave = async (values: any) => {
    setLoading(true);
    if (title === "Tambah") {
      try {
        await postRealisasiPengeluaranKegiatan(values, "");
        const realisasiBiaya = await getRealizationAll("biaya", {
          tahun: auths.isTahun,
        });
        const realisasiPendapatanHeader = await getRealizationAll(
          "pendapatan/header",
          {
            tahun: auths.isTahun,
          },
        );
        notifAlert({
          type: "success",
          description: "Data Berhasil di simpan",
        });
        setTimeout(() => {
          dispatch(setStore({ realisasiBiaya, realisasiPendapatanHeader }));
        }, 100);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await editRealisasiPengeluaranKegiatan(values, id, "");
        const realisasiBiaya = await getRealizationAll("biaya", {
          tahun: auths.isTahun,
        });
        const realisasiPendapatanHeader = await getRealizationAll(
          "pendapatan/header",
          {
            tahun: auths.isTahun,
          },
        );
        notifAlert({
          type: "success",
          description: "Data Berhasil di simpan",
        });
        setTimeout(() => {
          dispatch(setStore({ realisasiBiaya, realisasiPendapatanHeader }));
        }, 100);
      } catch (error) {
        console.log(error);
      }
    }

    setOpenModal(false);
    setLoading(false);
  };

  const handleTambah = () => {
    setID(uuidv4());
    setTitle("Tambah");
    setDataEdit(null);
    setOpenModal(true);
  };

  const expandedRowRender = (record) => {
    const columnsExpand = [
      {
        title: "Sumber Dana",
        key: "namaSumberDana",
        dataIndex: "namaSumberDana",
      },
      {
        title: "Jenis Pajak",
        dataIndex: "jenisPajak",
        key: "jenisPajak",
      },
      {
        title: "Tipe Kas",
        key: "namaTipeKas",
        dataIndex: "namaTipeKas",
      },
      {
        title: "Metode Pembayaran",
        key: "namaMetodePembayaran",
        dataIndex: "namaMetodePembayaran",
      },
      {
        title: "Data Rekening",
        key: "rekeningBankId",
        dataIndex: "rekeningBankId",
        render: (rekeningBankId) =>
          (rekeningBankId &&
            tmpRekeningBelanja
              .filter((item) => item.id.includes(rekeningBankId))
              .map((item) => {
                return `${item.nama_bank}-${item.no_rekening}`;
              })) ||
          "-",
      },
      {
        title: "Kuantitas",
        key: "quantity",
        dataIndex: "quantity",
      },
      {
        title: "Biaya Pajak",
        key: "biayaPajak",
        children: [
          {
            title: "PPN",
            key: "grandPajakTerutangPpn",
            dataIndex: "grandPajakTerutangPpn",
            render: (grandPajakTerutangPpn) =>
              formatRupiah(grandPajakTerutangPpn),
          },
          {
            title: "PPH21",
            key: "grandPajakTerutangPph21",
            dataIndex: "grandPajakTerutangPph21",
            render: (grandPajakTerutangPph21) =>
              formatRupiah(grandPajakTerutangPph21),
          },
          {
            title: "PPH22",
            key: "grandPajakTerutangPph22",
            dataIndex: "grandPajakTerutangPph22",
            render: (grandPajakTerutangPph22) =>
              formatRupiah(grandPajakTerutangPph22),
          },
          {
            title: "PPH23",
            key: "grandPajakTerutangPph23",
            dataIndex: "grandPajakTerutangPph23",
            render: (grandPajakTerutangPph23) =>
              formatRupiah(grandPajakTerutangPph23),
          },
        ],
      },
      {
        title: "Total",
        key: "Total",
        children: [
          {
            title: "Pajak",
            key: "grandPajak",
            dataIndex: "grandPajak",
            render: (grandPajak) => formatRupiah(grandPajak),
          },
          {
            title: "Pajak Terhutang",
            key: "grandPajakTerutang",
            dataIndex: "grandPajakTerutang",
            render: (grandPajakTerutang) => formatRupiah(grandPajakTerutang),
          },
          {
            title: "Sub Total",
            key: "jumlah",
            dataIndex: "jumlah",
            render: (jumlah) => formatRupiah(jumlah),
          },
          {
            title: "Grand Total",
            key: "grandTotal",
            render: (record) => formatRupiah(record.jumlah + record.grandPajak),
          },
        ],
      },
    ];

    const dataExpand = record.biayaSumberDanas || [];

    return (
      <Table
        columns={columnsExpand}
        dataSource={dataExpand}
        pagination={false}
        bordered
      />
    );
  };

  return (
    <>
      <BreadCrumb
        routes={itemBreadcrumb}
        title={"Rincian Pembuatan Nota"}
        back={true}
        toBack={() => route.goBack()}
      />
      <HeaderNotaPengeluaranKegiatan rincian={dataState} />
      <div className="m-5 p-5 bg-white shadow-md rounded">
        <div className="mb-4 flex justify-end">
          <div className="mr-4">
            <Space size={[8, 8]} wrap>
              {kodeRole === "bendahara_madrasah" && (
                <ButtonTambah onClick={handleTambah} />
              )}
              <ButtonLog
                onClick={() =>
                  route.push({
                    pathname: "logs/" + dataState?.id,
                    state: dataState?.id,
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
            expandable={{ expandedRowRender }}
            loading={loading}
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
      <ModalTanggalRealisasiPengeluaranKegiatan
        openModal={openModalTanggal}
        data={dataEdit}
        title={title}
        store={store}
        rincian={dataState}
        handleClose={() => setOpenModalTanggal(false)}
        handleSave={handleSaveTanggal}
      />
      <ModalPengeluaranKegiatan
        openModal={openModal}
        data={dataEdit}
        title={title}
        store={store}
        rincian={dataState}
        handleClose={() => {
          setOpenModal(false);
          setDataEdit(null);
        }}
        komponenBiaya={tmpRefKomponenBiaya}
        handleSave={handleSave}
      />
      <ModalApprovalPengeluaranKegiatan
        title={title}
        store={store}
        openModal={openModalApproval}
        // rincian={dataState}
        data={dataEdit}
        handleClose={() => setOpenModalApproval(false)}
        handleSave={handleSaveApproval}
      />
    </>
  );
};
export default ListNota;
