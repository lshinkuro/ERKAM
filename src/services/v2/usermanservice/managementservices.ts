/** @format */

import api from "../../../utils/api";
import { usermanService } from "../constant";
import qs from "query-string";

const basePath = `${usermanService}/management-user`;
const formUrlEncodedHeader = {
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
};

export type GetUserParams = {
  group?: string;
  activated?: number;
};

export const getUsers = async (getUserParams?: GetUserParams) => {
  try {
    const response = await api.get(
      `${basePath}/get-user`,
      getUserParams !== null ? { params: getUserParams } : {},
    );
    return response.data.return;
  } catch (error) {
    console.log(error);
  }
};

export const getRole = async () => {
  try {
    const response = await api.get(`${basePath}/role`);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const postUsers = async (params: any) => {
  const response = await api.post(`${basePath}/create-user`, params);
  return response.data.return;
};

export const deleteUsers = async (id: string) => {
  const response = await api.delete(`${basePath}/soft-delete/${id}`);
  return response.data.return;
};

export const editUsers = async (id: string, params: any) => {
  const response = await api.put(`${basePath}/edit-user/${id}`, params);
  return response.data.return;
};

export const checkUsernameOrEmail = async (uid: String, isEmail: boolean) => {
  try {
    const uri = isEmail ? "check-email" : "check-username";
    const reqBody = isEmail
      ? qs.stringify({ email: uid })
      : qs.stringify({ username: uid });
    const response = await api.post(
      `${basePath}/${uri}`,
      reqBody,
      formUrlEncodedHeader,
    );
    if (response.data.success === 0) throw Error(response.data.meta.success);
    return response;
  } catch (error) {
    console.log(error);
  }
};
