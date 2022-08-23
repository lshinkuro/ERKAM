/** @format */

import React, { useState, useEffect } from "react";
import { BreadCrumb } from "../../../../../components";
import { useHistory, useLocation } from "react-router-dom";
import {
  Form,
  Select,
  Descriptions,
  Tag,
  Table,
  Space,
  Modal,
  Input,
  InputNumber,
  Button,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import InputSearch from "../../../../../components/InputSearch";
import {
  ButtonExport,
  ButtonLog,
  ButtonTableApproval,
  ButtonTableDelete,
  ButtonTableEdit,
} from "../../../../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import "moment/locale/id";
import { formatRupiah, uuidv4 } from "../../../../../utils/helper";
import ModalKomponen from "../../../PaguInd/Belanja/Component/ModalKomponen";
import ModalSumberDana from "../../../PaguInd/Belanja/Component/ModalSumberDana";
import ModalApproval from "../../../PaguInd/Belanja/Component/ModalApproval";
import ModalAkb from "../../../PaguInd/Belanja/Component/ModalAkb";
import notifAlert from "../../../../../components/NotifAlert";
import FilterRincian from "../../../PaguInd/Belanja/Component/FilterRincian";
import DescriptionRincian from "../../../PaguInd/Belanja/Component/DescriptionRincian";

import { setStore } from "../../../../../redux/actions";
import EditableCell from "../../../PaguInd/Belanja/Rincian/EditTableCell";
import {
  deleteRencanaRincianKegiatanDefinitif,
  editRencanaRincianKegiatanDefinitif,
  postRencanaRincianKegiatanDefinitif,
} from "../../../../../services/v2/planningservice/rencanakegiatandefinitif";
import { getReferenceAll } from "../../../../../services/v2/referenceservice";
import { ExportToExcel } from "../../../../../components/Export/ExportToExcel";
import { getPlanningAll } from "../../../../../services/v2/planningservice";

const RincianBelanjaDefinitif = () => {
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Rencana" },
    { path: "/", breadcrumbName: "Pagu Definitif" },
    { path: "/", breadcrumbName: "Belanja" },
    { path: "/", breadcrumbName: "Rincian" },
  ];
  const route = useHistory();
  const dispatch = useDispatch();
  const [search, setSearch] = useState<any>(null);
  const [form] = Form.useForm();
  const [formTable] = Form.useForm();
  const store = useSelector((state: any) => state.store);
  const auths = useSelector((state: any) => state.auth);
  const auth = auths.data;
  const kodeRole = auth?.kode_role;
  const location = useLocation();
  const tmpRencana: any = location.state || null;
  const listMoment = moment.monthsShort();

  const tmpPajak = store.pajak || [];
  const tmpTipePencairan = store.tipePencairan || [];
  const tmpSatuan = store.satuan || [];
  const tmpJenisBelanja = store.jenisBelanja || [];
  const tmpRencanaBelanjaDefinitif = store.rencanaKegiatanDefinitif || [];
  // const tmpRefKomponenBiaya = store.komponenBiaya || [];
  const tmpRincianBelanjaDefinitif =
    store.rencanaRincianKegiatanDefinitif || [];
  const tmpRekapSumberDana = store.rencanaRekapSumberDanaBelanjaDefinitif || [];

  /** data Tambah Rincian */
  const [tmpTambahKomponen, setTambahKomponen] = useState<any>(null);
  const [listKoefisien, setListKoefisien] = useState<any>({
    koef1Jumlah: 1,
    koef2Jumlah: 0,
    koef3Jumlah: 0,
    koef4Jumlah: 0,
    koef1Satuan: null,
    koef2Satuan: null,
    koef3Satuan: null,
    koef4Satuan: null,
  });
  const [tambahAkb, setTambahAkb] = useState<any>(null);
  const [alokasiPendapatan, setAlokasiPendapatan] = useState<any>([]);
  const [listAkb, setListAkb] = useState<any>(null);
  const [listSumberDana, setListSumberDana] = useState<any>(null);
  const [dataApproval, setDataApproval] = useState<any>(null);

  const [tambahTipePencairan, setTambahTipePencairan] = useState(null);
  const [tambahJenisBelanja, setTambahJenisBelanja] = useState<any>(null);
  const [tambahPajak, setTambahPajak] = useState<any>(null);
  const [id, setID] = useState<any>(null);
  const [editSumberDana, setEditSumberDana] = useState<any>([]);
  /** dataEdit Rincian */
  const [disabledSaveEdit, setDisabledSaveEdit] = useState(false);
  const [titleModalKomponen, setTitleModalKomponen] = useState("");
  const [tambahKeterangan, setTambahKeterangan] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [openModalKomponen, setOpenModalKomponen] = useState(false);
  const [openModalSumberDana, setOpenModalSumberDana] = useState(false);
  const [openModalAKB, setOpenModalAKB] = useState(false);
  const [openModalApproval, setOpenModalApproval] = useState(false);

  const [standarPendidikan, setStandarPendidikan] = useState<any>(null);
  const [kegiatan, setKegiatan] = useState<any>(null);
  const [subKegiatan, setSubKegiatan] = useState<any>(null);
  const [editingKey, setEditingKey] = useState("");
  const [tmpRefKomponenBiaya, setTmpRefKomponenBiaya] = useState<any>([]);

  const getData = async () => {
    setLoading(true);
    const refKomponenBiaya = store.komponenBiaya || [];
    if (refKomponenBiaya.length) {
      setTmpRefKomponenBiaya(refKomponenBiaya);
    } else {
      const komponenBiaya = await getReferenceAll("komponen-biaya", {
        tahun: auth.isTahun,
        kode_provinsi: auth.madrasah.kode_provinsi,
        kode_kabkota: auth.madrasah.kode_kabkota,
      });
      setTmpRefKomponenBiaya(komponenBiaya);
      setTimeout(() => {
        dispatch(setStore({ komponenBiaya }));
      }, 100);
    }
    setLoading(false);
  };

  let tmpDataBelanja: any = null;

  standarPendidikan &&
    kegiatan &&
    subKegiatan &&
    tmpRencanaBelanjaDefinitif.length &&
    tmpRencanaBelanjaDefinitif
      .filter(
        (item: any) =>
          item.kode_snp === standarPendidikan &&
          item.kode_kegiatan === kegiatan &&
          item.kode_sub_kegiatan === subKegiatan,
      )
      .map((item: any) => (tmpDataBelanja = { ...item }));

  const tmpDataRincian =
    (standarPendidikan &&
      kegiatan &&
      subKegiatan &&
      tmpRincianBelanjaDefinitif.filter(
        (item: any) =>
          item.rencanaKegiatan.kode_snp === standarPendidikan &&
          item.rencanaKegiatan.kode_kegiatan === kegiatan &&
          item.rencanaKegiatan.kode_sub_kegiatan === subKegiatan,
      )) ||
    [];

  let dataTable: any = search
    ? tmpDataRincian.filter((item: any) => {
        const val = search.toLowerCase();
        return (
          (item.komponenBiayaNama !== null &&
            (item.komponenBiayaNama || "")
              .toString()
              .toLowerCase()
              .includes(val)) ||
          (item.nama_kegiatan !== null &&
            (item.nama_kegiatan || "").toString().toLowerCase().includes(val))
        );
      })
    : tmpDataRincian;

  dataTable = dataTable.map((item: any) => {
    return { ...item, key: item.id };
  });

  /** Filter Data untuk filter select **/
  let filterDataSnp: any = [];
  let filterDataKegiatan: any = [];
  let filterDataSubKegiatan: any = [];
  tmpRencanaBelanjaDefinitif.length &&
    // eslint-disable-next-line array-callback-return
    tmpRencanaBelanjaDefinitif.map((item: any) => {
      filterDataSnp.push(item.kode_snp);
      filterDataKegiatan.push(item.kode_kegiatan);
      filterDataSubKegiatan.push(item.kode_sub_kegiatan);
    });
  const tmpStandarPendidikan =
    store.snp.filter((item: any) => filterDataSnp.includes(item.kode)) || [];
  const tmpKegiatan =
    store.kegiatan.filter((item: any) =>
      filterDataKegiatan.includes(item.kode_kegiatan),
    ) || [];
  const tmpSubKegiatan =
    store.subKegiatan.filter((item: any) =>
      filterDataSubKegiatan.includes(item.kode),
    ) || [];

  /** Filter Set Data  **/
  useEffect(() => {
    if (tmpRencana) {
      form.setFieldsValue({
        standarPendidikan: tmpRencana.kode_snp,
        kegiatan: tmpRencana.kode_kegiatan,
        subKegiatan: tmpRencana.kode_sub_kegiatan,
      });
      setStandarPendidikan(tmpRencana.kode_snp);
      setKegiatan(tmpRencana.kode_kegiatan);
      setSubKegiatan(tmpRencana.kode_sub_kegiatan);
    }
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tmpRencana]);

  useEffect(() => {
    countEditTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formTable.getFieldsValue()]);

  /** Filter Set Data Jika select berubah  **/
  const handleChangeSelect = (values: any, field: string) => {
    switch (field) {
      case "standarPendidikan":
        setStandarPendidikan(values);
        form.setFieldsValue({ kegiatan: null, subKegiatan: null });
        setKegiatan(null);
        break;
      case "kegiatan":
        setKegiatan(values);
        setSubKegiatan(null);
        form.setFieldsValue({ subKegiatan: null });
        break;
      case "subKegiatan":
        setSubKegiatan(values);
        break;
    }
  };

  /** handle Open Modal Komponen Biaya */
  const handleOpenKomponen = (action: string) => {
    setOpenModalKomponen(true);
    setTitleModalKomponen(action);
  };

  /** Reponse Komponen Biaya */
  const handleSaveKomponen = (values: any, action: any) => {
    if (action === "Tambah") {
      setTambahKomponen(values);
      setTambahKeterangan(null);
    } else {
      formTable.setFieldsValue({
        komponenBiayaNama: values.listKomponen.nama,
        hargaSatuan: values.hargaSatuan,
        kodeJenisBelanja: null,
        sumberDana: null,
        ketBiayaLain: null,
      });
      setTambahKomponen(values);
      setTambahJenisBelanja(null);
      // setListSumberDana(null);
      // setAlokasiPendapatan(null);
      changeValues();
    }
    setOpenModalKomponen(false);
  };

  /** Handle  */
  const handleKoefisien = (values: any, action: string) => {
    let tmpListKoefesien: any = {};
    switch (action) {
      case "koef1Satuan":
        tmpListKoefesien = {
          ...listKoefisien,
          koef1Satuan: values,
        };

        break;
      case "koef2Satuan":
        tmpListKoefesien = {
          ...listKoefisien,
          koef2Satuan: values,
        };
        break;
      case "koef3Satuan":
        tmpListKoefesien = {
          ...listKoefisien,
          koef3Satuan: values,
        };
        break;
      case "koef4Satuan":
        tmpListKoefesien = {
          ...listKoefisien,
          koef4Satuan: values,
        };
        break;
      case "koef1Jumlah":
        tmpListKoefesien = {
          ...listKoefisien,
          koef1Jumlah: values,
        };
        break;
      case "koef2Jumlah":
        tmpListKoefesien = {
          ...listKoefisien,
          koef2Jumlah: values,
        };
        break;
      case "koef3Jumlah":
        tmpListKoefesien = {
          ...listKoefisien,
          koef3Jumlah: values,
        };
        break;
      case "koef4Jumlah":
        tmpListKoefesien = {
          ...listKoefisien,
          koef4Jumlah: values,
        };
        break;
    }
    setListKoefisien(tmpListKoefesien);
  };

  /** handle Open Modal Sumber Dana */
  const handleOpenSumberDana = (action: string) => {
    if (action === "Tambah") {
      if (tambahPajak) {
        setOpenModalSumberDana(true);
        setTitleModalKomponen(action);
        setEditSumberDana([]);
      } else {
        notifAlert({ type: "error", description: "Anda belum memilih pajak" });
      }
    } else {
      setOpenModalSumberDana(true);
      setTitleModalKomponen(action);
    }
  };

  /** Reponse Save Sumber Dana*/
  const handleSaveSumberDana = (values: any, action: any) => {
    let tmpSumberDana: string = "";
    let tmpEdit: any = [];
    setAlokasiPendapatan(values);
    // eslint-disable-next-line array-callback-return
    values.map((item: any, i: number) => {
      let namaSumberDana: any = null;
      tmpRekapSumberDana
        .filter((val: any) => val.id === item.rencanaPendapatanId)
        .map((val: any) => (namaSumberDana = val.nama_kode_sumber_dana));
      const jumlah = item.jumlah;
      tmpEdit.push({
        sumberDana: item.rencanaPendapatanId,
        kuantitas: item.quantity,
      });
      tmpSumberDana +=
        i > 0
          ? `, ${namaSumberDana} : ${formatRupiah(jumlah)}`
          : `${namaSumberDana} : ${formatRupiah(jumlah)}`;
    });
    setListSumberDana(tmpSumberDana);
    if (action === "Edit") {
      setEditSumberDana(tmpEdit);
      formTable.setFieldsValue({ sumberDana: tmpSumberDana });
      changeValues();
    }
    setOpenModalSumberDana(false);
  };

  /** handle Open Modal AKB */
  const handleOpenAKB = (action: string) => {
    if (tambahPajak) {
      setOpenModalAKB(true);
      setTitleModalKomponen(action);
    } else {
      notifAlert({ type: "error", description: "Anda belum memilih pajak" });
    }
  };

  /** Reponse Save AKB */
  const handleSaveAKB = (values: any, action: any) => {
    let tmpAkb: string = "";
    // eslint-disable-next-line array-callback-return
    listMoment.map((item: any, index: number) => {
      let i = index + 1;
      let jumlah =
        (values[`jumlahBulan${i}`] && values[`jumlahBulan${i}`]) || 0;
      tmpAkb += i > 1 ? `, ${item} : ${jumlah}` : `${item} : ${jumlah}`;
    });

    setTambahAkb(tmpAkb);
    setListAkb(values);
    if (action === "Edit") {
      formTable.setFieldsValue({ akb: tmpAkb });
      changeValues();
    }
    setOpenModalAKB(false);
  };

  const pajakData = tmpPajak.find((item) => item.kode === tambahPajak) || null;

  const totalTarget =
    listKoefisien.koef4Jumlah > 0
      ? listKoefisien.koef4Jumlah *
        listKoefisien.koef3Jumlah *
        listKoefisien.koef2Jumlah *
        listKoefisien.koef1Jumlah
      : listKoefisien.koef3Jumlah > 0
      ? listKoefisien.koef3Jumlah *
        listKoefisien.koef2Jumlah *
        listKoefisien.koef1Jumlah
      : listKoefisien.koef2Jumlah > 0
      ? listKoefisien.koef2Jumlah * listKoefisien.koef1Jumlah
      : listKoefisien.koef1Jumlah > 0
      ? listKoefisien.koef1Jumlah
      : 1;

  /** Harga Satuan Fn Tambah **/
  const tmpHargaSatuan =
    (tmpTambahKomponen && tmpTambahKomponen.hargaSatuan) || 0;
  const hargaSatuan =
    (tambahPajak === "ppn" &&
      Math.round(tmpHargaSatuan * ((pajakData.koefisien + 100) / 100))) ||
    (tambahPajak === "termasukPajak" &&
      Math.round(tmpHargaSatuan * (100 / (pajakData.koefisien + 100)))) ||
    tmpHargaSatuan;
  /** Total Harga Fn Tambah **/
  const totalTambahHarga = hargaSatuan * totalTarget;

  let listSatuan: any = [];
  listKoefisien.koef1Satuan && listSatuan.push(listKoefisien.koef1Satuan);
  listKoefisien.koef2Satuan && listSatuan.push(listKoefisien.koef2Satuan);
  listKoefisien.koef3Satuan && listSatuan.push(listKoefisien.koef3Satuan);

  const tmpValidModalSumberDana = {
    tagSumberDana: tmpDataBelanja?.tag_sumber_dana,
    totalSaldo: totalTambahHarga,
    hargaSatuan: hargaSatuan,
    totalKuantitas: totalTarget,
    jenisPajak: tambahPajak,
  };

  const tmpValidModalAkb = {
    totalKuantitas: totalTarget,
    startMonth: tmpDataBelanja?.bulan_pelaksanaan_start,
    endMonth: tmpDataBelanja?.bulan_pelaksanaan_end,
  };

  const isEditing = (record: any) => record.key === editingKey;

  const handleApproval = (record: any) => {
    setDataApproval(record);
    setOpenModalApproval(true);
  };

  const handleDelete = async (record: any) => {
    try {
      await deleteRencanaRincianKegiatanDefinitif(record.id);
      notifAlert({
        type: "success",
        description: "Hapus data rincian kegiatan berhasil",
      });
      handleGetAllDefinitif();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveEdit = async () => {
    let filterTipePencairan: any = tmpTipePencairan.find(
      (item: any) => item.kode === tambahTipePencairan,
    );
    const jenisBelanjaData =
      tmpJenisBelanja.find((item) => item.kode === tambahJenisBelanja) || null;

    const payload = {
      ...listKoefisien,
      ...listAkb,
      id: id,
      koefPersenPajak: pajakData && pajakData.koefisien,
      kodeHarga: tmpTambahKomponen?.kodeHarga,
      rencanaKegiatanId: tmpDataBelanja?.id,
      kodeJenisBelanja: tambahJenisBelanja,
      namaJenisBelanja: jenisBelanjaData && jenisBelanjaData.nama,
      komponenBiayaHargaId:
        tmpTambahKomponen?.listKomponen?.komponen_biaya_harga_id,
      komponenBiayaNama: tmpTambahKomponen?.listKomponen?.nama,
      hargaSatuan: tmpHargaSatuan,
      totalKuantitas: totalTarget,
      jumlahTotal: totalTambahHarga,
      pajak: pajakData && pajakData.kode,
      tipePencairanId: filterTipePencairan.id,
      tipePencairanKode: filterTipePencairan.kode,
      tipePencairanNama: filterTipePencairan.nama,
      alokasiPendapatan: alokasiPendapatan,
      ketBiayaLain: tambahKeterangan,
    };

    try {
      await editRencanaRincianKegiatanDefinitif(payload);

      notifAlert({
        type: "success",
        description: "Data Berhasi di simpan",
      });
      handleGetAllDefinitif();
      handleClear();
    } catch (error) {
      console.log(error);
    }
    handleClear();
  };

  const handleClear = () => {
    setEditingKey("");
    setID(null);
    setAlokasiPendapatan([]);
    setTambahAkb(null);
    setListAkb(null);
    setTambahKomponen(null);
    setTambahJenisBelanja(null);
    setTambahKeterangan(null);
    setTambahPajak(null);
    setListSumberDana(null);
    setTambahTipePencairan(null);
    setEditSumberDana([]);
    setListKoefisien({
      koef1Jumlah: 1,
      koef2Jumlah: 0,
      koef3Jumlah: 0,
      koef4Jumlah: 0,
      koef1Satuan: null,
      koef2Satuan: null,
      koef3Satuan: null,
      koef4Satuan: null,
    });
  };

  const handleGetAllDefinitif = async () => {
    setLoading(true);
    try {
      const rencanaRincianKegiatanDefinitif = await getPlanningAll(
        "rencana-rincian-kegiatan-definitif",
        { tahun: auth.isTahun },
      );
      const rencanaKegiatanDefinitif = await getPlanningAll(
        "rencana/kegiatan-definitif",
        { tahun: auth.isTahun },
      );
      const rencanaRekapSumberDanaBelanjaDefinitif = await getPlanningAll(
        "rencana-rekap-sumber-dana-belanja-definitif",
        { tahun: auth.isTahun },
      );
      const dataTmp = {
        rencanaKegiatanDefinitif,
        rencanaRekapSumberDanaBelanjaDefinitif,
        rencanaRincianKegiatanDefinitif,
      };
      setTimeout(() => {
        dispatch(setStore(dataTmp));
      }, 100);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    let filterTipePencairan: any = tmpTipePencairan.find(
      (item: any) => item.kode === tambahTipePencairan,
    );
    const jenisBelanjaData =
      tmpJenisBelanja.find((item) => item.kode === tambahJenisBelanja) || null;

    const payload = [
      {
        ...listKoefisien,
        ...listAkb,
        id: id || uuidv4(),
        koefPersenPajak: pajakData && pajakData.koefisien,
        kodeHarga: tmpTambahKomponen?.kodeHarga,
        rencanaKegiatanId: tmpDataBelanja?.id,
        kodeJenisBelanja: tambahJenisBelanja,
        namaJenisBelanja: jenisBelanjaData && jenisBelanjaData.nama,
        komponenBiayaHargaId:
          tmpTambahKomponen?.listKomponen?.komponen_biaya_harga_id,
        komponenBiayaNama: tmpTambahKomponen?.listKomponen?.nama,
        hargaSatuan: tmpHargaSatuan,
        totalKuantitas: totalTarget,
        jumlahTotal: totalTambahHarga,
        pajak: pajakData && pajakData.kode,
        tipePencairanId: filterTipePencairan.id,
        tipePencairanKode: filterTipePencairan.kode,
        tipePencairanNama: filterTipePencairan.nama,
        alokasiPendapatan: alokasiPendapatan,
        ketBiayaLain: tambahKeterangan,
      },
    ];

    try {
      await postRencanaRincianKegiatanDefinitif(payload);

      notifAlert({
        type: "success",
        description: "Data Berhasi di simpan",
      });
      handleGetAllDefinitif();
      handleClear();
    } catch (error) {
      console.log(error);
    }
  };

  let disabledSave =
    tmpTambahKomponen &&
    listKoefisien.koef1Jumlah &&
    listKoefisien.koef1Satuan &&
    tambahJenisBelanja &&
    tambahPajak &&
    tambahTipePencairan &&
    alokasiPendapatan.length &&
    listAkb
      ? false
      : true;

  /**
   * Data untuk tabel children pertama
   */
  let columns: any = [
    {
      title: "Komponen",
      dataIndex: "komponenBiayaNama",
      name: "komponenBiayaNama",
      key: "komponenBiayaNama",
      inputType: "text",
      width: "300px",
      editable: true,
    },
    {
      title: "Keterangan Komponen Biaya",
      key: "ketBiayaLain",
      name: "ketBiayaLain",
      dataIndex: "ketBiayaLain",
      editable: true,
      width: 250,
    },
    {
      title: "Kode Akun",
      key: "kodeAkun",
      name: "kodeJenisBelanja",
      width: "300px",
      editable: true,
      render: (record) =>
        record.kodeJenisBelanja + "-" + record.namaJenisBelanja,
    },
    {
      title: "Koefisien 1",
      key: "koefisien1",
      name: "koefisien1",
      editable: true,
      children: [
        {
          title: "Target",
          width: 110,
          name: "koef1Jumlah",
          key: "koef1Jumlah",
          dataIndex: "koef1Jumlah",
          editable: true,
          render: (koef1Jumlah) => koef1Jumlah || "-",
        },
        {
          title: "Satuan",
          width: 110,
          name: "koef1Satuan",
          key: "koef1Satuan",
          dataIndex: "koef1Satuan",
          editable: true,
          render: (koef1Satuan) => koef1Satuan || "-",
        },
      ],
    },
    {
      title: "Koefisien 2",
      key: "koefisien2",
      name: "koefisien2",
      editable: true,
      children: [
        {
          title: "Target",
          width: 110,
          name: "koef2Jumlah",
          key: "koef2Jumlah",
          editable: true,
          dataIndex: "koef2Jumlah",
          render: (koef2Jumlah) => koef2Jumlah || "-",
        },
        {
          title: "Satuan",
          width: 110,
          key: "koef2Satuan",
          name: "koef2Satuan",
          editable: true,
          dataIndex: "koef2Satuan",
          render: (koef2Satuan) => koef2Satuan || "-",
        },
      ],
    },
    {
      title: "Koefisien 3",
      key: "koefisien3",
      name: "koefisien3",
      editable: true,
      children: [
        {
          title: "Target",
          width: 110,
          key: "koef3Jumlah",
          name: "koef3Jumlah",
          editable: true,
          dataIndex: "koef3Jumlah",
          render: (koef3Jumlah) => koef3Jumlah || "-",
        },
        {
          title: "Satuan",
          width: 110,
          name: "koef3Satuan",
          key: "koef3Satuan",
          inputType: "select",
          listInput: [{ kode: "test", name: "test", value: "test" }],
          editable: true,
          dataIndex: "koef3Satuan",
          render: (koef3Satuan) => koef3Satuan || "-",
        },
      ],
    },
    {
      title: "Koefisien 4",
      key: "koef4Jumlah",
      name: "koefisien4",
      editable: true,
      children: [
        {
          title: "Target",
          width: 110,
          editable: true,
          name: "koef4Jumlah",
          key: "koef4Jumlah",
          dataIndex: "koef4Jumlah",
          render: (koef4Jumlah) => koef4Jumlah || "-",
        },
        {
          title: "Satuan",
          width: 110,
          editable: true,
          key: "koef4Satuan",
          name: "koef4Satuan",
          dataIndex: "koef4Satuan",
          render: (koef4Satuan) => koef4Satuan || "-",
        },
      ],
    },
    {
      title: "Harga Satuan (Rupiah)",
      key: "hargaSatuan",
      name: "hargaSatuan",
      width: 210,
      editable: true,
      dataIndex: "hargaSatuan",
      render: (hargaSatuan) => formatRupiah(hargaSatuan),
    },
    {
      title: "Pajak",
      key: "pajak",
      name: "pajak",
      width: "200px",
      editable: true,
      dataIndex: "pajak",
      render: (pajak) =>
        tmpPajak.filter((item) => item.kode === pajak).map((item) => item.nama),
    },
    {
      title: "Total Harga (Rupiah)",
      key: "jumlahTotal",
      width: 220,
      name: "totalHarga",
      editable: true,
      dataIndex: "jumlahTotal",
      render: (jumlahTotal) => formatRupiah(jumlahTotal),
    },
    {
      title: "Sumber Dana",
      key: "sumberdana",
      width: 250,
      name: "sumberDana",
      editable: true,
      render: (record) =>
        record.alokasiPendapatan.length &&
        record.alokasiPendapatan.map((item: any) => (
          <div key={`div${record.id}`} className="flex justify-between">
            <div>{item.rencana_pendapatan.nama_sumber_dana}</div>
            <div>{formatRupiah(item.jumlah)}</div>
          </div>
        )),
    },
    {
      title: "Tipe Pencairan",
      key: "tipePencairanNama",
      width: 200,
      editable: true,
      name: "tipePencairan",
      dataIndex: "tipePencairanNama",
    },
    {
      title: "AKB",
      key: "akb",
      name: "akb",
      width: 250,
      editable: true,
      render: (record) => {
        return (
          <Descriptions layout="horizontal" size="small">
            {listMoment.map((item: any, i: number) => (
              <Descriptions.Item key={`des${record.id}-${i}`} label={item}>
                {record[`jumlahBulan${i + 1}`]}
              </Descriptions.Item>
            ))}
          </Descriptions>
        );
      },
    },
    {
      title: "Komentar",
      key: "komentar",
      name: "komentar",
      dataIndex: "komentar",
      width: 250,
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      width: 120,
      fixed: "right",
      align: "center",
      render: (status, record) => {
        let color: any =
          (status === "MENUNGGU" && "#ffca27") ||
          (status === "DITOLAK" && "#f44436") ||
          (status === "DISETUJUI" && "#008000");
        const editable = isEditing(record);
        return editable ? (
          <Button
            onClick={() => {
              setEditingKey("");
              handleClear();
            }}>
            Batal
          </Button>
        ) : (
          <Tag color={color}>{status}</Tag>
        );
      },
    },
    {
      title: "Aksi",
      key: "aksi",
      align: "center",
      width: 120,
      fixed: "right",
      render: (record) => {
        const editable = isEditing(record);
        return kodeRole === "kepala_madrasah" ? (
          <Space>
            <ButtonTableApproval onClick={() => handleApproval(record)} />
          </Space>
        ) : editable ? (
          <Button
            type="primary"
            disabled={disabledSaveEdit}
            onClick={handleSaveEdit}>
            Simpan
          </Button>
        ) : (
          <Space>
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
          </Space>
        );
      },
    },
  ];

  const mapColumns = (col) => {
    if (!col.editable) {
      return col;
    }

    const newCol = {
      ...col,
      onCell: (record: any) => ({
        record,
        dataIndex: col.name,
        name: col.name,
        title: col.title,
        tmpSatuan,
        tmpPajak,
        tmpTipePencairan,
        tmpTambahKomponen,
        tmpJenisBelanja,
        listKoefisien,
        listSatuan,
        hargaSatuan,
        totalTambahHarga,
        handleOpenKomponen: handleOpenKomponen,
        handleOpenSumberDana: handleOpenSumberDana,
        handleKoefisien: handleKoefisien,
        handleOpenAKB: handleOpenAKB,
        editing: isEditing(record),
      }),
    };
    if (col.children) {
      newCol.children = col.children.map((item: any) => mapColumns(item));
    }
    return newCol;
  };

  const mergedColumns = columns.map((item: any) => mapColumns(item));

  const handleEdit = (record: any & { key: React.Key }) => {
    let tmpListKomponen: any = null;
    let tmpAkb: string = "";
    let listAkb: any = {};
    listMoment.length &&
      // eslint-disable-next-line array-callback-return
      listMoment.map((item: any, index: number) => {
        let i = index + 1;
        let jumlah =
          (record[`jumlahBulan${i}`] && record[`jumlahBulan${i}`]) || 0;
        tmpAkb += i > 1 ? `, ${item} : ${jumlah}` : ` ${item} : ${jumlah}`;
        listAkb[`jumlahBulan${i}`] = record[`jumlahBulan${i}`] || 0;
      });
    setTambahAkb(tmpAkb);
    setListAkb(listAkb);
    setTambahPajak(record.pajak);
    let tmpSumDana: string = createListSumberDana(record.alokasiPendapatan);
    let edSumberDana = record.alokasiPendapatan.map((item: any, i: number) => {
      return {
        sumberDana: item.rencana_pendapatan.id,
        kuantitas: item.quantity,
      };
    });
    setListSumberDana(tmpSumDana);
    setEditSumberDana(edSumberDana);
    const tmpAlokasiEdit: any = record.alokasiPendapatan.map((item: any) => {
      return {
        rencanaPendapatanId: item.rencana_pendapatan.id,
        jumlah: item.jumlah,
        quantity: item.quantity,
        kodePajak: item.kode_pajak,
        jenisPajak: item.jenis_pajak,
      };
    });
    setAlokasiPendapatan(tmpAlokasiEdit);
    setListKoefisien({
      koef1Jumlah: record.koef1Jumlah,
      koef2Jumlah: record.koef2Jumlah,
      koef3Jumlah: record.koef3Jumlah,
      koef4Jumlah: record.koef4Jumlah,
      koef1Satuan: record.koef1Satuan,
      koef2Satuan: record.koef2Satuan,
      koef3Satuan: record.koef3Satuan,
      koef4Satuan: record.koef4Satuan,
    });
    setTambahTipePencairan(record.tipePencairanKode);
    setTambahJenisBelanja(record.kodeJenisBelanja);
    tmpRefKomponenBiaya
      .filter(
        (item: any) =>
          item.komponen_biaya_harga_id === record.komponenBiayaHargaId,
      )
      .map((item: any) => (tmpListKomponen = { ...item }));

    setTambahKomponen({
      kodeHarga: record.kodeHarga,
      hargaSatuan: record.hargaSatuan,
      listKomponen: tmpListKomponen,
    });

    formTable.setFieldsValue({
      ...record,
      tipePencairan: record.tipePencairanKode,
      akb: tmpAkb,
      sumberDana: tmpSumDana,
      totalHarga: record.totalKuantitas * record.hargaSatuan,
    });

    setEditingKey(record.key);
    setID(record.id);
  };

  const createListSumberDana = (alokasi: any) => {
    let tmpSumDana: string = "";
    alokasi.length &&
      // eslint-disable-next-line array-callback-return
      alokasi.map((item: any, i: number) => {
        tmpSumDana +=
          i > 0
            ? `, ${item.rencana_pendapatan.nama_sumber_dana} : ${formatRupiah(
                item.jumlah,
              )}`
            : `${item.rencana_pendapatan.nama_sumber_dana} : ${formatRupiah(
                item.jumlah,
              )}`;
      });
    return tmpSumDana;
  };

  const handleExport = () => {
    try {
      let xls = tmpDataRincian.map((item: any) => {
        let tmpAkb: string = "";
        listMoment.length &&
          // eslint-disable-next-line array-callback-return
          listMoment.map((items: any, index: number) => {
            let i = index + 1;
            let jumlah =
              (item[`jumlahBulan${i}`] && item[`jumlahBulan${i}`]) || 0;
            tmpAkb +=
              i > 1 ? `, ${items} : ${jumlah}` : ` ${items} : ${jumlah}`;
          });
        let tmpSumberDana: string = "";
        // eslint-disable-next-line array-callback-return
        item.alokasiPendapatan.map((items: any, i: number) => {
          tmpSumberDana +=
            i > 0
              ? `, ${items.rencana_pendapatan.nama_sumber_dana} : ${items.rencana_pendapatan.jumlah}`
              : `${items.rencana_pendapatan.nama_sumber_dana} : ${items.rencana_pendapatan.jumlah}`;
        });
        return {
          KOMPONEN: item.komponenBiayaNama,
          KETERANGAN_KOMPONEN_BIAYA: item.ketBiayaLain,
          KODE_AKUN: item.kodeJenisBelanja + " " + item.namaJenisBelanja,
          KOEFISIEN_1_JUMLAH: item.koef1Jumlah,
          KOEFISIEN_1_SATUAN: item.koef1Satuan,
          KOEFISIEN_2_JUMLAH: item.koef2Jumlah,
          KOEFISIEN_2_SATUAN: item.koef2Satuan,
          KOEFISIEN_3_JUMLAH: item.koef3Jumlah,
          KOEFISIEN_3_SATUAN: item.koef3Satuan,
          KOEFISIEN_4_JUMLAH: item.koef4Jumlah,
          KOEFISIEN_4_SATUAN: item.koef4Satuan,
          HARGA_SATUAN: item.hargaSatuan,
          PAJAK: item.pajak,
          TOTAL_HARGA: item.jumlahTotal,
          SUMBER_DANA: tmpSumberDana,
          TIPE_PENCAIRAN: item.tipePencairanNama,
          AKB: tmpAkb,
          KOMENTAR: item.komentar,
          STATUS: item.status,
        };
      });
      ExportToExcel(xls, "daftar-rincian-definitif");
      notifAlert({ type: "success", description: "Data berhasil di export" });
    } catch (error) {
      notifAlert({ type: "error", description: "Data Gagal di export" });
    }
  };

  const handleFormEditChange = (_, values: any) => {
    setListKoefisien(values);
    changeValues();
  };

  const changeValues = () => {
    const values: any = formTable.getFieldsValue();

    for (let obj in values) {
      switch (obj) {
        case "pajak":
          setTambahPajak(values.pajak);
          break;
        case "ketBiayaLain":
          setTambahKeterangan(values.ketBiayaLain);
          break;
        case "kodeJenisBelanja":
          setTambahJenisBelanja(values.kodeJenisBelanja);
          break;
        case "tipePencairan":
          setTambahTipePencairan(values.tipePencairan);
          break;
      }
    }
    let tmpButtonSave =
      tmpTambahKomponen &&
      tambahJenisBelanja &&
      values.koef1Jumlah &&
      values.koef1Satuan &&
      values.sumberDana &&
      values.akb
        ? false
        : true;
    setDisabledSaveEdit(tmpButtonSave);
  };

  const countEditTotal = () => {
    let pajakEdit = tmpPajak.find((item) => item.kode === tambahPajak);
    let totalKuantitasSumber = 0;
    alokasiPendapatan.length &&
      alokasiPendapatan.map((item) => (totalKuantitasSumber += item.quantity));

    const editTotalTarget =
      listKoefisien.koef4Jumlah > 0
        ? listKoefisien.koef4Jumlah *
          listKoefisien.koef3Jumlah *
          listKoefisien.koef2Jumlah *
          listKoefisien.koef1Jumlah
        : listKoefisien.koef3Jumlah > 0
        ? listKoefisien.koef3Jumlah *
          listKoefisien.koef2Jumlah *
          listKoefisien.koef1Jumlah
        : listKoefisien.koef2Jumlah > 0
        ? listKoefisien.koef2Jumlah * listKoefisien.koef1Jumlah
        : listKoefisien.koef1Jumlah > 0
        ? listKoefisien.koef1Jumlah
        : 1;

    if (totalKuantitasSumber !== editTotalTarget) {
      // console.log(totalKuantitasSumber + " " + editTotalTarget);
      formTable.setFieldsValue({
        sumberDana: null,
        akb: null,
      });
      setTambahAkb(null);
      changeValues();
    }
    /** Harga Satuan Fn Tambah **/
    const tmpHargaSatuan =
      (tmpTambahKomponen && tmpTambahKomponen.hargaSatuan) || 0;
    const hargaSatuan =
      (tambahPajak === "ppn" &&
        Math.round(tmpHargaSatuan * ((pajakEdit.koefisien + 100) / 100))) ||
      (tambahPajak === "termasukPajak" &&
        Math.round(tmpHargaSatuan * (100 / (pajakEdit.koefisien + 100)))) ||
      tmpHargaSatuan;
    /** Total Harga Fn Tambah **/
    const editTotalTambahHarga = hargaSatuan * editTotalTarget;
    formTable.setFieldsValue({
      totalHarga: editTotalTambahHarga,
    });
  };
  return (
    <>
      <BreadCrumb
        routes={itemBreadcrumb}
        title="Rincian Rencana Belanja Definitif"
        back={true}
        toBack={() => route.goBack()}
      />

      <FilterRincian
        form={form}
        tmpStandarPendidikan={tmpStandarPendidikan}
        standarPendidikan={standarPendidikan}
        tmpKegiatan={tmpKegiatan}
        kegiatan={kegiatan}
        tmpSubKegiatan={tmpSubKegiatan}
        handleChangeSelect={handleChangeSelect}
      />

      <DescriptionRincian
        title="Pagu Definitif"
        tmpDataBelanja={tmpDataBelanja}
      />

      <div className="m-5 p-5 bg-white shadow-md rounded">
        <div className="mb-4 flex justify-end">
          <div className="mr-4">
            <Space size={[8, 8]} wrap>
              <ButtonExport
                disabled={tmpDataRincian.length ? false : true}
                onClick={handleExport}
              />
              <ButtonLog
                disabled={!tmpDataBelanja}
                onClick={() =>
                  route.push({
                    pathname: "rincian/logs",
                    state: tmpDataBelanja?.id,
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
          <Form
            form={formTable}
            component={false}
            onValuesChange={handleFormEditChange}>
            <Table
              columns={mergedColumns}
              dataSource={dataTable}
              loading={loading}
              rowClassName="editable-row"
              scroll={{ x: "1300" }}
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              pagination={false}
              bordered
              summary={() =>
                tmpDataBelanja &&
                kodeRole !== "kepala_madrasah" &&
                !editingKey && (
                  <Table.Summary fixed={"bottom"}>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} key="tambahKomponen">
                        <Input
                          name="tambahKomponen"
                          key="itambahKomponen"
                          value={
                            tmpTambahKomponen &&
                            tmpTambahKomponen.listKomponen.nama
                          }
                          placeholder="Komponen Biaya"
                          disabled
                          suffix={
                            <Button
                              size="small"
                              type="primary"
                              icon={<PlusOutlined />}
                              onClick={() => handleOpenKomponen("Tambah")}
                            />
                          }
                        />
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} key="tambahKeterangan">
                        <Input
                          disabled={
                            tmpTambahKomponen &&
                            tmpTambahKomponen?.listKomponen.belanja_lain
                              ? false
                              : true
                          }
                          value={tambahKeterangan}
                          name="keteranganKomponen"
                          onChange={(e) =>
                            setTambahKeterangan(e.currentTarget.value)
                          }
                          placeholder="Keterangan Komponen Biaya"
                        />
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={2} key="tambahAkun">
                        <Select
                          key="tambahAkun"
                          placeholder="Kode Akun"
                          value={tambahJenisBelanja}
                          onChange={(e) => setTambahJenisBelanja(e)}
                          style={{ width: "100%" }}>
                          {tmpTambahKomponen &&
                            tmpJenisBelanja.length &&
                            tmpJenisBelanja
                              .filter((item: any) =>
                                tmpTambahKomponen.listKomponen.jenis_belanja.includes(
                                  item.kode,
                                ),
                              )
                              .map((item: any) => (
                                <Select.Option value={item.kode}>
                                  {item.kode}-{item.nama}
                                </Select.Option>
                              ))}
                        </Select>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={3} key="tambahKoe1target">
                        <InputNumber
                          min={1}
                          type="number"
                          value={listKoefisien && listKoefisien.koef1Jumlah}
                          key="itambahKoe1Target"
                          disabled={tmpTambahKomponen ? false : true}
                          placeholder="0"
                          onChange={(e) => handleKoefisien(e, "koef1Jumlah")}
                        />
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={4} key="tambahKoe1satuan">
                        <Select
                          key="itambahKoe1Satuan"
                          showSearch
                          placeholder="Satuan"
                          value={listKoefisien && listKoefisien.koef1Satuan}
                          disabled={tmpTambahKomponen ? false : true}
                          onChange={(e) => handleKoefisien(e, "koef1Satuan")}
                          style={{ width: "100%" }}>
                          {tmpSatuan.length &&
                            tmpSatuan
                              .sort((a, b) => a.nama.localeCompare(b.nama))
                              .map((item: any, i: number) => (
                                <Select.Option
                                  key={`tamk1${i}`}
                                  value={item.kode}>
                                  {item.nama}
                                </Select.Option>
                              ))}
                        </Select>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={5} key="tambahKoe2target">
                        <InputNumber
                          min={1}
                          type="number"
                          key="itambahKoe2Target"
                          value={listKoefisien && listKoefisien.koef2Jumlah}
                          disabled={
                            listKoefisien.koef1Jumlah > 0 &&
                            listKoefisien.koef1Satuan
                              ? false
                              : true
                          }
                          placeholder="0"
                          onChange={(e) => handleKoefisien(e, "koef2Jumlah")}
                        />
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={6} key="tambahKoe2satuan">
                        <Select
                          key="itambahKoe2Satuan"
                          showSearch
                          allowClear
                          placeholder="Satuan"
                          value={listKoefisien && listKoefisien.koef2Satuan}
                          disabled={listKoefisien.koef1Satuan ? false : true}
                          onChange={(e) => handleKoefisien(e, "koef2Satuan")}
                          style={{ width: "100%" }}>
                          {tmpSatuan.length &&
                            tmpSatuan
                              .filter(
                                (item: any) => !listSatuan.includes(item.kode),
                              )
                              .sort((a, b) => a.nama.localeCompare(b.nama))
                              .map((item: any, i: number) => (
                                <Select.Option
                                  key={`tamk2${i}`}
                                  value={item.kode}>
                                  {item.nama}
                                </Select.Option>
                              ))}
                        </Select>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={7} key="tambahKoe3target">
                        <InputNumber
                          min={1}
                          type="number"
                          value={listKoefisien && listKoefisien.koef3Jumlah}
                          disabled={
                            listKoefisien.koef2Jumlah > 0 &&
                            listKoefisien.koef2Satuan
                              ? false
                              : true
                          }
                          key="itambahKoe3Target"
                          placeholder="0"
                          onChange={(e) => handleKoefisien(e, "koef3Jumlah")}
                        />
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={8} key="tambahKoe3satuan">
                        <Select
                          key="itambahKoe3Satuan"
                          placeholder="Satuan"
                          showSearch
                          allowClear
                          value={listKoefisien && listKoefisien.koef3Satuan}
                          disabled={listKoefisien.koef2Satuan ? false : true}
                          onChange={(e) => handleKoefisien(e, "koef3Satuan")}
                          style={{ width: "100%" }}>
                          {tmpSatuan.length &&
                            tmpSatuan
                              .filter(
                                (item: any) => !listSatuan.includes(item.kode),
                              )
                              .sort((a, b) => a.nama.localeCompare(b.nama))
                              .map((item: any, i: number) => (
                                <Select.Option
                                  key={`tamk3${i}`}
                                  value={item.kode}>
                                  {item.nama}
                                </Select.Option>
                              ))}
                        </Select>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={9} key="tambahKoe4target">
                        <InputNumber
                          min={1}
                          type="number"
                          value={listKoefisien && listKoefisien.koef4Jumlah}
                          disabled={
                            listKoefisien.koef3Jumlah > 0 &&
                            listKoefisien.koef3Satuan
                              ? false
                              : true
                          }
                          key="itambahKoe4Target"
                          placeholder="0"
                          onChange={(e) => handleKoefisien(e, "koef4Jumlah")}
                        />
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={10} key="tambahKoe4satuan">
                        <Select
                          key="itambahKoe4Satuan"
                          showSearch
                          allowClear
                          placeholder="Satuan"
                          value={listKoefisien && listKoefisien.koef4Satuan}
                          disabled={listKoefisien.koef3Satuan ? false : true}
                          onChange={(e) => handleKoefisien(e, "koef4Satuan")}
                          style={{ width: "100%" }}>
                          {tmpSatuan.length &&
                            tmpSatuan
                              .filter(
                                (item: any) => !listSatuan.includes(item.kode),
                              )
                              .sort((a, b) => a.nama.localeCompare(b.nama))
                              .map((item: any, i: number) => (
                                <Select.Option
                                  key={`tamk4${i}`}
                                  value={item.kode}>
                                  {item.nama}
                                </Select.Option>
                              ))}
                        </Select>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={11} key="tambahHargaSatuan">
                        <InputNumber
                          key="inputtambahHargaSatuan"
                          style={{ width: "100%" }}
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          prefix="Rp."
                          disabled={true}
                          value={tmpHargaSatuan}
                          placeholder={"Harga Satuan"}
                        />
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={12} key="tambahPajak">
                        <Select
                          key="itambahpajak"
                          onChange={(e) => setTambahPajak(e)}
                          value={tambahPajak}
                          placeholder={
                            tmpTambahKomponen
                              ? "Pajak"
                              : "Komponen masih kosong"
                          }
                          style={{ width: "100%" }}>
                          {tmpTambahKomponen &&
                            tmpPajak.length &&
                            tmpPajak
                              .filter(
                                (item: any) =>
                                  ![
                                    "pph21",
                                    "pph22",
                                    "ppnTerhutang",
                                    "pph23",
                                  ].includes(item.kode),
                              )
                              .map((item: any, i: number) => (
                                <Select.Option
                                  key={`ipaj${i}`}
                                  value={item.kode}>
                                  {item.nama}
                                </Select.Option>
                              ))}
                        </Select>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={13} key="tambahTotalHarga">
                        <InputNumber
                          key="inputtambahTotalHarga"
                          style={{ width: "100%" }}
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          prefix="Rp."
                          value={totalTambahHarga}
                          disabled
                          placeholder={"Total Harga"}
                        />
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={14} key="tambahSumberDana">
                        <Input
                          name="tambahSumberDana"
                          key="itambahSumberDana"
                          value={listSumberDana}
                          placeholder={
                            tambahPajak ? "Sumber Dana" : "Pajak masih kosong"
                          }
                          disabled
                          suffix={
                            <Button
                              size="small"
                              type="primary"
                              icon={<PlusOutlined />}
                              onClick={() => handleOpenSumberDana("Tambah")}
                            />
                          }
                        />
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={15} key="tambahTipePencairan">
                        <Select
                          key="itambahTipePencairan"
                          value={tambahTipePencairan}
                          onChange={(e) => setTambahTipePencairan(e)}
                          placeholder="Tipe Pencairan"
                          style={{ width: "100%" }}>
                          {tmpTipePencairan.length &&
                            tmpTipePencairan.map((item: any, i: number) => (
                              <Select.Option key={`itp${i}`} value={item.kode}>
                                {item.nama}
                              </Select.Option>
                            ))}
                        </Select>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={16} key="tambahAkb">
                        <Input
                          name="tambahAkb"
                          key="itambahAkb"
                          value={tambahAkb}
                          placeholder={
                            tambahPajak ? "AKB" : "Sumber Dana Masih Kosong"
                          }
                          disabled
                          suffix={
                            <Button
                              size="small"
                              type="primary"
                              icon={<PlusOutlined />}
                              onClick={() => handleOpenAKB("Tambah")}
                            />
                          }
                        />
                      </Table.Summary.Cell>
                      <Table.Summary.Cell
                        index={17}
                        key="tambahKomentar"></Table.Summary.Cell>
                      <Table.Summary.Cell
                        index={18}
                        colSpan={2}
                        key="aksiTambah">
                        <Space>
                          <Button key="btnTambahCancel" onClick={handleClear}>
                            Batal
                          </Button>
                          <Button
                            key="btnTambahSave"
                            type="primary"
                            disabled={disabledSave}
                            onClick={handleSave}>
                            Simpan
                          </Button>
                        </Space>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                )
              }
            />
          </Form>
        </div>
      </div>

      <ModalKomponen
        openModal={openModalKomponen}
        title={titleModalKomponen}
        onClose={() => setOpenModalKomponen(!openModalKomponen)}
        saveKomponen={handleSaveKomponen}
      />

      <ModalSumberDana
        openModal={openModalSumberDana}
        validData={tmpValidModalSumberDana}
        editSumberDana={editSumberDana}
        title={titleModalKomponen}
        onClose={() => setOpenModalSumberDana(!openModalSumberDana)}
        saveSumberDana={handleSaveSumberDana}
      />

      <ModalAkb
        openModal={openModalAKB}
        validData={tmpValidModalAkb}
        title={titleModalKomponen}
        onClose={() => setOpenModalAKB(!openModalAKB)}
        saveAKB={handleSaveAKB}
        editAkb={tambahAkb}
      />

      <ModalApproval
        openModal={openModalApproval}
        title="Approval Rencana Rincian Kegiatan Definitif"
        data={dataApproval}
        onReload={handleGetAllDefinitif}
        onClose={() => setOpenModalApproval(!openModalApproval)}
      />
    </>
  );
};

export default RincianBelanjaDefinitif;
