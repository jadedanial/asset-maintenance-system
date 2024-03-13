import { Col } from "antd";

const Slogan = () => {
  return (
    <>
      <Col
        style={{
          top: "20%",
          textAlign: "center",
          padding: "0 80px",
        }}
      >
        <div>
          <img src="images/ams.png" alt="logo" style={{ width: "60%" }} />
        </div>
        <div>
          <p className="small-font" style={{ textAlign: "left" }}>
            An asset performance optimization system developed by Jade Danial
            (danialjade@gmail.com) that aims to enhance the efficiency and
            effectiveness of an organization’s assets. This system is designed
            to ensure that all assets are well-maintained and functioning at
            their optimal capacity.
          </p>
        </div>
      </Col>
    </>
  );
};

export default Slogan;
