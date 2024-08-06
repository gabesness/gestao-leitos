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
  MDBIcon,
  MDBBadge, 
  MDBListGroup, 
  MDBListGroupItem,
  MDBRipple,
  MDBTextArea,
  MDBModal,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter,
  MDBModalDialog,
  MDBModalContent,
  MDBModalTitle,
  MDBDropdown,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBDropdownToggle,
  MDBCardTitle,
  MDBCardText,
  UserListItem,
}
from 'mdb-react-ui-kit';
import './MinhaConta.css';
import Pagination from '../../components/Pagination/Pagination';
import PacienteCard from '../../components/Cards/PacienteCard';
import HistoricoCard from '../../components/Cards/HistoricoCard';
import CabecalhoMeuUsuario from '../../components/Ficha/CabecalhoMeuUsuario';


function QuadroFicha() {
  return (
  <MDBCard style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px', width: '100%', maxWidth: '800px'}}>
    <CabecalhoMeuUsuario />
    <MDBCardBody style={{ padding: '20px' }}>
      <MDBRow>

      {/* histórico */}

      <div className="col-md-6">
      <h4>Perfil</h4>
      <MDBInput label="E-mail" id="SenhaAtual" style={{ marginBottom: '20px' }}/>
      
      </div>

        {/* Dados da Solicitação */}

        <div className="col-md-6">
          <div>
            <h4>Alterar a Senha</h4>
                <MDBInput label="Senha Atual" id="SenhaAtual" style={{ marginBottom: '20px' }}/>

                <MDBInput label="Nova Senha" id="SenhaAtual" style={{ marginBottom: '20px' }}/>

                <MDBInput label="Confirmar Nova Senha" id="SenhaAtual" style={{ marginBottom: '20px' }}/>

          </div>
        </div>
      </MDBRow>

      <div style={{ padding: '20px', marginTop: '10px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,.125)' }}>
      <div>
        <MDBBtn style={{ marginLeft: '10px' }} disabled>ALTERAR</MDBBtn>
      </div>
    </div>

    </MDBCardBody>
    

  </MDBCard>

  )
}

function MinhaConta() {  
  const nome = localStorage.getItem('nome');
  const sobrenome = localStorage.getItem('sobrenome');
  const cargo = localStorage.getItem('cargo');

  const selectedUser = {
    Nome: nome,
    Sobrenome: sobrenome,
    Cargo: cargo,
  };


  return (
    <MDBContainer fluid className='p-1 background-radial-gradient overflow-hidden d-flex justify-content-center' style={{ minHeight: '88vh' }}>
      <MDBCard className='my-5 bg-glass max-width-card' style={{ width: '100%', maxWidth: '1200px', borderRadius: '38px' }}>
      <h2 style={{ marginTop: '15px', marginLeft: '50px', marginBottom: '-22px' }}>Minha Conta</h2>
        <MDBCardBody className='p-5'>
          <div className="d-flex justify-content-center">
            <QuadroFicha selectedUser={selectedUser} />
          </div>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}

export default MinhaConta;