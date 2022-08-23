/** @format */

import React from "react";
import { Button } from "@windmill/react-ui";

import { useHistory } from "react-router-dom";

function Step3({ nextStep, prevStep }) {
  const refProvinsi: { kode: string; nama: string }[] = JSON.parse(
    localStorage.getItem("provdropdown")!,
  );
  const refKabkota: { kode: string; nama: string; kode_provinsi: string }[] =
    JSON.parse(localStorage.getItem("kabkotadropdown")!);
  const [selectedProvinsi, setSelectedProvinsi] = React.useState(
    refProvinsi[0].kode,
  );
  const [selectedKabkota, setSelectedKabkota] = React.useState("");
  const history = useHistory();

  const handleRoute = () => {
    history.push("/referensi/komponen-biaya");
  };

  return (
    <>
      <div className="m-5 p-5 bg-white shadow-sm rounded-sm">
        <h3 className="text-center">Data Berhasil Ditambahkan</h3>
      </div>
      <div className="m-5 p-5 bg-white shadow-sm rounded-sm">
        <div className="flex flex-row justify-end my-3 space-x-2">
          <Button
            style={{ backgroundColor: "#008e00" }}
            onClick={handleRoute}
            className="flex text-white justify-center items-center bg-blue-500 hover:bg-blue-700 cursor-pointer p-2 rounded-md">
            <span className="text-xs">Tutup</span>
          </Button>
        </div>
      </div>
    </>
  );
}

export default Step3;
