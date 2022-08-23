/**
 * /* eslint-disable import/first
 *
 * @format
 */

import React, { useContext, useEffect, useState } from "react";
import { SidebarContext } from "../context/SidebarContext";
import {
  // SearchIcon,
  OutlinePersonIcon,
  OutlineCogIcon,
  OutlineLogoutIcon,
  SyncIcon,
  SpinnerIcon,
} from "../icons";
// import { Avatar, Badge, List } from 'antd';
import {
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Dropdown,
  DropdownItem,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@windmill/react-ui";
import { SelectPicker } from "rsuite";
import { Button1 } from ".";
import { useHistory } from "react-router-dom";
import * as paguDefinitifServiceOnPlanning from "../services/v2/planningservice/pagudefinitif";
import * as paguDefinitifService from "../services/v2/realizationservice/pagudefinitif";
import * as rService from "../services/reference";
import * as referenceService from "../services/v2/referenceservice";
import * as kbService from "../services/v2/referenceservice/komponenbiaya";
import * as satuanService from "../services/v2/referenceservice/satuam";
import * as tipekasService from "../services/v2/referenceservice/tipekas";
import * as uService from "../services/users";
import * as mdService from "../services/v2/usermanservice/madrasahservices";
import * as notifService from "../services/v2/notificationservice";
import * as profileservice from "../services/v2/usermanservice/profileservices";
// import * as notifServiceRealisasi from "../services/v2/notificationservice/notif-realisasi";
import * as rkService from "../services/v2/planningservice/rencanakegiatan";
import * as plService from "../services/v2/planningservice/index";
import * as kelompoksasaranService from "../services/v2/referenceservice/kelompoksasaran";
import * as realizationService from "../services/v2/realizationservice";
import * as pindahbukuService from "../services/v2/realizationservice/pindahbuku";
import * as pService from "../services/v2/planningservice/usulanservice";
import * as pengaturanService from "../services/v2/pengaturan/pengaturan";
import * as reportServiceRkakl from "../services/v2/planningservice/laporan/rkakl";
import * as reportRealisasiRekapKeuangan from "../services/v2/realizationservice/laporan/rekapKeuangan";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import { Notification } from "./Notification";
import { Komentar } from "./Komentar";
import { Tahun as getTahunAuth } from "../services/auth";
import * as pendapatanService from "../services/v2/realizationservice/pendapatan/pendapatan";
import * as pengembalianDanaServices from "../services/v2/realizationservice/pengembalianDana";
// import * as LaporanRkakl from "../services/v2/planningservice/laporan/rkakl";

import { IndexedDb } from "../utils/IndexedDb";
// import sidebardesktop from "./Sidebar/DesktopSidebar";
const getOnLineStatus = () =>
  typeof navigator !== "undefined" && typeof navigator.onLine === "boolean"
    ? navigator.onLine
    : true;

const useNavigatorOnLine = () => {
  const [status, setStatus] = React.useState(getOnLineStatus());

  const setOnline = () => setStatus(true);
  const setOffline = () => setStatus(false);

  React.useEffect(() => {
    window.addEventListener("online", setOnline);
    window.addEventListener("offline", setOffline);

    return () => {
      window.removeEventListener("online", setOnline);
      window.removeEventListener("offline", setOffline);
    };
  }, []);

  return status;
};

// console.log("errror");

function Header() {
  // const { mode, toggleMode } = useContext(WindmillContext);
  const { toggleSidebar, toggleSidebarDesktop, isSidebarOpenDesktop } =
    useContext(SidebarContext);
  // const [isOpenSideBar, setIsOpenSidebar] = useState(true);

  const route = useHistory();

  // const [isNotificationsMenuOpen, setIsNotificationsMenuOpen] = useState(false);
  const [isSinkronOpen, setIsSinkronOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setisSuccess] = useState(false);
  const [isFail, setisFail] = useState(false);
  const [tahunTmp, setTahunTmp] = useState(2021);
  const [tahunList, setTahunList] = useState([]);
  const tmpAuth = JSON.parse(localStorage.getItem("auth")) || "";
  const isOnline = useNavigatorOnLine();

  console.log(isOnline);
  useEffect(() => {
    handleListTahun();

    if (isOnline) {
      handleSinkron();
    }
  }, [isOnline]);

  useEffect(() => {
    if (isOnline) {
      handleSinkron();
    }
  }, [tahunTmp]);

  const logOut = async () => {
    try {
      await uService.deletUser();
      localStorage.clear();
      route.push("/login");
    } catch {
      console.log("err");
    }
  };

  const handleTahunAnggaranChange = (thn) => {
    localStorage.setItem("curTahunFromSelListOnHeader", thn);
    setTahunTmp(thn);
  };

  const handleSinkron = async () => {
    let role = tmpAuth.group_role || "";

    const idb = new IndexedDb("offline-db-action");
    await idb.createObjectStore([
      `rencana-pendapatan-definitif-offline-action`,
      "rencana-rincian-kegiatan-dropdown-offline-action",
      "laporan-rkam",
    ]);
    setIsLoading(true);
    let promises = [];
    if (role === "madrasah") {
      promises = [
        ...promises,
        paguDefinitifServiceOnPlanning.browsePendapatanHeader(),
        paguDefinitifService.browse({
          activated: ["1"],
          tahun: [tahunTmp],
          groupRole: "madrasah",
        }),
        realizationService.paguDefinitifPlanningService.browseBelanja(tahunTmp),
        realizationService.pengeluaranpajakService.getPengeluaranPajak(
          tahunTmp,
        ),

        tipekasService.getTipekas(),

        uService.getUser("madrasah"),
        uService.getRoleS("madrasah"),
        uService.getMadrasah(),

        profileservice.getMyProfile(),

        pendapatanService.getPendapatan({ groupRole: "madrasah" }),

        ///done Reference #
        pengaturanService.gettipePenerima(),
        pengaturanService.getPenerima(),
        rService.getSnp(),
        rService.getBank(),
        rService.getLokasi("kabkota"),
        rService.getLokasi("prov"),
        rService.getKecamatan(),
        referenceService.getRef("kegiatan-snp", tahunTmp, "kegiatan-snp"),
        referenceService.getRef("jenis-belanja", tahunTmp, "jenis-belanja"),
        referenceService.getRef(
          "kategori-belanja",
          tahunTmp,
          "kategori-belanja",
        ),
        rService.getPenggunaanBos(),
        referenceService.getRef("jenis-belanja", tahunTmp, "kbiaya/jenis"),
        referenceService.getRef("pajak", tahunTmp, "kbiaya/pajak"),
        referenceService.getRef("tipe-pencairan", tahunTmp, "tipePencairan"),
        rService.getReferensiKegiatan(),
        referenceService.getRef(
          "rencana-rincian-kegiatan-dropdown",
          tahunTmp,
          "kbiaya/dropdown",
        ),
        rService.getKegiatanBop(),
        rService.getReferensiSumberDana(),
        rService.getRekeningBelanja(),

        ///done Reference #

        ///done planning #
        plService.saveOffline(null, "rencana-pendapatan-indikatif", "offline"),
        plService.saveOffline(null, "rencana-pendapatan-definitif", "offline"),
        plService.saveOffline(null, "rencana/kegiatan-indikatif", "offline"),
        plService.saveOffline(null, "rencana/kegiatan-definitif", "offline"),
        plService.saveOffline(
          null,
          "rencana-rincian-kegiatan-indikatif",
          "offline",
          "rencana-rincian-kegiatan-indikatif",
        ),
        plService.saveOffline(
          null,
          "rencana-rincian-kegiatan-definitif",
          "offline",
          "rencana-rincian-kegiatan-definitif",
        ),
        plService.getPlanning(
          "rencana-rekap-sumber-dana-belanja",
          tahunTmp,
          "rencana/rincian/rekapsumberdana",
        ),
        plService.getPlanning(
          "rencana-rekap-sumber-dana-belanja-definitif",
          tahunTmp,
          "rencana/rincian/rekapsumberdanadefinitif",
        ),
        plService.getPlanning(
          "rencana-pendapatan-indikatif",
          tahunTmp,
          "rencana-pendapatan-indikatif",
        ),
        plService.getPlanning(
          "rencana-pendapatan",
          tahunTmp,
          "rencana-pendapatan-definitif",
        ),
        plService.getPlanning(
          "rencana-tanggal/expired",
          tahunTmp,
          "rencana-tanggal/expired",
        ),
        plService.getPlanning("rencana-tanggal", tahunTmp, "rencana-tanggal"),
        ///done planning #

        //logs online aja
        plService.getRencanaKegiatanIndikatifBelanjaLogs(tahunTmp),
        plService.getRencanaIndikatifPendapatanLogs(),
        //online aja

        notifService.connectSocket(),
        notifService.getNotification(),

        //nanti lagi
        pService.getUsulans("usulan", 1, "usulankegiatan1"),
        pService.getUsulans("usulan", 2, "usulanSubKegiatan"),
        pService.getUsulans("usulan", 3, "usulanKomponen"),
        pService.saveOffline(null, "usulankegiatan1", "offline"),
        pService.saveOffline(null, "usulanKomponen", "offline"),
        pService.saveOffline(null, "usulanSubKegiatan", "offline"),
        //nanti lagi

        idb.syncToRealDb("rencana-pendapatan-definitif-offline-action"),
        realizationService.realizationPengeluaranKegiatan.GetRincianBelanjaDefinitif(
          tahunTmp,
        ),
        realizationService.realizationPengeluaranKegiatan.GetJenisSumberDana(
          tahunTmp,
        ),
        realizationService.realizationPengeluaranKegiatan.getRealisasiKegiatan(
          tahunTmp,
        ),
        realizationService.realizationPengeluaranKegiatan.logsAllNotaPengeluaranKegiatan(
          tahunTmp,
        ),
        reportServiceRkakl.getReport(tahunTmp),
        reportRealisasiRekapKeuangan.getRealisasiRekapKeuangan(tahunTmp),
      ];

      Promise.allSettled(promises)
        .then((data) => {
          // console.log(data)
          setisSuccess(true);
          setisFail(false);
          setIsLoading(false);
          setIsSinkronOpen(false);
        })
        .catch((error) => {
          setisSuccess(false);
          setisFail(true);
          setIsLoading(false);
          setIsSinkronOpen(false);
        });
    } else if (role === "kabkota") {
      promises = [
        ...promises,
        uService.getUser("madrasah"),
        uService.getRoleS("madrasah"),
        rService.getLokasi("kabkota"),
        uService.getRoleS("kabkota"),
        uService.getUser("kabkota"),
        rService.getRekeningBelanja(),
        rService.getReferensiKegiatan(),
        rService.getLokasi("kabkota"),
        rService.getLokasi("prov"),
        rService.getKecamatan(),
        profileservice.getMyProfile(),
        referenceService.getRef(
          "kategori-belanja",
          tahunTmp,
          "kategori-belanja",
        ),
        referenceService.getRef("jenis-belanja", tahunTmp, "jenis-belanja"),
        referenceService.getRef("pajak", tahunTmp, "kbiaya/pajak"),
        plService.getPlanning(
          "rencana-tanggal/expired",
          tahunTmp,
          "rencana-tanggal/expired",
        ),
        plService.getPlanning("rencana-tanggal", tahunTmp, "rencana-tanggal"),
        reportServiceRkakl.getReport(tahunTmp),
        reportRealisasiRekapKeuangan.getRealisasiRekapKeuangan(tahunTmp),
      ];
    } else if (role === "prov") {
      promises = [
        ...promises,
        uService.getUser("madrasah"),
        uService.getRoleS("madrasah"),
        rService.getLokasi("prov"),
        uService.getRoleS("prov"),
        uService.getUser("prov"),
        rService.getReferensiKegiatan(),
        rService.getLokasi("kabkota"),
        rService.getLokasi("prov"),
        rService.getKecamatan(),
        profileservice.getMyProfile(),
        referenceService.getRef(
          "kategori-belanja",
          tahunTmp,
          "kategori-belanja",
        ),
        referenceService.getRef("jenis-belanja", tahunTmp, "jenis-belanja"),
        referenceService.getRef("pajak", tahunTmp, "kbiaya/pajak"),
        reportServiceRkakl.getReport(tahunTmp),
        reportRealisasiRekapKeuangan.getRealisasiRekapKeuangan(tahunTmp),
      ];
    } else {
      promises = [
        ...promises,
        pService.getUsulans("usulan", 1, "usulankegiatan1"),
        pService.getUsulans("usulan", 2, "usulanSubKegiatan"),
        pService.getUsulans("usulan", 3, "usulanKomponen"),
        rService.getKegiatanBop(),
        rService.getSnp(),
        rService.getBank(),
        rService.getRekeningBelanja(),
        rService.getReferensiKegiatan(),
        rService.getReferensiAlokasiCostBost(),
        rService.getReferensiSubKegiatan(),
        rService.getReferensiSumberDana(),
        // rService.getRef("pagu-indikatif", tahunTmp, "pagu-indikatif"),
        // rService.getRef("pagu-definitf", tahunTmp, "pagu-definitif"),
        rService.getLokasi("kabkota"),
        rService.getLokasi("prov"),
        rService.getKecamatan(),
        referenceService.getRef("komponen-biaya", tahunTmp, "komponen-biaya"),
        uService.getRoleS("pusat"),
        uService.getUser("pusat"),
        uService.getUser("madrasah"),
        uService.getRoleS("madrasah"),
        uService.getRoleS("kabkota"),
        uService.getUser("kabkota"),
        uService.getRoleS("prov"),
        uService.getUser("prov"),
        profileservice.getMyProfile(),
        referenceService.getRef("jenis-belanja", tahunTmp, "jenis-belanja"),
        referenceService.getRef(
          "kategori-belanja",
          tahunTmp,
          "kategori-belanja",
        ),
        referenceService.getRef("satuan", tahunTmp, "satuan"),
        referenceService.getRef("pajak", tahunTmp, "kbiaya/pajak"),
        reportServiceRkakl.getReport(tahunTmp),
        reportRealisasiRekapKeuangan.getRealisasiRekapKeuangan(tahunTmp),
      ];
    }

    promises = [
      ...promises,
      // plService.getPlanning("rencana/kegiatan", tahunTmp, "rencana/kegiatan"),
      rService.getTahun(),
      plService.getPlanning(
        "rencana/kegiatan-indikatif",
        tahunTmp,
        "rencana/kegiatan-indikatif",
      ),
      plService.getPlanning(
        "rencana/kegiatan-definitif",
        tahunTmp,
        "rencana/kegiatan-definitif",
      ),
      rkService.getRencanaKegiatan(tahunTmp),
      rService.getSnp(),
      referenceService.getRef("penggunaan-bos", tahunTmp, "pbos"),
      referenceService.getRef("kegiatan-snp", tahunTmp, "kegiatan-snp"),
      referenceService.getRef("sub-kegiatan", tahunTmp, "sub-kegiatan"),
      kelompoksasaranService.getKelompokSasaran(),
      satuanService.getSatuan(),
      referenceService.getRef(
        "kategori-belanja",
        tahunTmp,
        "komponenbiaya/jenis",
      ),
      kbService.getKatKomBiaya(),
      rService.getReferensiKomponenBiaya(),
      mdService.getMadrasah(),
      realizationService.paguDefinitifService.browse({
        activated: ["1"],
        tahun: [tahunTmp],
      }),
      realizationService.pencairanPaguDefinitifService.browse({
        activated: ["1"],
        tahun: [tahunTmp],
        groupRole: role,
      }),
      pindahbukuService.browse(),
      pengembalianDanaServices.browse(),
    ];

    Promise.allSettled(promises)
      .then((data) => {
        data.filter((d) => d.status === "rejected").forEach(console.log);
        setisSuccess(true);
        setisFail(false);
        setIsLoading(false);
        setIsSinkronOpen(false);
      })
      .catch((error) => {
        setisSuccess(false);
        setisFail(true);
        setIsLoading(false);
        setIsSinkronOpen(false);
      });
  };

  const handleListTahun = async () => {
    const dataTahun = await getTahunAuth();
    // let tmpAuth = JSON.parse(localStorage.getItem("auth")) || "";
    if (tmpAuth.tahun === undefined && dataTahun.return.length !== 0) {
      localStorage.setItem(
        "curTahunFromSelListOnHeader",
        dataTahun.return[0].tahun,
      );
    } else {
      localStorage.setItem("curTahunFromSelListOnHeader", tmpAuth.tahun);
    }

    if (tmpAuth.group_role === "madrasah") {
      setTahunTmp(tmpAuth.tahun);
    }
    setTahunList(dataTahun.return);
  };

  const toProfile = () => {
    setIsProfileMenuOpen(false);
    route.push("/profil/akun");
  };
  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function handleSinkronClick() {
    setIsSinkronOpen(!isSinkronOpen);
  }

  function handleProfileClick() {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  }

  return (
    <header className="relative z-40 h-16 py-5 bg-green-500 shadow-bottom dark:bg-gray-800">
      <div className="flex items-center justify-between h-full px-6 md:px-6 mx-auto text-white dark:text-gray-500">
        {/* <!-- Mobile hamburger --> */}
        <div className="flx">
          <div className="flex items-center justify-center">
            <div>
              <div className="mr-5  rounded-md lg:hidden  focus:outline-none focus:shadow-outline-purple">
                <MenuUnfoldOutlined
                  onClick={toggleSidebar}
                  aria-label="Menu"
                  style={{ fontSize: "20px" }}
                />
              </div>
              <div className="mr-5  hidden rounded-md lg:block focus:outline-none  focus:shadow-outline-purple">
                {isSidebarOpenDesktop ? (
                  <>
                    <MenuUnfoldOutlined
                      onClick={toggleSidebarDesktop}
                      aria-label="Menu"
                      style={{ fontSize: "20px" }}
                    />
                  </>
                ) : (
                  <>
                    <MenuFoldOutlined
                      onClick={toggleSidebarDesktop}
                      aria-label="Menu"
                      style={{ fontSize: "20px" }}
                    />
                  </>
                )}
              </div>
            </div>
            <div>
              <SelectPicker
                defaultValue={tahunTmp}
                // valueKey="value"
                searchable={false}
                cleanable={false}
                className=" bg-green-500  border-0 border-none"
                onChange={(e) => handleTahunAnggaranChange(e)}
                data={
                  tahunList.length !== 0 &&
                  tahunList.map((e) => {
                    return { value: e.tahun, label: e.nama };
                  })
                }
              />
            </div>
          </div>
        </div>
        {/* <!-- Search input --> */}
        <div className="flx">
          <ul className="flex items-center flex-shrink-0 mb-0 space-x-6">
            {tmpAuth.group_role === "madrasah" && (
              <>
                <li className="relative">
                  <Komentar />
                </li>
              </>
            )}

            <li className="relative">
              <Notification />
            </li>
            <li className="relative">
              <button
                className="relative align-middle rounded-md focus:outline-none focus:shadow-outline-purple"
                onClick={handleSinkronClick}
                aria-label="Sync Data"
                aria-haspopup="true">
                <SyncIcon className="w-5 h-5" aria-hidden="true" />
              </button>

              <Dropdown
                align="right"
                isOpen={isSinkronOpen}
                onClose={() => setIsSinkronOpen(false)}
                className="z-50">
                <DropdownItem tag="a" onClick={handleSinkron}>
                  <span className="p-2">Sinkronisasi Data</span>
                  {isLoading ? (
                    <SpinnerIcon className="w-10 h-10 m-0" aria-hidden="true" />
                  ) : (
                    ""
                  )}
                </DropdownItem>
              </Dropdown>
            </li>
            {/* <!-- Profile menu --> */}
            <li className="relative">
              <button
                className="rounded-full focus:shadow-outline-purple focus:outline-none"
                onClick={handleProfileClick}
                aria-label="Account"
                aria-haspopup="true">
                <UserOutlined style={{ fontSize: "20px", color: "#FFF" }} />

                {/* <OutlinePersonIcon className="w-6 h-6" aria-hidden="true" /> */}
              </button>
              <Dropdown
                align="right"
                isOpen={isProfileMenuOpen}
                onClose={() => setIsProfileMenuOpen(false)}>
                <DropdownItem tag="a" onClick={toProfile}>
                  <OutlinePersonIcon
                    className="w-4 h-4 mr-3"
                    aria-hidden="true"
                  />
                  <span>Profil</span>
                </DropdownItem>
                <DropdownItem
                  tag="a"
                  onClick={() => route.push("/profil/edit")}>
                  <OutlineCogIcon className="w-4 h-4 mr-3" aria-hidden="true" />
                  <span>Pengaturan</span>
                </DropdownItem>
                <DropdownItem onClick={openModal}>
                  <OutlineLogoutIcon
                    className="w-4 h-4 mr-3"
                    aria-hidden="true"
                  />
                  <span>Keluar</span>
                </DropdownItem>
              </Dropdown>
            </li>
          </ul>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>Yakin Ingin Keluar?</ModalHeader>
        <ModalBody>
          Jika keluar, semua data yang tersimpan dilokal perangkat Anda akan
          otomatis hilang.
        </ModalBody>
        <ModalFooter>
          <Button1 label="Keluar" onClick={logOut} negative />
          <Button1 label="Tetap Di Aplikasi" onClick={closeModal} />
        </ModalFooter>
      </Modal>
      <div className="flex flex-col justify-center items-center font-semibold mt-4 bg-transparent ">
        {!isOnline ? <Alert type="warning">Anda sedang offline</Alert> : null}
        {isLoading ? (
          <Alert type="info">
            Sedang Sinkrosnisasi Data{" "}
            <FontAwesomeIcon className="ml-2" icon={faSync} spin size="sm" />
          </Alert>
        ) : null}
        {isSuccess ? (
          <Alert
            type="success"
            onClose={() => {
              setisSuccess(false);
            }}>
            Data Berhasil Tersinkronkan
          </Alert>
        ) : null}
        {isFail ? (
          <Alert
            type="danger"
            onClose={() => {
              setisFail(false);
            }}>
            Gagal sinkron, silahkan sinkron secara manual atau refresh halaman
          </Alert>
        ) : null}
      </div>
    </header>
  );
}

export default Header;
