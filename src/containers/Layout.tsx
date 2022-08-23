/** @format */

import React, { Suspense, lazy, useEffect, useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import routes from "../routes";

import HeaderNav from "../components/HeaderNav";
import Sidebar from "../components/Sidebar";
import Main from "../containers/Main";
import { Spin } from "antd";
import ThemedSuspense from "../components/ThemedSuspense";
import { useDispatch, useSelector } from "react-redux";
import { setStore } from "../redux/actions";

/** usermanservices */

import * as userserviceRole from "../services/v2/usermanservice/roleservices";
import * as userserviceRoleUser from "../services/v2/usermanservice/roleuserservices";
import * as userserviceProfile from "../services/v2/usermanservice/profileservices";
/** referenceservices */
import * as referenceserviceProvinsi from "../services/v2/referenceservice/provinsiservices";
import * as referenceserviceKabKota from "../services/v2/referenceservice/kabkotaservices";
import * as referenceserviceKecamatan from "../services/v2/referenceservice/kecamatanservices";
import {
  getLaporanAPBM,
  getLaporanRAPBMDashboard,
} from "../services/v2/realizationservice/laporanservices";
import { getRekeningBelanja } from "../services/v2/referenceservice/rekeningbelanjaservices";
import { getLevelPPK } from "../services/v2/referenceservice/levelppkservices";
/** planningservice */
import {
  getLaporanRapbmRekap,
  getLaporanApbmDashboard,
} from "../services/v2/planningservice/laporanservices";
import {
  getBank,
  getReferenceAll,
  getTipePenerima,
} from "../services/v2/referenceservice";
import { getSumberDana } from "../services/v2/referenceservice/sumberdanaservices";
import { getPenerima } from "../services/v2/referenceservice/penerimaservices";
// import {
//   getSnp,
//   getSubKegiatan,
// } from "../services/v2/referenceservice/snpkegiatanservices";
import { getPenggunaanBos } from "../services/v2/referenceservice/penggunaanbos";
import { getPlanningAll } from "../services/v2/planningservice";
import { getRealizationAll } from "../services/v2/realizationservice";
import { getUsermanAll } from "../services/v2/usermanservice";

///check lagi
// import * as paguDefinitifServiceOnPlanning from "../services/v2/planningservice/pagudefinitif";
// import * as paguDefinitifService from "../services/v2/realizationservice/pagudefinitif";
// import * as realizationService from "../services/v2/realizationservice";
// import * as pendapatanService from "../services/v2/realizationservice/pendapatan/pendapatan";
// import * as mdService from "../services/v2/usermanservice/madrasahservices";

const Page404 = lazy(() => import("../pages/404"));

const BasicLayout = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: any) => state.auth);
  const [loading, setLoading] = useState(false);
  const isTahun = auth.isTahun;

  // const store = useSelector((state: any) => state.store);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (auth.isOnline) {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, auth.isOnline, isTahun]);

  const getData = async () => {
    setLoading(true);
    let dataTmp = {};

    /** User Services */
    const profile = await userserviceProfile.getProfile();
    const role = await userserviceRole.getRole({
      group: auth.data.group_role,
      activated: 1,
    });
    const roleUser = await userserviceRoleUser.getRoleUser({
      group: auth.data.group_role,
      activated: 1,
    });

    const rekeningBelanja = await getRekeningBelanja({
      activated: 1,
    });

    const levelPPK = await getLevelPPK({
      activated: 1,
    });

    const bank = await getBank({
      activated: 1,
    });

    /** ReferenceServices */
    // const snp = await getSnp();
    const snp = await getReferenceAll("snp", {
      activated: 1,
      tahun: isTahun,
    });

    const subKegiatan = await getReferenceAll("sub-kegiatan", {
      activated: 1,
      tahun: isTahun,
    });
    // await getSubKegiatan();

    const penggunaanBos = await getPenggunaanBos();

    const provinsi = await referenceserviceProvinsi.getProvinsi({
      activated: 1,
    });

    const kabkota = await referenceserviceKabKota.getKabKota({
      activated: 1,
    });

    const kecamatan = await referenceserviceKecamatan.getKecamatan({
      activated: 1,
    });

    // const kelurahan = await referenceserviceKelurahan.getKelurahan({
    //   activated: 1,
    // });

    const pajak = await getReferenceAll("pajak", { activated: 1 });

    const tahun = await getReferenceAll("tahun", { activated: 1 });

    const kegiatan = await getReferenceAll("kegiatan-snp", {
      activated: 1,
      tahun: isTahun,
    });

    const jenisBelanja = await getReferenceAll("jenis-belanja", {
      activated: 1,
    });

    const kategoriBelanja = await getReferenceAll("kategori-belanja", {
      activated: 1,
    });

    const metodePembayaran = await getReferenceAll("metode-pembayaran", {
      activated: 1,
    });

    const kegiatanBop = await getReferenceAll("kegiatan-bop", {
      activated: 1,
    });

    const satuan = await getReferenceAll("satuan", {
      activated: 1,
    });

    const jenisTahapan = await getReferenceAll("jenis-tahapan", {
      activated: 1,
    });

    const tipeKas = await getReferenceAll("tipe-kas", {
      activated: 1,
    });

    const rencanaTanggal = await getPlanningAll("rencana-tanggal", {
      tahun: isTahun,
    });
    const sumberDana = await getSumberDana();

    const jenjang = await getUsermanAll("/auth/jenjang", null);
    switch (auth.data.group_role) {
      case "madrasah":
        // error 415
        const users = await getUsermanAll("management-user/get-user", {
          activated: 1,
          group: auth.data.group_role,
        });

        // const realisasiBiayaLaporanKeuangan = await getRealizationAll(
        //   "biaya/laporan-keuangan",
        //   {
        //     tahun: isTahun,
        //   },
        // );

        const laporanRapbmDashboard = await getLaporanRAPBMDashboard({
          tahun: isTahun,
        });

        const laporanApbmDashboard = await getLaporanApbmDashboard({
          tahun: isTahun,
        });

        const laporanApbm = await getLaporanAPBM({
          tahun: isTahun,
          madrasahId: auth.data.madrasah.id,
        });

        const laporanRapbmRekap = await getLaporanRapbmRekap({
          tahun: isTahun,
          madrasahId: auth.data.madrasah.id,
        });

        const tipePenerima = await getTipePenerima({
          activated: 1,
        });

        const penerimaRekening = await getPenerima({
          activated: 1,
        });

        /** Planning Services */
        const rencanaPendapatanDefinitif = await getPlanningAll(
          "rencana-pendapatan",
          { tahun: isTahun },
        );
        const rencanaPendapatanIndikatif = await getPlanningAll(
          "rencana-pendapatan-indikatif",
          { tahun: isTahun },
        );
        const rencanaRekapSumberDanaBelanja = await getPlanningAll(
          "rencana-rekap-sumber-dana-belanja",
          { tahun: isTahun },
        );

        const rencanaKegiatanIndikatif = await getPlanningAll(
          "rencana/kegiatan-indikatif",
          { tahun: isTahun },
        );

        const rencanaKegiatanDefinitif = await getPlanningAll(
          "rencana/kegiatan-definitif",
          { tahun: isTahun },
        );
        const rencanaRincianKegiatanIndikatif = await getPlanningAll(
          "rencana-rincian-kegiatan-indikatif",
          { tahun: isTahun },
        );
        const rencanaRincianKegiatanDefinitif = await getPlanningAll(
          "rencana-rincian-kegiatan-definitif",
          { tahun: isTahun },
        );
        const rencanaRekapSumberDanaBelanjaDefinitif = await getPlanningAll(
          "rencana-rekap-sumber-dana-belanja-definitif",
          {
            tahun: isTahun,
          },
        );

        const kategoriKomponenBiaya = await getReferenceAll(
          "kategori-komponen-biaya",
          {
            activated: 1,
          },
        );

        // const komponenBiaya = await getReferenceAll("komponen-biaya", {
        //   tahun: isTahun,
        //   kode_provinsi: auth.data.madrasah.kode_provinsi,
        //   kode_kabkota: auth.data.madrasah.kode_kabkota,
        // });

        // const komponenBiaya = await getReferenceAll(
        //   "rencana-rincian-kegiatan-dropdown",
        //   {
        //     tahun: isTahun,
        //     // kode_provinsi: auth.data.madrasah.kode_provinsi,
        //     // kode_kabkota: auth.data.madrasah.kode_kabkota,
        //   },
        // );
        const kelompokSasaran = await getReferenceAll("kelompok-sasaran", {
          activated: 1,
        });

        const tipePencairan = await getReferenceAll("tipe-pencairan", {
          activated: 1,
          tahun: isTahun,
        });

        /** Realization */
        const realisasiUploadSpp = await getRealizationAll("upload-spp", {
          tahun: isTahun,
        });

        const realisasiPindahBuku = await getRealizationAll("pindah-buku", {
          tahun: isTahun,
        });

        const realisasiPengembalianDana = await getRealizationAll(
          "pengembalian-dana",
          {
            tahun: isTahun,
          },
        );

        const realisasiPendapatan = await getRealizationAll("pendapatan", {
          tahun: isTahun,
        });

        const realisasiPendapatanHeader = await getRealizationAll(
          "pendapatan/header",
          {
            tahun: isTahun,
          },
        );

        const realisasiPencairanPaguDefinitif = await getRealizationAll(
          "pencairan-pagu-definitif",
          {
            tahun: isTahun,
            activated: 1,
          },
        );
        const realisasiPajak = await getRealizationAll("pajak", {
          tahun: isTahun,
        });
        const realisasiPajakDetail = await getRealizationAll("pajak-detail", {
          tahun: isTahun,
        });

        const realisasiOutputKegiatan = await getRealizationAll(
          "output-kegiatan",
          {
            tahun: isTahun,
          },
        );

        const realisasiBiaya = await getRealizationAll("biaya", {
          tahun: isTahun,
        });

        const realisasiBiayaDetail = await getRealizationAll("biaya-detail", {
          tahun: isTahun,
        });

        //check//

        dataTmp = {
          profile,
          role,
          roleUser,
          laporanApbm,
          laporanRapbmRekap,
          rekeningBelanja,
          levelPPK,
          bank,
          tipePenerima,
          metodePembayaran,
          sumberDana,
          penerimaRekening,
          snp,
          kegiatan,
          subKegiatan,
          penggunaanBos,
          provinsi,
          kabkota,
          kecamatan,
          // kelurahan,
          tipeKas,
          users,
          rencanaKegiatanIndikatif,
          rencanaKegiatanDefinitif,
          rencanaRincianKegiatanIndikatif,
          rencanaRincianKegiatanDefinitif,
          rencanaPendapatanDefinitif,
          rencanaPendapatanIndikatif,
          rencanaRekapSumberDanaBelanja,
          rencanaRekapSumberDanaBelanjaDefinitif,
          rencanaTanggal,
          pajak,
          tahun,
          jenisBelanja,
          kategoriBelanja,
          tipePencairan,
          jenisTahapan,
          kegiatanBop,
          kategoriKomponenBiaya,

          satuan,
          kelompokSasaran,
          realisasiUploadSpp,
          realisasiPindahBuku,
          realisasiPengembalianDana,
          realisasiPendapatan,
          realisasiPendapatanHeader,
          realisasiPencairanPaguDefinitif,
          realisasiPajak,
          realisasiPajakDetail,
          realisasiOutputKegiatan,
          realisasiBiaya,
          realisasiBiayaDetail,
          laporanRapbmDashboard,
          laporanApbmDashboard,
          // realisasiBiayaLaporanKeuangan,
        };
        dispatch(setStore(dataTmp));

        // error 500
        // const rencanaReportRkaklRekap = await getPlanningAll(
        //   "rencana/report-rkakl-rekap",
        //   isTahun,
        // );
        /*** check lagi */

        // paguDefinitifServiceOnPlanning.browsePendapatanHeader(),
        // paguDefinitifService.browse({
        //   activated: ["1"],
        //   tahun: [isTahun],
        //   groupRole: "madrasah",
        // }),
        // realizationService.paguDefinitifPlanningService.browseBelanja(
        //   isTahun,
        // ),
        // realizationService.pengeluaranpajakService.getPengeluaranPajak(
        //   isTahun,
        // ),

        break;
      case "kabkota":
        dataTmp = {
          profile,
          role,
          roleUser,
          satuan,
          snp,
          kegiatan,
          subKegiatan,
          penggunaanBos,
          provinsi,
          kabkota,
          kecamatan,
          // kelurahan,
          // users,
          sumberDana,
          jenisTahapan,
          rencanaTanggal,
          pajak,
          tahun,
          jenisBelanja,
          kategoriBelanja,
          jenjang,
          // realisasiBiayaLaporanKeuangan,
        };
        dispatch(setStore(dataTmp));
        break;

      case "pusat":
        dataTmp = {
          profile,
          role,
          roleUser,
          satuan,
          snp,
          kegiatan,
          subKegiatan,
          penggunaanBos,
          provinsi,
          kabkota,
          kecamatan,
          // kelurahan,
          jenisTahapan,
          rencanaTanggal,
          pajak,
          tahun,
          jenisBelanja,
          kategoriBelanja,
          sumberDana,
          jenjang,
          // realisasiBiayaLaporanKeuangan,
        };
        dispatch(setStore(dataTmp));
        break;
      case "provinsi":
        dataTmp = {
          profile,
          role,
          roleUser,
          satuan,
          snp,
          kegiatan,
          subKegiatan,
          penggunaanBos,
          provinsi,
          kabkota,
          kecamatan,
          // kelurahan,
          jenisTahapan,
          rencanaTanggal,
          pajak,
          tahun,
          jenisBelanja,
          kategoriBelanja,
          sumberDana,
          jenjang,
          // realisasiBiayaLaporanKeuangan,
        };
        dispatch(setStore(dataTmp));
        break;
    }

    setLoading(false);
  };

  return (
    <Spin spinning={loading}>
      <div className={`flex h-screen bg-gray-50 dark:bg-gray-900`}>
        <Sidebar />
        <div className="flex flex-col flex-1 w-full">
          <HeaderNav />
          <Main>
            <Suspense fallback={<ThemedSuspense />}>
              <Switch>
                {routes.map((route: any, i) => {
                  // console.log(route);
                  return (
                    route?.component && (
                      <Route
                        key={`${route}${i}`}
                        exact
                        path={`/${route.path}`}
                        render={(props) => <route.component {...props} />}
                      />
                    )
                  );
                })}
                <Redirect exact from="/" to="/dashboard" />
                <Route component={Page404} />
              </Switch>
            </Suspense>
          </Main>
        </div>
      </div>
    </Spin>
  );
};
export default BasicLayout;
