/** @format */

import api from "../../../utils/api";
import { referenceService } from "../constant";
const basePath = `${referenceService}`;

/** get All SNP By Activated */
export const getSnp = async (): Promise<any> => {
  try {
    const response = await api.get(`${basePath}/snp`, {
      params: {
        activated: 1,
      },
    });
    return response.data.return;
  } catch (error) {
    console.log(error);
  }
};

/** Post SNP  */
export const postSnp = async (params: any) => {
  const response = await api.post(`${basePath}/snp`, params);
  return response.data.return;
};

/** Post SNP  */
export const deleteSnp = async (params: any) => {
  const response = await api.delete(`${basePath}/snp/${params}`);
  return response.data.return;
};

/** Get Kegiatan  */
export const getKegiatanSnp = async (): Promise<any> => {
  const response = await api.get(`${basePath}/kegiatan-snp`, {
    params: {
      activated: 1,
    },
  });
  return response.data.return;
};

/** Post Kegiatan  */
export const postKegiatanSnp = async (params: any) => {
  const response = await api.post(`${basePath}/kegiatan-snp`, params);
  return response.data.return;
};

/** Delete Kegiatan  */
export const deleteKegiatanSnp = async (params: any) => {
  const response = await api.delete(`${basePath}/kegiatan-snp/${params}`);
  return response.data.return;
};

/** Get Sub Kegiatan  */
export const getSubKegiatan = async (): Promise<any> => {
  const response = await api.get(`${basePath}/sub-kegiatan`, {
    params: {
      activated: 1,
    },
  });
  return response.data.return;
};

/** Post Sub Kegiatan  */
export const postSubKegiatan = async (params: any) => {
  const response = await api.post(`${basePath}/sub-kegiatan`, params);
  return response.data.return;
};

/** Delete Sub Kegiatan  */
export const deleteSubKegiatan = async (params: any) => {
  const response = await api.delete(`${basePath}/sub-kegiatan/${params}`);
  return response.data.return;
};
