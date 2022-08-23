/** @format */

import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  Input,
  Select,
} from "@windmill/react-ui";
import {
  getKatKomBiaya,
  getKatJenisBelanja,
  postKatJenisBelanja,
} from "../../../services/v2/referenceservice/komponenbiaya";
import { TreeSelect } from "../../../components/TreeSelect";

import { useHistory } from "react-router";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type PageHeaderProps = {
  isOpen: boolean;
  onClose: () => void;
  data: any;
};
const tm0: any = [];

const InputModal: React.FC<PageHeaderProps> = ({ isOpen, onClose, data }) => {
  const [DataKatKom, setDataKatKom] = useState([]);
  const [DataJenisBel, setDataJenisBel] = useState([]);
  const [KomponenBiaya, setKomponenBiaya] = useState({ show: "", value: "" });
  const [ShowKategoriJenisBiaya, setShowKategoriJenisBiaya] = useState("");
  const [Nama, setNama] = useState("");
  const [Spesifikasi, setSpesifikasi] = useState("");
  const [kodeKomponenBiaya, setKodeKomponenBiaya] = useState("");
  const [satuan, setSatuan] = useState("");
  const [Deskripsi, setDeskripsi] = useState("");
  const [Activated, setActivated] = useState(0);
  const [prov, setProv] = useState<any>([]);
  const [kabKota, setKabKota] = useState<any>([]);
  const [satuanOption, setSatuanOption] = useState<any>([]);
  const [logErr, setLogErr] = useState<any>("");
  const [checkVal, setcheckVal] = useState<any>("");
  const route = useHistory();
  const getDataService = async () => {
    try {
      setDataJenisBel(
        JSON.parse(localStorage.getItem("komponenbiaya/jenis")!) || [],
      );
      setDataKatKom(
        JSON.parse(localStorage.getItem("komponenbiaya/kategori")!) || [],
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setSatuanOption(JSON.parse(localStorage.getItem("satuan")!));
    getDataService();
    if (data) {
      setKomponenBiaya({ show: data.kode_kategori, value: data.kode_kategori });
      let val: any = data.jenis_belanja;
      for (const i in val) {
        let payload = {
          value: val[i],
          show: val[i],
        };
        tm0[i] = payload;
      }
      setShowKategoriJenisBiaya(tm0.map((e) => e.show));
      setcheckVal(tm0.map((e) => e.value));
    }
    // setProv(provDOption[0].kode)
  }, [data]);

  useEffect(() => {
    console.log("TM0: ", tm0);
    console.log("CheckVAL: ", checkVal);
  });

  const handleKomponenBiaya = (val: any) => {
    // console.log('val', val)
    setKomponenBiaya(val);
  };

  const handleJenisBelanja = (val: any) => {
    // console.log(val)
    let gas: boolean = true;
    tm0.map((e, i) => {
      if (e.value === val.value) {
        tm0.splice(i, 1);
        gas = false;
      }
    });
    if (gas) {
      tm0.push(val);
    }
    setShowKategoriJenisBiaya(tm0.map((e) => e.show));
    setcheckVal(tm0.map((e) => e.value));
  };

  const handlePost = async () => {
    let jenisBelanja: any = [];
    tm0.map((e, i) => {
      jenisBelanja[i] = e.value;
    });
    let tmp0: any = [];
    tmp0.push({
      nama: Nama,
      kodeKategori: KomponenBiaya.value,
      spesifikasi: Spesifikasi,
      deskripsi: Deskripsi,
      jenisBelanja,
      tahun: 2021,
      kode: kodeKomponenBiaya,
      satuan: satuan,
    });

    if (satuan.length === 0) {
      setLogErr("Satuan masih kosong");
    } else if (Deskripsi === "") {
      setLogErr("Deskripsi tidak boleh kosong");
    } else {
      try {
        await postKatJenisBelanja(tmp0[0]);
        setNama("");
        setSpesifikasi("");
        setKomponenBiaya({ show: "", value: "" });
        setDataJenisBel([]);
        setProv([]);
        setKabKota([]);

        onClose();
      } catch (error) {
        console.log(error);
        // setLogErr(error.response.data.return);
      }
    }
  };

  const clearForm = async () => {
    setActivated(0);
    setNama("");
    setShowKategoriJenisBiaya("");
    setDeskripsi("");
    setKomponenBiaya({ show: "", value: "" });
    setSpesifikasi("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <ModalHeader>Tambah Komponen Biaya</ModalHeader>
      <ModalBody>
        <div className="flex flex-col p-2 ">
          <span className="text-red-500 align-middle">{logErr}</span>
          <div className="w-auto">
            <Label>
              <span className="text-gray-400">Kategori Komponen Biaya</span>
              <TreeSelect
                data={DataKatKom}
                getValue={handleKomponenBiaya}
                defaultValue={KomponenBiaya.show}
                placeholder="komponen biaya"
              />
            </Label>
            <Label>
              <span className="text-gray-400">
                Jenis belanja <span className="text-red-500">*</span>
              </span>
              <TreeSelect
                data={DataJenisBel}
                getValue={handleJenisBelanja}
                defaultValue={ShowKategoriJenisBiaya}
                placeholder="kategori komponen biaya"
                radioVal={checkVal}
              />
            </Label>
            <td>
              <Label>
                <span className="text-gray-400">
                  Kode Komponen Biaya <span className="text-red-500">*</span>
                </span>
                <Input
                  className="mt-1"
                  placeholder=""
                  onChange={(e: any) => setKodeKomponenBiaya(e.target.value)}
                />
              </Label>
            </td>
            <td>
              <Label className="ml-1">
                <span className="text-gray-400">
                  Nama <span className="text-red-500">*</span>
                </span>
                <Input
                  className="mt-1"
                  placeholder=""
                  onChange={(e: any) => setNama(e.target.value)}
                />
              </Label>
            </td>
            <table>
              <tbody>
                <tr>
                  <td>
                    <Label className="ml-1">
                      <span className="text-gray-400 ">
                        Spesifikasi <span className="text-red-500">*</span>
                      </span>
                      <Input
                        className="mt-1"
                        placeholder=""
                        onChange={(e: any) => setSpesifikasi(e.target.value)}
                      />
                    </Label>
                  </td>
                  <td>
                    <Label>
                      <span className="text-gray-400">Satuan </span>
                      <span className="text-red-400">*</span>
                      <Select
                        className="mt-1"
                        onChange={(e: any) => {
                          setSatuan(e.target.value);
                        }}>
                        <option disabled selected>
                          Pilih satuan ...
                        </option>
                        {satuanOption
                          ? satuanOption.map((data: any, key: any) => (
                              <option
                                key={data.kode}
                                id={data.kode}
                                value={data.nama}>
                                {`${data.nama}`}
                              </option>
                            ))
                          : "Silahkan Sinkrokan Data"}
                      </Select>
                    </Label>
                  </td>
                </tr>
              </tbody>
            </table>
            <Label>
              <span className="text-gray-400 ">
                Deskripsi <span className="text-red-500">*</span>
              </span>
              <Input
                className="mt-1"
                placeholder=""
                onChange={(e: any) => setDeskripsi(e.target.value)}
              />
            </Label>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="hidden sm:block ">
          <Button
            layout="outline"
            onClick={() => {
              setActivated(0);
              setNama("");
              setShowKategoriJenisBiaya("");
              setDeskripsi("");
              setKomponenBiaya({ show: "", value: "" });
              setSpesifikasi("");
              onClose();
            }}>
            Cancel
          </Button>
          <Button onClick={handlePost}>Tambah</Button>
        </div>
        <div className="block w-full sm:hidden">
          <Button
            block
            size="large"
            layout="outline"
            onClick={() => {
              setActivated(0);
              setNama("");
              setShowKategoriJenisBiaya("");
              setDeskripsi("");
              setKomponenBiaya({ show: "", value: "" });
              setSpesifikasi("");
              onClose();
            }}>
            Cancel
          </Button>
          <Button block size="large" onClick={handlePost}>
            Tambah
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default InputModal;
