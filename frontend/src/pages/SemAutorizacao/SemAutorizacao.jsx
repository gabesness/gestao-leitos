import React, { useState } from 'react';
import axios from 'axios';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBTypography
} from 'mdb-react-ui-kit';
import './SemAutorizacao.css';
import { ToastContainer, toast } from 'react-toastify';
import { AxiosURL } from '../../axios/Config';
import 'react-toastify/dist/ReactToastify.css';
import Logo from '../../assets/Logo_oncoleitos.png';

function SemAutorizacao() {

  return (
    <MDBContainer fluid className='p-4 background-radial-gradient overflow-hidden d-flex align-items-center justify-content-center' style={{ minHeight: '100vh', marginTop: '-20px' }}>
      <MDBCard className='my-5 bg-glass max-width-card'>
        <MDBCardBody className='p-5 text-center'>
        <MDBTypography tag='h2'>
            Sem autorização para acessar essa página.
          </MDBTypography>
        </MDBCardBody>
      </MDBCard>
      <ToastContainer />
    </MDBContainer>
  );
}

export default SemAutorizacao;
