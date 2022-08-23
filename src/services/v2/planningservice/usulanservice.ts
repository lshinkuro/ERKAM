/** @format */

import api from "../../../utils/api";
import { planningService } from "../constant";
import { removeDuplicate, uuidv4 } from "../../../utils/helper";
// import response from "../../../pages/Rencana/RencanaKegiatanDanAnggaran/Rincian/List/response";

const basePath = `${planningService}/usulan`;
const storageName = "usulankegiatan";

export const getUsulanKegiatan = async () => {
  try {
    const response = await api.get(`${basePath}`);
    localStorage.setItem(storageName, JSON.stringify(response.data.return));
    return response.data.return;
  } catch (error) {
    console.log(error);
    // if (error.response) throw error.response;
    // else throw error;
  }
};

export type UsulanKegiatanBody = {
  id?: string;
  tahun?: number;
  no_tiket?: string;
  no_tiket_format?: string;
  pengusul?: string;
  kode_snp?: string;
  nama_snp?: string;
  keterangan?: string;
  usulan_nama_kegiatan?: string;
  usulan_kode_bos?: string;
  usulan_nama_bos?: string;
  usulan_nama_sub_kegiatan?: string;
  kode_provinsi?: string;
  kode_kabkota?: string;
  status_usulan?: string;
  respon_date?: Date;
  respon_role?: string;
  respon_user_id?: string;
  kepala_madrasah_approved?: number;
  kepala_madrasah_approved_by?: string;
  kepala_madrasah_komentar?: string;
  kepala_madrasah_approved_date?: Date;
  kabkota_approved?: number;
  kabkota_approved_by?: string;
  kabkota_komentar?: string;
  kabkota_approved_date?: Date;
  provinsi_approved?: number;
  provinsi_approved_by?: string;
  provinsi_komentar?: string;
  provinsi_approved_date?: Date;
  pusat_approved?: number;
  pusat_approved_by?: string;
  pusat_komentar?: string;
  pusat_approved_date?: Date;

  //   sub_kegiatan: any;
  isNew?: boolean;
  aksi?: string;
  komentar?: string;
  is_approve?: number;

  created_by?: string;
  updated_by?: string;
  created_at?: Date;
  updated_at?: Date;
};

export const changeSameStatus = async (payload, url: any) => {
  try {
    await api.put(`${planningService}/change-status`, payload);
    const res = await api.get(`${planningService}/usulan?tipe_usulan=1`);
    localStorage.setItem(url, JSON.stringify(res.data.return));
    return res.data.return;
  } catch (err) {
    console.log(err);
  }
};

export const changeKomponenStatus = async (payload, url: any) => {
  try {
    await api.put(`${planningService}/change-status`, payload);
    const res = await api.get(`${planningService}/usulan?tipe_usulan=3`);
    localStorage.setItem(url, JSON.stringify(res.data.return));
    return res.data.return;
  } catch (err) {
    console.log(err);
  }
};

export const deleteUsulanKegiatan = async (id: any, url: any) => {
  try {
    const localData = JSON.parse(localStorage.getItem(url)!);
    const newLocalData = localData.filter((data) => data.id !== id);
    if (window.navigator.onLine) {
      await api.delete(`${planningService}/kegiatan/${id}`);
      localStorage.setItem(url, JSON.stringify(newLocalData));
    } else {
      localStorage.setItem(url, JSON.stringify(newLocalData));
    }
    return newLocalData;
  } catch (err) {
    console.log(err);
  }
};

// export const deleteUsulan = async(id:any,url:any)=>{
//   try{
//     const localData = JSON.parse(localStorage.getItem(url)!);
//     const newLocalData = localData.filter(data=>data.id !== id);
//     await api.delete(`${planningService}/`)
//   }catch{

//   }
// }

export const setApproveOrReject = async (reqBody: any, id: any, url: any) => {
  let localData = JSON.parse(localStorage.getItem(url)!);
  removeDuplicate(localData, "id", id);
  const res: any = await api.put<any>(`${basePath}/${id}`, reqBody);
  localStorage.setItem(url, JSON.stringify([res.data.return, ...localData]));
};
export const getUsulans = async (
  ref: any,
  params: any,
  namaLocalStorage: any,
): Promise<any> => {
  let response: any = await api.get<any>(
    "/v2/planning-services/" + ref + "?tipe_usulan=" + params,
  );
  let tmp0: any = response.data.return;

  const value = JSON.stringify(tmp0);
  localStorage.setItem(namaLocalStorage, value);
  return response.data.return;
};

export const saveOffline = async (data: any, id: any) => {
  try {
    let localData = JSON.parse(localStorage.getItem(id)!);
    let localDataTmp: any = [];
    if (data === null) {
      localDataTmp = localData;
    } else {
      if (!data.usulan.id || data.usulan.id === null) data.usulan.id = uuidv4();
      removeDuplicate(localData, "id", data.usulan.id);
      localDataTmp = [data, ...localData];
      console.log("data baru :", data.usulan.id);
    }
    if (window.navigator.onLine) {
      // let tmp0: any = [];
      // localStorage.setItem(id, JSON.stringify(localDataTmp));
      for await (const el0 of localDataTmp) {
        if ((data !== null && el0?.id === data?.id) || el0.isNew) {
          const baru = await api.post<any>(`${basePath}`, el0);
          console.log("data baru :", baru);
          // await getUsulans("usulan", 2, "usulanSubKegiatan").then((data)=>{
          //   localStorage.setItem(id, JSON.stringify(data));
          //   console.log("get lagi",data)})
        }
      }
    } else {
      localDataTmp.forEach((el0: any, key: number) => {
        localDataTmp[key]["isNew"] = "databaru";
      });
      if (data.usulan.id) {
        localStorage.setItem(id, JSON.stringify(localDataTmp));
      } else {
        console.log("no connection");
      }
    }
  } catch (error) {
    console.log(error);
  }
  return data;
};

export const changeStatus = async (params: UsulanKegiatanBody) => {
  try {
    let localData = JSON.parse(localStorage.getItem(storageName)!);
    // params = setApproveOrReject(params, params.id, "usulankegiatan1");
    let localDataTmp: any = [];
    removeDuplicate(localData, "id", params.id);
    if (params === null) {
      localDataTmp = localData;
    } else {
      if (!params.id || params.id === null) params.id = uuidv4();
      localDataTmp = [params, ...localData];
    }
    if (window.navigator.onLine) {
      localStorage.setItem(storageName, JSON.stringify(localDataTmp));
      localDataTmp.forEach((el: UsulanKegiatanBody) => {
        if (el.id === params.id) {
          api.put<any>(`${basePath}/change-status/${el.id}`, el);
        } else if (el.isNew) {
          api.put<any>(`${basePath}/change-status/${el.id}`, el);
        }
      });
    } else {
      localDataTmp.forEach((el0: any, key: number) => {
        localDataTmp[key]["isNew"] = "databaru";
      });
      if (params.id) {
        localStorage.setItem(storageName, JSON.stringify(localDataTmp));
      } else {
        console.log("no connection");
      }
    }
  } catch (error) {
    console.log(error);
    // if (error.response) throw error.response;
    // else throw error;
  }
};
