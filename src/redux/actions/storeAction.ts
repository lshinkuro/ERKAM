/** @format */
import { getTahunActive } from "../../services/v2/referenceservice/tahun";
import { StoreActions } from "../actionsName";

export const setPeriodeTahunActive =
  () =>
  (dispatch: any): void => {
    getTahunActive()
      .then((data) => {
        dispatch({ type: StoreActions.SET_TAHUN_PERIODE_ACTIVE, data: data });
      })
      .catch((error) => {
        console.log(error);
      });
  };

/** Set Store */
export const setStore = (data) => ({
  type: StoreActions.SET_STORE,
  data: data,
});

/** Delete Store */
export const setClearStore = () => ({
  type: StoreActions.CLEAR_STORE,
});
// /** Set Role */
// export const setRole = (data) => ({
//   type: StoreActions.SET_ROLE,
//   data: data,
// });

// /** Set Role User */
// export const setRoleUser = (data) => ({
//   type: StoreActions.SET_ROLE_USER,
//   data: data,
// });

// /** Set Provinsi */
// export const setProvinsi = (data) => ({
//   type: StoreActions.SET_PROVINSI,
//   data: data,
// });

// /** Set Kabkota */
// export const setKabKota = (data) => ({
//   type: StoreActions.SET_KABKOTA,
//   data: data,
// });

// /** Set Kecamatan */
// export const setKecamatan = (data) => ({
//   type: StoreActions.SET_KECAMATAN,
//   data: data,
// });

// /** Set Kelurahan */
// export const setKelurahan = (data) => ({
//   type: StoreActions.SET_KELURAHAN,
//   data: data,
// });
