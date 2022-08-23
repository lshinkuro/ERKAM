/** @format */

import React from "react";
import KemenAg from "../../assets/img/logo-kemenag.png";
import Erkam from "../../assets/img/erkam_warna.png";

/**
 * Header Login Area
 */
export const HeaderLogo = () => (
  <>
    <div className="flex justify-between">
      <img
        aria-hidden="true"
        className="mx-auto h-16 w-auto sm:h-12"
        src={KemenAg}
        alt="Office"
      />

      <img
        aria-hidden="true"
        className="mx-auto h-16 w-auto sm:h-12"
        src={Erkam}
        alt="Office"
      />
    </div>
    <h1 className="mb-4 mt-4 text-xl  text-center font-semibold text-gray-700 dark:text-gray-200">
      Rencana Kerja Anggaran Madrasah Berbasis Elektronik
    </h1>
  </>
);

/**
 * Footer Login Area
 */

export const FooterLogin = () => (
  <>
    <div className="flex justify-between mb-2">
      <a
        href="https://pendis.kemenag.go.id/"
        // eslint-disable-next-line react/jsx-no-target-blank
        target="_blank"
        rel="noreferrer"
        className=" font-light text-gray-700 dark:text-gray-700">
        Direktorat Jendral Pendidikan Islam
      </a>
      <a
        // eslint-disable-next-line react/jsx-no-target-blank
        target="_blank"
        rel="noreferrer"
        href="https://kemenag.go.id/"
        className=" font-light text-gray-700 dark:text-gray-700">
        Kementrian Agama Republik Indonesia
      </a>
    </div>
    <div className="copyright text-center">
      © e-RKAM Versi 2.0 All Rights Reserved.
    </div>
  </>
);
