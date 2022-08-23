/**
 * @format
 * @ratsoehimura
 * Action Auth
 **/

import { AuthActions } from "../actionsName";

/** Set Sign In */
export const signIn = (data, tahun) => ({
  type: AuthActions.SET_AUTH,
  payload: { data: data, tahun: tahun },
});

/** Set Sign Out */
export const signOut = () => ({
  type: AuthActions.LOG_OUT,
});

/** Set Status Online */
export const setOnline = (isOnline) => ({
  type: AuthActions.SET_ONLINE,
  status: isOnline,
});

/** Set Tahun Periode */
export const setTahunPeriode = (tahun) => ({
  type: AuthActions.SET_TAHUN,
  tahun: tahun,
});
