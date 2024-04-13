import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const Spinner = ({ height, theme }) => {
  const antIcon = <LoadingOutlined style={{ fontSize: 110 }} spin />;

  return (
    <>
      <div
        className="justified-row align-items-center"
        style={{
          height: height,
          background: theme === "light" ? "#f8f9fa" : "#161d40",
          position: "relative",
        }}
      >
        <img
          src={"images/ams.png"}
          alt="logo"
          style={{
            width: "60px",
          }}
        />
        <Spin
          indicator={antIcon}
          style={{
            position: "absolute",
            zIndex: 2,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
    </>
  );
};

export default Spinner;
