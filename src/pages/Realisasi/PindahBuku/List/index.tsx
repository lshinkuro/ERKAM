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
import ModalApprovalPindahBuku from "../Component/ModalApprovalPindahBuku";
import {
  deleteRealisasiPindahBuku,
  editRealisasiPindahBuku,
  postRealisasiPindahBuku,
} from "../../../../services/v2/realizationservice/pindahbukuservices";
import { setStore } from "../../../../redux/actions";
import notifAlert from "../../../../components/NotifAlert";
import ModalTanggalRealisasiPindahBuku from "../Component/ModalTanggalRealisasi";
import ModalPindahBuku from "../Component/ModalPindahBuku";
import { getRealizationAll } from "../../../../services/v2/realizationservice";

const PindahBuku = () => {
  const route = useHistory();
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Realisasi" },
    { path: "/", breadcrumbName: "Pindah Buku" },
    { path: "/", breadcrumbName: "List" },
  ];
  const dispatch = useDispatch();
  const [search, setSearch] = useState<any>(null);
  const auths = useSelector((state: any) => state.auth);
  const store = useSelector((state: any) => state.store);
  const auth = auths?.data;
  const kodeRole = auth?.kode_role;
  const [form] = Form.useForm();
  const [formTanggal] = Form.useForm();
  const [openModal, setOpenModal] = useState(false);
  const [openModalApproval, setOpenModalApproval] = useState(false);
  const [openModalTanggal, setOpenModalTanggal] = useState(false);
  const [title, setTitle] = useState("");
  const [dataEdit, setDataEdit] = useState<any>(null);
  const [id, setID] = useState<any>(null);

  const tmpRealisasiPindahBuku = store.realisasiPindahBuku || [];
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  /** Filter Search */
  let dataTable: any = search
    ? tmpRealisasiPindahBuku.filter((item: any) => {
        const val = search.toLowerCase();
        return (
          (item.rencanaPendapatanName !== null &&
            (item.rencanaPendapatanName || "")
              .toString()
              .toLowerCase()
              .includes(val)) ||
          (item.keterangan !== null &&
            (item.keterangan || "").toString().toLowerCase().includes(val)) ||
          (item.noNotaFormat !== null &&
            (item.noNotaFormat || "").toString().toLowerCase().includes(val))
        );
      })
    : tmpRealisasiPindahBuku;
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
      title: "Tanggal Nota",
      dataIndex: "tanggalNota",
      key: "tanggalNota",
      width: 150,
      render: (tanggalNota) =>
        tanggalNota
          ? moment(tanggalNota).format("dddd,DD MMM YYYY HH:mm:ss")
          : "-",
    },
    {
      title: "No Nota",
      dataIndex: "noNotaFormat",
      key: "noNotaFormat",
      width: 320,
      onFilter: (value, record) => record.noNotaFormat.indexOf(value) === 0,
      sorter: (a, b) => a.noNotaFormat.localeCompare(b.noNotaFormat),
    },
    {
      title: "Sumber Dana",
      dataIndex: "rencanaPendapatanName",
      key: "rencanaPendapatanName",
      width: 150,
      onFilter: (value, record) =>
        record.rencanaPendapatanName.indexOf(value) === 0,
      sorter: (a, b) =>
        a.rencanaPendapatanName.localeCompare(b.rencanaPendapatanName),
    },
    {
      title: "Tipe Kas",
      dataIndex: "namaTipeKas",
      key: "namaTipeKas",
      width: 150,
      onFilter: (value, record) => record.namaTipeKas.indexOf(value) === 0,
      sorter: (a, b) => a.namaTipeKas.localeCompare(b.namaTipeKas),
    },
    {
      title: "Ke Tipe Kas",
      dataIndex: "namaToTipeKas",
      key: "namaToTipeKas",
      width: 150,
      onFilter: (value, record) => record.namaToTipeKas.indexOf(value) === 0,
      sorter: (a, b) => a.namaToTipeKas.localeCompare(b.namaToTipeKas),
    },
    {
      title: "Jumlah",
      dataIndex: "grandTotal",
      key: "grandTotal",
      align: "right",
      width: 150,
      render: (grandTotal) => formatRupiah(grandTotal),
    },
    {
      title: "Keterangan",
      dataIndex: "keterangan",
      key: "keterangan",
      width: 150,
    },
    {
      title: "Tanggal Realisasi",
      dataIndex: "tanggalRealisasi",
      key: "tanggalRealisasi",
      width: 150,
      render: (tanggalRealisasi) =>
        tanggalRealisasi
          ? moment(tanggalRealisasi).format("dddd,DD MMM YYYY HH:mm:ss")
          : "-",
    },
    {
      title: "No Referensi",
      dataIndex: "realisasiNoReferensi",
      key: "realisasiNoReferensi",
      width: 100,
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
    form.setFieldsValue({
      sumberDana: record.rencanaPendapatanKode,
      tipeKas: record.kodeTipeKas,
      tipeKasTujuan: record.toKodeTipeKas,
      jumlah: record.grandTotal,
      keterangan: record.keterangan,
      tanggalNota: moment(record.tanggalNota),
      noRekening: record.rekeningBankId,
      noRekeningTujuan: record.toRekeningBankId,
    });
  };

  const handleDelete = async (record: any) => {
    try {
      await deleteRealisasiPindahBuku(record.id);
      const realisasiPindahBuku = tmpRealisasiPindahBuku.filter(
        (item: any) => !item.id.includes(record.id),
      );
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
        dispatch(setStore({ realisasiPindahBuku, realisasiPendapatanHeader }));
      }, 100);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDetailApprove = (record: any, action: any) => {
    setTitle(action);
    setOpenModalApproval(true);
    setDataEdit(record);
    setID(record.id);
  };

  const handleSaveApproval = async (action: any) => {
    try {
      const payload = {
        keterangan: "",
      };
      const res = await editRealisasiPindahBuku(payload, id, action);
      const filterRealisasiPindahBuku = tmpRealisasiPindahBuku.filter(
        (item: any) => !item.id.includes(id),
      );
      const realisasiPindahBuku = [...filterRealisasiPindahBuku, res];
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
        dispatch(setStore({ realisasiPindahBuku, realisasiPendapatanHeader }));
      }, 100);
    } catch (error) {
      console.log(error);
    }
    setOpenModalApproval(false);
  };

  const handleSaveTanggal = async (values: any) => {
    try {
      const payload = {
        realisasiNoReferensi: values.noReferensi,
        tanggalRealisasi: moment(values.tanggalRealisasi).format(
          "YYYY-MM-DD HH:mm:ss",
        ),
      };
      const res = await editRealisasiPindahBuku(payload, id, "/realisasi");
      const filterRealisasiPindahBuku = tmpRealisasiPindahBuku.filter(
        (item: any) => !item.id.includes(id),
      );
      const realisasiPindahBuku = [...filterRealisasiPindahBuku, res];
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
        dispatch(setStore({ realisasiPindahBuku, realisasiPendapatanHeader }));
      }, 100);
    } catch (error) {
      console.log(error);
    }
    setOpenModalTanggal(false);
  };

  const handleTambah = () => {
    setTitle("Tambah");
    setID(uuidv4());
    setOpenModal(true);
    form.resetFields();
  };

  const handleSave = async (values: any) => {
    const payload = {
      id: id,
      madrasahId: auth.madrasah.id,
      namaMadrasah: auth.madrasah.nama,
      tahun: auths.isTahun,
      kodeLevelPpk: auth?.madrasah?.kode_level_ppk,
      ...values,
    };
    const filterRealisasiPindahBuku = tmpRealisasiPindahBuku.filter(
      (item: any) => !item.id.includes(id),
    );

    if (title === "Tambah") {
      try {
        const res = await postRealisasiPindahBuku(payload);
        const realisasiPindahBuku = [...filterRealisasiPindahBuku, res];
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
          dispatch(
            setStore({ realisasiPindahBuku, realisasiPendapatanHeader }),
          );
        }, 100);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const res = await editRealisasiPindahBuku(payload, id, "");
        const realisasiPindahBuku = [...filterRealisasiPindahBuku, res];
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
          dispatch(
            setStore({ realisasiPindahBuku, realisasiPendapatanHeader }),
          );
        }, 100);
      } catch (error) {
        console.log(error);
      }
    }
    setOpenModal(false);
  };
  return (
    <>
      <BreadCrumb routes={itemBreadcrumb} title="Realisasi Pindah Buku" />
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
      <ModalPindahBuku
        openModal={openModal}
        title={title}
        form={form}
        handleClose={() => setOpenModal(false)}
        handleSave={handleSave}
        store={store}
      />
      <ModalApprovalPindahBuku
        title={title}
        store={store}
        openModal={openModalApproval}
        data={dataEdit}
        handleClose={() => setOpenModalApproval(false)}
        handleSave={handleSaveApproval}
      />
      <ModalTanggalRealisasiPindahBuku
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

export default PindahBuku;
