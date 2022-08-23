/** @format */

import api from "../../../utils/api";
import { realizationService } from "../constant";
const basePath = `${realizationService}/realizations/pengembalian-dana`;

/** Post  Realisasi Pengembalian Dana*/
export const postRealisasiPengembalianDana = async (
  params: any,
): Promise<any> => {
  const response = await api.post<any>(`${basePath}`, params);
  return response.data.return;
};

/** Edit  Realisasi Pengembalian Dana*/
export const editRealisasiPengembalianDana = async (
  data: any,
  id: any,
  action: string,
): Promise<any> => {
  const response = await api.put<any>(`${basePath}/${id}${action}`, data);
  return response.data.return;
};

/** Delete Realisasi Pengembalian Dana */
export const deleteRealisasiPengembalianDana = async (id: string) => {
  const response = await api.delete(`${basePath}/${id}`);
  return response.data.return;
};

/** Get Logs Realisasi Pengembalian Dana*/
export const getRealisasiPengembalianDanaLogs = async () => {
  const response = await api.get(`${basePath}/logs`);
  return response.data.return;
};
