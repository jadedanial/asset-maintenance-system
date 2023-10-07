import { Col, Card, Row } from "antd";

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
            <img
              src="images/danialsoft.png"
              alt="logo"
              style={{ width: "60%" }}
            />
            <Row style={{ marginTop: "20px", width: "75%" }}>
              <p className="big-font">
                Keeping your assets in top shape for optimal performance.
              </p>
            </Row>
          </Card>
        </div>
      </Col>
    </>
  );
};

export default Slogan;
