/** @format */

import api from "../../../utils/api";
import { realizationService } from "../constant";
const basePath = `${realizationService}/realizations`;
const storageName = "realisasi-output-kegiatan";

export const getOutputKegiatan = async (tahun?: any) => {
  const response = await api.get(`${basePath}/output-kegiatan`, {
    params: {
      tahun: tahun,
    },
  });
  localStorage.setItem(storageName, JSON.stringify(response.data.return));
  return response.data.return;
};

export const getOutputKegiatanByRencanaKegiatan = async (id?: any) => {
  const response = await api.get(
    `${basePath}/output-kegiatan/rencana-kegiatan`,
    {
      params: {
        rencanaKegiatanId: id,
      },
    },
  );
  return response.data.return;
};

export const getOutputKegiatanLogs = async (tahun?: any) => {
  const response = await api.get(`${basePath}/output-kegiatan/logs`, {
    params: {
      tahun: tahun,
    },
  });
  localStorage.setItem(
    storageName + "-logs",
    JSON.stringify(response.data.return),
  );
  return response.data.return;
};

export const postOutputKegiatan = async (params: any) => {
  const response = await api.post(`${basePath}/output-kegiatan`, params, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data.return;
};

// export const putOutputKegiatan = async (params: any) => {
//     try {
//         const response = await api.post(`${basePath}/output-kegiatan`, params, {
//             headers: { "Content-Type": "application/json" },
//         });
//         return response.data.return;
//     } catch (error) {
//         if (error.response) throw error.response;
//         else throw error;
//     }
// };

export const delOutputKegiatan = async (params: any) => {
  const response = await api.delete(`${basePath}/output-kegiatan/${params}`);
  return response.data.return;
};

export const putOutputKegiatan = async (params: any): Promise<any> => {
  let uuid = params.id;
  const response = await api.put(`${basePath}/output-kegiatan/${uuid}`, params);
  return response.data.return;
};

export const approveOutputKegiatan = async (params: any): Promise<any> => {
  let uuid = params.id;
  const response = await api.put(
    `${basePath}/output-kegiatan/approval/${uuid}`,
    params,
  );
  return response.data.return;
};
