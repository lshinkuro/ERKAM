/** @format */
/**update fix */
import api from "../../../utils/api";
import { usermanService } from "../constant";
const basePath = `${usermanService}/profile`;

/** Get My Profile */
export const getProfile = async () => {
  const response = await api.get(`${basePath}/my-profile`);
  return response.data.return;
};

/** Get Edit Profile */
export const editProfile = async (params: any) => {
  const response = await api.put(`${basePath}/edit-profile`, params);
  return response.data.return;
};

/** Get Edit Profile  NIK*/
export type nikProfileParams = {
  nik: string;
};

export const editProfileNIK = async (params: nikProfileParams) => {
  const response = await api.put(`${basePath}/edit-nik`, params, {
    headers: { "Content-Type": "application/json" },
  });
  return response;
};

/** Get Edit Profile Ganti Password */
export type passParams = {
  password_lama: string;
  password_baru: string;
};

export const editProfileGantiPassword = async (params: passParams) => {
  const response = await api.put(`${basePath}/ganti-password`, params, {
    headers: { "Content-Type": "application/json" },
  });
  return response;
};

/** Post Profile Code Email by profileId and emailTo */
type profileCodeEmailParams = {
  profileId: string;
  emailTo: string;
};

export const postProfileCodeEmail = async (params: profileCodeEmailParams) => {
  const response = await api.post<any>(`${basePath}/code-email`, params);
  return response.data.return;
};

/** Post Update Email  */
type profileUpdateEmailParams = {
  profileId: string;
  codeEmail: string;
  emailNew: string;
};

export const postProfileUpdateEmail = async (
  params: profileUpdateEmailParams,
) => {
  const response = await api.post<any>(`${basePath}/update-email`, params);
  return response.data.return;
};

/** Post Profile Upload Photo  */
export const editProfileUploadPhoto = async (
  data: any,
  id: any,
  // params: any,
) => {
  try {
    const response = await api.post(`${basePath}/upload-photo/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};
