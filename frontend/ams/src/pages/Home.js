import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LoginOutlined } from '@ant-design/icons';
import MainPage from '../components/Main';
import ResultPage from '../components/Result';
import NavigationMenu from '../components/Navigation';

const HomePage = () => {

  const [username, setUsername] = useState("");
  const [empid, setEmpID] = useState(0);
  const [showunauthorized, setShowunauthorized] = useState(true);
  
  useEffect(() => {(
    async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/user', {
          headers: {'Content-Type' : 'application/json'},
          withCredentials: true,
        });
        const content = await response.data;
        setShowunauthorized(false);
        setUsername(content.username);
        setEmpID(content.empID);
      } catch (err) {
        console.log(err.response.data[0]);
        setShowunauthorized(true);
      }
    }
  )();});

  return (
    <>
      {
        showunauthorized ?
        <>
          <NavigationMenu />
          <ResultPage style={{display: "none"}} icon="" status="403" title="Unauthorized User" subTitle="Sorry, you are not authorized to access this page. Please login." btnIcon={<LoginOutlined />} href="/login" />
        </>:<><MainPage username={username} empid={empid} /></>
      }
    </>
  );

};

export default HomePage;