/** @format */

import React, { useState } from "react";
import { BreadCrumb } from "../../../../components";
import moment from "moment";
import "moment/locale/id";
import { useHistory } from "react-router-dom";
import { formatRupiah, uuidv4 } from "../../../../utils/helper";
import { useDispatch, useSelector } from "react-redux";
import { Form, Badge, Table, Space, Modal } from "antd";
import {
  ButtonLog,
  ButtonTableApproval,
  ButtonTableDelete,
  ButtonTableDetail,
  ButtonTableEdit,
  ButtonTambah,
} from "../../../../components/Button";
import InputSearch from "../../../../components/InputSearch";
import ModalPendapatan from "../Component/ModalPendapatan";
import HeaderRealisasi from "../../../../components/HeaderRealisasi";
import ModalApprovalPendapatan from "../Component/ModalApprovalPendapatan";
import {
  deleteRealisasiPendapatan,
  editRealisasiPendapatan,
  postRealisasiPendapatan,
} from "../../../../services/v2/realizationservice/pendapatanservices";
import notifAlert from "../../../../components/NotifAlert";
import { setStore } from "../../../../redux/actions";
import ModalTanggalRealisasiPendapatan from "../Component/ModalTanggalRealisasi";
import { getRealizationAll } from "../../../../services/v2/realizationservice";

