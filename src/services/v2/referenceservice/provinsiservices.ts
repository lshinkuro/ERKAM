/** @format */
/**update fix */
import api from "../../../utils/api";
import { referenceService } from "../constant";
const basePath = `${referenceService}/provinsi`;

/** Get All Provinsi By  Activated  */
type provinsiParams = {
  activated: number;
};

export const getProvinsi = async (params: provinsiParams) => {
  try {
    const response = await api.get(`${basePath}`, { params });
    return response.data.return;
  } catch (error) {
    console.log(error);
  }
};

/** Post Provinsi   */
type postProvinsiParams = {
  kode: string;
  nama: string;
  activated: string;
};

export const postProvinsi = async (params: postProvinsiParams) => {
  const response = await api.post<any>(`${basePath}`, params);
  return response.data.return;
};

/** Delete Provinsi  */
export const deleteProvinsi = async (id: string) => {
  const response = await api.delete(`${basePath}/${id}`);
  return response.data.return;
};
