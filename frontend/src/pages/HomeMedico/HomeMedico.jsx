import React, { useState } from 'react';
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



}
from 'mdb-react-ui-kit';
import './HomeMedico.css';

function ModalComponent({ isOpen, toggleModal }) {
  return (
    <MDBModal tabIndex='-1' show={isOpen} getOpenState={(isOpen) => toggleModal(isOpen)}>
      <MDBModalHeader>
        Modal Title
      </MDBModalHeader>
      <MDBModalBody>
        {/* Modal content goes here */}
      </MDBModalBody>
      <MDBModalFooter>
        <MDBBtn color='secondary' onClick={toggleModal}>Close</MDBBtn>
        {/* Additional buttons or actions can be added here */}
      </MDBModalFooter>
    </MDBModal>
  );
}

function HomeMedico() {
  const usuarios = [
    { id: 1, nome: 'João Ferreira de Mendonça', prontuario: 123456 },
    { id: 2, nome: 'Maria Aparecida da Consceição', prontuario: 234567 },
    { id: 3, nome: 'Pedro Alcântara de Limões', prontuario: 345678 },
    { id: 4, nome: 'Ana Maria das Graças', prontuario: 456789 },
    { id: 5, nome: 'Lucas Ferreira', prontuario: 567890 },
    { id: 6, nome: 'Laura Flores do Jardim', prontuario: 678901 },
    { id: 7, nome: 'Mariana Ferreira de Mendonça', prontuario: 789012 },
    { id: 8, nome: 'Rafael Aparecida da Consceição', prontuario: 890123 },
    { id: 9, nome: 'Juliana Maria das Graças', prontuario: 901234 },
    { id: 10, nome: 'Felipe Alcântara de Limões', prontuario: 123987 },
  ];

  const [activeTab, setActiveTab] = useState('pendentes');
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const [basicModal, setBasicModal] = useState(false);
  const toggleOpen = () => setBasicModal(!basicModal);

  return (
    <MDBContainer fluid className='p-4 background-radial-gradient overflow-hidden d-flex justify-content-center'  style={{ minHeight: '100vh' }}>
      <MDBCard className='my-5 bg-glass max-width-card' style={{ width: '100%', maxWidth: '1200px' }}>
      <h2 style={{ marginTop: '10px', marginLeft: '10px', marginBottom: '-8px' }}>Acompanhamento</h2>
      <hr style={{ marginBottom: '10px' }} />
        <MDBCardBody className='p-5'>
          <MDBRow>
            <MDBCol md='4'>
              <MDBCard className='mb-4'>
                <MDBCardBody>
                <div className="text-center mb-4">
                 <MDBBtn color={activeTab === 'pendentes' ? 'primary' : 'light'} rippleColor='dark' onClick={() => setActiveTab('pendentes')}>
                 Pendentes
                 </MDBBtn>
                 <MDBBtn color={activeTab === 'internados' ? 'primary' : 'light'} onClick={() => setActiveTab('internados')}>
                  Internados
                 </MDBBtn>
                 </div>
                 <MDBInput type="text" label="Pesquisar" />
                 <MDBBtn onClick={toggleOpen}>Abrir Modal</MDBBtn>
                  <MDBListGroup light numbered>
                    {usuarios.map((usuario, index) => (
                      <MDBListGroupItem key={index} 
                      className={`list-item d-flex justify-content-between align-items-start ${selectedUser === usuario ? 'clicked' : ''}`}
                      onClick={() => handleUserClick(usuario)}
                      >
                      <div className='ms-2 me-auto'>
                      <div className='fw-bold'>{usuario.nome}</div>Prontuário: {usuario.prontuario}
                      </div>
                      </MDBListGroupItem>
                   ))}
                  </MDBListGroup>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol md='8'>
              <MDBCard>
                <MDBCardBody>
                {selectedUser && (
                    <div>
                      <h3>Detalhes do Usuário</h3>
                      <p><strong>Nome:</strong> {selectedUser.nome}</p>
                      <p><strong>Prontuário:</strong> {selectedUser.prontuario}</p>
                      <h4>Dados da Solicitação</h4>
                      <p><strong>Medicamentos:</strong></p>
                      <MDBTextArea label="Medicamentos" id="textAreaExample" rows="{4}" />
                      <p><strong>Plano terapêutico:</strong></p>
                      <p><strong>Observações:</strong></p>
                      <MDBTextArea label="Observações" id="textAreaExample" rows="{4}" />
                    </div>
                  )}
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBCardBody>
      </MDBCard>

      <MDBModal open={basicModal} onClose={() => setBasicModal(false)} tabIndex='-1'>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Novo Usuário</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
            

            <MDBInput type="text" label="Nome" />
            <MDBInput type="text" label="E-mail" />
            </MDBModalBody>

            <MDBModalFooter>
              <MDBBtn color='secondary' onClick={toggleOpen}>
                Fechar
              </MDBBtn>
              <MDBBtn>CRIAR</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>

    </MDBContainer>
  );
}

export default HomeMedico;