const RealisasiPendapatan = () => {
  const route = useHistory();
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Realisasi" },
    { path: "/", breadcrumbName: "Pendapatan" },
    { path: "/", breadcrumbName: "List" },
  ];
  const dispatch = useDispatch();
  const [search, setSearch] = useState<any>(null);
  const [form] = Form.useForm();
  const [formTanggal] = Form.useForm();
  const [openModal, setOpenModal] = useState(false);
  const [openModalApproval, setOpenModalApproval] = useState(false);
  const [openModalTanggal, setOpenModalTanggal] = useState(false);
  const [title, setTitle] = useState("");
  const auths = useSelector((state: any) => state.auth);
  const store = useSelector((state: any) => state.store);
  const auth = auths?.data;
  const refRekeningBelanja = store.rekeningBelanja || [];
  const refTipeKas = store.tipeKas || [];
  const refSumberDana = store.rencanaPendapatanDefinitif || [];
  const kodeRole = auth?.kode_role;
  const tmpRealisasiPendapatan = store.realisasiPendapatan || [];
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [id, setID] = useState<any>(null);
  const [dataEdit, setDataEdit] = useState<any>(null);

  /** Filter Search */
  let dataTable: any = search
    ? tmpRealisasiPendapatan.filter((item: any) => {
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
    : tmpRealisasiPendapatan;
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
      width: 250,
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
      title: "No Rekening",
      dataIndex: "rekeningBankId",
      key: "rekeningBankId",
      width: 150,
      render: (rekeningBankId) =>
        refRekeningBelanja
          .filter((item: any) => item.id.includes(rekeningBankId))
          .map((item) => item.no_rekening),
    },
    {
      title: "Nama Bank",
      dataIndex: "rekeningBankId",
      key: "namaRekeningBank",
      width: 150,
      render: (rekeningBankId) =>
        refRekeningBelanja
          .filter((item: any) => item.id.includes(rekeningBankId))
          .map((item) => item.nama_bank),
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
      width: 150,
      render: (tanggalNota) =>
        tanggalNota
          ? moment(tanggalNota).format("dddd,DD MMM YYYY HH:mm:ss")
          : "-",
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
      width: 150,
    },
    {
      title: "Jumlah",
      dataIndex: "jumlah",
      key: "jumlah",
      align: "right",
      width: 150,
      render: (jumlah) => formatRupiah(jumlah),
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
      width: 150,
      align: "center",
      fixed: "right",
      render: (record) => (
        <Space>
          {kodeRole === "kepala_madrasah" ? (
            <ButtonTableApproval
              tooltips="Approval"
              onClick={() => handleApproval(record)}
            />
          ) : (
            <>
              {record.status === "Menunggu Tanggal Realisasi" && (
                <ButtonTableDetail
                  tooltips="Set Tanggal Realisasi"
                  onClick={() => handleTanggalRealisasi(record)}
                />
              )}
              <ButtonTableEdit
                tooltips="Ubah"
                onClick={() => handleEdit(record)}
              />
              <ButtonTableDelete
                tooltips="Hapus"
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

  const handleEdit = (record: any) => {
    setID(record.id);
    setOpenModal(true);
    setTitle("Edit");
    form.setFieldsValue({
      sumberDana: record.rencanaPendapatanId,
      keterangan: record.keterangan,
      tipeKas: record.kodeTipeKas,
      nilaiPendapatan: record.jumlah,
      tanggalNota: moment(record.tanggalNota),
      noRekening: record.rekeningBankId,
    });
  };

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

  const handleDelete = async (record: any) => {
    try {
      await deleteRealisasiPendapatan(record.id);
      const realisasiPendapatan = tmpRealisasiPendapatan.filter(
        (item: any) => !item.id.includes(record.id),
      );
      notifAlert({
        type: "success",
        description: "Data Berhasil di hapus",
      });
      const realisasiPendapatanHeader = await getRealizationAll(
        "pendapatan/header",
        {
          tahun: auths.isTahun,
        },
      );
      setTimeout(() => {
        dispatch(setStore({ realisasiPendapatan, realisasiPendapatanHeader }));
      }, 100);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = async (values: any) => {
    let namaRekening = "";

    const tmpTipeKas =
      refTipeKas.find((item: any) => item.kode === values.tipeKas) || null;

    const tmpSumberDana =
      refSumberDana.find((item) => item.id.includes(values.sumberDana)) || null;

    if (values.tipeKas === "rekening_bank") {
      refRekeningBelanja
        .filter((item: any) => item.id.includes(values.noRekening))
        .map((item) => {
          return (namaRekening = item.no_rekening_nama);
        });
    }

    let payload = {
      tahun: auths.isTahun,
      kodeLevelPpk: auth.madrasah.kode_level_ppk,
      id: id,
      rencanaPendapatanId: values.sumberDana,
      rencanaPendapatanKode: tmpSumberDana?.kode_sumber_dana || null,
      rencanaPendapatanName: tmpSumberDana.nama_sumber_dana || null,
      kodeTipeKas: values.tipeKas,
      namaTipeKas: tmpTipeKas?.nama || null,
      rekeningBankId:
        (values.tipeKas === "rekening_bank" && values.noRekening) || "",
      namaRekeningBank: namaRekening,
      jumlah: values.nilaiPendapatan,
      keterangan: values.keterangan,
      tanggalNota: moment(values.tanggalNota).format("YYYY-MM-DD HH:mm:ss"),
    };
    const filterRealisasiPendapatan = tmpRealisasiPendapatan.filter(
      (item: any) => !item.id.includes(id),
    );
    if (title === "Tambah") {
      try {
        const res = await postRealisasiPendapatan(payload);
        notifAlert({
          type: "success",
          description: "Data Berhasil di simpan",
        });
        const realisasiPendapatan = [...filterRealisasiPendapatan, res];
        const realisasiPendapatanHeader = await getRealizationAll(
          "pendapatan/header",
          {
            tahun: auths.isTahun,
          },
        );
        setTimeout(() => {
          dispatch(
            setStore({ realisasiPendapatan, realisasiPendapatanHeader }),
          );
        }, 100);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const res = await editRealisasiPendapatan(payload, id, "");
        notifAlert({
          type: "success",
          description: "Data Berhasil di simpan",
        });
        const realisasiPendapatan = [...filterRealisasiPendapatan, res];
        const realisasiPendapatanHeader = await getRealizationAll(
          "pendapatan/header",
          {
            tahun: auths.isTahun,
          },
        );
        setTimeout(() => {
          dispatch(
            setStore({ realisasiPendapatan, realisasiPendapatanHeader }),
          );
        }, 100);
      } catch (error) {
        console.log(error);
      }
    }

    setOpenModal(false);
  };

  const handleApproval = (record: any) => {
    setTitle("Approval");
    setDataEdit(record);
    setID(record.id);
    setOpenModalApproval(true);
  };

  const handleSaveApproval = async (action: any) => {
    try {
      const payload = {
        keterangan: "",
      };
      const res = await editRealisasiPendapatan(payload, id, action);
      const filterRealisasiPendapatan = tmpRealisasiPendapatan.filter(
        (item: any) => !item.id.includes(id),
      );
      const realisasiPendapatan = [...filterRealisasiPendapatan, res];
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
        dispatch(setStore({ realisasiPendapatan, realisasiPendapatanHeader }));
      }, 100);
    } catch (error) {
      console.log(error);
    }
    setOpenModalApproval(false);
  };

  const handleTambah = () => {
    setOpenModal(true);
    setTitle("Tambah");
    setID(uuidv4());
    form.resetFields();
  };

  const handleSaveTanggal = async (values: any) => {
    try {
      const payload = {
        realisasiNoReferensi: values.noReferensi,
        tanggalRealisasi: moment(values.tanggalRealisasi).format(
          "YYYY-MM-DD HH:mm:ss",
        ),
      };
      const res = await editRealisasiPendapatan(payload, id, "/realisasi");
      const filterRealisasiPendapatan = tmpRealisasiPendapatan.filter(
        (item: any) => !item.id.includes(id),
      );
      const realisasiPendapatan = [...filterRealisasiPendapatan, res];
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
        dispatch(setStore({ realisasiPendapatan, realisasiPendapatanHeader }));
      }, 100);
    } catch (error) {
      console.log(error);
    }
    setOpenModalTanggal(false);
  };
  return (
    <>
      <BreadCrumb routes={itemBreadcrumb} title="Realisasi Pendapatan" />
      <HeaderRealisasi />
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
      <ModalPendapatan
        form={form}
        openModal={openModal}
        title={title}
        store={store}
        handleSave={handleSave}
        handleClose={() => setOpenModal(false)}
      />
      <ModalApprovalPendapatan
        openModal={openModalApproval}
        title={title}
        store={store}
        data={dataEdit}
        handleSave={handleSaveApproval}
        handleClose={() => setOpenModalApproval(false)}
      />
      <ModalTanggalRealisasiPendapatan
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

export default RealisasiPendapatan;
