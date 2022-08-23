/** @format */

/** Dashboard **/
export { default as Dashboard } from "./Dashboard";
export { default as EDM } from "./EvaluasiDiriMadrasah";

/** Profile User dan Madrasah **/
export { default as Profile } from "./Profile";
export { default as EditProfile } from "./Profile/EditProfile";
export { default as EditProfileMadrasah } from "./ProfileMadrasah/Edit";
export { default as ProfileMadrasah } from "./ProfileMadrasah/View";

/** Pengaturan **/
export { default as RekeningBank } from "./Pengaturan/RekeningBank";
export { default as Penerima } from "./Pengaturan/Penerima";

/** Pengaturan => Management User **/
export { default as Madrasah } from "./Pengaturan/ManagementUser/Madrasah";
export { default as StaffMadrasah } from "./Pengaturan/ManagementUser/StaffMadrasah";
export { default as Pusat } from "./Pengaturan/ManagementUser/Pusat";
export { default as Prov } from "./Pengaturan/ManagementUser/Provinsi";
export { default as KabKota } from "./Pengaturan/ManagementUser/Kabkota";
export { default as Pengawas } from "./Pengaturan/ManagementUser/Pengawas";

/** Referensi **/
export { default as Snp } from "./Referensi/Snp";
export { default as Satuan } from "./Referensi/Satuan";
export { default as Pajak } from "./Referensi/Pajak";
export { default as Kegiatan } from "./Referensi/Kegiatan";
export { default as SubKegiatan } from "./Referensi/SubKegiatan";
export { default as Tahun } from "./Referensi/Tahun";
export { default as KegiatanBop } from "./Referensi/KegiatanBop";
export { default as KegiatanBos } from "./Referensi/KegiatanBos";
export { default as Jenisbelanja } from "./Referensi/Jenisbelanja";
export { default as KomponenBiaya } from "./Referensi/KomponenBiaya";
export { default as SetKomponenBiayaHarga } from "./Referensi/KomponenBiaya/setharga";
/** Rencana **/
/** Rencana => Indikatif => Pendapatan **/
export { default as PaguIndikatifPendapatan } from "./Rencana/PaguInd/Pendapatan";
export { default as LogsPaguIndikatifPendapatan } from "./Rencana/PaguInd/Pendapatan/Logs";

/** Rencana => Indikatif => Belanja **/
export { default as PaguIndikatifBelanja } from "./Rencana/PaguInd/Belanja";
export { default as LogsPaguIndikatifBelanja } from "./Rencana/PaguInd/Belanja/Logs";
export { default as PaguIndikatifBelanjaRincian } from "./Rencana/PaguInd/Belanja/Rincian";
export { default as LogsPaguIndikatifBelanjaRincian } from "./Rencana/PaguInd/Belanja/Rincian/Logs";

/** Rencana => Definitif => Pendapatan **/
export { default as PaguDefinitifPendapatan } from "./Rencana/PaguDef/Pendapatan";
export { default as PaguDefinitifPendapatanLogs } from "./Rencana/PaguDef/Pendapatan/Logs";

/** Rencana => Definitif => Belanja **/
export { default as PaguDefinitifBelanja } from "./Rencana/PaguDef/Belanja";
export { default as LogsPaguDefinitifBelanja } from "./Rencana/PaguDef/Belanja/Logs";
export { default as PaguDefinitifBelanjaRincian } from "./Rencana/PaguDef/Belanja/Rincian";
export { default as LogsPaguDefinitifBelanjaRincian } from "./Rencana/PaguDef/Belanja/Rincian/Logs";

/** Realisasi */
/** Realisasi  =>  Pendapatan */
export { default as RealisasiPendapatan } from "./Realisasi/Pendapatan/List";
export { default as LogRealisasiPendapatan } from "./Realisasi/Pendapatan/Logs";

/** Realisasi  =>  Pindah Buku */
export { default as PindahBuku } from "./Realisasi/PindahBuku/List";
export { default as LogsPindahBuku } from "./Realisasi/PindahBuku/Logs";

/** Realisasi  =>  Pengembalian Dana */
export { default as PengembalianDana } from "./Realisasi/PengembalianDana/List";
export { default as LogsPengembalianDana } from "./Realisasi/PengembalianDana/Logs";

/** Realisasi  =>  Output Kegiatan */
export { default as OutputKegiatan } from "./Realisasi/OutputKegiatan/List";
export { default as RincianOutputKegiatan } from "./Realisasi/OutputKegiatan/Rincian";
export { default as LogsRincianOutputKegiatan } from "./Realisasi/OutputKegiatan/Logs";

