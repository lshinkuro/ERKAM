/** @format */

import React, { useState } from "react";
import { useHistory } from "react-router";
import { BreadCrumb } from "../../../../components";

import { Table, Modal, Badge, Space, Form } from "antd";
import {
  ButtonLog,
  ButtonTableApproval,
  ButtonTableDelete,
  ButtonTableEdit,
  ButtonTambah,
} from "../../../../components/Button";
import InputSearch from "../../../../components/InputSearch";
// import ChartCard from "../../../../components/Chart/ChartCard";
// import { Bar } from "react-chartjs-2";
import moment from "moment";
import "moment/locale/id";
import { useDispatch, useSelector } from "react-redux";
import notifAlert from "../../../../components/NotifAlert";
import { setStore } from "../../../../redux/actions";
import {
  deleteRealisasiOutputKegiatan,
  editRealisasiOutputKegiatan,
  postRealisasiOutputKegiatan,
} from "../../../../services/v2/realizationservice/outputkegiatanservices";
import { getTriwulan, toTitleCase, uuidv4 } from "../../../../utils/helper";
import ModalOutputKegiatan from "../Component/ModalOutputKegiatan";
import ModalApprovalOutputKegiatan from "../Component/ModalApprovalOutputKegiatan";
import HeaderOutputKegiatan from "../Component/HeaderOuputKergiatan";

