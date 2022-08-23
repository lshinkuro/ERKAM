/** @format */

import api from "../../../utils/api";
import { planningService } from "../constant";

const basePath = `${planningService}/rencana/kegiatan-indikatif`;

/** Post Rencana Kegiatan Indikatif */
export const postRencanaKegiatanIndikatif = async (params: any) => {
  const response = await api.post(`${basePath}`, params);
  return response.data.return;
};

/** Edit Rencana KegiatanIndikatif  By ID*/
export const editRencanaKegiatanIndikatif = async (params: any) => {
  const id = params.id;
  const response = await api.put(`${basePath}/${id}`, params);
  return response.data.return;
};

/** Delete Rencana Kegiatan Indikatif  By ID*/
export const deleteRencanaKegiatanIndikatif = async (params: any) => {
  try {
    const response = await api.delete(`${basePath}/${params}`);
    return response.data.return;
  } catch (error) {
    console.log(error);
  }
};

/** Get Logs Rencana Kegiatan Indikatif*/
export const getRencanaKegiatanIndikatifLogs = async (params: any) => {
  const response = await api.get(`${basePath}/logs`, { params });
  return response.data.return;
};

/** Approval Rencana Rincian Kegiatan Indikatif  By ID*/
export const approvalRencanaRincianKegiatanIndikatif = async (params: any) => {
  const id = params.id;
  const status = params.status;
  const komentar = params.komentar;
  const response = await api.put(
    `${planningService}/rencana-rincian-kegiatan-indikatif/status/${id}?id=${id}&status=${status}&komentar=${komentar}`,
    params,
  );
  return response.data.return;
};

/** Delete Rencana Rincian Kegiatan Indikatif  By ID*/
export const deleteRencanaRincianKegiatanIndikatif = async (params: any) => {
  try {
    const response = await api.delete(
      `${planningService}/rencana-rincian-kegiatan-indikatif/delete/${params}`,
    );
    return response.data.return;
  } catch (error) {
    console.log(error);
  }
};

/** Post Rencana Rincian Kegiatan Indikatif */
export const postRencanaRincianKegiatanIndikatif = async (params: any) => {
  const response = await api.post(
    `${planningService}/rencana-rincian-kegiatan-indikatif`,
    params,
  );
  return response.data.return;
};

/** Edit Rencana Rincian KegiatanIndikatif  By ID*/
export const editRencanaRincianKegiatanIndikatif = async (params: any) => {
  const id = params.id;
  const response = await api.put(
    `${planningService}/rencana-rincian-kegiatan-indikatif/${id}`,
    params,
  );
  return response.data.return;
};
