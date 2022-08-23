/** @format */

import api from "../../../utils/api";
import { realizationService } from "../constant";
const basePath = `${realizationService}/realizations/pindah-buku`;

/** Post  Realisasi Pindah Buku*/
export const postRealisasiPindahBuku = async (params: any): Promise<any> => {
  const response = await api.post<any>(`${basePath}`, params);
  return response.data.return;
};

/** Edit  Realisasi Pindah Buku*/
export const editRealisasiPindahBuku = async (
  data: any,
  id: any,
  action: string,
): Promise<any> => {
  const response = await api.put<any>(`${basePath}/${id}${action}`, data);
  return response.data.return;
};

/** Delete Realisasi Pindah Buku */
export const deleteRealisasiPindahBuku = async (id: string) => {
  const response = await api.delete(`${basePath}/${id}`);
  return response.data.return;
};

/** Get Logs Realisasi Pindah Buku*/
export const getRealisasiPindahBukuLogs = async () => {
  const response = await api.get(`${basePath}/logs`);
  return response.data.return;
};
