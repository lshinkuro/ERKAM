/** @format */

import { notification } from "antd";

const notifAlert = (props) => {
  return notification[props.type]({
    message:
      (props.type === "error" && "Kesalahan") ||
      (props.type === "success" && "Berhasil") ||
      (props.type === "warning" && "Perhatian") ||
      (props.type === "info" && "Information"),
    description: props.description,
  });
};
export default notifAlert;
