/** @format */

import api from "../../../utils/api";
import { referenceService } from "../constant";

const basePath = `${referenceService}`;

export const postKomponenBiaya = async (params: any) => {
  const response = await api.post(`${basePath}/komponen-biaya`, params, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data.return;
};

const postKatJenisBelanja = async (params: any) => {
  const response = await api.post(`${basePath}/komponen-biaya`, params, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data.return;
};

const getKatKomBiaya = async (): Promise<any> => {
  const response = await api.get(`${basePath}/kategori-komponen-biaya`);
  localStorage.setItem(
    "komponenbiaya/kategori",
    JSON.stringify(response.data.return),
  );
  return response.data.return;
};

const getKatJenisBelanja = async (): Promise<any> => {
  const response = await api.get(`${basePath}/kategori-belanja`);
  localStorage.setItem(
    "kategoriKomponenBiaya",
    JSON.stringify(response.data.return),
  );
  return response.data.return;
};

const getJsonXlsx = async (
  kodeProvinsi: string,
  kodeKabkota: string,
): Promise<any> => {
  const response = await api.get(
    `${basePath}/template-komponen-biaya-json?tahun=2021&kode_provinsi=${
      kodeProvinsi === undefined ? "" : kodeProvinsi
    }&kode_kabkota=${kodeKabkota === undefined ? "" : kodeKabkota}`,
  );
  return response.data.return;
};

export const setHargaKomponenBiaya = async (data: any): Promise<any> => {
  const response = await api.post(
    `${basePath}/upload-template-komponen-biaya`,
    data,
  );

  return response.data.return;
};

const testUpload = async (data: any): Promise<any> => {
  const response = await api.post(
    `${basePath}/upload-template-komponen-biaya`,
    data,
  );

  return response.data.return;
};

const browseKomponenBiaya = async (params) => {
  const response = await api.get(
    `${basePath}/template-komponen-biaya-json?tahun=${
      params.tahun
    }&kode_provinsi=${
      params.kode_provinsi === undefined ? "" : params.kode_provinsi
    }&kode_kabkota=${
      params.kode_kabkota === undefined ? "" : params.kode_kabkota
    }`,
  );
  return response.data.return;
};

const getNewKodeKOmponenBiaya = async (kode) => {
  const response = await api.get(
    `${basePath}/komponen-biaya/generate-kode?kode=${kode}`,
  );
  return response.data.return;
};

const getTahunActive = async () => {
  const response = await api.get(`${basePath}/tahun?activated=1`);
  return response.data.return;
};

const saveHeaderData = async (params) => {
  const response = await api.post(`${basePath}/komponen-biaya`, params);
  return response.data.return;
};

const saveDetailData = async (params) => {
  const response = await api.post(
    `${basePath}/upload-template-komponen-biaya`,
    params,
  );
  return response.data.return;
};

export {
  postKatJenisBelanja,
  getKatKomBiaya,
  getNewKodeKOmponenBiaya,
  getKatJenisBelanja,
  getJsonXlsx,
  testUpload,
  browseKomponenBiaya,
  getTahunActive,
  saveHeaderData,
  saveDetailData,
};
