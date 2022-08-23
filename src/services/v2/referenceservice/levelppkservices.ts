/** @format */

import api from "../../../utils/api";
import { referenceService } from "../constant";
const basePath = `${referenceService}/level-ppk`;

/** get Level PPK by activated */
type levelPPKParams = {
  activated: number;
};

export const getLevelPPK = async (params: levelPPKParams) => {
  try {
    const response = await api.get(`${basePath}`, { params });
    return response.data.return;
  } catch (error) {
    console.log(error);
  }
};

/** Post Level PPK   */
type postLevelPPKParams = {
  kode: string;
  nama: string;
  activated: string;
};

export const postLevelPPK = async (params: postLevelPPKParams) => {
  const response = await api.post<any>(`${basePath}`, params);
  return response.data.return;
};

/** Delete Level PPK  */
export const deleteLevelPPK = async (id: string) => {
  const response = await api.delete(`${basePath}/${id}`);
  return response.data.return;
};
