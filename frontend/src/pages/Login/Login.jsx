import React, { useState } from 'react';
import axios from 'axios';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon,
  MDBRow,
  MDBCol
} from 'mdb-react-ui-kit';
import './Login.css';
import { ToastContainer, toast } from 'react-toastify';
import { AxiosURL } from '../../axios/Config';
import 'react-toastify/dist/ReactToastify.css';
import Logo from '../../assets/Logo_oncoleitos.png';

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
      const response = await axios.post(`${AxiosURL}/usuarios/login/`, formData);
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

      toast.success('Login realizado com sucesso!');

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
      toast.error(error.response.data.Erro);
      console.error('Erro ao logar:', error);
    }
  }

  const handleConvidadoLogin = () => {
    localStorage.setItem('cargo', 'Convidado');
    window.location.href = '/pacientes';
  };


  const handleEsqueceuSenha = () => {
    window.location.href = '/esqueceusenha';
  };

  return (
    <MDBContainer fluid className='p-4 background-radial-gradient overflow-hidden d-flex align-items-center justify-content-center' style={{ minHeight: '100vh', marginTop: '-20px' }}>
      <MDBCard className='my-5 bg-glass max-width-card'>
        <MDBCardBody className='p-5 text-center'>
        <img src={Logo} alt="Logo" className='mb-4' style={{ width: '300px' }} />
        
          <form onSubmit={Logar}>
            <MDBRow className='mb-4 align-items-center'>
              <MDBCol size="auto" className='pe-0'>
                <MDBIcon fas icon="user" />
              </MDBCol>
              <MDBCol className='ps-2'>
                <MDBInput
                  name="username"
                  id="username"
                  label="Usuário"
                  value={formValue.username}
                  onChange={onChange}
                  maxLength="256"
                />
              </MDBCol>
            </MDBRow>

            <MDBRow className='mb-0 align-items-center'>
              <MDBCol size="auto" className='pe-0'>
                <MDBIcon fas icon="key" />
              </MDBCol>
              <MDBCol className='ps-2'>
                <MDBInput
                  type="password"
                  name="password"
                  id="password"
                  label="Senha"
                  value={formValue.password}
                  onChange={onChange}
                  maxLength="256"
                />
              </MDBCol>
            </MDBRow>

            <MDBBtn
              className='mb-4 mx-2'
              type="button"
              color='tertiary'
              rippleColor='light'
              onClick={handleEsqueceuSenha}
              style={{ textTransform: 'none' }}
            >
              <MDBIcon far icon="question-circle" className='me-2' />
              Esqueci minha senha
            </MDBBtn>

            <MDBBtn
              className='w-100 mb-0'
              size='md'
              type="submit"
              style={{
                borderRadius: '8px',
                padding: '10px 20px',
              }}
            >
            <MDBIcon fas icon="sign-in-alt" className="me-2" />
              ENTRAR
            </MDBBtn>

            <MDBBtn
              className='mx-2'
              type="button"
              color='tertiary'
              rippleColor='light'
              onClick={handleConvidadoLogin}
              style={{ textTransform: 'none' }}
            >
              Entrar como convidado
            </MDBBtn>
          </form>
        </MDBCardBody>
      </MDBCard>
      <ToastContainer />
    </MDBContainer>
  );
}

export default Login;
