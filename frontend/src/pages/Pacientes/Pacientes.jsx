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
import HistoricoCardSessao from '../../components/Cards/HistoricoCardSessao';
import CabecalhoHistorico from '../../components/Ficha/CabecalhoHistorico';
import formatarData from '../../utils/FormatarData';
import { AxiosURL } from '../../axios/Config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';



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
      const response = await axios.post(`${AxiosURL}/pacientes/cadastrar_paciente/`, formData);
      if (response.status === 201) {
      toast.success(response.data.OK);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      }
    } catch (error) {
      console.error('Erro ao criar paciente:', error);
      toast.error(error.response.data.erro);
    }
  }

  return (
    <MDBModal open={isOpen} onClose={handleClose} tabIndex='-1' appendToBody>
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle style={{ fontFamily: 'FiraSans-Medium, sans-serif' }}>Adicionar Paciente Novo</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={handleClose}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody style={{ fontFamily: 'FiraSans-Light, sans-serif' }}>
          <form onSubmit={CriarPaciente}>
            <MDBInput 
              className="mb-4" 
              name="nome" 
              id="nome" 
              label="Nome" 
              style={{ fontFamily: 'FiraSans-Light, sans-serif' }}
              type="text"
              value={formValue.nome} 
              onChange={onChange} 
            />

            <MDBInput 
              className="mb-4" 
              name="prontuario" 
              id="prontuario" 
              label="Prontuário" 
              style={{ fontFamily: 'FiraSans-Light, sans-serif' }}
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
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
      <ToastContainer />
    </MDBModal>
  );
}

function ModalEditarPaciente({ isOpen, onClose, selectedPaciente }) {
  // Estado do formulário
  const [formValue, setFormValue] = useState({
    nome: '',
  });

  // Atualizar o estado do formulário quando selectedPaciente mudar
  useEffect(() => {
    if (selectedPaciente) {
      setFormValue({
        nome: selectedPaciente.nome,
      });
    }
  }, [selectedPaciente]);

  // Função de mudança do formulário
  const onChange = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  // Função para editar paciente
  async function EditarPaciente(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append('nome', formValue.nome);

    try {
      const response = await axios.patch(`${AxiosURL}/pacientes/${selectedPaciente.id}/editar_paciente/`, formData);
      if (response.status === 200) {
        toast.success(response.data.OK);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        }
    } catch (error) {
      console.error('Erro ao editar paciente:', error);
      toast.error(error.response?.data?.erro || 'Erro desconhecido');
    }
  }

  // Fechar o modal
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
            <MDBModalTitle style={{ fontFamily: 'FiraSans-Medium, sans-serif' }}>Editar Paciente</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={handleClose}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody style={{ fontFamily: 'FiraSans-Light, sans-serif' }}>
            <form onSubmit={EditarPaciente}>
              <MDBInput
                className="mb-4"
                name="nome"
                id="nome"
                label="Nome"
                style={{ fontFamily: 'FiraSans-Light, sans-serif' }}
                type="text"
                value={formValue.nome}
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
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
      <ToastContainer />
    </MDBModal>
  );
}


