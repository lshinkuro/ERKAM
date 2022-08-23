/** @format */
/**update fix */
import api from "../../../utils/api";
import { referenceService } from "../constant";
const basePath = `${referenceService}/rekening-belanja`;

/** Get All Rekening Belanja By  Activated  */
type rekeningBelanjaParams = {
  activated: number;
};

export const getRekeningBelanja = async (params: rekeningBelanjaParams) => {
  try {
    const response = await api.get(`${basePath}`, { params });
    return response.data.return;
  } catch (error) {
    console.log(error);
  }
};

/** Post Rekening Belanja   */
export const postRekeningBelanja = async (params: any) => {
  const response = await api.post(`${basePath}`, params, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data.return;
};

/** Delete Rekening Belanja  */
export const deleteRekeningBelanja = async (params: any) => {
  const response = await api.delete(`${basePath}/${params}`);
  return response.data.return;
};

/** Edit Rekening Belanja  */
// export const putRekeningBelanja = async (params: any) => {
//   let uuid = params.id;
//   try {
//     const response = await api.put(`${basePath}/${uuid}`, params);
//     return response.data.return;
//   } catch (error) {
//     console.log(error);
//   }
// };
