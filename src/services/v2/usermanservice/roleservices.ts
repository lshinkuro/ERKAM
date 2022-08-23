/** @format */
/**update fix */
import api from "../../../utils/api";
import { usermanService } from "../constant";
import { setStoreDB } from "../../../utils/StoreDB";
const basePath = `${usermanService}/role`;

/** Get All Role Group and Activated  */
type roleParams = {
  group: string;
  activated: number;
};

export const getRole = async (params: roleParams) => {
  try {
    const response = await api.get(`${basePath}`, { params });
    setStoreDB("role", response.data.return);
    return response.data.return;
  } catch (error) {
    console.log(error);
  }
};

/** Get All by Role   */

export const getRoleKode = async (param: string) => {
  try {
    const response = await api.get(`${basePath}/${param}`);
    return response.data.return;
  } catch (error) {
    console.log(error);
  }
};

/** Post Role   */
type postRoleParams = {
  kode: string;
  nama: string;
  deskripsi: string;
  group: string;
  activated: string;
};

export const postRole = async (params: postRoleParams) => {
  const response = await api.post<any>(`${basePath}`, params);
  return response.data.return;
};

/** Delete Role   */
export const deleteRole = async (kode: string) => {
  const response = await api.delete(`${basePath}/${kode}`);
  return response.data.return;
};
