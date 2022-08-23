/** @format */

import api from "../../../utils/api";
import { usermanService } from "../constant";
const basePath = `${usermanService}/madrasah`;

/** Edit Logo Madrasah */
export type editLogoParams = {
  data: any;
  id: string;
};
export const editLogoMadrasah = async (params: editLogoParams) => {
  try {
    const response = await api.post(
      `${basePath}/${params.id}/upload`,
      params.data,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
/** Edit Logo Madrasah */

export const editMadrasah = async (params: any) => {
  try {
    const response = await api.put(`${basePath}/${params.id}`, params);
    return response.data.return;
  } catch (error) {
    console.log(error);
  }
};

/** Belum Bener */
export const getMadrasah = async () => {
  const response = await api.get<any>("/v2/user-services/my-madrasah");
  const data = response.data.return;
  return data;
};

export const singleCode = async (param: object): Promise<any> => {
  try {
    const res = await api.post(
      `${usermanService}/register/register-madrasah-single`,
      param,
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const submitFile = async (params: any) => {
  try {
    const response = await api.post(
      `${usermanService}/register/register-madrasah`,
      params,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );

    if (response.data.success === 0) throw Error(response.data.meta.success);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const codeCek = async (params: string) => {
  try {
    const res = await api.get(
      `${usermanService}/register/cek-kode-registrasi/${params}`,
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
