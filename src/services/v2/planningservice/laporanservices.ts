/** @format */
/**update fix */
import api from "../../../utils/api";
import { planningService } from "../constant";
// import { setStoreDB } from "../../../utils/StoreDB";
const basePath = `${planningService}`;

/** Get Laporan RAPBM rekap By Madrasah ID dan Tahun   */
type laporanRapbmRekapParams = {
  madrasahId?: string;
  tahun: number;
};

export const getLaporanRapbmRekap = async (params: laporanRapbmRekapParams) => {
  try {
    const response = await api.get(`${basePath}/laporan-rapbm-rekap`, {
      params,
    });
    // setStoreDB("laporanRapbmRekap", response.data.return);
    return response.data.return;
  } catch (error) {
    console.log(error);
  }
};

/** Get Laporan Erkam By Madrasah ID dan Tahun   */

export const getLaporanErkam = async (params: laporanRapbmRekapParams) => {
  try {
    const response = await api.get(`${basePath}/laporan-erkam`, {
      params,
    });
    // setStoreDB("laporanErkam", response.data.return);
    return response.data.return;
  } catch (error) {
    console.log(error);
  }
};

/** Get Laporan Apbm Dashboard By  Tahun   */
type laporanApbmDashboardParams = {
  tahun: number;
};

export const getLaporanApbmDashboard = async (
  params: laporanApbmDashboardParams,
) => {
  try {
    const response = await api.get(`${basePath}/laporan-apbm-dashboard`, {
      params,
    });
    // setStoreDB("laporanApbmDashboard", response.data.return);
    return response.data.return;
  } catch (error) {
    console.log(error);
  }
};

/** Get Laporan RKAKL Dashboard By  Tahun   */
type laporanRKAKLParams = {
  tahun: number;
};

export const getLaporanRkakl = async (params: laporanRKAKLParams) => {
  try {
    const response = await api.get(`${basePath}/rencana/report-rkakl-rekap`, {
      params,
    });
    // setStoreDB("laporanApbmDashboard", response.data.return);
    return response.data.return;
  } catch (error) {
    console.log(error);
  }
};
