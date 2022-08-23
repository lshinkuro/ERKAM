/** @format */

import React from "react";
import { Button, Tooltip, Dropdown, Menu } from "antd";
import { PdfIcon, ExcelIcon } from "../../icons";
import {
  // UserOutlined,
  // MailOutlined,
  // AimOutlined,
  DownOutlined,
  EyeOutlined,
  CheckSquareOutlined,
  DownloadOutlined,
  HistoryOutlined,
  // ContactsOutlined,
  EditFilled,
  PlusOutlined,
  DeleteOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";

export const ButtonTambah = (props: any) => {
  return (
    <Button type="primary" icon={<PlusOutlined />} {...props}>
      {props.title ? props.title : "Tambah"}
    </Button>
  );
};

export const ButtonEdit = (props: any) => {
  return (
    <Button type="primary" icon={<EditFilled />} {...props}>
      {props.title ? props.title : "Edit"}
    </Button>
  );
};

export const ButtonExport = (props: any) => {
  return (
    <Button icon={<DownloadOutlined />} {...props}>
      {props.title ? props.title : "Export"}
    </Button>
  );
};

export const ButtonPlus = (props: any) => {
  return (
    <Tooltip title={props.tooltips || ""}>
      <Button icon={<PlusOutlined />} {...props}>
        {props.title}
      </Button>
    </Tooltip>
  );
};

export const ButtonDetail = ({ title, ...props }: any) => {
  return (
    <Button icon={<FileSearchOutlined />} {...props}>
      {title}
    </Button>
  );
};

export const ButtonLog = (props: any) => {
  return (
    <Button icon={<HistoryOutlined />} {...props}>
      Log
    </Button>
  );
};

export const ButtonTableDelete = (props: any) => {
  return (
    <Tooltip title={props.tooltips || "Hapus"}>
      <Button
        type="default"
        className="custom-button-rkam"
        icon={<DeleteOutlined />}
        style={{ background: "#f44436", color: "white", borderRadius: 4 }}
        {...props}
      />
    </Tooltip>
  );
};

export const ButtonTableApproval = (props: any) => {
  return (
    <Tooltip title={props.tooltips || ""}>
      <Button
        type="default"
        className="custom-button-rkam"
        icon={<CheckSquareOutlined />}
        style={{ background: "green", color: "white", borderRadius: 4 }}
        {...props}
      />
    </Tooltip>
  );
};

export const ButtonTableEdit = (props: any) => {
  return (
    <Tooltip title={props.tooltips || "Ubah"}>
      <Button
        type="default"
        className="custom-button-rkam"
        icon={<EditFilled />}
        style={{ background: "#ffca27", color: "white", borderRadius: 4 }}
        {...props}
      />
    </Tooltip>
  );
};

export const ButtonTableDetail = (props: any) => {
  return (
    <Tooltip title={props.tooltips || ""}>
      <Button
        type="default"
        className="custom-button-rkam"
        icon={<FileSearchOutlined />}
        style={{ background: "#00bcd4", color: "white", borderRadius: 4 }}
        {...props}
      />
    </Tooltip>
  );
};

export const ButtonTableEditBlue = (props: any) => {
  return (
    <Tooltip title={props.tooltips || ""}>
      <Button
        type="default"
        className="custom-button-rkam"
        icon={<EyeOutlined />}
        style={{ background: "#108ee9", color: "white", borderRadius: 4 }}
        {...props}
      />
    </Tooltip>
  );
};

export const ButtonDropdownExport = ({ handleExportFile, ...props }) => {
  const menuExport = (): JSX.Element => {
    return (
      <Menu>
        <Menu.Item key={`menudrop1`} onClick={() => handleExportFile("pdf")}>
          <div className="flex">
            <PdfIcon className="mx-2" /> PDF
          </div>
        </Menu.Item>
        <Menu.Item key={`menudrop2`} onClick={() => handleExportFile("excel")}>
          <div className="flex">
            <ExcelIcon className="mx-2" /> Excel
          </div>
        </Menu.Item>
      </Menu>
    );
  };
  return (
    <Dropdown overlay={menuExport} placement="bottomLeft">
      <Button>
        Export <DownOutlined />
      </Button>
    </Dropdown>
  );
};

type ButtonProps = {
  onClick: any;
  label: string;
  negative?: boolean;
};

const index: React.FC<ButtonProps> = ({ label, negative, ...rest }) => {
  if (negative) {
    return (
      <button
        className="bg-red-600 h-10 hover:bg-green-500 text-white font-md focus:outline-none  py-1 px-4 rounded"
        {...rest}>
        {label}
      </button>
    );
  }
  return (
    <button
      className="bg-green-500 h-10 hover:bg-green-400 text-white font-md focus:outline-none  py-1 px-4 rounded"
      {...rest}>
      {label}
    </button>
  );
};

export default index;
