/** @format */

import React from "react";
import { BreadCrumb } from "../../../components";

import {
  InputGroup,
  Icon,
  Button,
  Table,
  Form,
  FormControl,
  TreePicker,
  Loader,
} from "rsuite";
import { Select } from "@windmill/react-ui";
import InputModal from "./inputmodal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faPlus,
  faFileExport,
  faSync,
} from "@fortawesome/free-solid-svg-icons";
// import { TreeSelect } from "../../../components/TreeSelect";
// import DataTable from "react-data-table-component";
// import DataTableExtensions from "react-data-table-component-extensions";
// import "react-data-table-component-extensions/dist/index.css";
import { useHistory } from "react-router-dom";

import { WrapSelect, LabelSelect, Main } from "./style";
import { browseKomponenBiaya } from "../../../services/v2/referenceservice/komponenbiaya";
import { formatRupiah } from "../../../utils/helper";

const { Column, HeaderCell, Cell, Pagination } = Table;
const Snp = () => {
  const maxPerPage = 10;
  const notifDelay = 3000;
  const route = useHistory();
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Referensi" },
    { path: "/", breadcrumbName: "Komponen Biaya" },
  ];

  const [pageTableData, setPageTableData] = React.useState<any>([{}]);
  const [totalResults, setTotalResults] = React.useState<number>(0);
  const [resultsPerPage, setResultsPerPage] =
    React.useState<number>(maxPerPage);
  const kategoriKomBiayaEl = React.useRef<any>("");
  const refProvinsi: { kode: string; nama: string }[] = JSON.parse(
    localStorage.getItem("provdropdown")!,
  );
  const refKabkota: {
    kode: string;
    nama: string;
    kode_provinsi: string;
  }[] = JSON.parse(localStorage.getItem("kabkotadropdown")!);
  const [btnLoading, setBtnLoading] = React.useState(false);
  const [selectedProvinsi, setSelectedProvinsi] = React.useState("");
  const [selectedKabkota, setSelectedKabkota] = React.useState("");
  const [selectedKategori, setSelectedKategori] = React.useState("");
  const [selectedJenisBelanja, setSelectedJenisBelanja] = React.useState("");
  const [pencarian, setPencarian] = React.useState("");

  const [filterInputErrors, setFilterInputErrors] = React.useState<
    Array<string>
  >([]);
  const [DataKatKom, setDataKatKom] = React.useState([]);
  const [DataJenisBel, setDataJenisBel] = React.useState([]);
  const [DataKatKom2, setDataKatKom2] = React.useState([]);
  const [DataJenisBel2, setDataJenisBel2] = React.useState([]);

  const [dataTable, setDataTable]: any = React.useState([]);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [modalData, setModalData] = React.useState<any>("");
  const [tableRefresh, setTableRefresh] = React.useState<any>(0);
  const [userRole, setUserRole] = React.useState<any>(null);
  const [pageTable, setPageTable] = React.useState<number>(1);
  const [KomponenBiaya, setKomponenBiaya] = React.useState({
    show: "",
    value: "",
  });
  const [ShowKategoriJenisBiaya, setShowKategoriJenisBiaya] = React.useState({
    show: "",
    value: "",
  });
  const [disableProvKab, setDisableProvKab] = React.useState<any>(false);
  const [disableProv, setDisableProv] = React.useState<any>(false);
  const [disableKab, setDisableKab] = React.useState<any>(false);

  const mapShortToLong = new Map([
    ["child", "children"],
    ["kode", "value"],
    ["nama", "label"],
    ["nama_kategori", "groupBy"],
  ]);

  const refit_keys = (o) => {
    // Only handle non-null objects
    if (o === null || typeof o !== "object") {
      return o;
    }

    if (Array.isArray(o)) {
      return o.map(refit_keys);
    }

    const build = {};
    for (const key in o) {
      const destKey = mapShortToLong.get(key) || key;
      let value = o[key];
      // if(o.nama_kategori !== undefined) {
      //   delete o.nama_kategori;
      // };
      o.nama = o.kode + " - " + o.nama;
      if (typeof value === "object") {
        value = refit_keys(value);
      }
      if (value.length === 0 && key === "child") {
        delete o.child;
      } else {
        build[destKey] = value;
      }
    }
    return build;
  };

  const mapShortToLongJenisBelanja = new Map([
    ["list_jenis_belanja", "children"],
    ["kode", "value"],
    ["nama", "label"],
  ]);

  const refit_keys_jenis_belanja = (o) => {
    if (o === null || typeof o !== "object") {
      return o;
    }

    if (Array.isArray(o)) {
      return o.map(refit_keys_jenis_belanja);
    }

    const build = {};
    for (const key in o) {
      const destKey = mapShortToLongJenisBelanja.get(key) || key;
      let value = o[key];
      if (o.activated !== undefined) {
        delete o.activated;
      }
      if (o.total_jenis_belanja !== undefined) {
        delete o.total_jenis_belanja;
      }
      if (o.deskripsi !== undefined) {
        delete o.deskripsi;
      }
      if (o.kode_kategori !== undefined) {
        delete o.kode_kategori;
      }
      if (o.id !== undefined) {
        delete o.id;
      }
      if (typeof value === "object") {
        value = refit_keys_jenis_belanja(value);
      }
      if (key === "nama") {
        value = o.kode + " - " + o.nama;
      }
      build[destKey] = value;
    }
    return build;
  };

  // setup data for every table
  const getDataService = async () => {
    setBtnLoading(true);
    const jenis =
      (await JSON.parse(localStorage.getItem("komponenbiaya/jenis")!)) || [];
    const katKom =
      JSON.parse(localStorage.getItem("komponenbiaya/kategori")!) || [];

    let tmpJenis = jenis.map((el: any) => {
      el.children = el.list_jenis_belanja;
      delete el.list_jenis_belanja;
      delete el.activated;
      delete el.deskripsi;
      delete el.kode_kategori;
      delete el.id;
      return el;
    });
    const tmpKatKom = refit_keys(katKom);
    const tmpJenisBelanja = refit_keys_jenis_belanja(tmpJenis);
    // console.log("TMPKAT KOM", tmpKatKom)
    setDataKatKom2(tmpKatKom);
    setDataJenisBel2(tmpJenisBelanja);

    try {
      const jenis =
        (await JSON.parse(localStorage.getItem("komponenbiaya/jenis")!)) || [];
      // console.log(jenis);
      setDataJenisBel(
        jenis.map((el: any) => {
          el.child = el.list_jenis_belanja;
          delete el.list_jenis_belanja;
          return el;
        }),
      );
      setDataKatKom(
        JSON.parse(localStorage.getItem("komponenbiaya/kategori")!) || [],
      );
    } catch (err) {
      console.log(err);
    }
    setBtnLoading(false);
  };

  React.useEffect(() => {
    getDataService();
    const tmp0 = JSON.parse(localStorage.getItem("auth")!);
    console.log("TMP0", tmp0);
    console.log("ROLE", tmp0.kode_role);
    if (
      tmp0.kode_role === "bendahara_madrasah" ||
      tmp0.kode_role === "kepala_madrasah"
    ) {
      setSelectedProvinsi(tmp0.madrasah.kode_provinsi);
      setDisableProv(true);
      setDisableKab(true);
    }

    if (
      tmp0.kode_role === "admin_kabkota" ||
      tmp0.kode_role === "admin_provinsi"
    ) {
      if (tmp0.kode_role === "admin_kabkota") {
        setSelectedProvinsi(tmp0.kantor_kabkota.kode_provinsi);
      }
      if (tmp0.kode_role === "admin_provinsi") {
        setSelectedProvinsi(tmp0.kantor_provinsi.kode_provinsi);
      }
      setDisableProv(true);
    }
  }, []);

  const generateTableData = async () => {
    let dataz: any = JSON.parse(localStorage.getItem("komponen-biaya")!) || [];
    setDataTable(dataz);
  };

  React.useEffect(() => {
    const tmp0 = JSON.parse(localStorage.getItem("auth")!);
    setUserRole(tmp0.kode_role);
    generateTableData();
    getDataService();
  }, [tableRefresh]);

  function showDetail() {
    setIsModalOpen(true);
  }

  function editKomponen(params: any) {
    setIsModalOpen(true);
    setModalData(params);
  }

  function hideDetails() {
    setTableRefresh(tableRefresh + 1);
    setModalData("");
    setIsModalOpen(false);
  }

  const handleKomponenBiaya = (val: any) => {
    setKomponenBiaya(val);
    setSelectedKategori(val.value);
    // let tmp1 = dataTable.filter((obj: any) => {
    //   return obj.kode_kategori === val.value;
    // });
    setFilterInputErrors([
      ...filterInputErrors.filter((a) => a !== "KomponenBiaya"),
    ]);
    if (!!ShowKategoriJenisBiaya.show && !!ShowKategoriJenisBiaya.value)
      setFilterInputErrors([...filterInputErrors, "ShowKategoriJenisBiaya"]);
    // setTableData(tmp1);
  };

  const handleJenisBelanja = (val: any) => {
    const tm0: any = [];
    // console.log('Jenis Belanja : ' + val.value + ' - ' + val.show);
    setSelectedJenisBelanja(val.value);
    setShowKategoriJenisBiaya(val);
    setFilterInputErrors([
      ...filterInputErrors.filter((a) => a !== "ShowKategoriJenisBiaya"),
    ]);

    // let tmp1 = dataTable.filter((obj: any) => {
    //   return JSON.stringify(obj.jenis_belanja).includes(val.value);
    // });
    // setTableData(tmp1);
    // console.log(val);
  };

  const columns: any = [
    {
      name: "Tahun",
      selector: "kode",
      width: "100px",
      sortable: true,
      subHeader: true,
    },
    {
      name: "Kategori",
      selector: "kode",
      width: "100px",
      sortable: true,
      subHeader: true,
    },
    {
      name: "Akun Belanja",
      selector: "kode",
      width: "100px",
      sortable: true,
      subHeader: true,
    },
    {
      name: "Provinsi",
      selector: "kode",
      width: "100px",
      sortable: true,
      subHeader: true,
    },
    {
      name: "Kab/Kota",
      selector: "kode",
      width: "100px",
      sortable: true,
      subHeader: true,
    },
    {
      name: "Nama",
      selector: "nama",
      width: "100px",
      sortable: true,
      subHeader: true,
    },
    {
      name: "Spesifikasi",
      selector: "kode",
      width: "100px",
      sortable: true,
      subHeader: true,
    },
    {
      name: "Satuan",
      selector: "kode",
      width: "100px",
      sortable: true,
      subHeader: true,
    },
    {
      name: "Harga 1",
      selector: "kode",
      width: "100px",
      sortable: true,
      subHeader: true,
    },
    {
      name: "Harga 2",
      selector: "kode",
      width: "100px",
      sortable: true,
      subHeader: true,
    },
    {
      name: "Harga 3",
      selector: "kode",
      width: "100px",
      sortable: true,
      subHeader: true,
    },
  ];

  const customStyles = {
    rows: {
      style: {
        minHeight: "45px", // override the row height
        // width: "90%",
      },
    },
    headCells: {
      style: {
        backgroundColor: "#1b6fbb",
        textTransform: "uppercase",
        color: "white",
      },
    },
  };

  // const resultsPerPage = 10;
  // const totalResults = JSON.parse(localStorage.getItem("komponen-biaya")!).length;
  const onChangePage = (p) => {
    setPageTable(p);
  };

  // Aug 06 2021 ---- Start
  const updateShowedDataTable = async (eResultsPerPage, ePageTable) => {
    setBtnLoading(true);
    const params = {
      tahun: 2021,
      kode_provinsi: selectedProvinsi,
      kode_kabkota: selectedKabkota,
    };

    const data = await browseKomponenBiaya(params);
    console.log("Sel Kategori : " + selectedKategori);
    setDataTable(data);
    setTotalResults(data.length);
    let tempData = data;
    console.log(tempData);

    if (selectedKategori !== "") {
      if (tempData.length !== 0) {
        tempData = tempData.filter((item) => {
          return item["Kode Kategori"] === selectedKategori;
        });
      }
    }

    if (selectedJenisBelanja !== "") {
      if (tempData.length !== 0) {
        tempData = tempData.filter((item) => {
          return item["Kode"] === selectedJenisBelanja;
        });
      }
    }

    if (pencarian !== "") {
      if (tempData.length !== 0) {
        const lowerPencarian = pencarian.toString().toLowerCase();
        console.log("PENCARIAN", lowerPencarian);
        tempData = tempData.filter((item) => {
          return (
            (item["Kategori"] !== null &&
              (item["Kategori"] || "")
                .toLowerCase()
                .includes(lowerPencarian)) ||
            (item["Spesifikasi"] !== null &&
              (item["Spesifikasi"] || "")
                .toLowerCase()
                .includes(lowerPencarian)) ||
            (item["Nama"] !== null &&
              (item["Nama"] || "").toLowerCase().includes(lowerPencarian))
          );
        });
      }
    }

    setDataTable(tempData);
    setTotalResults(tempData.length || 1);
    const c = tempData.slice(
      (ePageTable - 1) * eResultsPerPage,
      ePageTable * eResultsPerPage,
    );
    setPageTableData(c);
    setBtnLoading(false);
  };

  const onChangePageNew = (curPage) => {
    setPageTable(curPage);
  };

  const onChangeLength = (dataLen) => {
    setResultsPerPage(dataLen);
    setPageTable(1);
    updateShowedDataTable(dataLen, 1);
  };

  React.useEffect(() => {
    // console.log(selectedProvinsi);
    // console.log(selectedKabkota);
    console.log("Update Table kat, jenisbel, cari");
    updateShowedDataTable(resultsPerPage, pageTable);
    setPageTable(1);
  }, [selectedKategori, selectedJenisBelanja, pencarian]);

  React.useEffect(() => {
    updateShowedDataTable(resultsPerPage, pageTable);
  }, [pageTable]);

  const makeKomponenBiayaUI = (data) => {
    // console.log('MAKE UI');
    let tbody = (
      <tr>
        <td colSpan={12} style={{ padding: "50px", textAlign: "center" }}>
          <Loader content="TIDAK ADA DATA / SEDANG LOADING DATA..." />
        </td>
      </tr>
    );
    if (data.length !== 0) {
      tbody = data.map((items: any, i: number) => {
        // console.log(items);
        const provName = refProvinsi.filter((item) => {
          return item.kode === items["Kode Provinsi"];
        });
        const kabName = refKabkota.filter((item) => {
          return item.kode === items["Kode Kabkota"];
        });
        // console.log(provName);
        return (
          <tr>
            <td data-label="Tahun">{items.Tahun}</td>
            <td data-label="Kategori">{items.Kategori}</td>
            <td data-label="Kode Kategori">{items["Kode Kategori"]}</td>
            <td data-label="Kode Provinsi">
              {provName[0] !== null && provName[0] !== undefined
                ? provName[0].nama
                : ""}
            </td>
            <td data-label="Kode Kabkota">
              {kabName[0] !== null && kabName[0] !== undefined
                ? kabName[0].nama
                : ""}
            </td>
            <td data-label="Kode">{items.Kode}</td>
            <td data-label="Nama">{items.Nama}</td>
            <td data-label="Spesifikasi">{items.Spesifikasi}</td>
            <td data-label="Satuan">{items.Satuan}</td>
            <td data-label="Harga 1">{formatRupiah(items["Harga 1"])}</td>
            <td data-label="Harga 2">{formatRupiah(items["Harga 2"])}</td>
            <td data-label="Harga 3">{formatRupiah(items["Harga 3"])}</td>
          </tr>
        );
      });
    }
    return tbody;
  };

  const toCsv = (arr) => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      arr
        .map((e) =>
          Object.keys(e)
            .map(function (k) {
              return '"' + e[k] + '"';
            })
            .join(","),
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const hiddenElement = document.createElement("a");
    hiddenElement.href = encodedUri;
    hiddenElement.target = "_blank";
    hiddenElement.download =
      "export-" +
      selectedProvinsi +
      "-" +
      selectedKabkota +
      "-" +
      Math.floor(Date.now() / 1000) +
      ".xls";
    hiddenElement.click();
  };

  React.useEffect(() => {
    setFilterInputErrors([
      ...filterInputErrors.filter((a) => a != "selectedKabkota"),
    ]);
    if (!!KomponenBiaya.show && !!KomponenBiaya.value)
      setFilterInputErrors([...filterInputErrors, "KomponenBiaya"]);
    if (!!ShowKategoriJenisBiaya.show && !!ShowKategoriJenisBiaya.value)
      setFilterInputErrors([...filterInputErrors, "ShowKategoriJenisBiaya"]);
    if (selectedProvinsi !== "" && selectedKabkota !== "") {
      updateShowedDataTable(resultsPerPage, pageTable);
    }
  }, [selectedKabkota]);

  React.useEffect(() => {
    // console.log("[selectedProvinsi]", selectedProvinsi);
    const tmp0 = JSON.parse(localStorage.getItem("auth")!);
    if (
      tmp0.kode_role === "bendahara_madrasah" ||
      tmp0.kode_role === "kepala_madrasah"
    ) {
      setSelectedKabkota(tmp0.madrasah.kode_kabkota);
      setDisableProvKab(true);
    }
    if (!!selectedKabkota)
      setFilterInputErrors([...filterInputErrors, "selectedKabkota"]);
    if (!!KomponenBiaya.show && !!KomponenBiaya.value)
      setFilterInputErrors([...filterInputErrors, "KomponenBiaya"]);
    if (!!ShowKategoriJenisBiaya.show && !!ShowKategoriJenisBiaya.value)
      setFilterInputErrors([...filterInputErrors, "ShowKategoriJenisBiaya"]);
    if (selectedProvinsi !== "" && selectedKabkota !== "") {
      updateShowedDataTable(resultsPerPage, pageTable);
      setPageTable(1);
    }
  }, [selectedProvinsi]);

  return (
    <>
      <div>
        <InputModal
          onClose={hideDetails}
          isOpen={isModalOpen}
          data={modalData}
        />
        <BreadCrumb routes={itemBreadcrumb} title="Komponen Biaya" />
        <Main>
          <Form>
            <div className="grid grid-cols-2 gap-6">
              {/* Field Provinsi */}
              <WrapSelect>
                <div className="w-1/3">
                  <LabelSelect>Provinsi</LabelSelect>
                </div>
                <div className="w-2/3">
                  <Select
                    disabled={disableProv}
                    className="mt-1 mb-1 text-gray-500 table-cell"
                    placeholder="semua Provinsi"
                    value={selectedProvinsi}
                    onChange={(e: any) => {
                      setSelectedProvinsi(e.currentTarget.value);
                    }}>
                    <option value="" hidden>
                      Pilih Provinsi
                    </option>
                    {refProvinsi.map((el) => {
                      return (
                        <option key={el.kode} value={el.kode}>
                          {el.nama}
                        </option>
                      );
                    })}
                  </Select>
                </div>
              </WrapSelect>
              {/* Field Kabupaten Kota */}
              <WrapSelect>
                <div className="w-1/3">
                  <LabelSelect>Kabupaten Kota</LabelSelect>
                </div>
                <div className="w-2/3">
                  <Select
                    disabled={disableKab}
                    className="mt-1 mb-1 text-gray-500 table-cell"
                    placeholder="semua Provinsi"
                    value={selectedKabkota}
                    onChange={(e: any) => {
                      setSelectedKabkota(e.currentTarget.value);
                    }}>
                    <option value="" hidden>
                      Pilih Kab/Kota
                    </option>
                    {refKabkota.map((el) => {
                      if (el.kode_provinsi === selectedProvinsi)
                        return (
                          <option key={el.kode} value={el.kode}>
                            {el.nama}
                          </option>
                        );
                    })}
                  </Select>
                </div>
              </WrapSelect>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {/* Kategori Komponen Biaya */}
              <WrapSelect>
                <div className="w-1/3">
                  <LabelSelect>Kategori Komponen Biaya</LabelSelect>
                </div>
                <div className="w-2/3">
                  <FormControl
                    ref={kategoriKomBiayaEl}
                    onSelect={(activeNode, value, event) => {
                      setSelectedKategori(value);
                    }}
                    value={selectedKategori}
                    placeholder="Silahkan Pilih Kategori Komponen Biaya"
                    name="TreePicker"
                    accepter={TreePicker}
                    data={DataKatKom2}
                    style={{ width: "100%" }}
                  />
                </div>
              </WrapSelect>
              {/* Kategori Komponen Biaya */}
              {/* Jenis Belanja */}
              <WrapSelect>
                <div className="w-1/3">
                  <LabelSelect>Jenis Belanja</LabelSelect>
                </div>
                <div className="w-2/3">
                  <FormControl
                    ref={kategoriKomBiayaEl}
                    onSelect={(activeNode, value, event) => {
                      setSelectedJenisBelanja(value);
                    }}
                    value={selectedJenisBelanja}
                    placeholder="Silahkan Pilih Jenis Belanja"
                    name="TreePicker"
                    accepter={TreePicker}
                    data={DataJenisBel2}
                    style={{ width: "100%" }}
                  />
                </div>
              </WrapSelect>
            </div>
          </Form>
        </Main>
        <Main>
          <div className="w-full">
            <div className="flex my-2 justify-between">
              <div className="flex mt-4">&nbsp;</div>
              <div className="flex">
                <div className="mt-1 mb-2 flex justify-between items-center">
                  <Button
                    className="square-button"
                    color="green"
                    loading={false}
                    onClick={() => {
                      route.push("komponen-biaya/add");
                    }}>
                    <FontAwesomeIcon icon={faPlus} />
                    &nbsp;Tambah Komponen
                  </Button>
                  <Button
                    className="square-button"
                    color="green"
                    loading={btnLoading}
                    onClick={() => {
                      setSelectedJenisBelanja("");
                      setSelectedKategori("");
                      setKomponenBiaya({
                        show: "",
                        value: "",
                      });
                      setShowKategoriJenisBiaya({
                        show: "",
                        value: "",
                      });
                      updateShowedDataTable(resultsPerPage, pageTable);
                      setPageTable(1);
                    }}>
                    <FontAwesomeIcon icon={faSync} />
                    &nbsp;Refresh Data
                  </Button>
                  <Button
                    className="square-button"
                    color="green"
                    loading={false}
                    onClick={() => {
                      route.push({
                        pathname: "/referensi/komponen-biaya/set-harga",
                      });
                    }}>
                    <FontAwesomeIcon
                      className="ml-2 text-sm"
                      icon={faPencilAlt}
                    />{" "}
                    Set Harga
                  </Button>
                  <Button
                    className="square-button"
                    loading={false}
                    onClick={() => {
                      toCsv(pageTableData);
                    }}>
                    <FontAwesomeIcon icon={faFileExport} /> Export
                  </Button>
                </div>
                <div className="items-center justify-between">
                  <InputGroup style={{ marginTop: "5px", marginLeft: "5px" }}>
                    <input
                      placeholder="Pencarian ..."
                      className="h-8 py-1 w-full pl-3 pr-8 border focus:outline-none focus:shadow-outline focus:border-blue-300 "
                      onChange={(e) => {
                        console.log(e.currentTarget.value);
                        setPencarian(e.currentTarget.value);
                      }}
                    />
                    <InputGroup.Addon>
                      <Icon icon="search" />
                    </InputGroup.Addon>
                  </InputGroup>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full">
            <div className="flex my-2 justify-between">
              <div className="flex mt-4">&nbsp;</div>
              <div className="flex">
                <Pagination
                  lengthMenu={[
                    { value: maxPerPage * 1, label: maxPerPage * 1 },
                    { value: maxPerPage * 2, label: maxPerPage * 2 },
                    { value: maxPerPage * 4, label: maxPerPage * 4 },
                  ]}
                  displayLength={resultsPerPage}
                  activePage={pageTable}
                  ellipsis={true}
                  total={dataTable.length}
                  boundaryLinks={true}
                  onChangePage={onChangePageNew}
                  onChangeLength={onChangeLength}
                />
              </div>
            </div>
          </div>
          <div>
            <div className="tableKomponenBiayaContainer">
              <table className="tableKomponenBiaya">
                <thead
                  style={{ position: "relative" }}
                  className="bg-blue-500 text-white text-sm h-12">
                  <tr>
                    <th scope="col">Tahun</th>
                    <th scope="col">Kategori</th>
                    <th scope="col">Kode Kategori</th>
                    <th scope="col">Provinsi</th>
                    <th scope="col">Kab/Kota</th>
                    <th scope="col">Kode</th>
                    <th scope="col">Nama</th>
                    <th scope="col">Spesifikasi</th>
                    <th scope="col">Satuan</th>
                    <th scope="col">Harga 1</th>
                    <th scope="col">Harga 2</th>
                    <th scope="col">Harga 3</th>
                  </tr>
                </thead>
                <tbody>{makeKomponenBiayaUI(pageTableData)}</tbody>
              </table>
            </div>
          </div>
        </Main>
      </div>
    </>
  );
};

export default Snp;
