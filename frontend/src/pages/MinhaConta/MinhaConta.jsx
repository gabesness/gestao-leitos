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
import CabecalhoUsuario from '../../components/Ficha/CabecalhoUsuario';


function QuadroFicha({ selectedUser }) {
  return (
  <MDBCard style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px'}}>
    <CabecalhoUsuario selectedUser={selectedUser} />
    <MDBCardBody style={{ padding: '20px' }}>
      <MDBRow>

      {/* histórico */}

      <div className="col-md-6">
      <h4>Perfil</h4>
      <MDBInput label="E-mail" id="SenhaAtual" style={{ marginBottom: '20px' }}/>

      <MDBInput label="Telefone" id="SenhaAtual" style={{ marginBottom: '20px' }}/>
      
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
        <MDBBtn style={{ marginLeft: '10px' }}>ALTERAR</MDBBtn>
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
    <MDBContainer fluid className='p-1 background-radial-gradient overflow-hidden d-flex justify-content-center'  style={{ minHeight: '100vh' }}>
      <MDBCard className='my-5 bg-glass max-width-card' style={{ width: '100%', maxWidth: '1200px' }}>
      <h2 style={{ marginTop: '10px', marginLeft: '10px', marginBottom: '-8px' }}>Minha Conta</h2>
      <hr style={{ marginBottom: '10px' }} />
      <MDBCardBody className='p-5'>

          <QuadroFicha selectedUser={selectedUser} />

        </MDBCardBody>
      </MDBCard>

    </MDBContainer>
  );
}

export default MinhaConta;