import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCheckbox,
  MDBIcon
}
from 'mdb-react-ui-kit';
import './RecuperarSenha.css';
import { AxiosURL } from '../../axios/Config';


function RecuperarSenha() {
  const [email, setEmail] = useState('');

  const enviarEmail = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${AxiosURL}/usuarios/email_redefinir_senha/`, {
        email: email,
      });

      if (response.status === 200) {
        //toast.success(response.data.message);
        // setTimeout(() => {
        //   window.location.reload();
        // }, 2000);
      }
    } catch (error) {
      console.error(error);
      //toast.error(error.response?.data?.erro || 'Erro desconhecido');
    }
  };

  return (
    <MDBContainer fluid className='p-4 background-radial-gradient overflow-hidden d-flex align-items-center justify-content-center'  style={{ minHeight: '100vh', marginTop: '-100px' }}>

          <MDBCard className='my-5 bg-glass max-width-card'>
            <MDBCardBody className='p-5'>

            <MDBInput
                  label="Digite a nova senha"
                  type='password'
                  id="NovaSenha"
                  className="mb-3"
                  maxLength="256"
                />

            <MDBInput
                  label="Confirme a senha"
                  type='password'
                  id="NovaSenha2"
                  className="mb-3"
                  maxLength="256"
                />

              <MDBBtn onClick={enviarEmail} className='w-100 mb-4' size='md'>ALTERAR</MDBBtn>

            </MDBCardBody>
          </MDBCard>

    </MDBContainer>
  );
}

export default RecuperarSenha;