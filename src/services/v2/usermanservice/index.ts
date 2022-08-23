/** @format */

import api from "../../../utils/api";
import { usermanService } from "../constant";
const basePath = `${usermanService}`;

/** Get All Reference Activated  */
export const getUsermanAll = async (ref: any, params: any): Promise<any> => {
  try {
    let response: any = await api.get<any>(`${basePath}/${ref}`, {
      params,
    });
    return response.data.return;
  } catch (error) {
    console.log(error);
  }
};
