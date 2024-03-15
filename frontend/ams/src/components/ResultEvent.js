import React from "react";
import { Result } from "antd";

const ResultEvent = ({ icon, status, title, subTitle, extra, theme }) => {
  return (
    <>
      <div className={theme}>
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
