import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput
} from 'mdb-react-ui-kit';
import './RecuperarSenha.css';
import { AxiosURL } from '../../axios/Config';
import { ToastContainer, toast } from 'react-toastify';

function RecuperarSenha() {
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const [token, setToken] = useState('');
  const [uid, setUid] = useState('');

  useEffect(() => {
    // Extrai token e uid da URL
    const urlParts = window.location.pathname.split('/');
    const tokenFromUrl = urlParts[urlParts.length - 2];
    const uidFromUrl = urlParts[urlParts.length - 1];
    
    setToken(tokenFromUrl);
    setUid(uidFromUrl);

    // Console log para verificar token e uid
    console.log("Token:", tokenFromUrl);
    console.log("UID:", uidFromUrl);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== password2) {
      toast.error('As senhas não coincidem');
      return;
    }

    try {
      const response = await axios.patch(`${AxiosURL}/usuarios/redefinir_senha/`, {
        token,
        uid,
        password,
        password2
      });

      if (response.status === 200) {
        toast.success('Senha alterada com sucesso');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.erro || 'Erro desconhecido');
    }
  };

  return (
    <MDBContainer
    fluid
    className="p-4 background-radial-gradient overflow-hidden d-flex align-items-center justify-content-center"
    style={{ minHeight: '100vh', marginTop: '-100px' }}
  >
    <MDBCard className="my-5 bg-glass max-width-card">
      <MDBCardBody className="p-4 text-center">
        <h2 style={{ marginBottom: '10px', fontFamily: 'FiraSans-SemiBold, sans-serif' }}>
          Redefinir senha
        </h2>
          <form onSubmit={handleSubmit}>
            <MDBInput
              label="Digite a nova senha"
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-3"
              maxLength="256"
            />
            <MDBInput
              label="Confirme a senha"
              type='password'
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              className="mb-3"
              maxLength="256"
            />
            <MDBBtn type='submit' className='w-100 mb-4' size='md'>ALTERAR</MDBBtn>
          </form>
        </MDBCardBody>
      </MDBCard>
      <ToastContainer />
    </MDBContainer>
  );
}

export default RecuperarSenha;
