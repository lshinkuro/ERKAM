/** @format */

import api from "../../../utils/api";
import { referenceService } from "../constant";

const basePath = `${referenceService}`;

/** get Penggunaan Bos */
export const getPenggunaanBos = async () => {
  const response = await api.get(`${basePath}/penggunaan-bos`, {
    params: {
      activated: 1,
    },
  });
  // localStorage.setItem("pbos", JSON.stringify(response.data.return));
  return response.data.return;
};

/** Post Penggunaan Bos */
export const postPenggunaanBos = async (params: any) => {
  const response = await api.post(`${basePath}/penggunaan-bos`, params, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data.return;
};

/** Delete Penggunaan Bos */
export const deletePenggunaanBos = async (params: any) => {
  const response = await api.delete(`${basePath}/penggunaan-bos/${params}`);
  return response.data.return;
};
