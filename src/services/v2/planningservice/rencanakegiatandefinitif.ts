/** @format */

import api from "../../../utils/api";
import { planningService } from "../constant";

const basePath = `${planningService}/rencana/kegiatan-definitif`;

/** Post Rencana Kegiatan Definitif */
export const postRencanaKegiatanDefinitif = async (params: any) => {
  const response = await api.post(`${basePath}`, params);
  return response.data.return;
};

/** Edit Rencana Kegiatan Definitif  By ID*/
export const editRencanaKegiatanDefinitif = async (params: any) => {
  const id = params.id;
  const response = await api.put(`${basePath}/${id}`, params);
  return response.data.return;
};

/** Delete Rencana Kegiatan Definitif  By ID*/
export const deleteRencanaKegiatanDefinitif = async (params: any) => {
  try {
    const response = await api.delete(`${basePath}/${params}`);
    return response.data.return;
  } catch (error) {
    console.log(error);
  }
};

/** Get Logs Rencana Kegiatan Definitif*/
export const getRencanaKegiatanDefinitifLogs = async (params: any) => {
  const response = await api.get(`${basePath}/logs`, { params });
  return response.data.return;
};

/** Approval Rencana Rincian Kegiatan Definitif  By ID*/
export const approvalRencanaRincianKegiatanDefinitif = async (params: any) => {
  const id = params.id;
  const status = params.status;
  const komentar = params.komentar;
  const response = await api.put(
    `${planningService}/rencana-rincian-kegiatan-definitif/status/${id}?id=${id}&status=${status}&komentar=${komentar}`,
    params,
  );
  return response.data.return;
};

/** Delete Rencana Rincian Kegiatan Definitif  By ID*/
export const deleteRencanaRincianKegiatanDefinitif = async (params: any) => {
  try {
    const response = await api.delete(
      `${planningService}/rencana-rincian-kegiatan-definitif/${params}`,
    );
    return response.data.return;
  } catch (error) {
    console.log(error);
  }
};

/** Post Rencana Rincian Kegiatan Definitif */
export const postRencanaRincianKegiatanDefinitif = async (params: any) => {
  const response = await api.post(
    `${planningService}/rencana-rincian-kegiatan-definitif`,
    params,
  );
  return response.data.return;
};

/** Edit Rencana Rincian Kegiatan Definitif  By ID*/
export const editRencanaRincianKegiatanDefinitif = async (params: any) => {
  const id = params.id;
  const response = await api.put(
    `${planningService}/rencana-rincian-kegiatan-definitif/${id}`,
    params,
  );
  return response.data.return;
};
