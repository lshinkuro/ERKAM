/** @format */

import api from "../../../utils/api";
import { isObject, removeDuplicate, uuidv4 } from "../../../utils/helper";
import { planningService } from "../constant";

const basePath = `${planningService}`;

export const getPlanningAll = async (ref: any, params: any): Promise<any> => {
  try {
    let response: any = await api.get<any>(`${basePath}/${ref}`, { params });

    return response.data.return;
  } catch (error) {
    console.log(error);
  }
};

export const getPlanning = async (
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

export const getPlanningLogs = async (
  ref: string,
  tahun: number,
  storageName: string,
) => {
  const response = await api.get(`${basePath}/${ref}/logs?tahun=${tahun}`);
  console.log(response.data.return);
  localStorage.setItem(storageName, JSON.stringify(response.data.return));
  return response.data.return;
};

export const saveOffline = async (
  data: any,
  id: any,
  status?: any,
  localStorageName?: any,
) => {
  try {
    let localData = JSON.parse(localStorage.getItem(localStorageName || id)!);
    let localDataTmp: any = [];
    if (status === "hapus") {
      data.activated = data.activated === "1" ? "0" : "1";
    }
    if (data === null) {
      localDataTmp = localData;
    } else {
      if (!data.id || data.id === null) {
        data.id = uuidv4();
      }
      removeDuplicate(localData, "id", data.id);
      if (isObject(data)) {
        localDataTmp = [data, ...localData];
      } else {
        localDataTmp = [...data, ...localData];
      }
    }
    if (window.navigator.onLine) {
      if (status !== "tambah") {
        localStorage.setItem(id, JSON.stringify(localDataTmp));
      }
      for (let i = 0; i < localDataTmp.length; i++) {
        const el0 = localDataTmp[i];
        if ((data !== null && el0?.id === data?.id) || el0.isNew) {
          if (status === "hapus") {
            const res = await api.delete<any>(`${basePath}/${id}/${data.id}`);
            if (res?.status === 200) {
              const fromLocalStorage = JSON.parse(
                localStorage.getItem(localStorageName || id)!,
              );
              const afterDelete = fromLocalStorage.filter(
                (item) => item.id !== data.id,
              );
              localStorage.setItem(
                localStorageName || id,
                JSON.stringify(afterDelete),
              );
            }
          } else if (status === "edit") {
            // data.activated = data.activated === "1" ? "0" : "1";
            await api.put<any>(`${basePath}/${id}/${data.id}`, el0);
          } else if (status === "tambah") {
            const res: any = await api.post<any>(
              `${basePath}/${id}`,
              localStorageName === "rencana/rincian" ? [el0] : el0,
            );
            let tmpRes: any = [res?.data?.return, ...localData];
            if (
              id === "rencana-rincian-kegiatan" &&
              (status === "tambah" || status === "offline")
            ) {
              localStorage.setItem(
                localStorageName || id,
                JSON.stringify(tmpRes),
              );
            } else {
              localStorage.setItem(
                localStorageName || id,
                JSON.stringify(tmpRes),
              );
            }
          }
        }
      }
    } else {
      if (data.id) {
        localStorage.setItem(
          localStorageName || id,
          JSON.stringify(localDataTmp),
        );
      } else {
        console.log("no connection");
      }
    }
  } catch (error) {
    console.log(error);
    // return error
  }
  return data;
};
export const saveOnline = async (
  data?: any,
  url?: any,
  localStorageName?: any,
): Promise<any> => {
  await api.post<any>(`${basePath}/${url}`, data);
  const responseGet = await api.get<any>(`${basePath}/${url}`);

  await localStorage.setItem(
    localStorageName,
    JSON.stringify(responseGet.data.return),
  );
};

export const updateOnline = async (
  data?: any,
  url?: any,
  status?: any,
): Promise<any> => {
  let tmp0 = JSON.parse(localStorage.getItem(url)!) || "";
  let tmp1: any = "";
  if (data.id !== undefined) {
    tmp1 = tmp0.filter((obj: any) => {
      return obj.id !== data.id;
    });
  }
  let response: any = {};
  if (status === "edit") {
    response = await api.put<any>(`${basePath}/${url}/${data.id}`, data);
  } else if (status === "hapus") {
    response = await api.delete<any>(`${basePath}/${url}/${data.id}`);
  }
  let tmp2 = [response.data.return, ...(tmp1 || tmp0)];

  localStorage.setItem(url, JSON.stringify(tmp2));
  console.log("EDIT");
};

export const getRencanaIndikatifPendapatanLogs = async () => {
  try {
    const response = await api.get(
      `${basePath}/rencana-pendapatan-indikatif/logs`,
    );
    localStorage.setItem(
      "indikatif-pendapatan-logs",
      JSON.stringify(response.data.return),
    );
    return response.data.return;
  } catch (error) {
    console.log(error);
    // if (error.response) throw error.response;
    // else throw error;
  }
};

export const getRencanaKegiatanIndikatifBelanjaLogs = async (tahun?: any) => {
  try {
    const response = await api.get(
      `${basePath}/rencana/kegiatan-indikatif/logs`,
      {
        params: {
          tahun: tahun,
        },
      },
    );
    localStorage.setItem(
      "kegiatan-indikatif-belanja-logs",
      JSON.stringify(response.data.return),
    );
    return response.data.return;
  } catch (error) {
    console.log(error);
    // if (error.response) throw error.response;
    // else throw error;
  }
};

export const getAlokasi = async (id: any) => {
  try {
    const response = await api.get<any>(
      `${basePath}/rencana-pendapatan-indikatif/listalokasi/` + id,
    );
    return response.data.return;
  } catch (error) {
    console.log(error);
    // if (error.response) throw error.response;
    // else throw error;
  }
  // const data = response.data.return
  // localStorage.setItem("referensi-madrasah", JSON.stringify(data));
  // return data
};

// export const deleteRencanaBelanja = async (id:any, url: any) => {
//   try {
//     const localData = JSON.parse(localStorage.getItem(url)!);
//     const newLocalData = localData.filter(data => data.id !== id);
//     if (window.navigator.onLine) {
//       await api.delete(`${planningService}/rencana/kegiatan/${id}`);
//       localStorage.setItem(url, JSON.stringify(newLocalData));
//     } else {
//       localStorage.setItem(url, JSON.stringify(newLocalData));
//     }
//     return newLocalData;
//   }catch(err){
//     console.log(err);
//   }
// }
