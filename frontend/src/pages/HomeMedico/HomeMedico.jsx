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
  MDBCardTitle,
  MDBCardText,
}
from 'mdb-react-ui-kit';
import './HomeMedico.css';
import Pagination from '../../components/Pagination/Pagination';

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

function Histórico() {

}

function DadosFicha() {

}

function QuadroLista() {

}

function QuadroFicha() {

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

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5); // Quantidade de usuários por página

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentUsers = usuarios.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);


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
              <MDBCard className='mb-4' style={{ borderTopLeftRadius: '30px', borderTopRightRadius: '30px', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px'}}>
              <div className="text-center mb-4">
                 <MDBBtn   className="w-50" style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '0px', borderBottomRightRadius: '0px', borderBottomLeftRadius: '0px' }} color={activeTab === 'pendentes' ? 'light' : 'dark'} rippleColor='dark' onClick={() => setActiveTab('pendentes')}>
                 Pendentes
                 </MDBBtn>
                 <MDBBtn  className="w-50" style={{ borderTopLeftRadius: '0px', borderTopRightRadius: '20px', borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px' }} color={activeTab === 'internados' ? 'light' : 'dark'} onClick={() => setActiveTab('internados')}>
                  Internados
                 </MDBBtn>
                 </div>
              <MDBCardBody>
                 <MDBInput type="text" label="Pesquisar" />
                 <MDBBtn onClick={toggleOpen}>Abrir Modal</MDBBtn>
                 
                 <>
      <MDBListGroup light numbered>
        {currentUsers.map((usuario, index) => (
          <MDBListGroupItem
            key={index}
            className={`list-item d-flex justify-content-between align-items-start ${
              selectedUser === usuario ? 'clicked' : ''
            }`}
            onClick={() => handleUserClick(usuario)}
          >
            <div className='ms-2 me-auto'>
              <div className='fw-bold'>{usuario.nome}</div>Prontuário: {usuario.prontuario}
            </div>
          </MDBListGroupItem>
        ))}
      </MDBListGroup>
      {usuarios.length > postsPerPage && (
        <div className="pag">
          <Pagination
            postsPerPage={postsPerPage}
            totalPosts={usuarios.length}
            paginate={paginate}
          />
        </div>
      )}
    </>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>


            <MDBCol md='8'>
            {selectedUser && (
              <MDBCard style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px'}}>
    {/* Cabeçalho */}
    <div style={{ padding: '5px' }}>
    {selectedUser && (
  <div style={{ padding: '10px' }}>
    <h3 style={{ marginBottom: '0px' }}>Detalhes do Usuário</h3>
    <p style={{ marginBottom: '0px' }}><strong>Nome:</strong> {selectedUser.nome}</p>
    <p style={{ marginBottom: '0px' }}><strong>Prontuário:</strong> {selectedUser.prontuario}</p>
    {/* Conteúdo do cabeçalho (se necessário) */}
  </div>
)}
    </div>
    {/* Conteúdo principal */}
    <MDBCardBody style={{ padding: '20px' }}>
      <MDBRow>
      <div className="col-md-6">
      <h4>Histórico</h4>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>

        <MDBCard style={{ marginBottom: '10px' }}>
        <MDBCardBody style={{ padding: '10px' }}>
        <MDBCardTitle style={{ fontSize: '1rem' }}>
        Paciente Internado
        <span style={{ float: 'right', fontSize: '0.7rem' }}>Ontem</span>
        <br />
        <span style={{ float: 'right', fontSize: '0.7rem' }}>10:00</span>
        </MDBCardTitle>
        <MDBCardText style={{ fontSize: '0.8rem' }}>
        Aguardando registro de alta pelo médico, Escrevendo texto longo.
        </MDBCardText>
        </MDBCardBody>
        </MDBCard>

        <MDBCard style={{ marginBottom: '10px' }}>
        <MDBCardBody style={{ padding: '10px' }}>
        <MDBCardTitle style={{ fontSize: '1rem' }}>
        Paciente Internado
        <span style={{ float: 'right', fontSize: '0.7rem' }}>Ontem</span>
        <br />
        <span style={{ float: 'right', fontSize: '0.7rem' }}>10:00</span>
        </MDBCardTitle>
        <MDBCardText style={{ fontSize: '0.8rem' }}>
        Aguardando registro de alta pelo médico, Escrevendo texto longo.
        </MDBCardText>
        </MDBCardBody>
        </MDBCard>

        <MDBCard style={{ marginBottom: '10px' }}>
        <MDBCardBody style={{ padding: '10px' }}>
        <MDBCardTitle style={{ fontSize: '1rem' }}>
        Paciente Internado
        <span style={{ float: 'right', fontSize: '0.7rem' }}>Ontem</span>
        <br />
        <span style={{ float: 'right', fontSize: '0.7rem' }}>10:00</span>
        </MDBCardTitle>
        <MDBCardText style={{ fontSize: '0.8rem' }}>
        Aguardando registro de alta pelo médico, Escrevendo texto longo.
        </MDBCardText>
        </MDBCardBody>
        </MDBCard>

        <MDBCard style={{ marginBottom: '10px' }}>
        <MDBCardBody style={{ padding: '10px' }}>
        <MDBCardTitle style={{ fontSize: '1rem' }}>
        Paciente Internado
        <span style={{ float: 'right', fontSize: '0.7rem' }}>Ontem</span>
        <br />
        <span style={{ float: 'right', fontSize: '0.7rem' }}>10:00</span>
        </MDBCardTitle>
        <MDBCardText style={{ fontSize: '0.8rem' }}>
        Aguardando registro de alta pelo médico, Escrevendo texto longo.
        </MDBCardText>
        </MDBCardBody>
        </MDBCard>

        <MDBCard style={{ marginBottom: '10px' }}>
        <MDBCardBody style={{ padding: '10px' }}>
        <MDBCardTitle style={{ fontSize: '1rem' }}>
        Paciente Internado
        <span style={{ float: 'right', fontSize: '0.7rem' }}>Ontem</span>
        <br />
        <span style={{ float: 'right', fontSize: '0.7rem' }}>10:00</span>
        </MDBCardTitle>
        <MDBCardText style={{ fontSize: '0.8rem' }}>
        Aguardando registro de alta pelo médico, Escrevendo texto longo.
        </MDBCardText>
        </MDBCardBody>
        </MDBCard>


 

        </div>
        </div>
        <div className="col-md-6">
          {selectedUser && (
            <div>
              <h4>Dados da Solicitação</h4>
              <p><strong>Medicamentos:</strong></p>
              <MDBTextArea label="Medicamentos" id="textAreaExample" rows={4} />
              <p><strong>Plano terapêutico:</strong></p>
              <p><strong>Observações:</strong></p>
              <MDBTextArea label="Observações" id="textAreaExample" rows={4} />
            </div>
          )}
        </div>
      </MDBRow>
    </MDBCardBody>
    {/* Botões */}
    <div style={{ padding: '20px', marginTop: '10px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,.125)' }}>
            <div>
              <MDBBtn color='danger' >DELETAR</MDBBtn>
              <MDBBtn color='success' style={{ marginLeft: '10px' }}>SALVAR RASCUNHO</MDBBtn>
            </div>
            <div>
              <MDBBtn>REGULAÇÃO</MDBBtn>
              <MDBBtn style={{ marginLeft: '10px' }}>ENVIAR</MDBBtn>
            </div>
    </div>
              </MDBCard>
 )}
 {!selectedUser && (
   <div className="text-center">
     <p style={{ fontSize: '1.5rem' }}> Selecione um Usuário</p>
   </div>
 )}

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