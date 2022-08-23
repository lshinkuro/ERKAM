/** @format */
/**update fix */
import api from "../../../utils/api";
import { usermanService } from "../constant";
//simport { setStoreDB } from "../../../utils/StoreDB";
const basePath = `${usermanService}/role-user`;

/** Get All Role User Group and Activated  */
type roleParams = {
  group: string;
  activated: number;
};

export const getRoleUser = async (params: roleParams) => {
  try {
    const response = await api.get(`${basePath}`, { params });
    //    setStoreDB("roleUser", response.data.return);
    return response.data.return;
  } catch (error) {
    console.log(error);
  }
};

/** Get All by ID  */

export const getRoleUserID = async (param: string) => {
  try {
    const response = await api.get(`${basePath}/${param}`);
    return response.data.return;
  } catch (error) {
    console.log(error);
  }
};

/** Post Role User  */
// type postRole = {
//   kode: string;
//   nama: string;
//   deskripsi: string;
//   group: string;
//   activated: string;
// };

export const postRoleUser = async (params: any) => {
  const response = await api.post<any>(`${basePath}`, params);
  return response;
};

/** Delete Role User ID   */
export const deleteRoleUserID = async (id: string) => {
  const response = await api.delete(`${basePath}/${id}`);
  return response.data.return;
};
