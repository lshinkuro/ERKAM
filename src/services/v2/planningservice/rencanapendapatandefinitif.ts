/** @format */

import api from "../../../utils/api";
import { planningService } from "../constant";

const basePath = `${planningService}/rencana-pendapatan`;

/** Get Alokasi Rencana Pendapatan Definitif  By ID*/
export const getRencanaPendapatanDefinitifListAlokasi = async (params: any) => {
  const response = await api.get(`${basePath}/listalokasi/${params}`);
  return response.data.return;
};

/** Get Logs Rencana Pendapatan Definitif  By ID*/
export const getRencanaPendapatanDefinitifLogs = async () => {
  const response = await api.get(`${basePath}/logs`);
  return response.data.return;
};

/** Post Rencana Pendapatan Definitif  */
export const postRencanaPendapatanDefinitif = async (params: any) => {
  const response = await api.post(`${basePath}`, params);
  return response.data.return;
};

/** Edit Rencana Pendapatan Definitif */
export const editRencanaPendapatanDefinitif = async (params: any) => {
  const id = params.id;
  const response = await api.put(`${basePath}/${id}`, params);
  return response.data.return;
};

/** import  Rencana Pendapatan Definitif */
export const importRencanaPendapatanDefinitif = async (params: any) => {
  const response = await api.post(
    `${basePath}/import-dari-indikatif?tahun=${params}`,
  );
  return response.data.return;
};

/** Delete Rencana Pendapatan Definitif */
export const deleteRencanaPedapatanDefinitif = async (params: any) => {
  try {
    const response = await api.delete(`${basePath}/${params}`);
    return response.data.return;
  } catch (error) {
    console.log(error);
  }
};
