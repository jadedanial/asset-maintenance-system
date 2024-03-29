import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const Spinner = ({ theme }) => {
  const antIcon = <LoadingOutlined style={{ fontSize: 100 }} spin />;

  return (
    <>
      <div
        className="justified-row align-items-center"
        style={{
          height: "100vh",
          background: "#ecf3f9",
        }}
      >
        <img
          src={"images/ams.png"}
          alt="logo"
          style={{
            width: "60px",
            position: "fixed",
          }}
        />
        <Spin indicator={antIcon} />
      </div>
    </>
  );
};

export default Spinner;
