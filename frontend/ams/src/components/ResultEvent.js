import React from "react";
import { Result } from "antd";

const ResultEvent = (props) => {
  return (
    <>
      <div className={props.theme} style={{ paddingTop: "30px" }}>
        <Result
          icon={props.icon}
          status={props.status}
          title={props.title}
          subTitle={props.subTitle}
          extra={props.extra}
        />
      </div>
    </>
  );
};

export default ResultEvent;
