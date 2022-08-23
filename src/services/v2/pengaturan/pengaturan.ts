import api from "../../../utils/api";
import qs from "query-string";
import { referenceService } from "../constant";

const basePath = `${referenceService}`;
//get staff madrasah
export const getStaffMadrasah = async (queryParam: string): Promise<any> => {
  const params = {
    queryParam: JSON.stringify(queryParam),
  };
  const response = await api.get<any>("/pengaturan/staf-madrasah", { params });
  return response.data.return;
};

export const editStaffMadrasah = async (queryParam: object): Promise<any> => {
  const params = {
    queryParam: JSON.stringify(queryParam),
  };
  const response = await api.post<any>("/pengaturan/staf-madrasah", { params });
  return response.data.return;
};

export const addStaffMadrasah = async (queryParam: object): Promise<any> => {
  const response = await api.post<any>(
    "/pengaturan/add-staf-madrasah",
    qs.stringify(queryParam),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return response.data.return;
};

//get staff madrasah
export const getRekening = async (
  limit: number,
  offset: number,
  tahun: string
): Promise<any> => {
  const response = await api.get<any>("/pengaturan/rekening-bank", {
    params: { limit: limit, offset: offset, queryParam: { tahun: tahun } },
  });
  return response.data.return;
};

export const addRekening = async (tmp0: any) => {
  console.log("input", tmp0);
  const result = await api.post(
    "/pengaturan/save-rekening-bank",
    qs.stringify(tmp0),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return result.data.return;
};

export const getPenerima = async (): Promise<any> => {
  const response = await api.get<any>(`${basePath}/penerima?activated=1`);
  let tmp0: any = response.data.return;
  localStorage.setItem("penerimaRekening", JSON.stringify(tmp0));
  return response.data.return;
};



export const addPenerima = async (params: any) => {
  const result = await api.post(`${basePath}/penerima`, params);
  const data = result.data.return;
  console.log("berhasil input penerima", data)
  return data;
};

export const deletePenerima = async (
  id?: any
): Promise<any> => {
  let tmp0 = JSON.parse(localStorage.getItem("penerimaRekening")!);
  let tmp1: any = null;
  tmp1 = tmp0.filter((obj: any) => {
    return obj.id !== id;
  });
  const result = await api.delete<any>(`${basePath}/penerima/` + id);
  const data = result.data.return;
  return data;
};


export const getPenerimaController = async (id?: any): Promise<any> => {
  const response = await api.get<any>(`${basePath}/penerima-rekening?activated=1?id=${id}`);
  let tmp0: any = response.data.return;
  return response.data.return;
};

export const addPenerimaController = async (params: any) => {
  const result = await api.post(`${basePath}/penerima-rekening`, params);
  const data = result.data.return;
  console.log("berhasil input penerima", data)
  return data;
};

export const getPenerimaControllerId = async (id?: any): Promise<any> => {
  const response = await api.get<any>(`${basePath}/penerima-rekening?activated=1&d_penerima_id=${id}`);
  let tmp0: any = response.data.return;
  return response.data.return;
};

export const deletePenerimaControllerId = async (id?: any): Promise<any> => {
  const response = await api.delete<any>(`${basePath}/penerima-rekening/${id}`);
  let tmp0: any = response.data.return;
  return response.data.return;
};






// /v2/reference-services/tipe-penerima

export const gettipePenerima = async (): Promise<any> => {
  const response = await api.get<any>(`${basePath}/tipe-penerima`);
  let tmp0: any = response.data.return;
  localStorage.setItem("tipePenerima", JSON.stringify(tmp0));
  return response.data.return;
};