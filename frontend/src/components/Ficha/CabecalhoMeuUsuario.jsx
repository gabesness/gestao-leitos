import React, { useState } from 'react';
import { MDBIcon, MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalTitle, MDBBtn, MDBModalBody, MDBInput, MDBModalFooter } from 'mdb-react-ui-kit';


function ModalEditarNome({ isOpen, onClose }) {
  const handleClose = () => {
    if (isOpen) {
      onClose();
    }
  };

  return (
    <MDBModal show={isOpen} setShow={handleClose} tabIndex='-1'>
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle style={{ fontFamily: 'FiraSans-Medium, sans-serif' }}>
              Editar Nome
            </MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={handleClose}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody style={{ fontFamily: 'FiraSans-Light, sans-serif' }}>
            <MDBInput label="Nome" id="nome" type="text" />
            <MDBInput label="Sobrenome" id="sobrenome" type="text" />
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn>Salvar</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}

function ModalEditarEmail({ isOpen, onClose }) {
  const handleClose = () => {
    if (isOpen) {
      onClose();
    }
  };

  return (
    <MDBModal show={isOpen} setShow={handleClose} tabIndex='-1'>
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle style={{ fontFamily: 'FiraSans-Medium, sans-serif' }}>
              Editar E-mail
            </MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={handleClose}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody style={{ fontFamily: 'FiraSans-Light, sans-serif' }}>
            <MDBInput label="E-mail" id="email" type="email" />
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn>Salvar</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}


const CabecalhoMeuUsuario = () => {
  const nome = localStorage.getItem('nome');
  const sobrenome = localStorage.getItem('sobrenome');
  const username = localStorage.getItem('username');
  const cargo = localStorage.getItem('cargo');

  const [isNomeModalOpen, setNomeModalOpen] = useState(false);
  const [isEmailModalOpen, setEmailModalOpen] = useState(false);

  const toggleNomeModal = () => {
    console.log("botão nome");
    setNomeModalOpen(!isNomeModalOpen);
  };  
  
  const toggleEmailModal = () => {
    console.log("botão e-mail");
    setEmailModalOpen(!isEmailModalOpen);
  };

  return (
    <div style={{ width: '100%', padding: '5px', background: 'linear-gradient(to top, #2c8fe6, #82c2fa)', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
      <div style={{ padding: '10px', color: 'black' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ marginBottom: '0px', fontSize: '1.5em', fontFamily: 'FiraSans-Medium, sans-serif' }}>
              <strong>{nome} {sobrenome}</strong>
              <MDBIcon fas icon="edit" style={{ marginLeft: '10px', cursor: 'pointer' }} onClick={toggleNomeModal} />
            </h3>
            <p style={{ marginBottom: '0px', fontSize: '1.1em', fontFamily: 'FiraSans-Light, sans-serif' }}>
              E-mail:
              <MDBIcon fas icon="edit" style={{ marginLeft: '10px', cursor: 'pointer' }} onClick={toggleEmailModal} />
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

      <ModalEditarNome isOpen={isNomeModalOpen} onClose={toggleNomeModal} />
      <ModalEditarEmail isOpen={isEmailModalOpen} onClose={toggleEmailModal} />
    </div>
  );
};

export default CabecalhoMeuUsuario;
