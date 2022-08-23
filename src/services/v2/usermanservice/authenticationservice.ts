/** @format */

import api from "../../../utils/api";
import { usermanService } from "../constant";

const basePath = `${usermanService}/auth`;

type prelogin = {
  username: string;
  password: string;
};

export const PreLogin = async (params: prelogin) => {
  const bodyParams = new URLSearchParams();
  bodyParams.append("username", params.username);
  bodyParams.append("password", params.password);
  const res = await api.post(`${basePath}/pre-login`, bodyParams, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return res.data;
};

type login = {
  username: string;
  password: string;
  kodeRole: string;
};

export const Login = async (params: login) => {
  const bodyParams = new URLSearchParams();
  bodyParams.append("username", params.username);
  bodyParams.append("password", params.password);
  bodyParams.append("kode_role", params.kodeRole);
  const res = await api.post(`${basePath}/login`, bodyParams, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return res.data;
};

// export const getRoleAuth = async (params: any) => {
//   const res = await api.get(
//     `${basePath}/available-roles?username=${params.username}&madrasahId=${params.madrasahID}`,
//     { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
//   );
//   return res.data;
// };

// export const getMadrasahAuth = async (params: any) => {
//   const res = await api.get(
//     `${basePath}/available-madrasah?username=${params.username}`,
//     { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
//   );
//   return res.data;
// };

type forgot = {
  nik: string;
};

export const ForgotPass = async (params: forgot) => {
  const response = await api.post<any>(
    `${usermanService}/public/forgot`,
    params,
  );
  return response;
};

type reset = {
  token: string;
  password: string;
};

export const ResetPass = async (params: reset) => {
  const response = await api.post<any>(
    `${usermanService}/public/reset`,
    params,
  );
  return response;
};

export const Registrasi = async (params: any) => {
  const res = await api.post(
    `${usermanService}/register/pre-registrasi-madrasah`,
    params,
    { headers: { "Content-Type": "application/json" } },
  );
  return res.data.return;
};
