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
  MDBIcon,
  MDBListGroup, 
  MDBTextArea,
  MDBModal,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter,
  MDBModalDialog,
  MDBModalContent,
  MDBModalTitle
}
from 'mdb-react-ui-kit';
import './HomeFarmacia.css';
import Pagination from '../../components/Pagination/Pagination';
import PacienteCard from '../../components/Cards/PacienteCard';
import HistoricoCard from '../../components/Cards/HistoricoCard';
import CabecalhoPaciente from '../../components/Ficha/CabecalhoPaciente';
import formatarData from '../../utils/FormatarData';
import { ToastContainer, toast } from 'react-toastify';
import { AxiosURL } from '../../axios/Config';
import 'react-toastify/dist/ReactToastify.css';


function ModalDevolverMedico({ isOpen, onClose, selectedPaciente, formValue }) {
  
  const handleDevolver = async () => {
    if (!selectedPaciente) return;
  
    try {
      const response = await axios.patch(`${AxiosURL}/prescricoes/${selectedPaciente.id}/devolver_farmacia/`, {
        id_usuario: localStorage.getItem('idUser'),
        mensagem: formValue.mensagem  
      });
      toast.success('Prescrição devolvida ao médico');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Erro ao devolver a prescrição:", error);
      toast.error(error.response.data.erro);
    }
  };
 
 
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
            <MDBModalTitle style={{ fontFamily: 'FiraSans-Medium, sans-serif' }}>Confirmação de devolução ao médico</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={handleClose}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody style={{ fontFamily: 'FiraSans-Light, sans-serif' }}>

          A prescrição será devolvida ao médico para que ele possa fazer alterações.

          </MDBModalBody>
          <MDBModalFooter>
          <MDBBtn 
          color='danger' 
          style={{
            borderRadius: '8px',
            padding: '10px 20px',
          }}
          onClick={handleClose}>Cancelar</MDBBtn>
          <MDBBtn 
           style={{
            borderRadius: '8px',
            padding: '10px 20px',
          }}
          onClick={handleDevolver} >Devolver</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
      <ToastContainer />
    </MDBModal>
  );
}

function ModalEnviarRegulacao({ isOpen, onClose, selectedPaciente, formValue }) {
  
  const handleEnviar = async () => {
    if (!selectedPaciente) return;
  
    try {
      const response = await axios.patch(`${AxiosURL}/prescricoes/${selectedPaciente.id}/encaminhar_agendamento/`, {
        id_usuario: localStorage.getItem('idUser'),
        mensagem: formValue.mensagem  
      });
      toast.success('Prescrição encaminhada à regulação');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Erro ao enviar a prescrição para regulação:", error);
      toast.error(error.response.data.erro);
    }
  };
  
  
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
            <MDBModalTitle style={{ fontFamily: 'FiraSans-Medium, sans-serif' }}>Confirmação de encaminhamento</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={handleClose}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody style={{ fontFamily: 'FiraSans-Light, sans-serif' }}>

          A prescrição será encaminhada à regulação para que possa ser feita a reserva do leito.

          </MDBModalBody>
          <MDBModalFooter>
          <MDBBtn 
          color='danger' 
          style={{
            borderRadius: '8px',
            padding: '10px 20px',
          }}
          onClick={handleClose}>Cancelar</MDBBtn>
          <MDBBtn 
           style={{
            borderRadius: '8px',
            padding: '10px 20px',
          }}
          onClick={handleEnviar} >ENCAMINHAR</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
      <ToastContainer />
    </MDBModal>
  );
}

