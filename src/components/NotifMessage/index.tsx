/** @format */

import React from "react";
import moment from "moment";
import "moment/locale/id";
import { Alert } from "antd";

type notifMessageParams = {
  tanggalErkam: any;
  module: string;
  setAction: (action: any) => void;
};

export const NotifMessage = (params: notifMessageParams) => {
  const erkamDate: any = params.tanggalErkam;
  let module =
    (params.module === "pendapatanIndikatif" && "Pendapatan") ||
    (params.module === "pendapatanDefinitif" && "Pendapatan") ||
    (params.module === "belanjaDefinitif" && "Belanja") ||
    (params.module === "belanjaIndikatif" && "Belanja");

  let status = false;
  let countdownText = "";
  let title;
  let description;

  if (erkamDate.length) {
    if (moment().isBefore(erkamDate[0].end_date)) {
      status = false;
    } else {
      status = true;
    }

    let timeStamp =
      moment(erkamDate[0].end_date).toDate().getTime() -
      moment().toDate().getTime();
    let timeCountdown = moment.duration(timeStamp);
    if (timeCountdown.years() > 0) {
      countdownText = countdownText + timeCountdown.years() + " tahun ";
    }
    if (timeCountdown.months() > 0) {
      countdownText = countdownText + timeCountdown.months() + " bulan ";
    }
    if (timeCountdown.days() > 0) {
      countdownText = countdownText + timeCountdown.days() + " hari ";
    }
    if (timeCountdown.hours() > 0) {
      countdownText = countdownText + timeCountdown.hours() + " jam ";
    }
    if (timeCountdown.minutes() > 0) {
      countdownText = countdownText + timeCountdown.minutes() + " menit";
    }

    if (erkamDate[0].kode_jenis_tahapan !== "penetapan indikatif") {
      if (
        params.module === "pendapatanIndikatif" ||
        params.module === "belanjaIndikatif"
      ) {
        params.setAction(true);
        status = true;
        title = `Penetapan ${module} Indikatif Selesai`;
        description = "Penetapan Pendapatan Indikatif telah berakhir";
      } else {
        title = `Penetapan ${module} Definitif`;
        if (status) {
          params.setAction(true);
          description = `Penetapan ${
            erkamDate[0].status_pagu === "DEFINITIF" ? "Definitif" : "Perubahan"
          } telah berakhir`;
        } else {
          params.setAction(false);
          description = `Penetapan ${
            erkamDate[0].status_pagu === "DEFINITIF" ? "Definitif" : "Perubahan"
          } Akan berakhir ${countdownText} lagi`;
          //   status = true;
        }
      }
    } else {
      if (
        params.module === "pendapatanIndikatif" ||
        params.module === "belanjaIndikatif"
      ) {
        title = `Penetapan ${module} Indikatif`;
        if (status) {
          params.setAction(true);
          description = "Penetapan Pendapatan Indikatif telah berakhir";
        } else {
          params.setAction(false);
          description = `Akan berakhir ${countdownText} lagi`;
        }
      } else {
        params.setAction(true);
        title = `Penetapan ${module} Indikatif`;
        if (status) {
          description = `Penetapan telah berakhir pada tanggal ${moment(
            erkamDate[0].end_date,
          ).format("DD MMM YYYY [jam ]HH:mm")}`;
        } else {
          description = `Akan berakhir ${countdownText} lagi`;
        }
        status = false;
      }
    }
  } else {
    params.setAction(true);
    title = "Tidak ada penetapan";
    description = "Maaf belum ada penetapan dilakukan";
  }

  return (
    <>
      <Alert
        message={title}
        description={description}
        type={status ? "success" : "info"}
        showIcon
      />
    </>
  );
};
