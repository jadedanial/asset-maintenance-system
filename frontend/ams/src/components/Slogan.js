import { Col, Card } from "antd";

const Slogan = () => {
  return (
    <>
      <Col span={12} style={{ top: "30%" }}>
        <div className="flex-end-row">
          <Card
            style={{
              width: "70%",
              background: "#f0f2f5",
            }}
          >
            <img src="images/ams.png" alt="logo" style={{ width: "60%" }} />
          </Card>
        </div>
      </Col>
    </>
  );
};

export default Slogan;
