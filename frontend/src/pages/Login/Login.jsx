import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput
} from 'mdb-react-ui-kit';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [buttonClicked, setButtonClicked] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/accounts/login/', {
        username: email,
        password: password
      });
      console.log(response.data); // Faça algo com os dados recebidos do backend
      window.location.href = '/homemedico';
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  useEffect(() => {
    if (buttonClicked) {
      handleLogin();
    }
  }, [buttonClicked]);

  const handleButtonClick = () => {
    setButtonClicked(true);
  };

  return (
    <MDBContainer fluid className='p-4 background-radial-gradient overflow-hidden d-flex align-items-center justify-content-center'  style={{ minHeight: '100vh', marginTop: '-100px' }}>
      <MDBCard className='my-5 bg-glass max-width-card'>
        <MDBCardBody className='p-5 text-center'>
          <MDBInput
            className="mb-4"
            label="Email"
            id="form3"
            type="email"
            value={email}
            onChange={handleEmailChange}
          />
          <MDBInput
            className="mb-4"
            label="Password"
            id="form4"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
          <MDBBtn
            className='mx-2'
            color='tertiary'
            rippleColor='light'
          >
            Entrar como convidado
          </MDBBtn>
          <MDBBtn
            className='w-100 mb-4'
            size='md'
            onClick={handleButtonClick}
          >
            ENVIAR
          </MDBBtn>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}

export default Login;
