/** @format */
import React from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const InputSearch = (props): any => {
  return (
    <>
      <Input
        name="search"
        placeholder="Cari.."
        style={{ maxWidth: 500 }}
        {...props}
        suffix={<SearchOutlined />}
      />
    </>
  );
};

export default InputSearch;