function Rincian() {
  const route = useHistory();
  const rincianData: any = route ? route.location.state : null;
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Realisasi" },
    { path: "/", breadcrumbName: "Output Kegiatan" },
    { path: "/", breadcrumbName: "Rincian" },
  ];
  const dispatch = useDispatch();
  const store = useSelector((state: any) => state.store);
  const auths = useSelector((state: any) => state.auth);
  const auth = auths?.data;
  const kodeRole = auth?.kode_role;
  const tmpRealisasiOutputKegiatan = store.realisasiOutputKegiatan || [];
  const tmpSumberDana = store.rencanaPendapatanDefinitif || [];

  const [search, setSearch] = useState<any>(null);
  const [form] = Form.useForm();
  const [openModal, setOpenModal] = useState(false);
  const [openModalApproval, setOpenModalApproval] = useState(false);
  const [title, setTitle] = useState("");
  const [dataEdit, setDataEdit] = useState<any>(null);
  const [id, setID] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  /** Filter Search */
  let dataTable: any = search
    ? tmpRealisasiOutputKegiatan.filter((item: any) => {
        const val = search.toLowerCase();
        return (
          (item.kepalaMadrasahApproved !== null &&
            (item.kepalaMadrasahApproved || "")
              .toString()
              .toLowerCase()
              .includes(val)) ||
          (item.tahap !== null &&
            (item.tahap || "").toString().toLowerCase().includes(val))
        );
      })
    : tmpRealisasiOutputKegiatan;
  dataTable = dataTable.filter((item) =>
    item.rencanaKegiatanId.includes(rincianData?.id),
  );

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
      title: "Sumber Dana",
      dataIndex: "rencanaPendapatanId",
      key: "rencanaPendapatanId",
      render: (rencanaPendapatanId) =>
        tmpSumberDana
          .filter((item: any) => item.id.includes(rencanaPendapatanId))
          .map((item) => item.nama_sumber_dana),
    },
    {
      title: "Realisasi Output",
      dataIndex: "qtyOutput",
      key: "qtyOutput",
      render: (qtyOutput) =>
        qtyOutput + " " + rincianData?.indikator_output_satuan,
    },
    {
      title: "Indikator Output",
      key: "indikatorOutput",
      render: (_) => rincianData?.indikator_output,
    },
    {
      title: "Tanggal Realisasi",
      dataIndex: "tanggalRealisasi",
      key: "tanggalRealisasi",
      render: (tanggalRealisasi) =>
        tanggalRealisasi
          ? moment(tanggalRealisasi).format("dddd,DD MMM YYYY HH:mm:ss")
          : "-",
    },

    {
      title: "Status",
      dataIndex: "kepalaMadrasahApproved",
      key: "kepalaMadrasahApproved",
      render: (kepalaMadrasahApproved) => (
        <>
          <Badge
            status={
              (kepalaMadrasahApproved === "DISETUJUI" && "success") ||
              (kepalaMadrasahApproved === "MENUNGGU" && "warning") ||
              (kepalaMadrasahApproved === "DITOLAK" && "error") ||
              "default"
            }
            text={toTitleCase(kepalaMadrasahApproved)}
          />
        </>
      ),
    },
    {
      title: "Aksi",
      key: "aksi",
      align: "center",
      render: (record) => (
        <Space>
          {kodeRole === "kepala_madrasah" && (
            <ButtonTableApproval
              tooltips="Approval"
              onClick={() => handleDetailApprove(record, "Approval")}
            />
          )}
          {kodeRole === "bendahara_madrasah" && (
            <>
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

  const handleDetailApprove = (record: any, action: any) => {
    setTitle(action);
    setOpenModalApproval(true);
    setDataEdit(record);
    setID(record.id);
  };

  const handleSaveApproval = async (action: any) => {
    try {
      const payload = {
        id: id,
        approveStatus: action,
        komentar: null,
      };
      const res = await editRealisasiOutputKegiatan(payload, id, "approval/");
      const filterOutputKegiatan = tmpRealisasiOutputKegiatan.filter(
        (item: any) => !item.id.includes(id),
      );
      const realisasiOutputKegiatan = [...filterOutputKegiatan, res];
      notifAlert({
        type: "success",
        description: "Data Berhasil di simpan",
      });
      setTimeout(() => {
        dispatch(setStore({ realisasiOutputKegiatan }));
      }, 100);
    } catch (error) {
      console.log(error);
    }
    setOpenModalApproval(false);
  };

  const handleEdit = (record: any) => {
    setID(record.id);
    setOpenModal(true);
    setTitle("Edit");
    form.setFieldsValue({
      sumberDana: record.rencanaPendapatanId,
      qtyOutput: record.qtyOutput,
      tanggalRealisasi: moment(record.tanggalRealisasi),
      keterangan: record.keterangan,
    });
  };

  const handleDelete = async (record: any) => {
    try {
      await deleteRealisasiOutputKegiatan(record.id);
      const realisasiOutputKegiatan = tmpRealisasiOutputKegiatan.filter(
        (item: any) => !item.id.includes(record.id),
      );
      notifAlert({
        type: "success",
        description: "Data Berhasil di hapus",
      });
      setTimeout(() => {
        dispatch(setStore({ realisasiOutputKegiatan }));
      }, 100);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTambah = () => {
    setTitle("Tambah");
    setID(uuidv4());
    setOpenModal(true);
    form.resetFields();
  };

  const handleSave = async (values: any) => {
    const payload = {
      tahun: auth.isTahun,
      id: id,
      tahap: getTriwulan(moment(values.tanggalRealisasi).format("M")),
      rencanaPendapatanId: values.sumberDana,
      rencanaKegiatanId: rincianData?.id,
      qtyOutput: values.qtyOutput,
      tanggalRealisasi: moment(values.tanggalRealisasi).format(
        "YYYY-MM-DD HH:mm:ss",
      ),
      keterangan: values.keterangan,
    };
    // console.log(payload);
    const filterOutputKegiatan = tmpRealisasiOutputKegiatan.filter(
      (item: any) => !item.id.includes(id),
    );
    if (title === "Tambah") {
      try {
        const res = await postRealisasiOutputKegiatan(payload);
        const realisasiOutputKegiatan = [...filterOutputKegiatan, res];
        notifAlert({
          type: "success",
          description: "Data Berhasil di simpan",
        });

        setTimeout(() => {
          dispatch(setStore({ realisasiOutputKegiatan }));
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const res = await editRealisasiOutputKegiatan(payload, id, "");
        const realisasiOutputKegiatan = [...filterOutputKegiatan, res];
        notifAlert({
          type: "success",
          description: "Data Berhasil di simpan",
        });

        setTimeout(() => {
          dispatch(setStore({ realisasiOutputKegiatan }));
        });
      } catch (error) {
        console.log(error);
      }
    }
    setOpenModal(false);
  };
  return (
    <>
      <BreadCrumb
        back={true}
        toBack={() => route.goBack()}
        routes={itemBreadcrumb}
        title={"Rincian Output Kegiatan"}
      />
      <HeaderOutputKegiatan
        rincian={rincianData}
        data={dataTable}
        tmpSumberDana={tmpSumberDana}
      />
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
                    pathname: "logs/" + rincianData?.id,
                    state: rincianData,
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
      <ModalOutputKegiatan
        title={title}
        openModal={openModal}
        store={store}
        form={form}
        rincian={rincianData}
        handleClose={() => setOpenModal(false)}
        handleSave={handleSave}
      />
      <ModalApprovalOutputKegiatan
        title={title}
        openModal={openModalApproval}
        store={store}
        data={dataEdit}
        rincian={rincianData}
        handleClose={() => setOpenModalApproval(false)}
        handleSave={handleSaveApproval}
      />
    </>
  );
}

export default Rincian;
