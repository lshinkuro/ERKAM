import api from "../../../utils/api";
import { realizationService, referenceService } from "../constant";

const basePath = `${realizationService}/realizations`;
const basePathReference = `${referenceService}`;
const storagePindahbukuName = "pindah-buku"

export const browse = async (): Promise<any> => {
  let response;
  const tahunActive = localStorage.getItem('curTahunFromSelListOnHeader') || new Date().getFullYear();
  response =  response = await api.get(`${basePath}/pindah-buku?tahun=${tahunActive}`);
  localStorage.setItem(storagePindahbukuName, JSON.stringify(response.data.return));
  // console.log(response.data.return);
  return response.data.return;
};

export const add = async (params): Promise<any> => {
  const response = await api.post(`${basePath}/pindah-buku`, params);
  // console.log(response.data.return);
  return response.data.return;
};

export const edit = async (id, params): Promise<any> => {
    const response = await api.put(`${basePath}/pindah-buku/${id}`, params);
    // console.log(response.data.return);
    return response.data.return;
};

export const approval = async (id, params): Promise<any> => {
  const response = await api.put(`${basePath}/pindah-buku/${id}/approval`, params);
  // console.log(response.data.return);
  return response.data.return;
};

export const disapproval = async (id, params): Promise<any> => {
  const response = await api.put(`${basePath}/pindah-buku/${id}/disapproval`, params);
  // console.log(response.data.return);
  return response.data.return;
};

export const realisasi = async (id, params): Promise<any> => {
  const response = await api.put(`${basePath}/pindah-buku/${id}/realisasi`, params);
  // console.log(response.data.return);
  return response.data.return;
};

export const read = async (id): Promise<any> => {
    const response = await api.get(`${basePath}/pindah-buku/${id}`);
    // console.log(response.data.return);
    return response.data.return;
};

export const del = async (id): Promise<any> => {
    const response = await api.delete(`${basePath}/pindah-buku/${id}`);
    // console.log(response.data.return);
    return response.data.return;
};

export const getSumberDana = async (): Promise<any> => {
    const response = await api.get<any>(
      `${basePathReference}/sumber-dana?activated=1`
    );
    return response.data.return;
};

export const getBank = async (): Promise<any> => {
    const response = await api.get<any>(
      `${basePathReference}/bank?activated=1`
    );
    return response.data.return;
};

export const getRekeningBelanja = async (): Promise<any> => {
  const response = await api.get<any>(
    `${basePathReference}/rekening-belanja?activated=1`
  );
  return response.data.return;
};

export const getTipeKas = async (): Promise<any> => {
    const response = await api.get<any>(
      `${basePathReference}/tipe-kas?activated=1`
    );
    return response.data.return;
};

export const getPindahBukuLogs = async (): Promise<any> => {
    const response = await api.get<any>(
      `${basePath}/pindah-buku/logs`
    );
    return response.data.return;
};
