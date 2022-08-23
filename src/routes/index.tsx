/** @format */

import { lazy } from "react";
import {
  /** Dashboard **/
  Dashboard,
  EDM,

  /** Settings User dan Madrasah **/
  Profile,
  EditProfile,
  EditProfileMadrasah,
  ProfileMadrasah,

  /** Pengaturan **/
  RekeningBank,
  StaffMadrasah,
  Penerima,
  Madrasah,
  Pusat,
  Prov,
  KabKota,
  Pengawas,
  Role,
  /** Referensi **/
  Snp,
  Satuan,
  Pajak,
  Tahun,
  KegiatanBop,
  KegiatanBos,
  Kegiatan,
  SubKegiatan,
  AlokasiBop,
  AlokasiBos,
  Jenisbelanja,

  /** Rencana **/

  /** Pagu Indikatif Pendapatan  **/
  PaguIndikatifPendapatan,
  LogsPaguIndikatifPendapatan,

  /** Pagu Indikatif Belanja  **/
  PaguIndikatifBelanja,
  LogsPaguIndikatifBelanja,
  PaguIndikatifBelanjaRincian,
  LogsPaguIndikatifBelanjaRincian,

  /** Pagu Definitif Pendapatan  **/
  PaguDefinitifPendapatan,
  PaguDefinitifPendapatanLogs,

  /** Pagu Definitif Belanja  **/
  PaguDefinitifBelanja,
  LogsPaguDefinitifBelanja,
  PaguDefinitifBelanjaRincian,
  LogsPaguDefinitifBelanjaRincian,

  /** Realisasi **/
  /** Realisasi => Pendapatan **/
  RealisasiPendapatan,
  LogRealisasiPendapatan,

  /** Realisasi => Pindah Buku **/
  PindahBuku,
  LogsPindahBuku,

  /** Realisasi => Pengembalian Dana **/
  PengembalianDana,
  LogsPengembalianDana,

  /** Realisasi => Output Kegiatan **/
  OutputKegiatan,
  RincianOutputKegiatan,
  LogsRincianOutputKegiatan,
  /** Check Lagi Beb **/

  // DataReferensiRekening,
  SumberDanaMadrasah,
  KomponenBiaya,
  KomponenBiayaAdd,
  RekeningBelanja,

  // SubJenisbelanja,
  ReferensiMadrasah,
  KodeRegistrasiMadrasah,

  //Perencanaan
  // ApprovalValidasi,
  // LogsApproval,
  // RencanaKegiatanDanAnggaran,
  // ListRincianKegiatanDanAnggaran,
  // AddRincianKegiatanDanAnggaran,
  // LogsRincianKegiatanDanAnggaran,
  // EditRincianKegiatanDanAnggaran,
  // RencanaAnggaran,

  // ListRincianBelanjaDefinitif,

  //check lagi
  PengeluaranKegiatan,
  LogsPengeluaranKegiatan,
  LogsPengeluaranKegiatanNotaId,
  PengeluaranPajak,
  LogsPengeluaranPajak,

  //Laporan
  //Laporan Rencana
  LaporanErkam,
  // RkaklKonsolidasi,
  RkaklKonsolidasiMin,
  Apbm,

  //Laporan Penatausahaan
  BukuKasUmum,
  BukuKasUmumKonsolidasiMin,
  BukuPembantuPajak,
  BukuKasPembantu,
  PertanggungJawaban,
  //Laporan Realisasi
  LaporanRealisasi,
  LaporanRapbm,
  LaporanRincianKeuangan,
  LaporanOutputKegiatan,
  //Laporan Calk
  LaporanCalk,

  //Pengaturan
  TanggalRKAM,
  PPK,
  SetPPK,

  /** usulan dihapus  ***/
  SetKomponenBiayaHarga,
  TahapPencairan,
  LaporanRkakl,
  // check Lagi
  Pendapatan,
  AnggaranKasBelanja,

  //komentar
  Komentar,
} from "../pages";

import ListNota from "../pages/Realisasi/PengeluaranKegiatan/Nota";

const Page404 = lazy(() => import("../pages/404"));

const Blank = lazy(() => import("../pages/Blank"));

/**
 * ⚠ These are internal routes!
 * They will be rendered inside the app, using the default `containers/Layout`.
 * If you want to add a route to, let's say, a landing page, you should add
 * it to the `App`'s router, exactly like `Login`, `CreateAccount` and other pages
 * are routed.
 *
 * If you're looking for the links rendered in the SidebarContent, go to
 * `routes/sidebar.js`
 */
