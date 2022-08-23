import api from "../../../utils/api";
import { referenceService } from "../constant";

const basePath = `${referenceService}`;

export const getSubKegiatan = async (): Promise<any> => {
  const response = await api.get(`${basePath}/sub-kegiatan`, {
    params: {
      activated: 1,
    },
  });
  localStorage.setItem("sub-kegiatan", JSON.stringify(response.data.return));
  return response.data.return;
  // } catch (error) {
  //     if (error.response)
  //         throw error.response;
  //     else
  //         throw error;
  // }
};

export const postSubKegiatan = async (params: any) => {
  const response = await api.post(`${basePath}/sub-kegiatan`, params);
  return response.data.return;
};

export const deleteSubKegiatan = async (params: any) => {
  const response = await api.delete(`${basePath}/sub-kegiatan/${params}`);
  return response.data.return;
};
