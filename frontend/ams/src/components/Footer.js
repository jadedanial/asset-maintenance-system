import React from "react";
import { Row } from "antd";
import { GithubFilled, LinkedinFilled, LinkOutlined } from "@ant-design/icons";

const Footer = ({ theme }) => {
  return (
    <>
      <Row
        className="align-items-center justified-row"
        style={{
          background: theme === "light" ? "#f0ffff" : "#000c17",
          height: "80px",
          padding: "0 80px",
        }}
      >
        <p
          className="small-font"
          style={{ color: theme === "light" ? "#000" : "#fff" }}
        >
          AMS<sup>&#8482;</sup> developed by Jade Danial, email:
          danialjade@gmail.com &copy; 2024 All rights reserved.
        </p>
        <Row style={{ paddingLeft: "24px" }}>
          <a
            href="https://jadedanial.github.io/projects/"
            target="_blank"
            rel="noreferrer"
          >
            <LinkOutlined />
          </a>
          <br />
          <a
            href="https://github.com/jadedanial"
            target="_blank"
            rel="noreferrer"
          >
            <GithubFilled style={{ padding: "0 14px" }} />
          </a>
          <br />
          <a
            href="https://www.linkedin.com/in/jadedanial/"
            target="_blank"
            rel="noreferrer"
          >
            <LinkedinFilled />
          </a>
        </Row>
      </Row>
    </>
  );
};

export default Footer;
