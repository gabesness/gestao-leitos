import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
}
from 'mdb-react-ui-kit';
import './EsqueceuSenha.css';
import { AxiosURL } from '../../axios/Config';
import { ToastContainer, toast } from 'react-toastify';


function EsqueceuSenha() {
  const [email, setEmail] = useState('');

  const enviarEmail = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${AxiosURL}/usuarios/email_redefinir_senha/`, {
        email: email,
      });

      if (response.status === 200) {
        toast.success('E-mail foi enviado');
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
    <MDBContainer fluid className='p-4 background-radial-gradient overflow-hidden d-flex align-items-center justify-content-center'  style={{ minHeight: '100vh', marginTop: '-100px' }}>

          <MDBCard className='my-5 bg-glass max-width-card'>
          <MDBCardBody className="p-4 text-center">
          <h2 style={{ marginBottom: '10px', fontFamily: 'FiraSans-SemiBold, sans-serif' }}>
          Esqueceu a senha
        </h2>
            <p style={{ marginBottom: "10px", fontSize: "0.9rem", color: "#6c757d" }}>
                Informe o e-mail cadastrado no sistema, será enviado um link para que se possa alterar a senha.
              </p>
            <MDBInput
                  label="E-mail"
                  id="email"
                  className="mb-3"
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength="256"
                />

              <MDBBtn onClick={enviarEmail} className='w-100 mb-4' size='md'>ENVIAR</MDBBtn>

            </MDBCardBody>
          </MDBCard>
          <ToastContainer />
    </MDBContainer>
  );
}

export default EsqueceuSenha;