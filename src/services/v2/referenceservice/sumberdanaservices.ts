/** @format */

import api from "../../../utils/api";
import { referenceService } from "../constant";

const basePath = `${referenceService}/sumber-dana`;

/** get All Sumber Dana by Activated */
export const getSumberDana = async () => {
  const response = await api.get(`${basePath}`, {
    params: {
      activated: 1,
    },
  });
  return response.data.return;
};

/** Post Sumber Dana by Activated */
export const postSumberDana = async (params: any) => {
  const response = await api.post(`${basePath}`, params, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data.return;
};

/** Delete Sumber Dana by Activated */
export const deleteSumberDana = async (params: any) => {
  const response = await api.delete(`${basePath}/${params}`);
  return response.data.return;
};
