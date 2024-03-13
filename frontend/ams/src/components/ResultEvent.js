import React from "react";
import { Result } from "antd";

const ResultEvent = ({ icon, status, title, subTitle, extra, theme }) => {
  return (
    <>
      <div className={theme} style={{ paddingTop: "30px", minHeight: "460px" }}>
        <Result
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
