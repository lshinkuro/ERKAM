/** @format */

import api from "../../../utils/api";
import { realizationService } from "../constant";
const basePath = `${realizationService}/realizations/pendapatan`;

/** Post  Realisasi Pendapatan*/
export const postRealisasiPendapatan = async (params: any): Promise<any> => {
  const response = await api.post<any>(`${basePath}`, params);
  return response.data.return;
};

/** Edit  Realisasi Pendapatan*/
export const editRealisasiPendapatan = async (
  data: any,
  id: any,
  action: string,
): Promise<any> => {
  const response = await api.put<any>(`${basePath}/${id}${action}`, data);
  return response.data.return;
};

/** Delete Realisasi Pendapatan */
export const deleteRealisasiPendapatan = async (id: string) => {
  const response = await api.delete(`${basePath}/${id}`);
  return response.data.return;
};

/** Get Logs Realisasi Pendapatan*/
export const getRealisasiPendapatanLogs = async () => {
  const response = await api.get(`${basePath}/logs`);
  return response.data.return;
};
