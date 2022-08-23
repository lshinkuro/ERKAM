/** @format */

import api from "../utils/api";

export const getProfileMadrasah = async () => {
  const result: any = await api.get(
    "/management-user/profil-pengguna?queryParam=1&limit=0&offset=0",
  );
  const data = [result.data.return];
  return data;
};

export const getMyMadrasah = async (ref: any): Promise<any> => {
  const response: any = await api.get<any>(
    "/v2/user-services/madrasah?activated=1&kode_kabkota=" + ref,
  );
  // let tmp0: any = response.data.return;

  const value = JSON.stringify([response.data.return]);
  localStorage.setItem("madrasahdropdown", value);
  return response.data.return;
};

export const singleCode = async (param: object): Promise<any> => {
  // let tmp1: any = removeDuplicate(tmp0, "id", data.id);
  // localStorage.setItem(id, JSON.stringify([response.data.return, ...tmp1]));

  try {
    const res = await api.post(
      "/v2/user-services/register/register-madrasah-single",
      param,
      { headers: { "Content-Type": "application/json" } },
    );
    return res;
  } catch (error) {
    console.log(error);
    // if (error.response)
    //   throw error.response;
    // else
    //   throw error;
  }
};

export const submitFile = async (params: any) => {
  try {
    const response = await api.post(
      "/v2/user-services/register/register-madrasah",
      params,
      { headers: { "Content-Type": "multipart/form-data" } },
    );

    if (response.data.success === 0) throw Error(response.data.meta.success);
    return response;
  } catch (error) {
    console.log(error);
    // if (error.response) throw error.response;
    // else throw error;
  }
  // const response = await api.post(
  //   "/v2/user-services/register/register-madrasah",
  //   params,
  //   {
  //     headers: { 'Content-Type': 'multipart/form-data' }
  //   }
  // );
  // return response;
};
