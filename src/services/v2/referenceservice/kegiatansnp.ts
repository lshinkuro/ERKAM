import api from "../../../utils/api";
import { referenceService } from "../constant";

const basePath = `${referenceService}`;

export const getKegiatanSnp = async (): Promise<any> => {
  const response = await api.get(`${basePath}/kegiatan-snp`, {
    params: {
      activated: 1,
    },
  });
  localStorage.setItem("kegiatan-snp", JSON.stringify(response.data.return));
  return response.data.return;
};

export const postKegiatanSnp = async (params: any) => {
  const response = await api.post(`${basePath}/kegiatan-snp`, params);
  return response.data.return;
};

export const deleteKegiatanSnp = async (params: any) => {
  const response = await api.delete(`${basePath}/kegiatan-snp/${params}`);
  return response.data.return;
};
