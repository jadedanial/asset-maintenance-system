import React from "react";
import { CheckSquareFilled, CloseSquareFilled } from "@ant-design/icons";

function NotificationEvent(status, desc) {
  const color = status ? "#318ce7" : "#ff0000";
  const icon = status ? <CheckSquareFilled /> : <CloseSquareFilled />;

  const message = (
    <p className="small-font" style={{ color: color }}>
      {desc}
    </p>
  );

  return {
    message: message,
    placement: "topRight",
    duration: 3,
    icon: icon,
  };
}

export default NotificationEvent;
