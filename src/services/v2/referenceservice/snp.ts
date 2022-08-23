import api from "../../../utils/api";
import { referenceService } from "../constant";

const basePath = `${referenceService}`;

export const getSnp = async (): Promise<any> => {
  const response = await api.get(`${basePath}/snp`, {
    params: {
      activated: 1,
    },
  });
  localStorage.setItem("snp", JSON.stringify(response.data.return));
  return response.data.return;
  // } catch (error) {
  //     if (error.response)
  //         throw error.response;
  //     else
  //         throw error;
  // }
};

export const postSnp = async (params: any) => {
  const response = await api.post(`${basePath}/snp`, params);
  return response.data.return;
};

export const deleteSnp = async (params: any) => {
  const response = await api.delete(`${basePath}/snp/${params}`);
  return response.data.return;
};
