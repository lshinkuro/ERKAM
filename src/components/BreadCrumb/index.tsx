/** @format */

import React from "react";
import { PageHeader } from "antd";
// import { HomeOutlined } from "@ant-design/icons";

type PageHeaderProps = {
  routes: any[];
  title: string;
  subTitle?: string;
  back?: boolean;
  extra?: React.ReactNode;
  toBack?: () => void;
};

const index: React.FC<PageHeaderProps> = ({
  routes,
  title,
  subTitle,
  back = false,
  extra,
  toBack = () => true,
}) => {
  let pageStyle: any = {
    className: "site-page-header",
    title: title,
    subTitle: subTitle,
    breadcrumb: { routes },
    extra,
  };
  if (back) {
    pageStyle = {
      ...pageStyle,
      onBack: () => toBack(),
    };
  }
  return (
    <div className="w-full divide-y bg-white divide-fuchsia-300 shadow-sm">
      <PageHeader {...pageStyle}></PageHeader>
    </div>
  );
};

export default index;
