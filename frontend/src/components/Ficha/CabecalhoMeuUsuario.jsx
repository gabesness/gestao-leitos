import React, { useState } from 'react';
import { MDBIcon, MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalTitle, MDBBtn, MDBModalBody, MDBInput, MDBModalFooter } from 'mdb-react-ui-kit';


const CabecalhoMeuUsuario = () => {
  const nome = localStorage.getItem('nome');
  const sobrenome = localStorage.getItem('sobrenome');
  const username = localStorage.getItem('username');
  const cargo = localStorage.getItem('cargo');

  return (
    <div style={{ width: '100%', padding: '5px', background: 'linear-gradient(to top, #2c8fe6, #82c2fa)', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
      <div style={{ padding: '10px', color: 'black' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ marginBottom: '0px', fontSize: '1.5em', fontFamily: 'FiraSans-Medium, sans-serif' }}>
              <strong>{nome} {sobrenome}</strong>
            </h3>
            <p style={{ marginBottom: '0px', fontSize: '1.1em', fontFamily: 'FiraSans-Light, sans-serif' }}>
              E-mail:
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ marginBottom: '0px', fontSize: '1.1em', fontFamily: 'FiraSans-Light, sans-serif' }}>
              Tipo de conta: {cargo}
            </p>
            <p style={{ marginBottom: '0px', fontSize: '1.1em', fontFamily: 'FiraSans-Light, sans-serif' }}>
              Usuário: {username}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CabecalhoMeuUsuario;
