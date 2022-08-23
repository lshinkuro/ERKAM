import api from "../../../utils/api";
import { referenceService } from "../constant";

const basePath = `${referenceService}`;

export const getKategoriBelanja = async () => {
  const response = await api.get(`${basePath}/kategori-belanja`, {
    params: {
      activated: 1,
    },
  });
  return response.data.return;
};

export const postKategoriBelanja = async (params: any) => {
  const response = await api.post(`${basePath}/kategori-belanja`, params, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data.return;
};

export const deleteKategoriBelanja = async (params: any) => {
  const response = await api.delete(`${basePath}/kategori-belanja/${params}`);
  return response.data.return;
};

export const postJenisBelanja = async (params: any) => {
  const response = await api.post(`${basePath}/jenis-belanja`, params, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data.return;
};

export const deleteJenisBelanja = async (params: any) => {
  const response = await api.delete(`${basePath}/jenis-belanja/${params}`);
  return response.data.return;
};
