/** @format */

import api from "../../../utils/api";
import { realizationService } from "../constant";
const basePath = `${realizationService}/realizations`;
const storageName = "realisasi-pengeluaran-pajak";

export const getPengeluaranPajak = async (tahun?: any) => {
  const response = await api.get(`${basePath}/pajak`, {
    params: {
      tahun: tahun,
    },
  });
  localStorage.setItem(storageName, JSON.stringify(response.data.return));
  return response.data.return;
};

export const getLaporanPembantuPajak = async (param?: any) => {
  const response = await api.get(`${basePath}/laporan-pembantu-pajak`, {
    params: param,
  });
  // localStorage.setItem(storageName, JSON.stringify(response.data.return));
  return response.data.return;
};

export const getPengeluaranPajakLogs = async () => {
  const response = await api.get(`${basePath}/pajak/logs`);
  localStorage.setItem(
    storageName + "-logs",
    JSON.stringify(response.data.return),
  );
  return response.data.return;
};

export const delPengeluaranPajak = async (params: any) => {
  const response = await api.delete(`${basePath}/pajak/${params}`);
  return response.data.return;
};

export const postPengeluaranPajak = async (params: any) => {
  const response = await api.post(`${basePath}/pajak`, params, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data.return;
};

export const putPengeluaranPajak = async (params: any): Promise<any> => {
  let uuid = params.id;
  const response = await api.put(`${basePath}/pajak/${uuid}`, params);
  return response.data.return;
};

export const putPengeluaranPajakRealisasi = async (
  params: any,
): Promise<any> => {
  let uuid = params.id;
  const response = await api.put(`${basePath}/pajak/${uuid}/realisasi`, params);
  return response.data.return;
};

export const putPengeluaranPajakApproval = async (
  params: any,
): Promise<any> => {
  let uuid = params.id;
  const response = await api.put(`${basePath}/pajak/${uuid}/approval`, params);
  return response.data.return;
};

export const putPengeluaranPajakDisapproval = async (
  params: any,
): Promise<any> => {
  let uuid = params.id;
  const response = await api.put(
    `${basePath}/pajak/${uuid}/disapproval`,
    params,
  );
  return response.data.return;
};