/** Check Lagi  **/
export { default as Pendapatan } from "./Dashboard/Pendapatan";
export { default as AnggaranKasBelanja } from "./Dashboard/AnggaranKasBelanja";

export { default as ApprovalValidasi } from "./Rencana/ApprovalValidasi";
export { default as LogsApproval } from "./Rencana/ApprovalValidasi/Logs";

export { default as KomponenBiayaAdd } from "./Referensi/KomponenBiaya/Add";

export { default as RekeningBelanja } from "./Referensi/RekeningBelanja";

export { default as TahapPencairan } from "./Referensi/TahapPencairan";

export { default as AlokasiBop } from "./Referensi/AlokasiBop";
export { default as AlokasiBos } from "./Referensi/AlokasiBos";
export { default as SumberDanaMadrasah } from "./Referensi/SumberDanaMadrasah";

// export { default as PaguDefinitif } from "./Pencairan/PaguDefinitif";
// export { default as PencairanPagu } from "./Pencairan/PencairanPagu/List";
// export { default as TambahPencairanPagu } from "./Pencairan/PencairanPagu/Add";

export { default as PengeluaranKegiatan } from "./Realisasi/PengeluaranKegiatan/List";
export { default as NotaPengeluaranKegiatan } from "./Realisasi/PengeluaranKegiatan/Nota";
export { default as LogsPengeluaranKegiatan } from "./Realisasi/PengeluaranKegiatan/Logs";
export { default as LogsPengeluaranKegiatanNotaId } from "./Realisasi/PengeluaranKegiatan/Logs/NotaLogs";

export { default as PengeluaranPajak } from "./Realisasi/PengeluaranPajak/List";
export { default as LogsPengeluaranPajak } from "./Realisasi/PengeluaranPajak/Logs";

export { default as LaporanErkam } from "./Laporan/LaporanRkam";
export { default as LaporanRkakl } from "./Laporan/LaporanRkakl";
export { default as RkaklKonsolidasiMin } from "./Laporan/RkaklKonsolidasiMin";
export { default as RapbmRincian } from "./Laporan/RapbmRincian";
export { default as Apbm } from "./Laporan/Apbm";

export { default as BukuKasUmum } from "./Laporan/BukuKasUmum";
export { default as BukuKasUmumKonsolidasiMin } from "./Laporan/BukuKasUmumKonsolidasiMin";
export { default as BukuPembantuPajak } from "./Laporan/BukuPembantuPajak";
export { default as BukuKasPembantu } from "./Laporan/BukuKasPembantu";
export { default as PertanggungJawaban } from "./Laporan/PertanggungJawaban";

export { default as LaporanRealisasi } from "./Laporan/LaporanRealisasi";
export { default as LaporanRapbm } from "./Laporan/LaporanRapbm";
export { default as LaporanRincianKeuangan } from "./Laporan/LaporanRincianKeuangan";
export { default as LaporanOutputKegiatan } from "./Laporan/LaporanOutputKegiatan";
export { default as LaporanCalk } from "./Laporan/LaporanCalk";

export { default as TanggalRKAM } from "./Pengaturan/TanggalRKAM";

export { default as PPK } from "./Pengaturan/PPK";
export { default as SetPPK } from "./Pengaturan/PPK/SetPPK";
export { default as Role } from "./Pengaturan/Role";

export { default as ReferensiMadrasah } from "./Referensi/Madrasah";
export { default as KodeRegistrasiMadrasah } from "./Referensi/KodeRegistrasiMadrasah";

//komentar
export { default as Komentar } from "./Komentar";

//belanja pagu definitif
// export { default as PaguDefinitifBelanja } from "./Rencana/PaguDef/Belanja";
// export { default as PaguDefinitifBelanjaLogs } from "./Rencana/PaguDef/Belanja/Logs";
// export { default as ListRincianBelanjaDefinitif } from "./Rencana/PaguDef/Belanja/Rincian/List";
// export { default as ListRincianBelanjaDefinitif2 } from "./Rencana/PaguDef/Belanja/Rincian2";
// export { default as ListRincianBelanjaDefinitifAdd } from "./Rencana/PaguDef/Belanja/Rincian/Add";
// export { default as ListRincianBelanjaDefinitifEdit } from "./Rencana/PaguDef/Belanja/Rincian/Edit";

// export { default as PaguDefinitifBelanja } from "./Rencana/PaguDef/Belanja2";
// export { default as PaguDefinitifBelanjaLogs } from "./Rencana/PaguDef/Belanja2/Logs";
// export { default as ListRincianBelanjaDefinitif3 } from "./Rencana/PaguDef/Belanja2/Rincian/List/listRincian";
