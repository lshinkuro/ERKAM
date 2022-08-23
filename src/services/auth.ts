/** @format */

import api from "../utils/api";

type login = {
  username: string;
  password: string;
  kode_role: string;
  madrasah_id: string;
};

export const Login = async (params: login) => {
  const bodyParams = new URLSearchParams();
  bodyParams.append("username", params.username);
  bodyParams.append("password", params.password);
  bodyParams.append("kode_role", params.kode_role);
  const res = await api.post("/v2/user-services/auth/login", bodyParams, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return res.data;
};

export const Madrasah = async (params: login) => {
  const res = await api.get(
    `/v2/user-services/auth/available-madrasah?username=${params.username}`,
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
  );
  return res.data;
};

export const Role = async (params: login) => {
  const res = await api.get(
    `/v2/user-services/auth/available-roles?username=${params.username}&madrasahId=${params.madrasah_id}`,
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
  );
  return res.data;
};

export const Tahun = async () => {
  const res = await api.get(`/v2/reference-services/tahun?activated=1`, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return res.data;
};

export const Reg = async (params) => {
  const bodyParams = params;
  const res = await api.post(
    "/v2/user-services/register/pre-registrasi-madrasah",
    bodyParams,
    { headers: { "Content-Type": "application/json" } },
  );
  return res.data;
};
