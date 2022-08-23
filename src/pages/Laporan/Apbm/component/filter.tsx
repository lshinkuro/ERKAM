import React from "react"
import {FilterIcon } from '../../../../icons';

import {
  Button,
  ButtonGroup,
  Whisper,
  Popover,
  SelectPicker
} from "rsuite";

import {
  Select
} from "@windmill/react-ui";

import { DatePicker } from 'antd';


const  FilterLaporan = () => {
  const refProvinsi: { kode: string; nama: string }[] = JSON.parse(
    localStorage.getItem("provdropdown")!
  )
  const [selectedProvinsi, setSelectedProvinsi] = React.useState("")
  const refKabkota: {
    kode: string;
    nama: string;
    kode_provinsi: string;
  }[] = JSON.parse(localStorage.getItem("kabkotadropdown")!)
  const [selectedKabkota, setSelectedKabkota] = React.useState("")
  
  const [openDropdown, setOpenDropdown] = React.useState(false)
  const [dataProvinsi, setDataProvinsi] = React.useState<any>([])
  const [dataKabKota, setDataKabKota] = React.useState<any>([])
  const [dataMadrasah, setDataMadrasah] = React.useState<any>([])
  
  const renderMenu = ({ onClose, left, top, className }, ref) => {
    return (
      <Popover ref={ref} className={className} style={{ left, top, zIndex : 0, minWidth: "500px"}} full>
        <div>
          <div className="flex">
            <div className="bg-green-500 text-white p-2" style={{minWidth: "100px"}}>
              Periode
            </div>
            <div className="p-2">
              <p>Pilih Bulan</p>
              <p> <DatePicker picker="month" /></p>
            </div>  
          </div>  
          <div className="flex">
            <div className="bg-green-500 text-white p-2" style={{minWidth: "100px"}}>
              Area
            </div>
            <div className="flex">
              <div className="p-2">
                <p>Pilih Provinsi : </p>
                <p>
                <Select
                  className="mt-1 mb-1 text-gray-500 table-cell "
                  placeholder="semua Provinsi"
                  value={selectedProvinsi}
                  onChange={(e: any) => {
                    setSelectedProvinsi(e.currentTarget.value);
                  }}
                >
                <option value="" hidden>Pilih Provinsi</option>
                  {refProvinsi.map((el) => {
                    return (
                      <option key={el.kode} value={el.kode}>
                        {el.nama}
                      </option>
                    );
                  })}
                </Select>  
                </p>
              </div>  
              <div className="p-2">
                <p>Pilih Kabupaten/Kota : </p>
                <p>
                <Select
                  className="mt-1 mb-1 text-gray-500 table-cell"
                  placeholder="semua Provinsi"
                  value={selectedKabkota}
                  onChange={(e: any) => {
                    setSelectedKabkota(e.currentTarget.value);
                  }}
                >
                  <option value="" hidden>Pilih Kab/Kota</option>
                  {refKabkota.map((el) => {
                    if (el.kode_provinsi === selectedProvinsi)
                      return (
                        <option key={el.kode} value={el.kode}>
                          {el.nama}
                        </option>
                      );
                  })}
                </Select>  
                </p>
              </div>  
            </div>  
          </div> 
          <div className="flex">
            <div className="bg-green-500 text-white p-2" style={{minWidth: "100px"}}>
              Madrasah
            </div>
            <div className="p-2">              
              <p>Pilih Madrasah : </p>
              <p><SelectPicker className="z-50"  data={dataMadrasah}  /></p>
            </div>  
          </div>   
        </div>
      </Popover>
    );
  };

  return (
    <>
    <ButtonGroup className="ml-2">
      <Whisper placement="bottomStart" trigger="click" speaker={renderMenu} >
        <Button appearance="subtle">Filter <FilterIcon className="ml-2" width="16px" style={{float: "right"}}/></Button>
      </Whisper>
    </ButtonGroup>
    </>
  )
}

export default FilterLaporan;