function QuadroLista({ pacientes, selectedPaciente, handlePacienteClick, }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5); // Quantidade de usuários por página
  const [searchTerm, setSearchTerm] = useState(''); // Estado para o termo de pesquisa

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const cargo = localStorage.getItem('cargo');

  const searchedPacientes = pacientes.filter(paciente => {
    if (/^\d+$/.test(searchTerm)) {
      return paciente.prontuario.includes(searchTerm);
    }
    return paciente.nome.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const currentPacientes = searchedPacientes.slice(indexOfFirstPost, indexOfLastPost);



  // Modal
  const [basicModal, setBasicModal] = useState(false);

  const toggleOpen = () => setBasicModal(!basicModal);

  return (
    <MDBCol md='4'>
      <MDBCard
        className='mb-4'
        style={{
          borderTopLeftRadius: '30px',
          borderTopRightRadius: '30px',
          borderBottomLeftRadius: '20px',
          borderBottomRightRadius: '20px',
          height: '610px',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Conteúdo */}
        <MDBCardBody
          className="d-flex flex-column"
          style={{ flex: '1 1 auto', minHeight: '0' }}
        >
          {/* Cabeçalho */}
          <div className="d-flex align-items-center mb-3">
            
          <MDBInput
            type="text"
            label={
              <div className="d-flex align-items-center">
                <MDBIcon fas icon="search" className="me-2" />
                Pesquisar
              </div>
            }
            value={searchTerm}
            onChange={handleSearchChange}
            className="flex-grow-1"
            style={{ height: '40px', borderRadius: '20px' }}
          />

            {cargo === 'Recepção' || cargo === 'Regulação' ? (
              <MDBBtn
                onClick={toggleOpen}
                className="ms-2 d-flex justify-content-center align-items-center btn-sm"
                style={{
                  minWidth: '40px',
                  height: '40px',
                  margin: '0',
                }}
                color="primary"
              >
                <MDBIcon fas icon="plus" style={{ fontSize: '16px' }} />
              </MDBBtn>
            ) : null}
          </div>
  
          <MDBListGroup light style={{ flex: '1 1 auto', overflowY: 'auto' }}>
            {/* Listagem */}
            {currentPacientes.map((paciente, index) => (
              <PacienteCard
                key={index}
                paciente={paciente}
                selectedPaciente={selectedPaciente}
                handlePacienteClick={handlePacienteClick}
              />
            ))}
          </MDBListGroup>
  
          {pacientes.length > postsPerPage && (
            <div className="pag text-center d-flex justify-content-center mt-auto">
              <Pagination
                postsPerPage={postsPerPage}
                totalPosts={searchedPacientes.length}
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
  const [showEditModal, setShowEditModal] = useState(false); // Novo estado para o modal de edição
  const cargo = localStorage.getItem('cargo');

  const uniqueSessions = ['Todas', ...new Set(historico.map(item => item.sessao))];

  const filteredHistorico = selectedSession === 'Todas'
  ? historico
  : historico.filter(item => item.sessao === selectedSession);

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
  };

  function baixarHistoricoComoPDF(historico, nomePaciente) {
    const doc = new jsPDF();
    
    // Defina o título do PDF com o nome do paciente
    doc.setFontSize(18);
    doc.text(`Histórico do Paciente ${nomePaciente}`, 14, 16);
    
    // Adicione a tabela
    const tableColumn = ['Data', 'Hora', 'Sessão', 'Estágio Atual', 'Mensagem', 'Usuário'];
    const tableRows = historico.map(registro => {
      const { dataFormatada, horaFormatada } = formatarData(registro.criado_em);
      return [
        dataFormatada,
        horaFormatada,
        registro.sessao,
        registro.estagio_atual,
        registro.mensagem,
        `${registro.usuario.first_name} ${registro.usuario.last_name}`
      ];
    });
    
    doc.autoTable(tableColumn, tableRows, { startY: 30 });
    
    // Salve o PDF
    doc.save(`historico_paciente_${nomePaciente}.pdf`);
  }
  

  useEffect(() => {
    // Resetar o dropdown quando o paciente selecionado mudar
    setSelectedSession('Todas');
  }, [selectedPaciente]);

  return (
    <MDBCol md='8'>
      {selectedPaciente && (
        <MDBCard style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px', height: '610px'}}>
          {/* Cabeçalho */}
          <CabecalhoHistorico selectedPaciente={selectedPaciente} />

          {/* Conteúdo */}
          <MDBCardBody style={{ padding: '10px' }}>
            <MDBRow style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {cargo === 'Recepção' || cargo === 'Regulação' || cargo === 'Administrador' ? (
                  <MDBBtn className='mx-2' color='tertiary' rippleColor='light' onClick={handleEditClick}>
                    <MDBIcon fas icon="edit" className='me-1' />
                    Editar Paciente
                  </MDBBtn>
                ) : null}
                  <MDBBtn className='mx-2' color='tertiary' rippleColor='light' onClick={() => baixarHistoricoComoPDF(historico, selectedPaciente.nome)}>
                   <MDBIcon fas icon="file-download" className='me-1' />
                     Baixar Histórico
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
            <h4 style={{ textAlign: 'center', fontFamily: 'FiraSans-Medium, sans-serif' }}>Histórico</h4>
            <div id="historico-content" style={{ height: '360px', overflowY: 'auto' }}>
              {filteredHistorico.map((registro, index) => {
                const { dataFormatada, horaFormatada } = formatarData(registro.criado_em);
                return (
                  <div key={index} style={{ width: '400px', margin: '0 auto' }}>
                    <HistoricoCardSessao
                      title={registro.estagio_atual}
                      date={dataFormatada}
                      time={horaFormatada}
                      text={registro.mensagem}
                      sessao={registro.sessao}
                      first_name={registro.usuario.first_name}
                      last_name={registro.usuario.last_name}
                    />
                  </div>
                );
              })}
            </div>
          </MDBCardBody>
        </MDBCard>
      )}
      {!selectedPaciente && (
        <div className="text-center d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
          <p style={{ fontSize: '1.5rem' }}>Selecione um Paciente</p>
        </div>
      )}
      {/* Modal de Edição */}
      <ModalEditarPaciente isOpen={showEditModal} onClose={closeEditModal} selectedPaciente={selectedPaciente} />
    </MDBCol>
  );
}


function Pacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [selectedPaciente, setselectedPaciente] = useState(null);


  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await axios.get(`${AxiosURL}/pacientes/lista/`);
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
      const response = await axios.get(`${AxiosURL}/pacientes/${paciente.id}/historico_completo/`);
      setHistorico(response.data);
      console.log('Histórico do paciente:', response.data);
    } catch (error) {
      console.error('Erro ao buscar o histórico do paciente:', error);
    }
  };

  return (
    <MDBContainer fluid className='p-1 background-radial-gradient overflow-hidden d-flex justify-content-center'  style={{ minHeight: '100vh' }}>
      <MDBCard className='my-5 bg-glass max-width-card' style={{ width: '100%', maxWidth: '1200px', borderRadius: '38px' }}>
      <h2 style={{ marginTop: '15px', marginLeft: '50px', marginBottom: '-22px', fontFamily: 'FiraSans-SemiBold, sans-serif' 
 }}>Pacientes</h2>
      <MDBCardBody className='p-5'>
          <MDBRow>
          <QuadroLista
              pacientes={pacientes}
              selectedPaciente={selectedPaciente}
              handlePacienteClick={handlePacienteClick}
            />

          <QuadroFicha 
          selectedPaciente={selectedPaciente} 
          historico={historico}

          />

          </MDBRow>
        </MDBCardBody>
      </MDBCard>
      <ToastContainer />
    </MDBContainer>
  );
}

export default Pacientes;