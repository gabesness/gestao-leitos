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
      window.location.href = '/pacientes';
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


function QuadroLista({ pacientes, activeTab, selectedPaciente, handlePacienteClick, setActiveTab }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5); // Quantidade de usuários por página

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPacientes = pacientes.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const cargo = localStorage.getItem('cargo');


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
            {cargo === 'Recepção' || cargo === 'Regulação' ? (
              <MDBBtn onClick={toggleOpen} className="ms-2 d-flex justify-content-center align-items-center" style={{ borderRadius: '50%', width: '40px', height: '40px', padding: '0', margin: '0' }} color="dark">
                <MDBIcon fas icon="plus" />
              </MDBBtn>
            ) : null}
          </div>
          
          <MDBListGroup light>

          {/* Listagem */}

          {currentPacientes.map((paciente, index) => (
              <PacienteCard key={index} paciente={paciente} selectedPaciente={selectedPaciente} handlePacienteClick={handlePacienteClick} />
            ))}

          </MDBListGroup>
          {pacientes.length > postsPerPage && (
            <div className="pag">
              <Pagination
                postsPerPage={postsPerPage}
                totalPosts={pacientes.length}
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

function QuadroFicha({ selectedPaciente, historico }) {
  const [selectedSession, setSelectedSession] = useState('Todas');

  const uniqueSessions = ['Todas', ...new Set(historico.map(item => item.sessao))];

  const filteredHistorico = selectedSession === 'Todas'
    ? historico
    : historico.filter(item => item.sessao === selectedSession);

  return (
    <MDBCol md='8'>
      {selectedPaciente && (
        <MDBCard style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px' }}>
  
          {/* Cabeçalho */}
          <CabecalhoHistorico selectedPaciente={selectedPaciente} />
  
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
                Todas
              </MDBBtn>
              <MDBDropdown style={{ marginLeft: 'auto' }}>
                  <MDBDropdownToggle tag='a' className='btn btn-primary'>
                    {selectedSession === 'Todas' ? selectedSession : `Sessão ${selectedSession}`}
                  </MDBDropdownToggle>
                  <MDBDropdownMenu>
                    {uniqueSessions.map((sessao, index) => (
                      <MDBDropdownItem key={index} onClick={() => setSelectedSession(sessao)}>
                        {sessao === 'Todas' ? sessao : `Sessão ${sessao}`}
                      </MDBDropdownItem>
                    ))}
                  </MDBDropdownMenu>
                </MDBDropdown>
            </div>
          </MDBRow>
  
            {/* Histórico */}
            <h4 style={{ textAlign: 'center' }}>Histórico</h4>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {historico.map((registro, index) => (
                <HistoricoCard
                  key={index}
                  title={registro.estagio_atual}
                  date={registro.date}
                  time={registro.time}
                  text={registro.mensagem}
                />
              ))}
            </div>
          </MDBCardBody>
  
        </MDBCard>
      )}
      {!selectedPaciente && (
        <div className="text-center">
          <p style={{ fontSize: '1.5rem' }}>Selecione um Usuário</p>
        </div>
      )}
    </MDBCol>
  )
  
}

function Pacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [activeTab, setActiveTab] = useState('pendentes');
  const [selectedPaciente, setselectedPaciente] = useState(null);


  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await axios.get('http://localhost:8000/pacientes/lista/');
        setPacientes(response.data);
      } catch (error) {
        console.error("Erro ao buscar os usuários:", error);
      }
    };
    fetchPacientes();
  }, []);

  const handlePacienteClick = async (paciente) => {
    setselectedPaciente(paciente);
    try {
      const response = await axios.get(`http://localhost:8000/pacientes/${paciente.id}/historico_completo/`);
      setHistorico(response.data);
      console.log('Histórico do paciente:', response.data);
    } catch (error) {
      console.error('Erro ao buscar o histórico do paciente:', error);
    }
  };

  return (
    <MDBContainer fluid className='p-1 background-radial-gradient overflow-hidden d-flex justify-content-center'  style={{ minHeight: '100vh' }}>
      <MDBCard className='my-5 bg-glass max-width-card' style={{ width: '100%', maxWidth: '1200px' }}>
      <h2 style={{ marginTop: '10px', marginLeft: '10px', marginBottom: '-8px' }}>Pacientes</h2>
      <hr style={{ marginBottom: '10px' }} />
      <MDBCardBody className='p-5'>
          <MDBRow>
          <QuadroLista
              pacientes={pacientes}
              activeTab={activeTab}
              selectedPaciente={selectedPaciente}
              handlePacienteClick={handlePacienteClick}
              setActiveTab={setActiveTab}
            />

          <QuadroFicha 
          selectedPaciente={selectedPaciente} 
          historico={historico}

          />

          </MDBRow>
        </MDBCardBody>
      </MDBCard>

    </MDBContainer>
  );
}

export default Pacientes;