/** @format */

import React from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

/** Komponen Tootips */
const TooltipInfo = (params: any) => (
  <Tooltip {...params}>
    <InfoCircleOutlined style={{ fontSize: 14 }} />
  </Tooltip>
);

export default TooltipInfo;
