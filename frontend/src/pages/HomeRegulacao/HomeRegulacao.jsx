import React, { useState } from 'react';
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
import './HomeRegulacao.css';
import Pagination from '../../components/Pagination/Pagination';
import PacienteRegulacaoCard from '../../components/Cards/PacienteRegulacaoCard';
import HistoricoCard from '../../components/Cards/HistoricoCard';
import CabecalhoPaciente from '../../components/Ficha/CabecalhoPaciente';

function ModalDevolverMedico({ isOpen, onClose }) {
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
            <MDBModalTitle>Devolução ao médico</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={handleClose}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>

          A prescrição será devolvida ao médico por falta de vagas, para que possar ser autorizado 
          o encaminhamento para outro hospital.

          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color='danger'>Cancelar</MDBBtn>
            <MDBBtn>Devolver</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}

function ModalConfirmarAgendamento({ isOpen, onClose }) {
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
            <MDBModalTitle>Confirmar agendamento</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={handleClose}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>

          O paciente será agendado ao leito.

          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color='danger'>Cancelar</MDBBtn>
            <MDBBtn>Agendar</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}

function ModalConfirmarInternacao({ isOpen, onClose }) {
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
            <MDBModalTitle>Confirmar internação</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={handleClose}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>

          Confirmar que o paciente foi internado.

          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color='danger'>Cancelar</MDBBtn>
            <MDBBtn>Agendar</MDBBtn>
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
            <MDBModalTitle>Confirmar transferências</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={handleClose}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>

          Confirmar que o paciente foi transferido.

          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color='danger'>Cancelar</MDBBtn>
            <MDBBtn>Agendar</MDBBtn>
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

function ModalCriarPaciente({ isOpen, onClose }) {
  const handleClose = () => {
    if (isOpen) {
      onClose();
    }
  };

  const [formValue, setFormValue] = useState({
    nome: '',
    prontuario: '',
  });

  const onChange = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  async function CriarPaciente(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append('nome', formValue.nome);
    formData.append('prontuario', formValue.prontuario);
    
    try {
      const response = await axios.post('http://localhost:8000/criar_paciente/', formData);
      if (response.status === 200) {
        // Aqui você pode lidar com a resposta, se necessário
      }
    } catch (error) {
      console.error('Erro ao criar paciente:', error);
    }
  }


  return (
    <MDBModal open={isOpen} onClose={handleClose} tabIndex='-1' appendToBody>
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>Adicionar Paciente Novo</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={handleClose}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>
          <form onSubmit={CriarPaciente}>
            <MDBInput 
              className="mb-4" 
              name="nome" 
              id="nome" 
              label="Nome" 
              type="text"
              value={formValue.nome} 
              onChange={onChange} 
            />

            <MDBInput 
              className="mb-4" 
              name="prontuario" 
              id="prontuario" 
              label="prontuario" 
              type="text"
              value={formValue.prontuario} 
              onChange={onChange} 
            />  

            <MDBBtn
              className='w-100 mb-4'
              size='md'
              type="submit"
            >
              Salvar
            </MDBBtn>
          </form>

          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color='danger'>Cancelar</MDBBtn>
            <MDBBtn>Criar</MDBBtn>
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

          <MDBInput type="text" label="Pesquisar" />
          <MDBBtn onClick={toggleOpen} className="ms-2 d-flex justify-content-center align-items-center" style={{ borderRadius: '50%', width: '40px', height: '40px', padding: '0', margin: '0' }} color="dark">
              <MDBIcon fas icon="plus" />
            </MDBBtn>
          <MDBListGroup light numbered>

          {/* Listagem */}

          {currentUsers.map((usuario, index) => (
              <PacienteRegulacaoCard key={index} user={usuario} selectedUser={selectedUser} handleUserClick={handleUserClick} />
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
      <ModalCriarPaciente isOpen={basicModal} onClose={toggleOpen} />
    </MDBCol>
  );
}

function QuadroFicha({ selectedUser }) {
  const [selectedLeito, setSelectedLeito] = useState(null);

  const handleSelectLeito = (index) => {
    setSelectedLeito(index + 1);
  };

  return (
  <MDBCol md='8'>
  {selectedUser && (
  <MDBCard style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px'}}>

    {/* Cabeçalho */}

    <CabecalhoPaciente selectedUser={selectedUser} />

    {/* Conteúdo */}

    <MDBCardBody style={{ padding: '20px' }}>
      <MDBRow>

      {/* histórico */}

      <div className="col-md-6">
      <h4>Histórico</h4>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <HistoricoCard
                title="Paciente Internado"
                date="Ontem"
                time="10:00"
                text="Aguardando registro de alta pelo médico. Escrevendo texto longo."
          />
          
        </div>
        </div>

        {/* Dados da Solicitação */}

        <div className="col-md-6">
          <div>
            <h4>Dados da Solicitação</h4>
            <MDBInput label="Data de Entrada" id="textAreaExample" type="date" className="mb-3" disabled/>

            <div className="d-flex align-items-center mb-3">
              <div className="me-2">
                <MDBInput label="Nº de Sessões" id="sessoes" disabled/>
              </div>
              <div>
                <MDBInput label="Dias de intervalo" id="intervaloDias" disabled/>
              </div>
            </div>

            <h5>Leitos para amanhã</h5>

            <div className="row mt-3">
              {[...Array(18)].map((_, index) => (
                <div key={index} className="col-md-2 mb-1">
                  <MDBIcon fas icon="bed" style={{fontSize: '28px', cursor: 'pointer', color: '#14A44D'}} onClick={() => handleSelectLeito(index)} />
                  <p style={{textAlign: 'center', fontSize: '8px'}}>Leito {index + 1}</p>
                </div>
              ))}
            </div>

            <p>Reservar: {selectedLeito !== null ? `Leito ${selectedLeito}` : ''}</p>


            <hr />

            <MDBTextArea label="Observações" id="textAreaExample" rows={4}/>
          </div>
        </div>
      </MDBRow>
    </MDBCardBody>

    {/* Botões */}

    <div style={{ padding: '20px', marginTop: '10px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,.125)' }}>
      <div>
        <MDBBtn style={{ marginLeft: '10px' }}>ENCAMINHAR</MDBBtn>
      </div>
      <div>
        <MDBBtn style={{ marginLeft: '10px' }}>RESERVAR</MDBBtn>
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
  )
}

function HomeRegulacao() {
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

  return (
    <MDBContainer fluid className='p-1 background-radial-gradient overflow-hidden d-flex justify-content-center'  style={{ minHeight: '100vh' }}>
      <MDBCard className='my-5 bg-glass max-width-card' style={{ width: '100%', maxWidth: '1200px' }}>
      <h2 style={{ marginTop: '10px', marginLeft: '10px', marginBottom: '-8px' }}>Acompanhamento</h2>
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

export default HomeRegulacao;