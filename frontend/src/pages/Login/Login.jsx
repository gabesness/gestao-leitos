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
      const response = await axios.post('http://localhost:8000/usuarios/login/', formData);
      if (response.status === 200) {
      localStorage.setItem('idUser', response.data.id);
      localStorage.setItem('nome', response.data.nome);
      localStorage.setItem('sobrenome', response.data.sobrenome);
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('cargo', response.data.groups[0]);
      
      console.log(localStorage.getItem('idUser'));
      console.log(localStorage.getItem('nome'));
      console.log(localStorage.getItem('sobrenome'));
      console.log(localStorage.getItem('username'));
      console.log(localStorage.getItem('cargo'));

      if (response.data.groups[0] === "Administrador") {
        window.location.href = '/homeadm';
      }
      if (response.data.groups[0] === "Médico") {
        window.location.href = '/homemedico';
      }
      if (response.data.groups[0] === "Farmácia") {
        window.location.href = '/homefarmacia';
      }
      if (response.data.groups[0] === "Regulação") {
        window.location.href = '/homeregulacao';
      }
      if (response.data.groups[0] === "Recepção") {
        window.location.href = '/pacientes';
      }

      }
    } catch (error) {
      console.error('Erro ao logar:', error);
    }
  }

  const handleConvidadoLogin = () => {
    localStorage.setItem('cargo', 'Convidado');
    window.location.href = '/pacientes';
  };

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
              onClick={handleConvidadoLogin}
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
