/** @format */

import api from "../../../../utils/api";
import { planningService } from "../../constant";

const basePathPlanning = `${planningService}`;
const reportLocalStorage = "laporan-rkakl";

export const getReport = async (tahun): Promise<any> => {
  try {
    // const
    const response = await api.get(
      `${basePathPlanning}/rencana/report-rkakl-rekap?tahun=${tahun}`,
    );
    localStorage.setItem(
      reportLocalStorage,
      JSON.stringify(response.data.return),
    );
    return response.data.return;
  } catch (error) {
    console.log(error);
    // if (error.response) {
    //   throw error.response;
    // } else {
    //     throw error;
    // };
  }
};
