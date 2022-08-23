/** @format */
/**update fix */
import api from "../../../utils/api";
import { referenceService } from "../constant";
const basePath = `${referenceService}/penerima`;

/** Get All Penerima By Activated  */
type penerimaParams = {
  activated: number;
};

export const getPenerima = async (params: penerimaParams) => {
  try {
    const response = await api.get(`${basePath}`, {
      params,
    });
    return response.data.return;
  } catch (error) {
    console.log(error);
  }
};

/** Get Post Penerima   */

export const postPenerima = async (params: any) => {
  try {
    const response = await api.post(`${basePath}`, params);
    return response.data.return;
  } catch (error) {
    console.log(error);
  }
};

/** Get Edit Penerima   */
export const editPenerima = async (params: any) => {
  let uuid = params.id;
  const response = await api.put(`${basePath}/${uuid}`, params);
  return response.data.return;
};

/** Get Delete Penerima   */
export const deletePenerima = async (params: any) => {
  try {
    const response = await api.delete(`${basePath}/${params}`);
    return response.data.return;
  } catch (error) {
    console.log(error);
  }
};

/**  Post Penerima Rekening   */
export const postPenerimaRekening = async (params: any) => {
  const response = await api.post(
    `${referenceService}/penerima-rekening`,
    params,
  );
  return response.data.return;
};

/** Delete Penerima Rekening   */
export const deletePenerimaRekening = async (params: any) => {
  const response = await api.delete(
    `${referenceService}/penerima-rekening/${params}`,
  );
  return response.data.return;
};

/** Edit Penerima Rekening   */
export const editPenerimaRekening = async (params: any) => {
  let uuid = params.id;
  const response = await api.put(
    `${referenceService}/penerima-rekening/${uuid}`,
    params,
  );
  return response.data.return;
};
