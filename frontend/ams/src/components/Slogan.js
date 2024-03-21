import { Col } from "antd";

const Slogan = () => {
  return (
    <Col
      className="align-items-center"
      style={{
        textAlign: "right",
        height: "calc(100vh - 80px)",
      }}
    >
      <div>
        <img src="images/ams.png" alt="logo" style={{ width: "60%" }} />
      </div>
    </Col>
  );
};

export default Slogan;
