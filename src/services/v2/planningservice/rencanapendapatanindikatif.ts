/** @format */

import api from "../../../utils/api";
import { planningService } from "../constant";

const basePath = `${planningService}/rencana-pendapatan-indikatif`;

/** Get Alokasi Rencana Pendapatan Indikatif  By ID*/
export const getRencanaPendapatanIndikatifLisAlokasi = async (params: any) => {
  const response = await api.get(`${basePath}/listalokasi/${params}`);
  return response.data.return;
};

/** Post Rencana Pendapatan Indikatif  By ID*/
export const postRencanaPendapatanIndikatif = async (params: any) => {
  const response = await api.post(`${basePath}`, params);
  return response.data.return;
};

/** Edit Rencana Pendapatan Indikatif  By ID*/
export const editRencanaPendapatanIndikatif = async (params: any) => {
  const id = params.id;
  const response = await api.put(`${basePath}/${id}`, params);
  return response.data.return;
};

/** Get Logs Rencana Pendapatan Indikatif  By ID*/
export const getRencanaPendapatanIndikatifLogs = async () => {
  const response = await api.get(`${basePath}/logs`);
  return response.data.return;
};

/** Delete Rencana Pendapatan Indikatif  By ID*/
export const deleteRencanaPedapatanIndikatif = async (params: any) => {
  try {
    const response = await api.delete(`${basePath}/${params}`);
    return response.data.return;
  } catch (error) {
    console.log(error);
  }
};
