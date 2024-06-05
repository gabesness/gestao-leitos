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
import './Pacientes.css';
import Pagination from '../../components/Pagination/Pagination';
import PacienteCard from '../../components/Cards/PacienteCard';
import HistoricoCard from '../../components/Cards/HistoricoCard';
import CabecalhoHistorico from '../../components/Ficha/CabecalhoHistorico';

function ModalNovaPrescricao({ isOpen, onClose }) {
  const handleClose = () => {
    if (isOpen) {
      onClose();
    }
  };

  return (
    <MDBModal open={isOpen} onClose={handleClose} tabIndex='-1' appendToBody>
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>Nova Prescrição</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={handleClose}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>

          <MDBInput label="Prontuário do Paciente" id="prontuario" type="text"/>

          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn>Criar</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}

function ModalConfirmarAlta({ isOpen, onClose }) {
  const handleClose = () => {
    if (isOpen) {
      onClose();
    }
  };

  return (
    <MDBModal open={isOpen} onClose={handleClose} tabIndex='-1' appendToBody>
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>Confirmação de Alta</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={handleClose}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>

          Confirme que o paciente está recebendo alta

          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color='danger'>Cancelar</MDBBtn>
            <MDBBtn>Confirmar Alta</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}

function ModalConfirmarFacelimento({ isOpen, onClose }) {
  const handleClose = () => {
    if (isOpen) {
      onClose();
    }
  };

  return (
    <MDBModal open={isOpen} onClose={handleClose} tabIndex='-1' appendToBody>
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>Confirmação de Falecimento</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={handleClose}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>

          Confirme que o paciente faleceu

          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color='danger'>Cancelar</MDBBtn>
            <MDBBtn>Confirmar Alta</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}

function ModalEnviarFarmacia({ isOpen, onClose }) {
  const handleClose = () => {
    if (isOpen) {
      onClose();
    }
  };

  return (
    <MDBModal open={isOpen} onClose={handleClose} tabIndex='-1' appendToBody>
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>Confirmação envio para farmácia</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={handleClose}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>

          A prescrição será encaminhada para a farmácia

          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color='danger'>Cancelar</MDBBtn>
            <MDBBtn>Encaminhar</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}

function ModalConfirmarTransferencia({ isOpen, onClose }) {
  const handleClose = () => {
    if (isOpen) {
      onClose();
    }
  };

  return (
    <MDBModal open={isOpen} onClose={handleClose} tabIndex='-1' appendToBody>
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>Confirmação de Transferência</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={handleClose}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>

          Autorização para a regulação confirmar transferência

          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color='danger'>Cancelar</MDBBtn>
            <MDBBtn>Autorizar transferência</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}


function QuadroLista({ usuarios, activeTab, selectedUser, handleUserClick, setActiveTab }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5); // Quantidade de usuários por página

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentUsers = usuarios.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  // Modal
  const [basicModal, setBasicModal] = useState(false);

  const toggleOpen = () => setBasicModal(!basicModal);

  return (
    <MDBCol md='4'>
      <MDBCard className='mb-4' style={{ borderTopLeftRadius: '30px', borderTopRightRadius: '30px', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px'}}>
         {/* Botões das Abas */}
        <div className="text-center mb-4">
          <MDBBtn className="w-50" style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '0px', borderBottomRightRadius: '0px', borderBottomLeftRadius: '0px' }} color={activeTab === 'pendentes' ? 'light' : 'dark'} rippleColor='dark' onClick={() => setActiveTab('pendentes')}>
            Pendentes
          </MDBBtn>
          <MDBBtn className="w-50" style={{ borderTopLeftRadius: '0px', borderTopRightRadius: '20px', borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px' }} color={activeTab === 'internados' ? 'light' : 'dark'} onClick={() => setActiveTab('internados')}>
            Internados
          </MDBBtn>
        </div>

        {/* Conteúdo */}
        <MDBCardBody>
          {/* Cabeçalho */}

          <div className="d-flex align-items-center mb-3">
            <MDBInput type="text" label="Pesquisar" className="flex-grow-1" style={{ height: '40px' }} />
            <MDBBtn onClick={toggleOpen} className="ms-2 d-flex justify-content-center align-items-center" style={{ borderRadius: '50%', width: '40px', height: '40px', padding: '0', margin: '0' }} color="dark">
              <MDBIcon fas icon="plus" />
            </MDBBtn>
          </div>
          
          <MDBListGroup light numbered>

          {/* Listagem */}

          {currentUsers.map((usuario, index) => (
              <PacienteCard key={index} user={usuario} selectedUser={selectedUser} handleUserClick={handleUserClick} />
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
        </MDBCardBody>
      </MDBCard>
      <ModalConfirmarAlta isOpen={basicModal} onClose={toggleOpen} />
    </MDBCol>
  );
}

function QuadroFicha({ selectedUser }) {
  return (
    <MDBCol md='8'>
      {selectedUser && (
        <MDBCard style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px' }}>
  
          {/* Cabeçalho */}
          <CabecalhoHistorico selectedUser={selectedUser} />
  
          {/* Conteúdo */}
          <MDBCardBody style={{ padding: '10px' }}>
          <MDBRow style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <MDBBtn className='mx-2' color='tertiary' rippleColor='light'>
                <MDBIcon fas icon="file-download" className='me-2' />
                Sessão Atual
              </MDBBtn>
              <MDBBtn className='mx-2' color='tertiary' rippleColor='light'>
                <MDBIcon fas icon="file-download" className='me-2' />
                Todas as Sessões
              </MDBBtn>
              <MDBDropdown style={{ marginLeft: 'auto' }}>
                <MDBDropdownToggle tag='a' className='btn btn-primary'>
                  Sessões
                </MDBDropdownToggle>
                <MDBDropdownMenu>
                  <MDBDropdownItem link>1</MDBDropdownItem>
                  <MDBDropdownItem link>2</MDBDropdownItem>
                  <MDBDropdownItem link>3</MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            </div>
          </MDBRow>
  
            {/* Histórico */}
            <h4 style={{ textAlign: 'center' }}>Histórico</h4>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <HistoricoCard
                title="Paciente Internado"
                date="Ontem"
                time="10:00"
                text="Aguardando registro de alta pelo médico. Escrevendo texto longo."
              />
            </div>
          </MDBCardBody>
  
        </MDBCard>
      )}
      {!selectedUser && (
        <div className="text-center">
          <p style={{ fontSize: '1.5rem' }}>Selecione um Usuário</p>
        </div>
      )}
    </MDBCol>
  )
  
}

function Pacientes() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get('http://localhost:8000/lista_pacientes/');
        setUsuarios(response.data);
      } catch (error) {
        console.error("Erro ao buscar os usuários:", error);
      }
    };
    fetchUsuarios();
  }, []);

  
  const [activeTab, setActiveTab] = useState('pendentes');
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  return (
    <MDBContainer fluid className='p-1 background-radial-gradient overflow-hidden d-flex justify-content-center'  style={{ minHeight: '100vh' }}>
      <MDBCard className='my-5 bg-glass max-width-card' style={{ width: '100%', maxWidth: '1200px' }}>
      <h2 style={{ marginTop: '10px', marginLeft: '10px', marginBottom: '-8px' }}>Pacientes</h2>
      <hr style={{ marginBottom: '10px' }} />
      <MDBCardBody className='p-5'>
          <MDBRow>
          <QuadroLista
              usuarios={usuarios}
              activeTab={activeTab}
              selectedUser={selectedUser}
              handleUserClick={handleUserClick}
              setActiveTab={setActiveTab}
            />

          <QuadroFicha 
          selectedUser={selectedUser} 
          />

          </MDBRow>
        </MDBCardBody>
      </MDBCard>

    </MDBContainer>
  );
}

export default Pacientes;