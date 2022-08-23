/** @format */

import api from "../../../utils/api";
import { referenceService } from "../constant";

const basePath = `${referenceService}`;

export const getTipekas = async (): Promise<any> => {
  try {
    const response = await api.get(`${basePath}/tipe-kas`);
    localStorage.setItem(
      "tipe-kas-controller",
      JSON.stringify(response.data.return),
    );
    return response.data.return;
  } catch (error) {
    // if (error.response)
    //     throw error.response;
    // else
    //     throw error;
    console.log(error);
  }
};
