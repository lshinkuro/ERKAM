/** @format */

import api from "../../../utils/api";
import { notificationService } from "../constant";

const basePath = `${notificationService}`;

export const getComments = async (param?: any) => {
  const response = await api.get(`${basePath}/comments`, {
    params: param,
  });
  return response.data.return;
};

export const deleteComment = async (params: any) => {
  const response = await api.delete(`${basePath}/comment/${params}`);
  return response.data.return;
};

export const postComment = async (params) => {
  const response = await api.post(`${basePath}/comment`, params, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data.return;
};

export const editComment = async (params: any) => {
  let uuid = params.id;
  const response = await api.put(`${basePath}/comment/${uuid}`, params);
  return response.data.return;
};

export const changeStatusComment = async (param: any) => {
  let uuid = param.id;
  const response = await api.put(
    `${basePath}/comment/update-status/${uuid}?notificationStatus=READ`,
  );
  return response.data.return;
};

export const getMenuPage = () => {
  const response: any = [
    {
      path: "/laporan/laporan-rkam",
      name: "RKAM",
    },
    {
      path: "/laporan/laporan-rkakl",
      name: "RKAKL",
    },
    {
      path: "/laporan/rkakl-konsolidasi-min",
      name: "RKAKL Konsolidasi Min",
    },
    {
      path: "/laporan/laporan-rapbm",
      name: "RAPBM",
    },
    {
      path: "/laporan/apbm",
      name: "APBM",
    },
    {
      path: "/laporan/buku-kas-umum",
      name: "Laporan BKU",
    },
    {
      path: "/laporan/buku-kas-umum-konsolidasi-min",
      name: "Laporan BKU Konsolidasi Min",
    },
    {
      path: "/laporan/buku-pembantu-pajak",
      name: "Laporan Pembantu Pajak",
    },
    {
      path: "/laporan/buku-pembantu-kas-tunai",
      name: "Laporan Pembantu Buku Kas Tunai",
    },
    {
      path: "/laporan/pertanggung-jawaban",
      name: "Laporan Pertanggung Jawaban",
    },
    {
      path: "/laporan/laporan-realisasi",
      name: "Rekap Keuangan (Laporan Realisasi)",
    },
    {
      path: "/laporan/laporan-rincian-keuangan",
      name: "Rincian Keuangan (RKAKL + Realisasi)",
    },
    {
      path: "/laporan/output-kegiatan",
      name: "Laporan Output Kegiatan",
    },
    {
      path: "/laporan/laporan-calk",
      name: "Catatan Atas Laporan Keuangan (CALK)",
    },
  ];
  return response;
};
