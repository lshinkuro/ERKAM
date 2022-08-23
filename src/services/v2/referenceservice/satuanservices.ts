/** @format */

import api from "../../../utils/api";
import { referenceService } from "../constant";

const basePath = `${referenceService}/satuan`;

/** Post Satuan   */
type postSatuanParams = {
  kode: string;
  nama: string;
  activated: string;
};

export const postSatuan = async (params: postSatuanParams) => {
  const response = await api.post<any>(`${basePath}`, params);
  return response.data.return;
};

/** Delete Satuan  */
export const deleteSatuan = async (id: string) => {
  const response = await api.delete(`${basePath}/${id}`);
  return response.data.return;
};
