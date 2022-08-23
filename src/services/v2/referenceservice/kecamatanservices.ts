/** @format */
/**update fix */
import api from "../../../utils/api";
import { referenceService } from "../constant";
const basePath = `${referenceService}/kecamatan`;

/** Get All Kecamatan By Code KabKota Activated  */
type kecamatanParams = {
  kode_kabkota?: string;
  activated: number;
};

export const getKecamatan = async (params: kecamatanParams) => {
  try {
    const response = await api.get(`${basePath}`, { params });
    return response.data.return;
  } catch (error) {
    console.log(error);
  }
};

/** Post Kecamatan   */
type postKecamatanParams = {
  kode: string;
  nama: string;
  kode_kabkota: string;
  activated: string;
};

export const postKecamatan = async (params: postKecamatanParams) => {
  const response = await api.post<any>(`${basePath}`, params);
  return response.data.return;
};

/** Delete Kecamatan  */
export const deleteKecamatan = async (kode: string) => {
  const response = await api.delete(`${basePath}/${kode}`);
  return response.data.return;
};
