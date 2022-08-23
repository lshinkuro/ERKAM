/** @format */

import api from "../../../utils/api";
import { referenceService } from "../constant";

const basePath = `${referenceService}/pajak`;

/** Post Pajak   */

export const postPajak = async (params: any) => {
  const response = await api.post<any>(`${basePath}`, params);
  return response.data.return;
};

/** Delete Pajak  */
export const deletePajak = async (id: string) => {
  const response = await api.delete(`${basePath}/${id}`);
  return response.data.return;
};
