/** @format */

import React, { useState } from "react";
import { BreadCrumb } from "../../../../components";
import { useHistory } from "react-router-dom";
import { formatRupiah, uuidv4 } from "../../../../utils/helper";
import moment from "moment";
import "moment/locale/id";
import { Table, Modal, Badge, Space, Form } from "antd";
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
import { useDispatch, useSelector } from "react-redux";
import notifAlert from "../../../../components/NotifAlert";
import ModalApprovalPengeluaranPajak from "../Component/ModalApprovalPengeluaranPajak";
import ModalTanggalRealisasiPengeluaranPajak from "../Component/ModalTanggalRealisasi";
import {
  deleteRealisasiPengeluaranPajak,
  editRealisasiPengeluaranPajak,
  postRealisasiPengeluaranPajak,
} from "../../../../services/v2/realizationservice/pengeluaranpajakservices";
import { setStore } from "../../../../redux/actions";
import ModalPengeluaranPajak from "../Component/ModalPengeluaranPajak";
import { getRealizationAll } from "../../../../services/v2/realizationservice";

/**
 * Tampilan realisasi pengeluaran pajak
 */
const PengeluaranPajak = () => {
  const route = useHistory();
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Realisasi" },
    { path: "/", breadcrumbName: "Pengeluaran Pajak" },
    { path: "/", breadcrumbName: "List" },
  ];
  const dispatch = useDispatch();
  const [search, setSearch] = useState<any>(null);
  const [formTanggal] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openModalApproval, setOpenModalApproval] = useState(false);
  const [openModalTanggal, setOpenModalTanggal] = useState(false);
  const [title, setTitle] = useState<any>(null);
  const [dataEdit, setDataEdit] = useState<any>(null);
  const [id, setID] = useState<any>(null);
  const auths = useSelector((state: any) => state.auth);
  const store = useSelector((state: any) => state.store);
  const auth = auths?.data;
  const kodeRole = auth?.kode_role;

  const tmpTipeKas = store.tipeKas || [];
  const tmpPajak = store.pajak || [];
  const tmpRealisasiPajak = store.realisasiPajak || [];
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  /** Filter Search */
  let dataTable: any = search
    ? tmpRealisasiPajak.filter((item: any) => {
        const val = search.toLowerCase();
        return (
          (item.rencanaPendapatanName !== null &&
            (item.rencanaPendapatanName || "")
              .toString()
              .toLowerCase()
              .includes(val)) ||
          (item.noNotaFormat !== null &&
            (item.noNotaFormat || "").toString().toLowerCase().includes(val))
        );
      })
    : tmpRealisasiPajak;
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
      title: "No Nota",
      dataIndex: "noNotaFormat",
      key: "noNotaFormat",
      width: 340,
      onFilter: (value, record) => record.noNotaFormat.indexOf(value) === 0,
      sorter: (a, b) => a.noNotaFormat.localeCompare(b.noNotaFormat),
    },
    {
      title: "Jenis Pajak",
      dataIndex: "kodePajak",
      key: "kodePajak",
      width: 150,
      onFilter: (value, record) => record.kodePajak.indexOf(value) === 0,
      sorter: (a, b) => a.kodePajak.localeCompare(b.kodePajak),
      render: (kodePajak) =>
        tmpPajak.length &&
        tmpPajak
          .filter((item: any) => item.kode === kodePajak)
          .map((item) => item.nama),
    },
    {
      title: "Sumber Dana",
      dataIndex: "namaSumberDana",
      key: "namaSumberDana",
      width: 150,
      onFilter: (value, record) => record.namaSumberDana.indexOf(value) === 0,
      sorter: (a, b) => a.namaSumberDana.localeCompare(b.namaSumberDana),
    },
    {
      title: "Tipe Kas",
      dataIndex: "kodeTipeKas",
      key: "kodeTipeKas",
      width: 150,
      onFilter: (value, record) => record.kodeTipeKas.indexOf(value) === 0,
      sorter: (a, b) => a.kodeTipeKas.localeCompare(b.kodeTipeKas),
      render: (kodeTipeKas) =>
        tmpTipeKas.length &&
        tmpTipeKas
          .filter((item: any) => item.kode === kodeTipeKas)
          .map((item) => item.nama),
    },
    {
      title: "Keterangan",
      dataIndex: "keterangan",
      key: "keterangan",
      width: 150,
    },
    {
      title: "Tanggal Nota",
      dataIndex: "tanggalNota",
      key: "tanggalNota",
      width: 170,
      render: (tanggalNota) =>
        tanggalNota
          ? moment(tanggalNota).format("dddd,DD MMM YYYY HH:mm:ss")
          : "-",
    },
    {
      title: "Tanggal Realisasi",
      dataIndex: "tanggalRealisasi",
      key: "tanggalRealisasi",
      width: 170,
      render: (tanggalRealisasi) =>
        tanggalRealisasi
          ? moment(tanggalRealisasi).format("dddd,DD MMM YYYY HH:mm:ss")
          : "-",
    },
    {
      title: "No Referensi",
      dataIndex: "realisasiNoReferensi",
      key: "realisasiNoReferensi",
      width: 150,
    },
    {
      title: "Jumlah",
      dataIndex: "grandTotal",
      key: "grandTotal",
      align: "right",
      width: 180,
      render: (grandTotal) => formatRupiah(grandTotal),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
      fixed: "right",
      render: (status) => (
        <>
          <Badge
            status={
              (status === "Selesai" && "success") ||
              (status === "Menunggu Tanggal Realisasi" && "processing") ||
              (status === "Menunggu" && "warning") ||
              (status === "Tidak Disetujui" && "error") ||
              "default"
            }
            text={status}
          />
        </>
      ),
    },
    {
      title: "Aksi",
      key: "aksi",
      width: 180,
      align: "center",
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
              {record.status === "Menunggu Tanggal Realisasi" && (
                <ButtonTableDetail
                  tooltips="Set Tanggal Realisasi"
                  onClick={() => handleTanggalRealisasi(record)}
                />
              )}
              <ButtonTableEdit onClick={() => handleEdit(record)} />
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
    formTanggal.setFieldsValue({
      tanggalRealisasi: record.tanggalRealisasi
        ? moment(record.tanggalRealisasi)
        : null,
      noReferensi: record.realisasiNoReferensi,
    });
    setTitle("Set Tanggal Realisasi");
    setDataEdit(record);
    setID(record.id);
  };

  const handleEdit = (record: any) => {
    setID(record.id);
    setOpenModal(true);
    setTitle("Edit");
    setDataEdit(record);
  };

  const handleDelete = async (record: any) => {
    setLoading(true);
    try {
      await deleteRealisasiPengeluaranPajak(record.id);
      const realisasiPajak = await getRealizationAll("pajak", {
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
        description: "Data Berhasil di hapus",
      });
      setTimeout(() => {
        dispatch(setStore({ realisasiPajak, realisasiPendapatanHeader }));
      }, 100);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleDetailApprove = (record: any, action: any) => {
    setTitle(action);
    setOpenModalApproval(true);
    setDataEdit(record);
    setID(record.id);
  };

  const handleSaveApproval = async (action: any) => {
    setLoading(true);
    try {
      const payload = {
        id: id,
        approveStatus: (action === "/approval" && "DISETUJUI") || "DITOLAK",
      };
      await editRealisasiPengeluaranPajak(payload, id, action);
      const realisasiPajak = await getRealizationAll("pajak", {
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
        dispatch(setStore({ realisasiPajak, realisasiPendapatanHeader }));
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
      const payload = {
        realisasiNoReferensi: values.noReferensi,
        tanggalRealisasi: moment(values.tanggalRealisasi).utc(),
      };
      await editRealisasiPengeluaranPajak(payload, id, "/realisasi");
      const realisasiPajak = await getRealizationAll("pajak", {
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
        dispatch(setStore({ realisasiPajak, realisasiPendapatanHeader }));
      }, 100);
    } catch (error) {
      console.log(error);
    }
    setOpenModalTanggal(false);
    setLoading(false);
  };

  const handleTambah = () => {
    setID(uuidv4());
    setOpenModal(true);
    setTitle("Tambah");
    setDataEdit(null);
  };

  const handleSave = async (values: any) => {
    setLoading(true);
    if (title === "Tambah") {
      try {
        await postRealisasiPengeluaranPajak(values);
        const realisasiPajak = await getRealizationAll("pajak", {
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
          dispatch(setStore({ realisasiPajak, realisasiPendapatanHeader }));
        }, 100);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await editRealisasiPengeluaranPajak(values, id, "");
        const realisasiPajak = await getRealizationAll("pajak", {
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
          dispatch(setStore({ realisasiPajak, realisasiPendapatanHeader }));
        }, 100);
      } catch (error) {
        console.log(error);
      }
    }

    setLoading(false);
    // postPengeluaranPajak
  };

  return (
    <>
      <BreadCrumb routes={itemBreadcrumb} title="Realisasi Pengeluaran Pajak" />
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
            loading={loading}
            dataSource={dataTable}
            scroll={{ x: "1300" }}
            // tableLayout="auto"
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
      <ModalPengeluaranPajak
        dataEdit={dataEdit}
        openModal={openModal}
        title={title}
        store={store}
        handleSave={handleSave}
        handleClose={() => {
          setDataEdit(null);
          setOpenModal(false);
        }}
      />
      <ModalApprovalPengeluaranPajak
        title={title}
        store={store}
        openModal={openModalApproval}
        data={dataEdit}
        handleClose={() => setOpenModalApproval(false)}
        handleSave={handleSaveApproval}
      />
      <ModalTanggalRealisasiPengeluaranPajak
        openModal={openModalTanggal}
        title={title}
        form={formTanggal}
        data={dataEdit}
        handleSave={handleSaveTanggal}
        handleClose={() => setOpenModalTanggal(false)}
        store={store}
      />
    </>
  );
};
export default PengeluaranPajak;
