/**
 * update fix
 *
 * @format
 */

import api from "../../../utils/api";
import { planningService } from "../constant";
const basePath = `${planningService}/rencana-tanggal`;

/** Post Rencana Tanggal   */
export const postRencanaTanggal = async (params: any) => {
  const response = await api.post<any>(`${basePath}`, params);
  return response.data.return;
};

/** Edit Rencana Tanggal   */
export const editRencanaTanggal = async (params: any) => {
  const id = params.id;
  const response = await api.put<any>(`${basePath}/${id}`, params);
  return response.data.return;
};

/** Delete RencanaTanggal  */
export const deleteRencanaTanggal = async (id: string) => {
  const response = await api.delete(`${basePath}/${id}`);
  return response.data.return;
};
