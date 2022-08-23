/** @format */

import api from "../../../utils/api";

//PPK
export const getMadrasah = async (params?: any): Promise<any> => {
  const response = await api.get<any>(
    `/v2/user-services/madrasah?activated=1&kode_kabkota=${params}`,
  );
  return response.data.return;
};
//put ppk
export const putMadrasahPPK = async (params?: any): Promise<any> => {
  const id = params.id;
  const kode_level_ppk = params.kode_level_ppk;
  const response = await api.put<any>(`/v2/user-services/madrasah/${id}`, {
    kode_level_ppk,
  });

  return response.data.return;
};

//read madrasah ppk
export const getMadrasahPPK = async (params?: any): Promise<any> => {
  const response = await api.get<any>(`/v2/user-services/madrasah/${params}`);

  return response.data.return;
};
//getLevelPPK
export const getLvPPK = async (params?: any): Promise<any> => {
  const response = await api.get<any>(
    `/v2/reference-services/level-ppk?activated=1&kode_provinsi=${params}`,
  );

  return response.data.return;
};
