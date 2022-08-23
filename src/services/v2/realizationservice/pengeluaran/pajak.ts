/** @format */

import api from "../../../../utils/api";
// import { realizationService } from "../../constant";
// import { removeDuplicate, uuidv4 } from "../../../../utils/helper";
// import qs from "query-string";
// import { AnyCnameRecord } from "dns";

const tahunActive =
  localStorage.getItem("curTahunFromSelListOnHeader") ||
  new Date().getFullYear();

export const getReferensiSumberDanaCurrent = async (): Promise<any> => {
  const response = await api.get<any>(
    "/v2/reference-services/sumber-dana?activated=1&tahun=" + tahunActive,
  );
  let tmp0: any = response.data.return;
  const value = JSON.stringify(tmp0);
  localStorage.setItem("referensi-sumberdana", value);
  return response.data.return;
};

export const getReferensiTipeKas = async (): Promise<any> => {
  const response = await api.get<any>("/v2/reference-services/tipe-kas");
  let tmp0: any = response.data.return;
  const value = JSON.stringify(tmp0);
  localStorage.setItem("referensi-tipekas", value);
  return response.data.return;
};

export const getReferensiPajak = async (): Promise<any> => {
  const response = await api.get<any>("/v2/reference-services/pajak");
  let tmp0: any = response.data.return;
  const value = JSON.stringify(tmp0);
  localStorage.setItem("referensi-tipekas", value);
  return response.data.return;
};

export const getReferensiOutputKegiatan = async (): Promise<any> => {
  const response = await api.get<any>(
    "/v2/reference-services/kegiatan?tahun=2021&activated=1",
  );
  const value = JSON.stringify([response.data.return]);
  localStorage.setItem("referensi-kegiatan", value);
  return response.data.return;
};
