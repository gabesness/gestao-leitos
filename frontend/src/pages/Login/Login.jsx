import React, { useState } from 'react';
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

  const [formValue, setFormValue] = useState({
    username: '',
    password: '',
  });

  const onChange = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  async function Logar(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append('username', formValue.username);
    formData.append('password', formValue.password);
    
    try {
      const response = await axios.post('http://localhost:8000/login/', formData);
      if (response.status === 200) {
        // Aqui você pode lidar com a resposta, se necessário
      }
    } catch (error) {
      console.error('Erro ao logar:', error);
    }
  }

  return (
    <MDBContainer fluid className='p-4 background-radial-gradient overflow-hidden d-flex align-items-center justify-content-center'  style={{ minHeight: '100vh', marginTop: '-100px' }}>
      <MDBCard className='my-5 bg-glass max-width-card'>
        <MDBCardBody className='p-5 text-center'>
          <form onSubmit={Logar}>
            <MDBInput 
              className="mb-4" 
              name="username" 
              id="username" 
              label="Usuário" 
              value={formValue.username} 
              onChange={onChange} 
            />

            <MDBInput 
              className="mb-4" 
              type="password" 
              name="password" 
              id="password" 
              label="password" 
              value={formValue.password} 
              onChange={onChange} 
            />  

            <MDBBtn
              className='mx-2'
              type="button"
              color='tertiary'
              rippleColor='light'
            >
              Entrar como convidado
            </MDBBtn>
            <MDBBtn
              className='w-100 mb-4'
              size='md'
              type="submit"
            >
              ENVIAR
            </MDBBtn>
          </form>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}

export default Login;
