import React, { useState } from "react";
import { Card, Typography, Segmented } from "antd";
import Reorder from "./Reorder";

const { Title } = Typography;

const Transact = (props) => {
  const [segment, setSegment] = useState("Issue");

  function selectedSegment(key) {
    switch (key) {
      case "Reorder":
        return (
          <Reorder
            empid={props.empid}
            username={props.username}
            collapsed={props.collapsed}
            sectionCode={props.sectionCode}
            theme={props.theme}
            emptyImage={props.emptyImage}
          ></Reorder>
        );
      default:
        break;
    }
  }

  return (
    <>
      <div className={props.theme}>
        <Card className="card-main-layout" size="large" hoverable>
          <div className="justified-row">
            <div className="card-custom-size" style={{ marginBottom: "0" }}>
              <Card
                size="large"
                title={
                  <Title>
                    <Segmented
                      className="large-card-title"
                      options={[
                        "Issue",
                        "Return",
                        "Adjust",
                        "Reorder",
                        "Receive",
                      ]}
                      onChange={(e) => setSegment(e)}
                      block
                    />
                  </Title>
                }
                hoverable
              >
                <div style={{ marginTop: "30px" }}>
                  {selectedSegment(segment)}
                </div>
              </Card>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Transact;
