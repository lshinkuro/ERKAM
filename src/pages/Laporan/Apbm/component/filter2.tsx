import React, { useState, useEffect } from "react";
import { Table as Tablea, Select, DatePicker, Alert } from 'antd';
import moment from "moment";
import 'moment/locale/id';

type FilterProps = {
  setTahun: (tahun) => void;
  setProvinsi: (provinsi) => void;
  setKabupaten: (kabupaten) => void;
  setMadrasah: (madrasah) => void;
  defaultKabupaten: any;
  defaultProvinsi: any;
  defaultMadrasah: any;
}

const  FilterLaporan2: React.FC<FilterProps> = ({ 
  setTahun, 
  setProvinsi, 
  setKabupaten, 
  setMadrasah, 
  defaultKabupaten, 
  defaultProvinsi, 
  defaultMadrasah
}) => {
  const auth = JSON.parse(localStorage.getItem("auth")!) || []
  const refMadrasah = JSON.parse(localStorage.getItem("referensi-madrasah")!) || []
  const refProvinsi: { kode: string; nama: string }[] = JSON.parse(localStorage.getItem("provdropdown")!)
  const refKabkota: {
      kode: string;
      nama: string;
      kode_provinsi: string;
  }[] = JSON.parse(localStorage.getItem("kabkotadropdown")!)
  const [tahun, setTahunView] = useState<any>(auth.tahun ? auth.tahun : new Date().getFullYear())
  const [provinsi, setProvinsiView] = useState<any>(defaultProvinsi)
  const [kabupaten, setKabupatenView] = useState<any>(defaultKabupaten)
  const [madrasah, setMadrasahView] = useState<any>(defaultMadrasah)
  const [disabledProv, setDisabledProv] = useState<boolean>(false)
  const [disabledKabKota, setDisabledKabKota] = useState<boolean>(false)
  const [disabledMadrasah, setDisabledMadrasah] = useState<boolean>(false)
  const [infoMessage, setInfoMessage] = useState<string>("")
  

  useEffect(() => {
    if(madrasah === "" || madrasah === null ){
      setInfoMessage("Silahkan Pilih Madrasah Terlebih Dahulu")
    } else {
      setInfoMessage("")
    }
  }, [madrasah]);
  
  useEffect(() => {
    if (auth.group_role === "madrasah"){
      setDisabledProv(true)
      setDisabledKabKota(true)
      setDisabledMadrasah(true)
      setProvinsi(auth.madrasah.kode_provinsi)
      setKabupaten(auth.madrasah.kode_kabkota)
      setMadrasah(auth.madrasah.id)
      setProvinsiView(auth.madrasah.kode_provinsi)
      setKabupatenView(auth.madrasah.kode_kabkota)
      setMadrasahView(auth.madrasah.id)
    }
    if (auth.group_role === "kabkota"){
      setDisabledProv(true)
      setDisabledKabKota(true)
      setDisabledMadrasah(false)
      setProvinsi(auth.madrasah.kode_provinsi)
      setKabupaten(auth.madrasah.kode_kabkota)
      setProvinsiView(auth.madrasah.kode_provinsi)
      setKabupatenView(auth.madrasah.kode_kabkota)
    }
    if (auth.group_role === "prov"){
      setDisabledProv(true)
      setDisabledKabKota(false)
      setDisabledMadrasah(false)
      setProvinsi(auth.madrasah.kode_provinsi)
      setProvinsiView(auth.madrasah.kode_provinsi)
    }
    if (auth.group_role === "pusat"){
      setDisabledProv(false)
      setDisabledKabKota(false)
      setDisabledMadrasah(false)
    }
    setTahun(tahun)
    if(madrasah === "" || madrasah === null ){
      setInfoMessage("Silahkan Pilih Madrasah Terlebih Dahulu")
    }
  }, []);

  const handleSelectYear = async (value: moment.Moment | null, dateString: string) => {
    setTahun(dateString)
    setTahunView(value)
  }

  return(
    <>
    <div className="m-5 p-5 bg-white shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center">
              <div className="w-1/3">
                  Periode
              </div>
              <div className="w-2/3">
                  <DatePicker 
                    picker="year" 
                    value={moment(tahun ? tahun : new Date().getFullYear()  , "YYYY")}
                    onChange={(date, dateString) => {
                        if(dateString !== ""){
                          handleSelectYear(date, dateString)
                        }
                      }
                    }
                  />
              </div>
          </div>
          <div className="flex items-center">
              <div className="w-1/3">
                  Provinsi
              </div>
              <div className="w-2/3">
                  <Select
                      options={refProvinsi.length !== 0 ? refProvinsi.map((e) => { return { value: e.kode, label: e.nama } }) : []}
                      onChange={(value ) => {
                        setProvinsi(value)
                        setProvinsiView(value)
                        setKabupaten(null)
                        setKabupatenView(null)
                        setMadrasah(null)
                        setMadrasahView(null)
                      }}
                      placeholder="Provinsi"
                      className="w-full"
                      showSearch
                      allowClear
                      value={provinsi}
                      disabled={disabledProv}
                  />
              </div>
          </div>
          <div className="flex items-center">
              <div className="w-1/3">
                  Kabupaten / Kota
              </div>
              <div className="w-2/3">
                  <Select
                      options={provinsi ? refKabkota.filter(e => e.kode_provinsi === provinsi).map((e) => { return { value: e.kode, label: e.nama } }) : []}
                      onChange={(value ) => {
                        setKabupaten(value)
                        setKabupatenView(value)
                        setMadrasah(null)
                        setMadrasahView(null)
                      }}
                      placeholder="Kabupaten / Kota"
                      className="w-full"
                      showSearch
                      allowClear
                      value={kabupaten}
                      disabled={disabledKabKota}
                  />
              </div>
          </div>
          <div className="flex items-center">
              <div className="w-1/3">
                  Madrasah
              </div>
              <div className="w-2/3">
                  <Select
                      options={
                        (provinsi && kabupaten) ?
                          refMadrasah.length !== 0 
                          ? 
                          refMadrasah.filter(e => e.kode_provinsi === provinsi && e.kode_kabkota === kabupaten)
                            .map((e2) => { return { value: e2.id, label: e2.nama } }) 
                          : 
                          []
                        :
                        []
                      }
                      placeholder="Madrasah"
                      className="w-full"
                      showSearch
                      allowClear
                      value={madrasah}
                      onChange={(value ) => {
                        setMadrasah(value)
                        setMadrasahView(value)
                      }}
                      disabled={disabledMadrasah}
                  />
              </div>
          </div>
      </div>
    </div>
    {infoMessage !== "" && infoMessage !== null  ?
    <Alert
      message={infoMessage}
      type="info"
      showIcon
    />
    : null}
    </>
  )
}

export default FilterLaporan2;