function QuadroLista({ pacientes, activeTab, selectedPaciente, handlePacienteClick, setActiveTab }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5); // Quantidade de usuários por página
  const [searchTerm, setSearchTerm] = useState(''); // Estado para o termo de pesquisa

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);


 const searchedPacientes = pacientes.filter(paciente => {
    if (/^\d+$/.test(searchTerm)) {
      return paciente.prontuario.includes(searchTerm);
    }
    return paciente.nome.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const currentPacientes = searchedPacientes.slice(indexOfFirstPost, indexOfLastPost);
  
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
        <MDBCardBody className="d-flex flex-column" style={{ flex: '1 1 auto', minHeight: '0' }}>
        {/* Barra de Pesquisa */}
        <div className="d-flex align-items-center mb-2" style={{ marginTop: '0px' }}>
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
              className="flex-grow-1 mb-2 mt-0"
              style={{ height: '32px' }}
            />
          </div>
          {/* Listagem */}
          <MDBListGroup light style={{ flex: '1 1 auto', overflowY: 'auto' }}>
            {currentPacientes.map((paciente, index) => (
              <PacienteCard
                key={index}
                paciente={paciente}
                selectedPaciente={selectedPaciente}
                handlePacienteClick={handlePacienteClick}
              />
            ))}
          </MDBListGroup>
  
          {/* Paginação */}
          {pacientes.length > postsPerPage && (
            <div className="pag text-center d-flex justify-content-center mt-auto">
              <Pagination
                postsPerPage={postsPerPage}
                totalPosts={searchedPacientes.length}
                paginate={paginate}
                currentPage={currentPage}
              />
            </div>
          )}
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
  );
  

}

function QuadroFicha({ selectedPaciente, historico }) {
  const [formValue, setFormValue] = useState({
    mensagem: ''
  });

  const onChange = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  // Modais
  // Modal de devolver ao medico
  const [isModalDevolverMedicoOpen, setIsModalDevolverMedicoOpen] = useState(false);
  const toggleModalDevolverMedico = () => setIsModalDevolverMedicoOpen(!isModalDevolverMedicoOpen);
  
  // Modal enviar regulacao
  const [isModalEnviarRegulacaoOpen, setIsModalEnviarRegulacaoOpen] = useState(false);
  const toggleModalEnviarRegulacao = () => setIsModalEnviarRegulacaoOpen(!isModalEnviarRegulacaoOpen);
  const { data_prox_sessao = '' } = selectedPaciente || {};
  const formattedDataProxSessao = data_prox_sessao ? data_prox_sessao.split('T')[0] : '';
  return (
  <MDBCol md='8'>
  {selectedPaciente && (
  <MDBCard style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px', height: '610px'}}>

    {/* Cabeçalho */}

    <CabecalhoPaciente selectedPaciente={selectedPaciente} />

    {/* Conteúdo */}

    <MDBCardBody style={{ padding: '20px' }}>
      <MDBRow>

      {/* histórico */}

      <div className="col-md-6">
      <h4 style={{ fontFamily: 'FiraSans-Medium, sans-serif' }}>Histórico</h4>
      <div style={{ height: '360px', overflowY: 'auto' }}>
      {historico.map((registro, index) => {
                    const { dataFormatada, horaFormatada } = formatarData(registro.criado_em);
                    return (
                      <HistoricoCard
                      key={index}
                      title={registro.estagio_atual}
                      date={dataFormatada} // Data formatada
                      time={horaFormatada} // Horário formatado
                      text={registro.mensagem}
                      first_name={registro.usuario.first_name}
                      last_name={registro.usuario.last_name}
                    />
                    );
                  })}
          
        </div>
        </div>

        {/* Dados da Solicitação */}

        <div className="col-md-6">
          <div>
          <h4 style={{ fontFamily: 'FiraSans-Medium, sans-serif' }}>Dados da Solicitação</h4>
            <MDBTextArea 
                    label="Medicamentos" 
                    id="textAreaExample" 
                    rows={4} 
                    style={{ 
                      resize: 'none', 
                      fontFamily: 'FiraSans-Light, sans-serif' 
                  }}
                    className="mb-3" 
                    value={selectedPaciente.plano_terapeutico?.medicamentos || ''}
                    disabled 
                  />
            
            <MDBInput 
                    label="Próxima Sessão" 
                    id="textAreaExample" 
                    type="date" 
                    style={{  
                      fontFamily: 'FiraSans-Light, sans-serif' 
                      }}
                    className="mb-3" 
                    value={formattedDataProxSessao}
                    disabled 
                  />

            <div className="d-flex align-items-center mb-3">
              <div className="me-2">
              <MDBInput 
                        label="Nº de Sessões" 
                        id="sessoes" 
                        style={{ 
                          fontFamily: 'FiraSans-Light, sans-serif' 
                      }}
                        value={selectedPaciente.plano_terapeutico?.sessoes_prescritas || ''} 
                        disabled 
                      />
              </div>
              <div>
              <MDBInput 
                        label="Dias de intervalo" 
                        id="intervaloDias" 
                        style={{ 
                          fontFamily: 'FiraSans-Light, sans-serif' 
                      }}
                        value={selectedPaciente.plano_terapeutico?.dias_intervalo || ''} 
                        disabled 
                      />
              </div>
            </div>

            <hr />

            <MDBTextArea 
                    label="Observações" 
                    id="textAreaExample" 
                    rows={4}
                    style={{ 
                      resize: 'none', 
                      fontFamily: 'FiraSans-Light, sans-serif' 
                  }}
                    name="mensagem"
                    value={formValue.mensagem} 
                    onChange={onChange}
                    maxLength="256"
                    />
          </div>
        </div>
      </MDBRow>
    </MDBCardBody>

    {/* Botões */}

    <div style={{ padding: '20px', marginTop: '10px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,.125)' }}>
      <div>
        <MDBBtn 
        color='secondary' 
        style={{
          borderRadius: '8px',
          padding: '10px 20px',
        }}
        onClick={toggleModalDevolverMedico}>
        <MDBIcon fas icon="undo" className="me-2" />
          DEVOLVER AO MÉDICO
          </MDBBtn>
      </div>
      <div>
        <MDBBtn 
         style={{
          borderRadius: '8px',
          padding: '10px 20px',
        }}
        onClick={toggleModalEnviarRegulacao}>
        <MDBIcon fas icon="paper-plane" className="me-2" />
          ENCAMINHAR À REGULAÇÃO</MDBBtn>
      </div>
    </div>
        </MDBCard>
 )}
    {!selectedPaciente && (
      <div className="text-center d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <p style={{ fontSize: '1.5rem' }}>Selecione um Paciente</p>
      </div>
    )}
  
   {/* Modais */}
    <ModalDevolverMedico isOpen={isModalDevolverMedicoOpen} onClose={toggleModalDevolverMedico} selectedPaciente={selectedPaciente} formValue={formValue}
    />
    <ModalEnviarRegulacao isOpen={isModalEnviarRegulacaoOpen} onClose={toggleModalEnviarRegulacao} selectedPaciente={selectedPaciente} formValue={formValue}
    />
      </MDBCol>
  )
}

