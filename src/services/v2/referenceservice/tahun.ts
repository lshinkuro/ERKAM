/** @format */

import api from "../../../utils/api";
import { referenceService } from "../constant";
import { setStoreDB } from "../../../utils/StoreDB";

const basePath = `${referenceService}`;

export const getTahun = async () => {
  const response = await api.get(`${basePath}/tahun`);
  // localStorage.setItem("tahun", JSON.stringify(response.data.return));
  return response.data.return;
};

export const postTahun = async (params: any) => {
  const response = await api.post(`${basePath}/tahun`, params);
  return response.data.return;
};

export const deleteTahun = async (params: any) => {
  const response = await api.delete(`${basePath}/tahun/${params}`);
  return response.data.return;
};

export const getTahunActive = async () => {
  const response = await api.get(`${basePath}/tahun?activated=1`);
  setStoreDB("periodeTahunActive", response.data.return);
  return response.data.return;
};