const routes = [
  {
    path: "dashboard/", // Done
    component: Dashboard, //
  },
  {
    path: "edm", // Done
    component: EDM, //
  },
  //Profile User
  {
    path: "profil/akun", // Done
    component: Profile, //
  },
  {
    path: "profil/edit", // Done
    component: EditProfile, //
  },

  //Profile Madrasah
  {
    path: "profile-madrasah", // Done
    component: ProfileMadrasah,
  },
  {
    path: "profile-madrasah/edit", // Done
    component: EditProfileMadrasah,
  },

  //Pengaturan
  /**  Management User **/
  {
    path: "pengaturan/management-user/madrasah", // Done
    component: Madrasah,
  },
  {
    path: "pengaturan/management-user/pengawas", // Done
    component: Pengawas,
  },
  {
    path: "pengaturan/management-user/role", // Done
    component: Role,
  },
  {
    path: "pengaturan/management-user/staff-madrasah", // Done
    component: StaffMadrasah,
  },
  {
    path: "pengaturan/rekening-bank", // Done
    component: RekeningBank,
  },
  {
    path: "pengaturan/penerima",
    component: Penerima,
  },

  /**  Referensi **/
  /**  SNP **/
  {
    path: "referensi/satuan",
    component: Satuan,
  },
  {
    path: "referensi/pajak",
    component: Pajak,
  },

  /**  Rencana **/
  /**  Rencana => Pagu Indikatif Pendapatan **/
  {
    path: "rencana/indikatif/pendapatan",
    component: PaguIndikatifPendapatan,
  },
  {
    path: "rencana/indikatif/pendapatan/logs",
    component: LogsPaguIndikatifPendapatan,
  },

  /**  Rencana => Pagu Indikatif Belanja **/
  {
    path: "rencana/indikatif/belanja/rincian",
    component: PaguIndikatifBelanjaRincian,
  },
  {
    path: "rencana/indikatif/belanja",
    component: PaguIndikatifBelanja,
  },
  {
    path: "rencana/indikatif/belanja/logs",
    component: LogsPaguIndikatifBelanja,
  },
  {
    path: "rencana/indikatif/belanja/rincian/logs",
    component: LogsPaguIndikatifBelanjaRincian,
  },

  /**  Rencana => Pagu Definitif Pendapatan **/
  {
    path: "rencana/definitif/pendapatan",
    component: PaguDefinitifPendapatan,
  },
  {
    path: "rencana/definitif/pendapatan/logs",
    component: PaguDefinitifPendapatanLogs,
  },

  /**  Rencana => Pagu Definitif Belanja **/
  {
    path: "rencana/definitif/belanja/rincian",
    component: PaguDefinitifBelanjaRincian,
  },
  {
    path: "rencana/definitif/belanja",
    component: PaguDefinitifBelanja,
  },
  {
    path: "rencana/definitif/belanja/logs",
    component: LogsPaguDefinitifBelanja,
  },
  {
    path: "rencana/definitif/belanja/rincian/logs",
    component: LogsPaguDefinitifBelanjaRincian,
  },

  //Realisasi Pendapatan
  {
    path: "realisasi/pendapatan/list",
    component: RealisasiPendapatan,
  },
  {
    path: "realisasi/pendapatan/logs",
    component: LogRealisasiPendapatan,
  },
  //Realisasi Pindah Buku
  {
    path: "realisasi/pindah-buku/list",
    component: PindahBuku,
  },
  {
    path: "realisasi/pindah-buku/logs",
    component: LogsPindahBuku,
  },
  //Realisasi Pengembalian Dana
  {
    path: "realisasi/pengembalian-dana/list",
    component: PengembalianDana,
  },
  {
    path: "realisasi/pengembalian-dana/logs",
    component: LogsPengembalianDana,
  },
  //Realisasi Output Kegiatan
  {
    path: "realisasi/output-kegiatan",
    component: OutputKegiatan,
  },
  {
    path: "realisasi/output-kegiatan/rincian/:id",
    component: RincianOutputKegiatan,
  },
  {
    path: "realisasi/output-kegiatan/rincian/logs/:id",
    component: LogsRincianOutputKegiatan,
  },

  {
    path: "realisasi/pengeluaran-kegiatan/list",
    component: PengeluaranKegiatan,
  },
  {
    path: "realisasi/pengeluaran-kegiatan/list/nota",
    component: ListNota,
  },
  {
    path: "realisasi/pengeluaran-kegiatan/list/nota/:id",
    component: ListNota,
  },
  {
    path: "realisasi/pengeluaran-kegiatan/logs",
    component: LogsPengeluaranKegiatan,
  },
  {
    path: "realisasi/pengeluaran-kegiatan/list/nota/logs/:id",
    component: LogsPengeluaranKegiatanNotaId,
  },
  {
    path: "realisasi/pengeluaran-pajak/list",
    component: PengeluaranPajak,
  },
  {
    path: "realisasi/pengeluaran-pajak/logs",
    component: LogsPengeluaranPajak,
  },

  //Pencairan
  // {
  //   path: "pencairan/pagu-definitif",
  //   component: PaguDefinitif,
  // },
  // {
  //   path: "pencairan/pencairan-pagu/list",
  //   component: PencairanPagu,
  // },
  // {
  //   path: "pencairan/pencairan-pagu/add",
  //   component: TambahPencairanPagu,
  // },

  // {
  //   path: "realisasi/pindah-buku/add",
  //   component: TambahPindahBuku,
  // },
  // {
  //   path: "realisasi/pindah-buku/edit/:id",
  //   component: EditPindahBuku,
  // },
  //laporan
  {
    path: "laporan/laporan-rkam",
    component: LaporanErkam,
  },
  {
    path: "laporan/laporan-rkakl",
    component: LaporanRkakl,
  },
  {
    path: "laporan/rkakl-konsolidasi-min",
    component: RkaklKonsolidasiMin,
  },
  {
    path: "laporan/laporan-rapbm",
    component: LaporanRapbm,
  },
  {
    path: "laporan/apbm",
    component: Apbm,
  },

  {
    path: "laporan/buku-kas-umum",
    component: BukuKasUmum,
  },
  {
    path: "laporan/buku-kas-umum-konsolidasi-min",
    component: BukuKasUmumKonsolidasiMin,
  },
  {
    path: "laporan/buku-pembantu-pajak",
    component: BukuPembantuPajak,
  },
  {
    path: "laporan/buku-pembantu-kas-tunai",
    component: BukuKasPembantu,
  },
  {
    path: "laporan/pertanggung-jawaban",
    component: PertanggungJawaban,
  },
  {
    path: "laporan/laporan-keuangan-realisasi",
    component: LaporanRealisasi,
  },
  {
    path: "laporan/laporan-rincian-keuangan",
    component: LaporanRincianKeuangan,
  },
  {
    path: "laporan/output-kegiatan",
    component: LaporanOutputKegiatan,
  },
  {
    path: "laporan/laporan-calk",
    component: LaporanCalk,
  },

  //referensi
  {
    path: "referensi/kegiatan",
    component: Kegiatan,
  },

  {
    path: "referensi/kegiatan/:id",
    component: Kegiatan,
  },
  {
    path: "referensi/sub-kegiatan",
    component: SubKegiatan,
  },
  {
    path: "referensi/sub-kegiatan/:id",
    component: SubKegiatan,
  },
  {
    path: "referensi/Snp",
    component: Snp,
  },
  {
    path: "referensi/tahun",
    component: Tahun,
  },
  {
    path: "referensi/kegiatan-bop",
    component: KegiatanBop,
  },
  {
    path: "referensi/kegiatan-bos",
    component: KegiatanBos,
  },
  {
    path: "referensi/alokasi-bos",
    component: AlokasiBos,
  },
  {
    path: "referensi/alokasi-bop",
    component: AlokasiBop,
  },
  // {
  //   path: "referensi/data-referensi-rekening-belanja",
  //   component: DataReferensiRekening,
  // },
  {
    path: "referensi/sumber-dana-madrasah",
    component: SumberDanaMadrasah,
  },
  {
    path: "referensi/komponen-biaya",
    component: KomponenBiaya,
  },
  {
    path: "referensi/komponen-biaya/add",
    component: KomponenBiayaAdd,
  },
  {
    path: "referensi/komponen-biaya/set-harga",
    component: SetKomponenBiayaHarga,
  },
  {
    path: "referensi/rekening-belanja",
    component: RekeningBelanja,
  },
  {
    path: "referensi/jenis-belanja",
    component: Jenisbelanja,
  },
  // {
  //   path: "referensi/jenis-belanja/:id",
  //   component: SubJenisbelanja,
  // },
  {
    path: "referensi/madrasah",
    component: ReferensiMadrasah,
  },
  {
    path: "referensi/kode-registrasi-madrasah",
    component: KodeRegistrasiMadrasah,
  },
  {
    path: "referensi/tahap-pencairan",
    component: TahapPencairan,
  },

  //Komentar
  {
    path: "komentar",
    component: Komentar,
  },

  // {
  //   path: "backup",
  //   component: Backup,
  // },
  // {
  //   path: "export",
  //   component: Export,
  // },

  {
    path: "pengaturan/management-user/pusat",
    component: Pusat,
  },
  {
    path: "pengaturan/management-user/prov",
    component: Prov,
  },
  {
    path: "pengaturan/management-user/kabkota",
    component: KabKota,
  },

  {
    path: "pengaturan/tanggal-rkam",
    component: TanggalRKAM,
  },
  {
    path: "pengaturan/ppk",
    component: PPK,
  },
  {
    path: "pengaturan/ppk/set-ppk/:id",
    component: SetPPK,
  },
  {
    path: "404",
    component: Page404,
  },
  {
    path: "blank",
    component: Blank,
  },
  //Check lagi
  {
    path: "dashboard/pendapatan-dan-kegiatan", // Check
    component: Dashboard, //
  },
  {
    path: "dashboard/pendapatan", // Check
    component: Pendapatan, //
  },
  {
    path: "dashboard/kas-belanja", // Check
    component: AnggaranKasBelanja, //
  },
];

export default routes;
