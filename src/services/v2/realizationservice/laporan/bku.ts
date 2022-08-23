import api from "../../../../utils/api";
import { realizationService, usermanService } from "../../constant";

const basePathRealization = `${realizationService}`;
const basePathUser = `${usermanService}`

export const browse = async (urlParam:string): Promise<any> => {
  try {
    const response = await api.get(
      `${basePathRealization}/realizations/laporan-bku?${urlParam}`
    )
    localStorage.setItem("laporan-bku", JSON.stringify(response.data.return));
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

export const getMadrasah = async (idPusat:string, idProvinsi:string, idKabKota:string, jenjang:string): Promise<any> => {
  try {
    const response = await api.get(
      `${basePathUser}/madrasah/kantor-pusat/${idPusat}/kantor-provinsi/${idProvinsi}/kantor-kabkota/${idKabKota}${jenjang}`
    )
    localStorage.setItem("list-madrasah", JSON.stringify(response.data.return));
    return response.data.return;
  } catch(e){
    console.log("e ", e)
    return []
  }
};