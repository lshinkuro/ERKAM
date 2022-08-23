/** @format */

import React from "react";
import BreadCrumb from "../../components/BreadCrumb";
import { Typography, Button } from "antd";

const { Title, Paragraph } = Typography;

function Edm() {
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/edm", breadcrumbName: "Evaluasi Diri Madrasah" },
  ];

  return (
    <>
      <BreadCrumb routes={itemBreadcrumb} title="Evaluasi Diri Madrasah" />

      <div className="m-5 sm:p-5 p-10 bg-white shadow-sm">
        <div className="p-2">
          <Title level={3} className="text-center">
            Assalamualaikum Warahmatullahi Wabarakatuh
          </Title>
          <Paragraph>
            Tim Penjaminan Mutu (TPM) Madrasah Yang Terhormat.
          </Paragraph>
          <Paragraph>
            Evaluasi Diri Madrasah (EDM) ini adalah suatu proses penilaian mutu
            penyelenggaraan pendidikan berdasarkan indikator-indikator kunci
            yang mengacu pada Standar Nasional Pendidikan (SNP). Salah satu
            manfaat penting dari EDM agar madrasah mengetahui kekuatan,
            kelemahan dan tantangan yang dimilikinya madrasah dalam rangka untuk
            memperbaiki mutu pendidikan madrasah itu sendiri.
          </Paragraph>
          <Paragraph>
            Oleh karena itu, dalam pengisian instrumen EDM ini agar TPM
            melakukan dengan penuh kesadaran, jujur dan objektif berdasarkan
            fakta.
          </Paragraph>
          <Paragraph>
            Semangat kebersamaan seluruh warga madrasah untuk mau mengevaluasi
            diri demi kemajuan bersama adalah kunci dari keberhasilan EDM ini.
            Melalui EDM, Insya Alloh madrasah akan semakin maju.
          </Paragraph>
        </div>
        <div className=" flex justify-center item-center mt-4">
          <p className="text-teal-600 text-sm ">Dokumen Pedoman Edm</p>
          <a href="/" className="text-sm mx-2 text-center text-red-500">
            Download
          </a>
        </div>
        <div className=" flex justify-center item-center mt-4">
          <p className="text-teal-600 text-sm ">User Manual Edm</p>
          <a href="/" className="text-sm mx-2 text-center text-red-500">
            Download
          </a>
        </div>
        <div className=" flex justify-center item-center mt-4 mb-9">
          <Button type="primary">Isi Instrumen pdf</Button>
        </div>
      </div>
    </>
  );
}

export default Edm;
