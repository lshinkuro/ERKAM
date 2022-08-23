/** @format */
import { StoreActions } from "../actionsName";
type storeParams = {
  dataStore: any[];
  periodeTahunActive: any[];
  profile: any[];
  role: any[];
  roleUser: any[];
  provinsi: any[];
  kabkota: any[];
  kecamatan: any[];
  kelurahan: any[];
  rekeningBelanja: any[];
  levelPPK: any[];
  bank: any[];
  tipePenerima: any[];
  tipeKas: any[];
  metodePembayaran: any[];
  sumberDana: any[];
  penerimaRekening: any[];
  stafMadrasah: any[];
  snp: any[];
  kegiatan: any[];
  subKegiatan: any[];
  penggunaanBos: any[];
  kategoriKomponenBiaya: any[];
  komponenBiaya: any[];
  satuan: any[];
  kelompokSasaran: any[];
  users: any[];
  rencanaKegiatanIndikatif: any[];
  rencanaKegiatanDefinitif: any[];
  rencanaRincianKegiatanIndikatif: any[];
  rencanaRincianKegiatanDefinitif: any[];
  rencanaPendapatanIndikatif: any[];
  rencanaPendapatanDefinitif: any[];
  rencanaRekapSumberDanaBelanja: any[];
  rencanaRekapSumberDanaBelanjaDefinitif: any[];
  rencanaTanggal: any[];
  pajak: any[];
  tahun: any[];
  jenisBelanja: any[];
  kategoriBelanja: any[];
  tipePencairan: any[];
  jenisTahapan: any[];
  jenjang: any[];
  // rencanaRincianKegiatanDropdown: any[];
  laporanApbm: any[];
  laporanRapbmRekap: any[];
  laporanApbmDashboard: any[];
  laporanRapbmDashboard: any[];
  kegiatanBop: any[];
  realisasiUploadSpp: any[];
  realisasiPindahBuku: any[];
  realisasiPengembalianDana: any[];
  realisasiPendapatan: any[];
  realisasiPendapatanHeader: any;
  realisasiPencairanPaguDefinitif: any[];
  realisasiPajak: any[];
  realisasiPajakDetail: any[];
  realisasiOutputKegiatan: any[];
  realisasiBiaya: any[];
  realisasiBiayaDetail: any[];
  realisasiBiayaLaporanKeuangan: any[];
};

const initialStoreState: storeParams = {
  dataStore: [],
  periodeTahunActive: [],
  profile: [],
  role: [],
  roleUser: [],
  provinsi: [],
  kabkota: [],
  kecamatan: [],
  kelurahan: [],
  rekeningBelanja: [],
  levelPPK: [],
  bank: [],
  tipePenerima: [],
  tipeKas: [],
  metodePembayaran: [],
  sumberDana: [],
  penerimaRekening: [],
  stafMadrasah: [],
  snp: [],
  kegiatan: [],
  subKegiatan: [],
  penggunaanBos: [],
  kategoriKomponenBiaya: [],
  komponenBiaya: [],
  satuan: [],
  kelompokSasaran: [],
  users: [],
  rencanaKegiatanIndikatif: [],
  rencanaKegiatanDefinitif: [],
  rencanaRincianKegiatanIndikatif: [],
  rencanaRincianKegiatanDefinitif: [],
  rencanaPendapatanIndikatif: [],
  rencanaPendapatanDefinitif: [],
  rencanaRekapSumberDanaBelanja: [],
  rencanaRekapSumberDanaBelanjaDefinitif: [],
  rencanaTanggal: [],
  pajak: [],
  tahun: [],
  jenisBelanja: [],
  kategoriBelanja: [],
  tipePencairan: [],
  jenisTahapan: [],
  jenjang: [],
  // rencanaRincianKegiatanDropdown: [],
  kegiatanBop: [],
  realisasiUploadSpp: [],
  realisasiPindahBuku: [],
  realisasiPengembalianDana: [],
  realisasiPendapatan: [],
  realisasiPendapatanHeader: {},
  realisasiPencairanPaguDefinitif: [],
  realisasiPajak: [],
  realisasiPajakDetail: [],
  laporanApbm: [],
  laporanRapbmRekap: [],
  laporanApbmDashboard: [],
  laporanRapbmDashboard: [],
  realisasiOutputKegiatan: [],
  realisasiBiaya: [],
  realisasiBiayaDetail: [],
  realisasiBiayaLaporanKeuangan: [],
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const storeReducers = (state = initialStoreState, action): any => {
  switch (action.type) {
    case StoreActions.SET_STORE:
      return {
        ...state,
        ...action.data,
      };

    case StoreActions.SET_TAHUN_PERIODE_ACTIVE:
      return {
        ...state,
        periodeTahunActive: action.data,
      };

    // case StoreActions.SET_PROFILE:
    //   return {
    //     ...state,
    //     profile: action.data,
    //   };

    // case StoreActions.SET_ROLE:
    //   return {
    //     ...state,
    //     role: action.data,
    //   };
    // case StoreActions.SET_ROLE_USER:
    //   return {
    //     ...state,
    //     roleUser: action.data,
    //   };
    // case StoreActions.SET_PROVINSI:
    //   return {
    //     ...state,
    //     provinsi: action.data,
    //   };
    // case StoreActions.SET_KABKOTA:
    //   return {
    //     ...state,
    //     kabkota: action.data,
    //   };
    // case StoreActions.SET_KECAMATAN:
    //   return {
    //     ...state,
    //     kecamatan: action.data,
    //   };
    // case StoreActions.SET_KELURAHAN:
    //   return {
    //     ...state,
    //     kelurahan: action.data,
    //   };
    case StoreActions.CLEAR_STORE:
      return initialStoreState;
    default:
      return state;
  }
};

export default storeReducers;
