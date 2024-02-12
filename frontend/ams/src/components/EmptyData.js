import React from "react";
import { InboxOutlined } from "@ant-design/icons";

const EmptyData = (props) => {
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
              color: props.theme === "light" ? "#87e4f769" : "#12002e77",
            }}
          />
          <p
            className="medium-font"
            style={{
              textAlign: "center",

              paddingTop: "10px",
              color: props.theme === "light" ? "#87e4f7" : "#130130",
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
