import React from 'react';
import { Button, Result } from 'antd';

const ResultPage = (props) => {

  return (
    <>
      <div style={{marginTop: 40}}>
        <Result icon={props.icon} status={props.status} title={props.title} subTitle={props.subTitle}
          extra={[
            <Button size="large" type="primary" icon={props.btnIcon} href={props.href}>
              Log In
            </Button>
          ]}
        />
      </div>
    </>
  );

};

export default ResultPage;