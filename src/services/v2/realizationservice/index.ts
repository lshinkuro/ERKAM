/** @format */

import * as paguDefinitif from "./pagudefinitif";
import * as pencairanPaguDefinitif from "./pencairanpagudefinitif";
import * as paguDefinitifPlanning from "../planningservice/pagudefinitif";
import * as outputKegiatan from "./outputkegiatan";
import * as pengeluaranPajak from "./pengeluaranpajak";
import * as pengeluaranKegiatan from "./pengeluaranKegiatan";
import api from "../../../utils/api";
import { realizationService } from "../constant";
const basePath = `${realizationService}/realizations`;
export const paguDefinitifService = paguDefinitif;
export const pencairanPaguDefinitifService = pencairanPaguDefinitif;
export const paguDefinitifPlanningService = paguDefinitifPlanning;
export const outputkegiatanService = outputKegiatan;
export const pengeluaranpajakService = pengeluaranPajak;
export const realizationPengeluaranKegiatan = pengeluaranKegiatan;

export const getRealizationAll = async (
  ref: any,
  params: any,
): Promise<any> => {
  let response: any = await api.get<any>(`${basePath}/${ref}`, {
    params,
  });
  return response.data.return;
};
