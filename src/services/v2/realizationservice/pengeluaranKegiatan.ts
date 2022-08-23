/** @format */

import api from "../../../utils/api";
import { planningService, realizationService } from "../constant";

const basePlanningPath = `${planningService}`;
const baseRealizationPath = `${realizationService}`;
const rincianDefinitifStorageName = "rincian-belanja/definitif";
const rincianNotaStorage = "realisasi-pengeluaran-kegiatan/rincian-nota";
const jenisSumberDanaStorage = "jenis-sumber-dana";

export const GetRincianBelanjaDefinitif = async (tahun): Promise<any> => {
  try {
    const response = await api.get(
      `${basePlanningPath}/rencana-rincian-kegiatan-definitif/status?tahun=${tahun}`,
    );
    localStorage.setItem(
      rincianDefinitifStorageName,
      JSON.stringify(response.data.return),
    );
    return response.data.return;
  } catch (error) {
    // if (error.response) {
    //     throw error.response;
    // } else {
    //     throw error;
    // }
    console.log(error);
  }
};

export const GetJenisSumberDana = async (tahun): Promise<any> => {
  try {
    const response = await api.get(
      `${basePlanningPath}/rencana-rincian-kegiatan-definitif/sumber-dana?tahun=${tahun}`,
    );
    localStorage.setItem(
      jenisSumberDanaStorage,
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

export const getRealisasiKegiatan = async (tahun): Promise<any> => {
  try {
    const response = await api.get(
      `${baseRealizationPath}/realizations/biaya/?tahun=${tahun}`,
    );
    localStorage.setItem(
      rincianNotaStorage,
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

export const getRealisasiKegiatanId = async (id: any): Promise<any> => {
  const response = await api.get(
    `${baseRealizationPath}/realizations/biaya/?id=${id}`,
  );
  return response.data.return;
};

export const notaOperation = async (
  payload: any,
  state: any,
  id: any,
): Promise<any> => {
  if (state == "create") {
    const response = await api.post(
      `${baseRealizationPath}/realizations/biaya`,
      payload,
    );
    console.log("NEW DATA: ", response);
  } else if (state == "update") {
    const response = await api.put(
      `${baseRealizationPath}/realizations/biaya/${id}`,
      payload,
    );
    console.log("EDIT DATA: ", response);
  } else {
    const response = await api.delete(
      `${baseRealizationPath}/realizations/biaya/${id}`,
      payload,
    );
  }
};

export const ApprovalOperation = async (
  payload: any,
  id: any,
): Promise<any> => {
  const response = await api.put(
    `${baseRealizationPath}/realizations/biaya/approval/${id}`,
    payload,
  );
  console.log("APPROVAL STATUS: ", response);
};

export const RealizationOperation = async (payload: any): Promise<any> => {
  const response = await api.post(
    `${baseRealizationPath}/realizations/biaya/realisasi`,
    payload,
  );
  console.log("APPROVAL STATUS: ", response);
};

export const logsAllNotaPengeluaranKegiatan = async (
  tahun?: any,
): Promise<any> => {
  try {
    const response = await api.get(
      `${baseRealizationPath}/realizations/biaya/logs`,
      {
        params: {
          tahun: tahun,
        },
      },
    );
    localStorage.setItem(
      "logs-pengeluaran-kegiatan-all",
      JSON.stringify(response.data.return),
    );
    return response.data.return;
  } catch (error) {
    // if (error.response) throw error.response;
    // else throw error;
    console.log(error);
  }
};

export const logsNotaPengeluaranKegiatanID = async (
  tahun?: any,
  id?: any,
): Promise<any> => {
  try {
    // realisasi/pengeluaran-madrasah/list/nota/logs/:id
    // /rencana-rincian-kegiatan-id?rencanaRincianKegiatanId=84517c00-7930-4c9f-8d1c-281a0ccb4f36&tahun=2021
    const response = await api.get(
      `${baseRealizationPath}/realizations/biaya/logs/rencana-rincian-kegiatan-id?rencanaRincianKegiatanId=${id}&`,
      {
        params: {
          tahun: tahun,
        },
      },
    );
    localStorage.setItem(
      "logs-pengeluaran-kegiatan-id",
      JSON.stringify(response.data.return),
    );
    return response.data.return;
  } catch (error) {
    // if (error.response) throw error.response;
    // else throw error;
    console.log(error);
  }
};
