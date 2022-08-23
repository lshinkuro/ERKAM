/** @format */

import api from "../../../utils/api";
import { referenceService } from "../constant";

const basePath = `${referenceService}`;

/** Get All Reference Activated  */
export const getReferenceAll = async (ref: any, params: any): Promise<any> => {
  try {
    let response: any = await api.get<any>(`${basePath}/${ref}`, {
      params,
    });
    return response.data.return;
  } catch (error) {
    console.log(error);
  }
};

/** Get All Bank Activated  */
type activatedParams = {
  activated: number;
};
export const getBank = async (params: activatedParams) => {
  try {
    const response = await api.get<any>(`${basePath}/bank`, { params });
    return response.data.return;
  } catch (error) {
    console.log(error);
  }
};

/** Get All Tipe Penerima Activated  */

export const getTipePenerima = async (params: activatedParams) => {
  try {
    const response = await api.get<any>(`${basePath}/tipe-penerima`, {
      params,
    });
    return response.data.return;
  } catch (error) {
    console.log(error);
  }
};
/** Check Kembali  */

export const putOutputKegiatan = async (params: any): Promise<any> => {
  let uuid = params.id;
  const response = await api.put(`${basePath}/output-kegiatan/${uuid}`, params);
  return response.data.return;
};

export const getProvinsi = async () => {
  const response = await api.get(`${basePath}/provinsi`, {
    params: {
      activated: 1,
    },
  });
  return response.data.return;
};

export const getKelurahan = async (param: any) => {
  const response = await api.get(`${basePath}/kelurahan`, {
    params: param,
  });
  return response.data.return;
};

export const getKecamatan = async (idKabupaten?: any) => {
  const response = await api.get(`${basePath}/kecamatan`, {
    params: {
      activated: 1,
      kode_kabkota: idKabupaten,
    },
  });
  return response.data.return;
};

export const getKabKota = async (idProvinsi?: any) => {
  const response = await api.get(`${basePath}/kabkota`, {
    params: {
      activated: 1,
      kode_provinsi: idProvinsi,
    },
  });
  return response.data.return;
};

export const getSumberDana = async () => {
  const response = await api.get(`${basePath}/sumber-dana`, {
    params: {
      activated: 1,
    },
  });
  return response.data.return;
};

export const getRekeningBelanja = async () => {
  const response = await api.get(`${basePath}/rekening-belanja`, {
    params: {
      activated: 1,
    },
  });
  localStorage.setItem(
    "rekening-belanja",
    JSON.stringify(response.data.return),
  );
  return response.data.return;
};

export const delRekeningBelanja = async (params: any) => {
  const response = await api.delete(`${basePath}/rekening-belanja/${params}`);
  return response.data.return;
};

export const postRekeningBelanja = async (params: any) => {
  const response = await api.post(`${basePath}/rekening-belanja`, params, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data.return;
};

export const putRekeningBelanja = async (params: any) => {
  let uuid = params.id;
  const response = await api.put(
    `${basePath}/rekening-belanja/${uuid}`,
    params,
  );
  return response.data.return;
};

export const getPenerima = async () => {
  const response = await api.get(`${basePath}/penerima`, {
    params: {
      activated: 1,
    },
  });
  localStorage.setItem(
    "penerimaRekening",
    JSON.stringify(response.data.return),
  );
  return response.data.return;
};

export const postPenerima = async (params: any) => {
  const response = await api.post(`${basePath}/penerima`, params);
  return response.data.return;
};

export const editPenerima = async (params: any) => {
  let uuid = params.id;
  const response = await api.put(`${basePath}/penerima/${uuid}`, params);
  return response.data.return;
};

export const deletePenerima = async (params: any) => {
  const response = await api.delete(`${basePath}/penerima/${params}`);
  return response.data.return;
};

export const getPenerimaRekening = async (param: any) => {
  const response = await api.get(`${basePath}/penerima-rekening`, {
    params: param,
  });
  return response.data.return;
};

export const postPenerimaRekening = async (params: any) => {
  const response = await api.post(`${basePath}/penerima-rekening`, params);
  return response.data.return;
};

export const editPenerimaRekening = async (params: any) => {
  let uuid = params.id;
  const response = await api.put(
    `${basePath}/penerima-rekening/${uuid}`,
    params,
  );
  return response.data.return;
};

export const deletePenerimaRekening = async (params: any) => {
  const response = await api.delete(`${basePath}/penerima-rekening/${params}`);
  return response.data.return;
};

export const getRef = async (
  ref: any,
  tahun: any,
  storageName: any,
): Promise<any> => {
  let response: any = await api.get<any>(
    `${basePath}/${ref}?tahun=${tahun}&activated=${1}`,
  );
  localStorage.setItem(storageName, JSON.stringify(response.data.return));
  return response.data.return;
};
