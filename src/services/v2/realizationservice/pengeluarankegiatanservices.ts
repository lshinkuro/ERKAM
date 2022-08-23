/** @format */

import api from "../../../utils/api";
import { realizationService } from "../constant";
const basePath = `${realizationService}/realizations/biaya`;

/** Post  Realisasi Pengeluaran Kegiatan*/
export const postRealisasiPengeluaranKegiatan = async (
  params: any,
  action: string,
): Promise<any> => {
  const response = await api.post<any>(`${basePath}${action}`, params);
  return response.data.return;
};

/** Edit  Realisasi Pengeluaran Kegiatan*/
export const editRealisasiPengeluaranKegiatan = async (
  data: any,
  id: any,
  action: string,
): Promise<any> => {
  const response = await api.put<any>(`${basePath}/${action}${id}`, data);
  return response.data.return;
};

/** Delete Realisasi Pengeluaran Kegiatan */
export const deleteRealisasiPengeluaranKegiatan = async (id: string) => {
  const response = await api.delete(`${basePath}/${id}`);
  return response.data.return;
};

/** Get Logs Realisasi Pengeluaran Kegiatan */
export const getRealisasiPengeluaranKegiatanLogs = async (tahun: string) => {
  const response = await api.get(`${basePath}/logs?tahun=${tahun}`);
  return response.data.return;
};

/** Get Logs Realisasi Rincian Pengeluaran Kegiatan */
export const getRealisasiRincianPengeluaranKegiatanLogs = async (
  tahun: string,
  id: string,
) => {
  const response = await api.get(
    `${basePath}/logs/rencana-rincian-kegiatan-id?rencanaRincianKegiatanId=${id}&tahun=${tahun}`,
  );
  return response.data.return;
};
