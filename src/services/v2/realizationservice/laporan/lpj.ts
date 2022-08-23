/** @format */

import api from "../../../../utils/api";
import { realizationService, usermanService } from "../../constant";

const basePathRealization = `${realizationService}`;
const basePathUser = `${usermanService}`;

export const browseLpj = async (
  tahap: any,
  tahun: any,
  madrasahId: any,
): Promise<any> => {
  try {
    const response = await api.get(
      `${basePathRealization}/realizations/laporan-pertanggungjawaban-bendahara-pengeluaran?tahap=${tahap}&tahun=${tahun}&madrasahId=${madrasahId}`,
    );
    localStorage.setItem("laporan-lpj", JSON.stringify(response.data.return));

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

// export const browseLpj2 = async (tahap:any, tahun:any, madrasahId:any) :Promise<any> => {
//   try {
//     const response = await api.get(`${basePathRealization}/realizations/laporan-pertanggungjawaban-bendahara-pengeluaran?tahap=${tahap}&tahun=${tahun}&madrasahId=${madrasahId}`)
//     localStorage.setItem("lpj", JSON.stringify(response.data.return))
//   } catch (error) {
//     if (error.response) {
//       throw error.response;
//     } else {
//       throw error;
//     }
//   }
// }
