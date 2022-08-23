/** @format */

import React from "react";
import { Button, Result } from "antd";
import { useHistory } from "react-router-dom";

const Page404: React.FC = () => {
  const route = useHistory();
  return (
    <Result
      status="404"
      title="404"
      subTitle="Maaf, Halaman ini tidak di temukan."
      extra={
        <Button onClick={() => route.push("/")} type="primary">
          Kembali
        </Button>
      }
    />
  );
};

export default Page404;
