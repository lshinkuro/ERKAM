/** @format */

import api from "../../../utils/api";
import { realizationService } from "../constant";
const basePath = `${realizationService}/realizations/output-kegiatan`;

/** Post  Realisasi Output Kegiatan*/
export const postRealisasiOutputKegiatan = async (
  params: any,
): Promise<any> => {
  const response = await api.post<any>(`${basePath}`, params);
  return response.data.return;
};

/** Edit  Realisasi Output Kegiatan*/
export const editRealisasiOutputKegiatan = async (
  data: any,
  id: any,
  action: string,
): Promise<any> => {
  const response = await api.put<any>(`${basePath}/${action}${id}`, data);
  return response.data.return;
};

/** Delete Realisasi Output Kegiatan */
export const deleteRealisasiOutputKegiatan = async (id: string) => {
  const response = await api.delete(`${basePath}/${id}`);
  return response.data.return;
};

/** Get Logs Realisasi Output Kegiatan*/
export const getRealisasiOutputKegiatanLogs = async (params: any) => {
  const response = await api.get(`${basePath}/logs?tahun=${params}`);
  return response.data.return;
};
