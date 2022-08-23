/** @format */
/**update fix */
import api from "../../../utils/api";
import { realizationService } from "../constant";
const basePath = `${realizationService}/realizations`;

/** Get Laporan Daftar Sumber Dana By Madrasah ID dan Tahun   */
type laporanSumberDanaParams = {
  madrasahId?: string;
  tahun: any;
};

export const getLaporanDaftarSumberDana = async (
  params: laporanSumberDanaParams,
) => {
  try {
    const response = await api.get(`${basePath}/laporan/daftar-sumber-dana`, {
      params,
    });
    // setStoreDB("laporanSumberDana", response.data.return);
    return response.data.return;
  } catch (error) {
    console.log(error);
  }
};

/** Get Laporan Pertanggung Jawaban Bendahara Pengeluaran By Madrasah ID dan Tahun   */
type laporanPertanggungJawabanParams = {
  madrasahId?: string;
  tahun: number;
  kodeSumberDana: string;
};

export const getLaporanPertanggungJawabanBendaharaPengeluaran = async (
  params: laporanPertanggungJawabanParams,
) => {
  try {
    const response = await api.get(
      `${basePath}/laporan-pertanggungjawaban-bendahara-pengeluaran`,
      {
        params,
      },
    );
    // setStoreDB(
    //   "laporanPertanggungJawabanBendaharaPengeluaran",
    //   response.data.return,
    // );
    return response.data.return;
  } catch (error) {
    console.log(error);
  }
};

/** Get Laporan Pembantu Pajak By Madrasah ID dan Tahun   */
type laporanPembantuPajakParams = {
  madrasahId?: string;
  tahun: any;
  bulan: any;
};

export const getLaporanPembantuPajak = async (
  params: laporanPembantuPajakParams,
) => {
  try {
    const response = await api.get(`${basePath}/laporan-pembantu-pajak`, {
      params,
    });
    // setStoreDB("laporanPembantuPajak", response.data.return);
    return response.data.return;
  } catch (error) {
    console.log(error);
  }
};

/** Get Laporan BKU By Madrasah ID dan Tahun   */
type laporanBKUParams = {
  madrasahId?: string;
  kodeTipeKas?: string;
  tahun: any;
  bulan: any;
};

export const getLaporanBKU = async (params: laporanBKUParams) => {
  try {
    const response = await api.get(`${basePath}/laporan-bku`, {
      params,
    });
    // setStoreDB("laporanBKU", response.data.return);
    return response.data.return;
  } catch (error) {
    console.log(error);
  }
};

/** Get Laporan APBM By Madrasah ID dan Tahun   */
type laporanAPBMParams = {
  madrasahId?: string;
  tahun: any;
};

export const getLaporanAPBM = async (params: laporanAPBMParams) => {
  try {
    const response = await api.get(`${basePath}/laporan-apbm`, {
      params,
    });
    return response.data.return;
  } catch (error) {
    console.log(error);
  }
};

/** Get Laporan APBM Dashboard By Madrasah ID dan Tahun   */
type laporanAPBMDashboardParams = {
  tahun: number;
};

export const getLaporanRAPBMDashboard = async (
  params: laporanAPBMDashboardParams,
) => {
  try {
    const response = await api.get(`${basePath}/laporan-apbm-dashboard`, {
      params,
    });
    return response.data.return;
  } catch (error) {
    console.log(error);
  }
};

/** Get Laporan Realisasi Tahun   */
type laporanRealisasiParams = {
  tahun: any;
};

export const getLaporanRealisasi = async (params: laporanRealisasiParams) => {
  try {
    const response = await api.get(`${basePath}/biaya/laporan-keuangan`, {
      params,
    });
    return response.data.return;
  } catch (error) {
    console.log(error);
  }
};