function HomeFarmacia() {
  const [pacientes, setPacientes] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [selectedPaciente, setSelectedPaciente] = useState(null);


  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await axios.get(`${AxiosURL}/pacientes/lista_farmacia/`);
        setPacientes(response.data);
      } catch (error) {
        console.error("Erro ao buscar os usuários:", error);
      }
    };
    fetchPacientes();
  }, []);

  const handlePacienteClick = async (paciente) => {
    setSelectedPaciente(paciente);
    try {
      const response = await axios.get(`${AxiosURL}/pacientes/${paciente.id}/historico_atual/`);
      setHistorico(response.data);
      console.log('Histórico do paciente:', response.data);
    } catch (error) {
      console.error('Erro ao buscar o histórico do paciente:', error);
    }
  };

  return (
    <MDBContainer fluid className='p-1 background-radial-gradient overflow-hidden d-flex justify-content-center'  style={{ minHeight: '100vh' }}>
      <MDBCard className='my-5 bg-glass max-width-card' style={{ width: '100%', maxWidth: '1200px', borderRadius: '38px' }}>
      <h2 style={{ marginTop: '15px', marginLeft: '50px', marginBottom: '-22px',         fontFamily: 'FiraSans-SemiBold, sans-serif' 
 }}>Prescrições</h2>
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

export default HomeFarmacia;