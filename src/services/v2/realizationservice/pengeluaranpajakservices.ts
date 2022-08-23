/** @format */

import api from "../../../utils/api";
import { realizationService } from "../constant";
const basePath = `${realizationService}/realizations/pajak`;

/** Post  Realisasi Pengeluaran Pajak*/
export const postRealisasiPengeluaranPajak = async (
  params: any,
): Promise<any> => {
  const response = await api.post<any>(`${basePath}`, params);
  return response.data.return;
};

/** Edit  Realisasi Pengeluaran Pajak */
export const editRealisasiPengeluaranPajak = async (
  data: any,
  id: any,
  action: string,
): Promise<any> => {
  const response = await api.put<any>(`${basePath}/${id}${action}`, data);
  return response.data.return;
};

/** Delete Realisasi Pengeluaran Pajak  */
export const deleteRealisasiPengeluaranPajak = async (id: string) => {
  const response = await api.delete(`${basePath}/${id}`);
  return response.data.return;
};

/** Get Logs Realisasi Pengeluaran Pajak */
export const getRealisasiPengeluaranPajakLogs = async () => {
  const response = await api.get(`${basePath}/logs`);
  return response.data.return;
};
