import api from "../../../utils/api";
import { realizationService, referenceService, planningService } from "../constant";

const basePath = `${realizationService}/realizations`;
const basePathReference = `${referenceService}`;
const basePathPlanning = `${planningService}`

export const browse = async (): Promise<any> => {
    const tahunActive = localStorage.getItem('curTahunFromSelListOnHeader')
    const response = await api.get(`${basePath}/pengembalian-dana?tahun=${tahunActive}`);
    localStorage.setItem("pengembalian-dana", JSON.stringify(response.data.return));
    return response.data.return;
};

export const getDataById = async (id:string): Promise<any> => {
    const response = await api.get(`${basePath}/pengembalian-dana/${id}`);
    return response.data.return;
};

export const editData = async (id:string, params): Promise<any> => {
    const response = await api.put(`${basePath}/pengembalian-dana/${id}`, params);
    return response.data.return;
};

export const addPengembalianDana = async (params): Promise<any> => {
    const response = await api.post(`${basePath}/pengembalian-dana`, params);
    return response.data.return;
  };

export const deletePengembalianDana = async (id:string): Promise<any> => {
    const response = await api.delete(`${basePath}/pengembalian-dana/${id}`);
    return response.data.return;
};

export const approve = async (id:string): Promise<any> => {
    const body = {}
    const response = await api.put(`${basePath}/pengembalian-dana/${id}/approval`, body);
    return response.data.return;
};

export const reject = async (id:string): Promise<any> => {
    const body = {}
    const response = await api.put(`${basePath}/pengembalian-dana/${id}/disapproval`, body);
    return response.data.return;
};

export const setTanggalRealisasi = async (id:string, params): Promise<any> => {
    const response = await api.put(`${basePath}/pengembalian-dana/${id}/realisasi`, params);
    return response.data.return;
};

export const getLogs = async (): Promise<any> => {
    const response = await api.get(`${basePath}/pengembalian-dana/logs`);
    return response.data.return;
};


export const getRekeningBank = async (): Promise<any> => {
    const tahunActive = localStorage.getItem('curTahunFromSelListOnHeader')
    const response = await api.get(`${basePathReference}/pengaturan/rekening-bank?tahun=${tahunActive}`);
    return response.data.return;
};

export const getRekeningPenerima = async (uuidPenerima:string): Promise<any> => {
    const tahunActive = localStorage.getItem('curTahunFromSelListOnHeader')
    const response = await api.get(`${basePathReference}/penerima-rekening?tahun=${tahunActive}&d_penerima_id=${uuidPenerima}`);
    return response.data.return;
};

export const getRekeningPenerimaById = async (id:string): Promise<any> => {
    const response = await api.get(`${basePathReference}/penerima-rekening//${id}`);
    return response.data.return;
};

export const getSumberDana = async (): Promise<any> => {
    const tahunActive = localStorage.getItem('curTahunFromSelListOnHeader')
    const response = await api.get(`${basePathReference}/sumber-dana?tahun=${tahunActive}`);
    return response.data.return;
};

export const getListPendapatan = async (): Promise<any> => {
    const tahunActive = localStorage.getItem('curTahunFromSelListOnHeader')
    const response = await api.get(`${basePath}/pendapatan?tahun=${tahunActive}`)
    const dataResponse = response.data.return
    let dataReturn = dataResponse
    if(dataResponse){
        dataReturn = dataResponse.filter((item) => item.status.toLowerCase() === "selesai")
    }
    return dataReturn
};

export const getListPendapatanById = async (id:string): Promise<any> => {
    const response = await api.get(`${basePathPlanning}/rencana-pendapatan/${id}`)
    return response.data.return
}

export const getListSaldo = async (): Promise<any> => {
    const tahunActive = localStorage.getItem('curTahunFromSelListOnHeader')
    const response = await api.get(`${basePath}/pendapatan/header?tahun=${tahunActive}`)
    return response.data.return
}

export const getTipeKas = async (kodeSumberDana:string): Promise<any> => {
    const tahunActive = localStorage.getItem('curTahunFromSelListOnHeader')
    const response = await api.get(`${basePathReference}/tipe-kas?tahun=${tahunActive}&kodeSumberDana=${kodeSumberDana}`);
    return response.data.return;
};

export const getAllTipeKas = async (): Promise<any> => {
    const tahunActive = localStorage.getItem('curTahunFromSelListOnHeader')
    const response = await api.get(`${basePathReference}/tipe-kas?tahun=${tahunActive}`);
    return response.data.return;
};

export const getMetodePembayaran = async (): Promise<any> => {
    const tahunActive = localStorage.getItem('curTahunFromSelListOnHeader')
    const response = await api.get(`${basePathReference}/metode-pembayaran?tahun=${tahunActive}`);
    return response.data.return;
};

export const getPenerima = async (): Promise<any> => {
    const tahunActive = localStorage.getItem('curTahunFromSelListOnHeader')
    const response = await api.get(`${basePathReference}/penerima?tahun=${tahunActive}`);
    return response.data.return;
};

export const getPenerimaById = async (id:string): Promise<any> => {
    const response = await api.get(`${basePathReference}/penerima/${id}`);
    return response.data.return;
};

