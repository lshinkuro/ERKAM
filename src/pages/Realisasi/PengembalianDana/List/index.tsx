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
import HeaderRealisasi from "../../../../components/HeaderRealisasi";
import {
  deleteRealisasiPengembalianDana,
  editRealisasiPengembalianDana,
  postRealisasiPengembalianDana,
} from "../../../../services/v2/realizationservice/pengembaliandanaservices";
import notifAlert from "../../../../components/NotifAlert";
import { setStore } from "../../../../redux/actions";
import ModalApprovalPengembalianDana from "../Component/ModalApprovalPengembalianDana";
import ModalTanggalRealisasiPengembalianDana from "../Component/ModalTanggalRealisasi";
import { getRealizationAll } from "../../../../services/v2/realizationservice";
import ModalPengembalianDana from "../Component/ModalPengembalianDana";

const PengembalianDana = () => {
  const route = useHistory();
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Realisasi" },
    { path: "/", breadcrumbName: "Pengembalian Dana" },
    { path: "/", breadcrumbName: "List" },
  ];
  const dispatch = useDispatch();
  const store = useSelector((state: any) => state.store);
  const auths = useSelector((state: any) => state.auth);
  const auth = auths?.data;
  const kodeRole = auth?.kode_role;
  const tmpRealisasiPengembalianDana = store.realisasiPengembalianDana || [];
  const tmpTipeKas = store.tipeKas || [];

  const [search, setSearch] = useState<any>(null);
  const [formTanggal] = Form.useForm();
  const [openModal, setOpenModal] = useState(false);
  const [openModalApproval, setOpenModalApproval] = useState(false);
  const [openModalTanggal, setOpenModalTanggal] = useState(false);
  const [title, setTitle] = useState("");
  const [dataEdit, setDataEdit] = useState<any>(null);
  const [id, setID] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  /** Filter Search */
  let dataTable: any = search
    ? tmpRealisasiPengembalianDana.filter((item: any) => {
        const val = search.toLowerCase();
        return (
          (item.pendapatan.rencanaPendapatanName !== null &&
            (item.pendapatan.rencanaPendapatanName || "")
              .toString()
              .toLowerCase()
              .includes(val)) ||
          (item.keterangan !== null &&
            (item.keterangan || "").toString().toLowerCase().includes(val)) ||
          (item.noNotaFormat !== null &&
            (item.noNotaFormat || "").toString().toLowerCase().includes(val))
        );
      })
    : tmpRealisasiPengembalianDana;
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
      width: 320,
      onFilter: (value, record) => record.noNotaFormat.indexOf(value) === 0,
      sorter: (a, b) => a.noNotaFormat.localeCompare(b.noNotaFormat),
    },
    {
      title: "Sumber Dana",
      key: "rencanaPendapatanName",
      width: 150,
      onFilter: (value, record) =>
        record.pendapatan.rencanaPendapatanName.indexOf(value) === 0,
      sorter: (a, b) =>
        a.pendapatan.rencanaPendapatanName.localeCompare(
          b.pendapatan.rencanaPendapatanName,
        ),
      render: (record) => record.pendapatan.rencanaPendapatanName,
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
      title: "Jumlah",
      dataIndex: "grandTotal",
      key: "grandTotal",
      width: 150,
      render: (grandTotal) => formatRupiah(grandTotal),
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
      const res = await editRealisasiPengembalianDana(payload, id, action);
      const filterRealisasiPengembalianDana =
        tmpRealisasiPengembalianDana.filter(
          (item: any) => !item.id.includes(id),
        );
      const realisasiPengembalianDana = [
        ...filterRealisasiPengembalianDana,
        res,
      ];
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
          setStore({ realisasiPengembalianDana, realisasiPendapatanHeader }),
        );
      }, 100);
    } catch (error) {
      console.log(error);
    }
    setOpenModalApproval(false);
  };

  const handleSaveTanggal = async (values: any) => {
    try {
      const payload = {
        realisasi_no_referensi: values.noReferensi,
        tanggal_realisasi: moment(values.tanggalRealisasi).utc(),
      };
      const res = await editRealisasiPengembalianDana(
        payload,
        id,
        "/realisasi",
      );
      const filterRealisasiPengembalianDana =
        tmpRealisasiPengembalianDana.filter(
          (item: any) => !item.id.includes(id),
        );
      const realisasiPengembalianDana = [
        ...filterRealisasiPengembalianDana,
        res,
      ];
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
          setStore({ realisasiPengembalianDana, realisasiPendapatanHeader }),
        );
      }, 100);
    } catch (error) {
      console.log(error);
    }
    setOpenModalTanggal(false);
  };

  const handleEdit = (record: any) => {
    setID(record.id);
    setOpenModal(true);
    setTitle("Edit");
    setDataEdit(record);
  };

  const handleDelete = async (record: any) => {
    try {
      await deleteRealisasiPengembalianDana(record.id);
      const realisasiPengembalianDana = tmpRealisasiPengembalianDana.filter(
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
        dispatch(
          setStore({ realisasiPengembalianDana, realisasiPendapatanHeader }),
        );
      }, 100);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTambah = () => {
    setTitle("Tambah");
    setID(uuidv4());
    setOpenModal(true);
    setDataEdit(null);
  };

  const handleSave = async (values: any) => {
    const payload = {
      id: id,
      tahun: auths.isTahun,
      ...values,
    };
    const filterRealisasiPengembalianDana = tmpRealisasiPengembalianDana.filter(
      (item: any) => !item.id.includes(id),
    );

    if (title === "Tambah") {
      try {
        const res = await postRealisasiPengembalianDana(payload);
        const realisasiPengembalianDana = [
          ...filterRealisasiPengembalianDana,
          res,
        ];
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
            setStore({ realisasiPengembalianDana, realisasiPendapatanHeader }),
          );
        }, 100);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const res = await editRealisasiPengembalianDana(payload, id, "");
        const realisasiPengembalianDana = [
          ...filterRealisasiPengembalianDana,
          res,
        ];
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
            setStore({ realisasiPengembalianDana, realisasiPendapatanHeader }),
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
      <BreadCrumb routes={itemBreadcrumb} title="Realisasi Pengembalian Dana" />
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
      <ModalPengembalianDana
        openModal={openModal}
        title={title}
        data={dataEdit}
        handleClose={() => {
          setOpenModal(false);
          setDataEdit(null);
        }}
        handleSave={handleSave}
        store={store}
      />
      <ModalApprovalPengembalianDana
        title={title}
        store={store}
        openModal={openModalApproval}
        data={dataEdit}
        handleClose={() => setOpenModalApproval(false)}
        handleSave={handleSaveApproval}
      />
      <ModalTanggalRealisasiPengembalianDana
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

export default PengembalianDana;
