/** @format */
/**update fix */
import api from "../../../utils/api";
import { referenceService } from "../constant";
const basePath = `${referenceService}/kabkota`;

/** Get All KabKota By Code Provinsi Activated  */
type kabkotaParams = {
  kode_provinsi?: string;
  activated: number;
};

export const getKabKota = async (params: kabkotaParams) => {
  try {
    const response = await api.get(`${basePath}`, { params });
    return response.data.return;
  } catch (error) {
    console.log(error);
  }
};

/** Post KabKota   */
type postKabKotaParams = {
  kode: string;
  nama: string;
  kode_provinsi: string;
  activated: string;
};

export const postKabKota = async (params: postKabKotaParams) => {
  const response = await api.post<any>(`${basePath}`, params);
  return response.data.return;
};

/** Delete KabKota  */
export const deleteKabKota = async (kode: string) => {
  const response = await api.delete(`${basePath}/${kode}`);
  return response.data.return;
};
