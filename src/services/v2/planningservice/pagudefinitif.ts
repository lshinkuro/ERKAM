/** @format */

import api from "../../../utils/api";
import {
  planningService,
  realizationService,
  referenceService,
} from "../constant";

const basePath = `${planningService}`;
const baseReferencePath = `${referenceService}`;
const baseRealizationPath = `${realizationService}`;
const storagePendapatanName = "rencana-pendapatan-definitif";
const storageBelanjaName = "rencana-belanja-definitif";
const storageRealisasiPendapatanHeader = "realisasi-pendapatan-header";

const browse = async (): Promise<any> => {
  let response;
  const tahunActive =
    localStorage.getItem("curTahunFromSelListOnHeader") ||
    new Date().getFullYear();
  response = await api.get(
    `${basePath}/rencana-pendapatan?tahun=${tahunActive}`,
  );
  localStorage.setItem(
    storagePendapatanName,
    JSON.stringify(response.data.return),
  );
  // console.log(response.data.return);
  return response.data.return;
};

const browseBelanja = async (tahun): Promise<any> => {
  const response = await api.get(
    `${basePath}/rencana/kegiatan-definitif?tahun=${tahun}`,
  );
  localStorage.setItem(
    storageBelanjaName,
    JSON.stringify(response.data.return),
  );
  // console.log(response.data.return);
  return response.data.return;
};

const browseBelanjaDetail = async (tahun): Promise<any> => {
  const response = await api.get(
    `${basePath}/rencana-rincian-kegiatan-definitif?tahun=${tahun}`,
  );
  // console.log(response.data.return);
  return response.data.return;
};

const browseBelanjaDetail2 = async (rencanaKegiatanId): Promise<any> => {
  const response = await api.get(
    `${basePath}/rencana-rincian-kegiatan-definitif/rencana-kegiatan?rencanaKegiatanId=${rencanaKegiatanId}`,
  );
  // console.log(response.data.return);
  return response.data.return;
};

const browsePortalBos = async (tahun, nsm): Promise<any> => {
  try {
    const response = await api.get(
      `${baseReferencePath}/portal-bos?tahun=${tahun}&nsm=${nsm}`,
    );
    console.log(response.data);
    return response.data.return;
  } catch (e) {
    return {};
  }
};

const add = async (params): Promise<any> => {
  const response = await api.post(`${basePath}/rencana-pendapatan`, params);
  // console.log(response.data.return);
  return response.data.return;
};

const addBelanja = async (params): Promise<any> => {
  const response = await api.post(
    `${basePath}/rencana/kegiatan-definitif`,
    params,
  );
  // console.log(response.data.return);
  return response.data.return;
};

const edit = async (id, params): Promise<any> => {
  const response = await api.put(
    `${basePath}/rencana-pendapatan/${id}`,
    params,
  );
  // console.log(response.data.return);
  return response.data.return;
};

const editBelanja = async (params): Promise<any> => {
  const response = await api.put(
    `${basePath}/rencana/kegiatan-definitif`,
    params,
  );
  // console.log(response.data.return);
  return response.data.return;
};

const del = async (id): Promise<any> => {
  const response = await api.delete(`${basePath}/rencana-pendapatan/${id}`);
  // console.log(response.data.return);
  return response.data;
};

const delBelanja = async (id): Promise<any> => {
  const response = await api.delete(
    `${basePath}/rencana/kegiatan-definitif/${id}`,
  );
  // console.log(response.data.return);
  return response.data;
};

const delRincianBelanjaDetail = async (id): Promise<any> => {
  const response = await api.delete(
    `${basePath}/rencana-rincian-kegiatan-definitif/${id}`,
  );
  return response.data;
};

const editRincianBelanjaDetail = async (id, status, komentar): Promise<any> => {
  // Available values : MENUNGGU, DISETUJUI, DITOLAK, SELESAI
  const response = await api.put(
    `${basePath}/rencana-rincian-kegiatan-definitif/status/${id}?status=${status}&komentar=${komentar}`,
  );
  // console.log(response.data.return);
  return response.data.return;
};

const logs = async (): Promise<any> => {
  const response = await api.get(`${basePath}/rencana-pendapatan/logs`);
  // console.log(response.data.return);
  return response.data.return;
};

const logsRincian = async (id): Promise<any> => {
  const response = await api.get(
    `${basePath}/rencana-rincian-kegiatan-definitif/logs/rencana-rincian?rencanaRincianKegiatanId=${id}`,
  );
  // console.log(response.data.return);
  return response.data.return;
};

const addRincianBelanja = async (params): Promise<any> => {
  const response = await api.post(
    `${basePath}/rencana-rincian-kegiatan-definitif`,
    params,
  );
  // console.log(response.data.return);
  return response.data.return;
};

const editRincianBelanja = async (id, params): Promise<any> => {
  const response = await api.put(
    `${basePath}/rencana-rincian-kegiatan-definitif/${id}`,
    params,
  );
  // console.log(response.data.return);
  return response.data.return;
};

const delRincianBelanja = async (id): Promise<any> => {
  const response = await api.delete(
    `${basePath}/rencana-rincian-kegiatan-definitif/${id}`,
  );
  // console.log(response.data.return);
  return response.data;
};

const importRencanaDefinitifFromIndikatif = async (params): Promise<any> => {
  try {
    const response = await api.post(
      `${basePath}/rencana-pendapatan/import-dari-indikatif?tahun=${params}`,
    );
    return response.data.return;
  } catch (error) {
    // console.log(error);
    // if (error.response)
    //     throw error.response.data;
    // else
    //     throw error;
  }
};

const browseRekapSumberDanaBelanjaDefinitif = async (): Promise<any> => {
  let response;
  const tahunActive =
    localStorage.getItem("curTahunFromSelListOnHeader") ||
    new Date().getFullYear();
  response = await api.get(
    `${basePath}/rencana-rekap-sumber-dana-belanja-definitif?tahun=${tahunActive}`,
  );
  localStorage.setItem(
    storagePendapatanName,
    JSON.stringify(response.data.return),
  );
  // console.log(response.data.return);
  return response.data.return;
};

const browsePendapatanHeader = async (): Promise<any> => {
  let response;
  const tahunActive =
    localStorage.getItem("curTahunFromSelListOnHeader") ||
    new Date().getFullYear();
  response = await api.get(
    `${baseRealizationPath}/realizations/pendapatan/header?tahun=${tahunActive}`,
  );
  localStorage.setItem(
    storageRealisasiPendapatanHeader,
    JSON.stringify(response.data.return),
  );
  // console.log(response.data.return);
  return response.data.return;
};

export {
  add,
  addBelanja,
  addRincianBelanja,
  browse,
  browsePortalBos,
  browseBelanja,
  browseBelanjaDetail,
  browseBelanjaDetail2,
  browseRekapSumberDanaBelanjaDefinitif,
  browsePendapatanHeader,
  del,
  delRincianBelanja,
  delRincianBelanjaDetail,
  editRincianBelanjaDetail,
  delBelanja,
  edit,
  editBelanja,
  editRincianBelanja,
  logs,
  logsRincian,
  importRencanaDefinitifFromIndikatif,
};
