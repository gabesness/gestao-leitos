import React from 'react';
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
import './AlterarSenha.css';

function EsqueceuSenha() {
  return (
    <MDBContainer fluid className='p-4 background-radial-gradient overflow-hidden d-flex align-items-center justify-content-center'  style={{ minHeight: '100vh', marginTop: '-100px' }}>

          <MDBCard className='my-5 bg-glass max-width-card'>
            <MDBCardBody className='p-5'>

              <MDBInput className='mb-4' label='Senha' id='form4' type='password'/>
              <MDBInput className='mb-4' label='Confirmar Senha' id='form4' type='password'/>

              <MDBBtn className='w-100 mb-4' size='md'>ENVIAR</MDBBtn>

            </MDBCardBody>
          </MDBCard>

    </MDBContainer>
  );
}

export default EsqueceuSenha;