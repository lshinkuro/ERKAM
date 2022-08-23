/** @format */
import React from "react";
import { Dropdown, Button } from "antd";

const menuDropdown = (props: any) => {
  return (
    <Dropdown
      overlay={props.overlay}
      placement="bottomRight"
      trigger={["click"]}
      arrow={{ pointAtCenter: true }}>
      <Button
        type="text"
        //   icon={props.menuIcon}
      />
    </Dropdown>
  );
};
export default menuDropdown;
