import React from "react";
import { InboxOutlined } from "@ant-design/icons";

const EmptyData = () => {
  return (
    <>
      <>
        <div
          style={{
            textAlign: "center",
            margin: "50px 0",
          }}
        >
          <InboxOutlined
            style={{
              fontSize: "50px",
            }}
          />
          <p
            className="medium-font"
            style={{
              textAlign: "center",
              paddingTop: "10px",
            }}
          >
            Empty Data
          </p>
        </div>
      </>
    </>
  );
};

export default EmptyData;
