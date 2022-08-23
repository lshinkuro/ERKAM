/** @format */
/**update fix */
import api from "../../../utils/api";
import { referenceService } from "../constant";
const basePath = `${referenceService}/kelurahan`;

/** Get All Kelurahan By Code Kecamatan Activated  */
type kelurahanParams = {
  kode_kecamatan?: string;
  activated: number;
};

export const getKelurahan = async (params: kelurahanParams) => {
  try {
    const response = await api.get(`${basePath}`, { params });
    return response.data.return;
  } catch (error) {
    console.log(error);
  }
};

/** Post Kelurahan   */
type postKelurahanParams = {
  kode: string;
  nama: string;
  kode_kecamatan: string;
  activated: string;
};

export const postKelurahan = async (params: postKelurahanParams) => {
  const response = await api.post<any>(`${basePath}`, params);
  return response.data.return;
};

/** Delete Kelurahan   */
export const deleteKelurahan = async (id: string) => {
  const response = await api.delete(`${basePath}/${id}`);
  return response.data.return;
};
