import React from "react";
import { Result } from "antd";

const ResultEvent = ({
  icon,
  status,
  title,
  subTitle,
  extra,
  height,
  theme,
}) => {
  return (
    <>
      <div
        className={`align-items-center justified-row ${theme}`}
        style={{
          height: height,
        }}
      >
        <Result
          style={{
            width: "500px",
          }}
          icon={icon}
          status={status}
          title={title}
          subTitle={subTitle}
          extra={extra}
        />
      </div>
    </>
  );
};

export default ResultEvent;
