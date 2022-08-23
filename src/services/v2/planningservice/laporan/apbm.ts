import api from "../../../../utils/api";
import { planningService, usermanService } from "../../constant";

const basePathRealization = `${planningService}`;
const basePathUser = `${usermanService}`

export const browse = async (urlParam:string): Promise<any> => {
  try {
    const response = await api.get(
      `${basePathRealization}/laporan-rapbm-rekap?${urlParam}`
    )
    localStorage.setItem("laporan-rapbm-rekap", JSON.stringify(response.data.return));
    return response.data.return;
  } catch(e){
    console.log("e ", e)
    return []
  }
};

export const browseDashboard = async (urlParam:string): Promise<any> => {
  try {
    const response = await api.get(
      `${basePathRealization}/laporan-apbm-dashboard?${urlParam}`
    )
    localStorage.setItem("laporan-apbm-dashboard", JSON.stringify(response.data.return));
    return response.data.return;
  } catch(e){
    console.log("e ", e)
    return []
  }
};

export const getKantorProvinsi = async (id:string): Promise<any> => {
  try {
    const response = await api.get(
      `${basePathUser}/kantor-provinsi/kantor-pusat/${id}`
    )
    localStorage.setItem("kantor-provinsi", JSON.stringify(response.data.return));
    return response.data.return;
  } catch(e){
    console.log("e ", e)
    return []
  }
};

export const getKantorKab = async (idPusat:string, idProvinsi:string): Promise<any> => {
  try {
    const response = await api.get(
      `${basePathUser}/kantor-kabkota/kantor-pusat/${idPusat}/kantor-provinsi/${idProvinsi}`
    )
    localStorage.setItem("kantor-kota", JSON.stringify(response.data.return));
    return response.data.return;
  } catch(e){
    console.log("e ", e)
    return []
  }
};

export const getMadrasah = async (idPusat:string, idProvinsi:string, idKabKota:string): Promise<any> => {
  try {
    const response = await api.get(
      `${basePathUser}/madrasah/kantor-pusat/${idPusat}/kantor-provinsi/${idProvinsi}/kantor-kabkota/${idKabKota}`
    )
    localStorage.setItem("list-madrasah", JSON.stringify(response.data.return));
    return response.data.return;
  } catch(e){
    console.log("e ", e)
    return []
  }
};