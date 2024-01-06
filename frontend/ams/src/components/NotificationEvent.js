import React from "react";
import { CheckSquareOutlined, CloseSquareOutlined } from "@ant-design/icons";

function NotificationEvent(status, desc) {
  const color = status ? "#318ce7" : "#ff0000";
  const icon = status ? (
    <CheckSquareOutlined style={{ color: color }} />
  ) : (
    <CloseSquareOutlined style={{ color: color }} />
  );

  const message = (
    <p className="medium-card-title" style={{ color: color }}>
      Notification
    </p>
  );

  const description = (
    <p className="small-font" style={{ color: color }}>
      {desc}
    </p>
  );

  return {
    message: message,
    description: description,
    placement: "topRight",
    duration: 5,
    icon: icon,
  };
}

export default NotificationEvent;
