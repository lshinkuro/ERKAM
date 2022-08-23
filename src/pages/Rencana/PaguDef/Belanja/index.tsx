/** @format */

import React, { useState } from "react";
import BreadCrumb from "../../../../components/BreadCrumb";

import { useHistory } from "react-router-dom";
import { ExportToExcel } from "../../../../components/Export/ExportToExcel";
import { NotifMessage } from "../../../../components/NotifMessage";
import {
  ButtonDetail,
  ButtonExport,
  ButtonLog,
  ButtonTableDelete,
  ButtonTableDetail,
  ButtonTableEdit,
  ButtonTambah,
} from "../../../../components/Button";
import InputSearch from "../../../../components/InputSearch";
import { Table, Space, Modal, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import "moment/locale/id";
import HeaderBelanja from "../../PaguInd/Belanja/Component/HeaderBelanja";
import { uuidv4 } from "../../../../utils/helper";
import notifAlert from "../../../../components/NotifAlert";
import { setStore } from "../../../../redux/actions";
import {
  deleteRencanaKegiatanDefinitif,
  editRencanaKegiatanDefinitif,
  postRencanaKegiatanDefinitif,
} from "../../../../services/v2/planningservice/rencanakegiatandefinitif";
import ModalFormAction from "../../PaguInd/Belanja/Component/ModalFormAction";

const BelanjaDefinitif = () => {
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Rencana" },
    { path: "/", breadcrumbName: "Pagu Definitif" },
    { path: "/", breadcrumbName: "Belanja" },
  ];

  const route = useHistory();
  const dispatch = useDispatch();
  const auths = useSelector((state: any) => state.auth);
  const store = useSelector((state: any) => state.store);
  const auth = auths?.data;
  const kodeRole = auth?.kode_role;
  const tmpStandarPendidikan = store.snp || [];
  const tmpKegiatan = store.kegiatan || [];
  const tmpSubKegiatan = store.subKegiatan || [];
  const tmpRencanaBelanjaDefinitif = store.rencanaKegiatanDefinitif || [];
  const tmpRencanaTanggal = store.rencanaTanggal;
  const tmpRencanaRekapSumberDanaBelanjaDefinitif =
    store.rencanaRekapSumberDanaBelanjaDefinitif || [];

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [id, setID] = useState("");
  const [title, setTitle] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState<any>(null);
  const [editData, setEditData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [btnAction, setBtnAction] = useState(false);

  /** Filter Search */
  let dataTable: any = search
    ? tmpRencanaBelanjaDefinitif.filter((item: any) => {
        const val = search.toLowerCase();
        return (
          (item.nama_snp !== null &&
            (item.nama_snp || "").toString().toLowerCase().includes(val)) ||
          (item.nama_kegiatan !== null &&
            (item.nama_kegiatan || "").toString().toLowerCase().includes(val))
        );
      })
    : tmpRencanaBelanjaDefinitif;
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
      title: "Nama SNP",
      dataIndex: "nama_snp",
      key: "nama_snp",
      width: "100%",
      onFilter: (value, record) => record.nama_snp.indexOf(value) === 0,
      sorter: (a, b) => a.nama_snp - b.nama_snp,
    },
    {
      title: "Kegiatan",
      key: "nama_kegiatan",
      dataIndex: "nama_kegiatan",
      width: "100%",
      onFilter: (value, record) => record.nama_kegiatan.indexOf(value) === 0,
      sorter: (a, b) => a.nama_kegiatan.localeCompare(b.nama_kegiatan),
    },
    {
      title: "Sub Kegiatan",
      key: "nama_sub_kegiatan",
      dataIndex: "nama_sub_kegiatan",
      width: "100%",
      onFilter: (value, record) =>
        record.nama_sub_kegiatan.indexOf(value) === 0,
      sorter: (a, b) => a.nama_sub_kegiatan.localeCompare(b.nama_sub_kegiatan),
    },
    {
      title: "Pelaksanaan",
      children: [
        {
          title: "Mulai",
          key: "bulan_pelaksanaan_start",
          width: "100%",
          render: (record) =>
            record.bulan_pelaksanaan_start &&
            moment(
              `${record.tahun}-${record.bulan_pelaksanaan_start}-01`,
            ).format("MMMM"),
        },
        {
          title: "Akhir",
          width: "100%",
          key: "bulan_pelaksanaan_end",
          render: (record) =>
            record.bulan_pelaksanaan_end &&
            moment(`${record.tahun}-${record.bulan_pelaksanaan_end}-01`).format(
              "MMMM",
            ),
        },
      ],
    },
    {
      title: "Sasaran",
      key: "kelompok_sasaran",
      width: "100%",
      render: (record) =>
        record.kelompok_sasaran.length &&
        record.kelompok_sasaran.map((item: any) => (
          <Tag key={`${record.id}${item}`} color="#00b1cc">
            {item}
          </Tag>
        )),
    },
    {
      title: "Indikator Output",
      children: [
        {
          title: "Output",
          key: "indikator_output",
          width: "100%",
          dataIndex: "indikator_output",
        },
        {
          title: "Target",
          width: "100%",
          key: "indikator_output_target",
          dataIndex: "indikator_output_target",
        },
        {
          title: "Satuan",
          width: "100%",
          key: "indikator_output_satuan",
          dataIndex: "indikator_output_satuan",
        },
      ],
    },
    {
      title: "Indikator Hasil",
      children: [
        {
          title: "Output",
          width: "100%",
          key: "indikator_hasil",
          dataIndex: "indikator_hasil",
        },
        {
          title: "Target",
          width: "100%",
          key: "indikator_hasil_target",
          dataIndex: "indikator_hasil_target",
        },
        {
          title: "Satuan",
          width: "100%",
          key: "indikator_hasil_satuan",
          dataIndex: "indikator_hasil_satuan",
        },
      ],
    },
    {
      title: "Total Rincian",
      key: "total_rincian",
      dataIndex: "total_rincian",
      fixed: "right",
      width: "100%",
      onFilter: (value, record) => record.total_rincian.indexOf(value) === 0,
      sorter: (a, b) => a.total_rincian - b.total_rincian,
      render: (total_rincian) => total_rincian || 0,
    },
    {
      title: "Total Disetujui",
      key: "total_disetujui",
      dataIndex: "total_disetujui",
      width: "100%",
      fixed: "right",
      onFilter: (value, record) => record.total_disetujui.indexOf(value) === 0,
      sorter: (a, b) => a.total_disetujui - b.total_disetujui,
      render: (total_disetujui) => total_disetujui || 0,
    },
    {
      title: "Aksi",
      key: "aksi",
      width: "100%",
      fixed: "right",
      render: (record) => (
        <Space>
          <ButtonTableDetail
            disabled={btnAction}
            tooltips="Rincian"
            onClick={() =>
              route.push({
                pathname: "/rencana/definitif/belanja/rincian",
                state: record,
              })
            }
          />
          {kodeRole === "kepala_madrasah" && (
            <>
              <ButtonTableEdit
                disabled={btnAction}
                onClick={() => handleEdit(record)}
              />
              <ButtonTableDelete
                disabled={btnAction}
                onClick={() => {
                  Modal.confirm({
                    title: "Perhatian",
                    content: "Yakin Hapus Data?",
                    onOk() {
                      return handleDelete(record);
                    },
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

  const handleTambah = () => {
    setOpenModal(true);
    setTitle("Tambah");
    setEditData(null);
    setID(uuidv4());
  };

  const handleEdit = (record: any) => {
    setOpenModal(true);
    setTitle("Edit");
    setID(record.id);
    setEditData(record);
  };

  const handleDelete = async (record: any) => {
    const rencanaKegiatanDefinitif = tmpRencanaBelanjaDefinitif.filter(
      (item: any) => !item.id.includes(record.id),
    );
    try {
      await deleteRencanaKegiatanDefinitif(record.id);
      notifAlert({
        type: "success",
        description: "Penghapusan Data Belanja Definitif Berhasil",
      });
      setTimeout(() => {
        dispatch(setStore({ rencanaKegiatanDefinitif }));
      }, 100);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = async (values: any) => {
    setLoading(true);
    const namaSnp = tmpStandarPendidikan.filter(
      (item: any) => item.kode === values.standarPendidikan,
    );
    const namaKegiatan = tmpKegiatan.filter(
      (item: any) => item.kegiatan.kode === values.kegiatan,
    );
    const namaSubKegiatan = tmpSubKegiatan.filter(
      (item: any) => item.kode === values.subKegiatan,
    );
    const payload = {
      id: id,
      tahun: auth.isTahun,
      kode_snp: values.standarPendidikan,
      nama_snp: namaSnp[0].nama,
      kode_kegiatan: values.kegiatan,
      nama_kegiatan: namaKegiatan[0].kegiatan.nama,
      kode_sub_kegiatan: values.subKegiatan,
      nama_sub_kegiatan: namaSubKegiatan[0].nama,
      bulan_pelaksanaan_start: moment(values.waktuPelaksanaan[0]).format("M"),
      bulan_pelaksanaan_end: moment(values.waktuPelaksanaan[1]).format("M"),
      madrasah_id: auth.madrasah.id,
      nama_madrasah: auth.madrasah.nama,
      nsm_madrasah: auth?.madrasah?.nsm,
      jenjang_madrasah: auth?.madrasah?.jenjang?.kode,
      kode_level_ppk: auth?.madrasah?.nsm,
      kantor_kabkota_id: auth?.madrasah?.kantor_kabkota_id,
      kantor_provinsi_id: auth?.madrasah?.kantor_provinsi_id,
      kantor_pusat_id: auth?.madrasah?.kantor_pusat_id,
      nama_kantor_kabkota: auth?.kantor_kabkota,
      nama_kantor_provinsi: auth?.kantor_provinsi,
      nama_kantor_pusat: auth?.kantor_pusat,
      kode_kabkota: auth?.madrasah?.kode_kabkota,
      kode_provinsi: auth?.madrasah?.kode_provinsi,
      kelompok_sasaran: values.kelompokSasaran,
      indikator_output: values.indikatorOutput,
      indikator_output_target: values.outputTarget,
      indikator_output_satuan: values.outputSatuan,
      indikator_hasil: values.indikatorHasil,
      indikator_hasil_target: values.hasilTarget,
      indikator_hasil_satuan: values.hasilSatuan,
      tag_sumber_dana: values.tagSumberDana,
    };
    if (title === "Tambah") {
      // const rencanaKegiatanIndikatif = [...tmpRencanaBelanjaDefinitif, payload]; //offline mode
      try {
        const tmpData = await postRencanaKegiatanDefinitif(payload);
        const rencanaKegiatanDefinitif = [
          ...tmpRencanaBelanjaDefinitif,
          tmpData,
        ];
        notifAlert({
          type: "success",
          description: "Data belanja definitif berhasil disimpan",
        });
        setTimeout(() => {
          dispatch(setStore({ rencanaKegiatanDefinitif }));
        }, 100);
      } catch (error) {
        console.log(error);
      }
    } else {
      const filterRencanaBelanjaDefinitif = tmpRencanaBelanjaDefinitif.filter(
        (item: any) => !item.id.includes(id),
      );
      try {
        const tmpEdit = await editRencanaKegiatanDefinitif(payload);
        const rencanaKegiatanDefinitif = [
          ...filterRencanaBelanjaDefinitif,
          tmpEdit,
        ];
        notifAlert({
          type: "success",
          description: "Data belanja definitif berhasil disimpan",
        });
        setTimeout(() => {
          dispatch(setStore({ rencanaKegiatanDefinitif }));
        }, 100);
      } catch (error) {
        console.log(error);
      }
    }
    setLoading(false);
    setOpenModal(false);
  };

  const handleExport = () => {
    setLoading(true);
    try {
      let xls = tmpRencanaBelanjaDefinitif.map((item: any) => {
        let tmpSasaran: any = "";
        item.kelompok_sasaran.length &&
          item.kelompok_sasaran.map((item: any) => (tmpSasaran += `${item},`));

        return {
          NAMA_SNP: item.nama_snp,
          KEGIATAN: item.nama_kegiatan,
          SUB_KEGIATAN: item.nama_sub_kegiatan,
          PELAKSANAAN_MULAI: moment(
            `${item.tahun}-${item.bulan_pelaksanaan_start}-01`,
          ).format("MMMM"),
          PELAKSANAAN_AKHIR: moment(
            `${item.tahun}-${item.bulan_pelaksanaan_end}-01`,
          ).format("MMMM"),
          KELOMPOK_SASARAN: tmpSasaran,
          INDIKATOR_OUTPUT: item.indikator_output,
          INDIKATOR_OUTPUT_TARGET: item.indikator_output_target,
          INDIKATOR_OUTPUT_SATUAN: item.indikator_output_satuan,
          INDIKATOR_HASIL: item.indikator_hasil,
          INDIKATOR_HASIL_TARGET: item.indikator_hasil_target,
          INDIKATOR_HASIL_SATUAN: item.indikator_hasil_satuan,
          TOTAL_RINCIAN: item.total_rincian,
          TOTAL_DISETUJUI: item.total_disetujui,
        };
      });
      ExportToExcel(xls, "daftar-belanja-definitif");
      notifAlert({ type: "success", description: "Data berhasil di export" });
    } catch (error) {
      notifAlert({ type: "error", description: "Data Gagal di export" });
    }
    setLoading(false);
  };

  return (
    <>
      <BreadCrumb routes={itemBreadcrumb} title="Rencana Belanja Definitif" />
      <HeaderBelanja data={tmpRencanaRekapSumberDanaBelanjaDefinitif} />
      <div className="m-5 p-5 bg-white shadow-md rounded">
        <div className="mb-4">
          <NotifMessage
            tanggalErkam={tmpRencanaTanggal}
            module="belanjaDefinitif"
            setAction={(action: boolean) => setBtnAction(action)}
          />
        </div>
        <div className="mb-4 flex justify-end">
          <div className="mr-4">
            <Space size={[8, 8]} wrap>
              {kodeRole === `kepala_madrasah` && (
                <ButtonTambah onClick={handleTambah} disabled={btnAction} />
              )}
              <ButtonDetail
                title="Rincian"
                disabled={btnAction}
                onClick={() => route.push("/rencana/definitif/belanja/rincian")}
              />
              <ButtonExport
                title="Export"
                loading={loading}
                onClick={handleExport}
              />
              <ButtonLog
                onClick={() => route.push("/rencana/definitif/belanja/logs")}
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
      <ModalFormAction
        title={title}
        editData={editData}
        handleSave={handleSave}
        openModal={openModal}
        hanldeClose={() => {
          setOpenModal(false);
          setEditData(null);
          setID("");
        }}
      />
    </>
  );
};

export default BelanjaDefinitif;
