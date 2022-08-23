/** @format */
import { AuthActions } from "../actionsName";
type AuthProps = {
  isLogin: boolean;
  isOnline: boolean;
  isTahun: any;
  data: any;
};

// let authTmp = JSON.parse(localStorage.getItem("auth")!);

const InitialAuthState: AuthProps = {
  isLogin: false,
  isOnline: navigator.onLine,
  isTahun: null,
  data: {},
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const authReducers = (state = InitialAuthState, action): any => {
  switch (action.type) {
    case AuthActions.SET_AUTH:
      localStorage.setItem("auth", JSON.stringify(action.payload.data));
      return {
        ...state,
        isLogin: true,
        isTahun: action.payload.tahun,
        data: action.payload.data,
      };
    case AuthActions.SET_ONLINE:
      return {
        ...state,
        isOnline: action.status,
      };
    case AuthActions.SET_TAHUN:
      let tmpAuth: any = {
        ...state.data,
        isTahun: action.tahun,
      };
      localStorage.setItem("auth", JSON.stringify(tmpAuth));
      return {
        ...state,
        isTahun: action.tahun,
        data: tmpAuth,
      };
    case AuthActions.LOG_OUT:
      localStorage.clear();
      return InitialAuthState;

    default:
      return state;
  }
};

export default authReducers;
