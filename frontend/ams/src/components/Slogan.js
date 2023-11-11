import { Col, Card } from "antd";

const Slogan = () => {
  return (
    <>
      <Col span={12} className="flex-end-row" style={{ top: "30%" }}>
        <Card
          style={{
            width: "70%",
            background: "#f0f2f5",
          }}
        >
          <img src="images/ams.png" alt="logo" style={{ width: "60%" }} />
        </Card>
      </Col>
    </>
  );
};

export default Slogan;
