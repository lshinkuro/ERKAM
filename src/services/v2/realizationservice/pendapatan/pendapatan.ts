import api from "../../../../utils/api";
import { realizationService } from "../../constant";
import { removeDuplicate, uuidv4 } from "../../../../utils/helper";
import qs from "query-string";
import { AnyCnameRecord } from "dns";

const basePath = `${realizationService}/realizations`;

type Params = {
  groupRole: string
}

export const getPendapatan = async (params: Params): Promise<any> => {
  const response = await api.get(`${basePath}/pendapatan`);
  if (params.groupRole === "madrasah")
    localStorage.setItem(
      "realisasi-pendapatan",
      JSON.stringify(response.data.return)
    );
  return response.data.return;
};

export const postPendapatan = async (data:any): Promise<any> => {
  const response = await api.post<any>(`${basePath}/pendapatan`,data);
  return response.data.return;
};

export const getPendapatanId = async (id:AnyCnameRecord): Promise<any> => {
  const response = await api.get(`${basePath}/pendapatan/${id}`);
  return response.data.return;
};

export const putPendapatanId = async (data:any,id:any): Promise<any> => {
  const response = await api.put<any>(`${basePath}/pendapatan/${id}`,data);
  return response.data.return;
};

export const putPendapatanApproval = async (data:any,id:any): Promise<any> => {
  const response = await api.put<any>(`${basePath}/pendapatan/${id}/approval`,data);
  return response.data.return;
};

export const putPendapatanDisApproval = async (data:any,id:any): Promise<any> => {
  const response = await api.put<any>(`${basePath}/pendapatan/${id}/disapproval`,data);
  return response.data.return;
};

export const putPendapatanRealisasi = async (data:any,id:any): Promise<any> => {
  const response = await api.put<any>(`${basePath}/pendapatan/${id}/realisasi`,data);
  return response.data.return;
};

export const delPendapatan = async (id:any): Promise<any> => {
  const response = await api.delete<any>(`${basePath}/pendapatan/${id}`);
  return response.data.return;
};

export const getLogsPendapatan = async (): Promise<any> => {
  const response = await api.get(`${basePath}/pendapatan/logs`);
  return response.data.return;
};

export const postPendapatanOffline = async (data: any, id?: any) => {
    try {
      let localData = JSON.parse(localStorage.getItem(id)!);
      let localDataTmp: any = [];
      if (data === null) {
        localDataTmp = localData;
      } else {
        if (!data.id || data.id === null) data.id = uuidv4();
        removeDuplicate(localData, "id", data.id);
        localDataTmp = [data, ...localData];
        console.log("data baru :",data.usulan.id)
      }
      if (window.navigator.onLine) {
        for await (const el0 of localDataTmp) {
          if ((data !== null && el0?.id === data?.id) || el0.isNew) {
            const baru = await api.post<any>(`${basePath}/pendapatan`, el0);
            console.log("data baru :",baru)
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


