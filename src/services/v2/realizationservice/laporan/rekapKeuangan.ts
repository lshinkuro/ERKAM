/** @format */

import api from "../../../../utils/api";
import { realizationService } from "../../constant";

const basePathRealization = `${realizationService}`;
const rekapKeuanganStorage = "realisasi/laporan-rekap-keuangan";

export const getRealisasiRekapKeuangan = async (tahun): Promise<any> => {
  try {
    const response = await api.get(
      `${basePathRealization}/realizations/biaya/laporan-keuangan?tahun=${tahun}`,
    );
    localStorage.setItem(
      rekapKeuanganStorage,
      JSON.stringify(response.data.return),
    );
    return response.data.return;
  } catch (error) {
    // if (error.response) {
    //   throw error.response;
    // } else {
    //   throw error;
    // }
    console.log(error);
  }
};
