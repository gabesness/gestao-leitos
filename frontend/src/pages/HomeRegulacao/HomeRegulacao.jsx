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
import './HomeRegulacao.css';
import Pagination from '../../components/Pagination/Pagination';
import PacienteRegulacaoCard from '../../components/Cards/PacienteRegulacaoCard';
import HistoricoCard from '../../components/Cards/HistoricoCard';
import CabecalhoPaciente from '../../components/Ficha/CabecalhoPaciente';
import formatarData from '../../utils/FormatarData';


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

function ModalAgendamento({ isOpen, onClose }) {
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

function ModalInternacao({ isOpen, onClose }) {
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

function ModalTransferencia({ isOpen, onClose }) {
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
            <MDBModalTitle>Confirmar transferência</MDBModalTitle>
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

function ModalAltaObito({ isOpen, onClose }) {
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

function QuadroLista({ pacientes, activeTab, selectedPaciente, handlePacienteClick, setActiveTab }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5); // Quantidade de usuários por página
  const [searchTerm, setSearchTerm] = useState(''); // Estado para o termo de pesquisa

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  const filteredPacientes = pacientes.filter(paciente => 
    activeTab === 'pendentes' ? 
      ['ENCAMINHADO_PARA_AGENDAMENTO', 
      'AUTORIZADO_PARA_TRANSFERENCIA']
      .includes(paciente.estagio_atual) 
      : 
      paciente.estagio_atual === 'AGENDADO'
  );


  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const searchedPacientes = filteredPacientes.filter(paciente => {
    if (/^\d+$/.test(searchTerm)) {
      return paciente.prontuario.includes(searchTerm);
    }
    return paciente.nome.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const currentPacientes = searchedPacientes.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <MDBCol md='4'>
      <MDBCard className='mb-4' style={{ borderTopLeftRadius: '30px', borderTopRightRadius: '30px', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px'}}>
         
         {/* Botões das Abas */}

        <div className="text-center mb-4">
          <MDBBtn className="w-50" style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '0px', borderBottomRightRadius: '0px', borderBottomLeftRadius: '0px' }} color={activeTab === 'pendentes' ? 'light' : 'dark'} rippleColor='dark' onClick={() => setActiveTab('pendentes')}>
            Pendentes
          </MDBBtn>
          <MDBBtn className="w-50" style={{ borderTopLeftRadius: '0px', borderTopRightRadius: '20px', borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px' }} color={activeTab === 'agendados' ? 'light' : 'dark'} onClick={() => setActiveTab('agendados')}>
            Agendados
          </MDBBtn>
        </div>

        {/* Conteúdo */}

        <MDBCardBody>

          {/* Cabeçalho */}

          <MDBInput type="text" label="Pesquisar" value={searchTerm} onChange={handleSearchChange} className="flex-grow-1" style={{ height: '40px' }} />

          <MDBListGroup light>

          {/* Listagem */}

          {currentPacientes.map((paciente, index) => (
              <PacienteRegulacaoCard key={index} paciente={paciente} selectedPaciente={selectedPaciente} handlePacienteClick={handlePacienteClick} />
            ))}

          </MDBListGroup>
          {filteredPacientes.length > postsPerPage && (
            <div className="pag">
              <Pagination
                postsPerPage={postsPerPage}
                totalPosts={filteredPacientes.length}
                paginate={paginate}
              />
            </div>
          )}
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
  );
}

function QuadroFicha({ selectedPaciente, historico }) {
  // Modais
  // Modal de devolver ao medico
  const [isModalDevolverMedicoOpen, setIsModalDevolverMedicoOpen] = useState(false);
  const toggleModalDevolverMedico = () => setIsModalDevolverMedicoOpen(!isModalDevolverMedicoOpen);
  
  // Modal Agendamento
  const [isModalAgendamentoOpen, setIsModalAgendamentoOpen] = useState(false);
  const toggleModalAgendamento = () => setIsModalAgendamentoOpen(!isModalAgendamentoOpen);

  // Modal transferência
  const [isModalTransferenciaOpen, setIsModalTransferenciaOpen] = useState(false);
  const toggleModalTransferencia = () => setIsModalTransferenciaOpen(!isModalTransferenciaOpen);
 
  // Modal confirmar Alta Óbito
  const [isModalAltaObitoOpen, setIsModalAltaObitoOpen] = useState(false);
  const toggleModalAltaObito = () => setIsModalAltaObitoOpen(!isModalAltaObitoOpen);

  // Modal Internacao
  const [isModalInternacaoOpen, setIsModalInternacaoOpen] = useState(false);
  const toggleModalInternacao = () => setIsModalInternacaoOpen(!isModalInternacaoOpen);
    

  const [selectedLeito, setSelectedLeito] = useState(null);

  const handleSelectLeito = (index) => {
    setSelectedLeito(index + 1);
  };

    // Botões da Direita
    const renderButtons = () => {
      switch (selectedPaciente.estagio_atual) {
        case 'ENCAMINHADO_PARA_AGENDAMENTO':
          return <MDBBtn style={{ marginLeft: '10px' }} onClick={toggleModalAgendamento} >AGENDAR</MDBBtn>;
        case 'AUTORIZADO_PARA_TRANSFERENCIA':
          return (
            <>
              <div>
                <MDBBtn style={{ marginLeft: '10px' }} onClick={toggleModalTransferencia} >CONFIRMAR TRANSFERÊNCIA</MDBBtn>
              </div>
            </>
          );
        case 'AGENDADO':
          return (
            <>
              <div>
                <MDBBtn color='primary' onClick={toggleModalInternacao} >CONFIRMAR INTERNAÇÃO</MDBBtn>
              </div>
            </>
          );
        default:
          return null;
      }
    };

  return (
  <MDBCol md='8'>
  {selectedPaciente && (
  <MDBCard style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px'}}>

    {/* Cabeçalho */}

    <CabecalhoPaciente selectedPaciente={selectedPaciente} />

    {/* Conteúdo */}

    <MDBCardBody style={{ padding: '20px' }}>
      <MDBRow>

      {/* histórico */}

      <div className="col-md-6">
      <h4>Histórico</h4>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
      {historico.map((registro, index) => {
                    const { dataFormatada, horaFormatada } = formatarData(registro.criado_em);
                    return (
                      <HistoricoCard
                        key={index}
                        title={registro.estagio_atual}
                        date={dataFormatada} // Data formatada
                        time={horaFormatada} // Horário formatado
                        text={registro.mensagem}
                      />
                    );
                  })}
          
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
          {selectedPaciente.estagio_atual === 'ENCAMINHADO_PARA_AGENDAMENTO' && (
              <MDBBtn color='success' style={{ marginLeft: '10px' }} onClick={toggleModalDevolverMedico} >DEVOLVER</MDBBtn>
          )}
          {selectedPaciente.estagio_atual === 'AGENDADO' && (
              <MDBBtn color='danger' style={{ marginLeft: '10px' }} onClick={toggleModalAltaObito} >ALTA ÓBITO</MDBBtn>
          )}
        </div>
        <div>
          {renderButtons()}
        </div>
    </div>
        </MDBCard>
 )}
    {!selectedPaciente && (
      <div className="text-center">
        <p style={{ fontSize: '1.5rem' }}> Selecione um Usuário</p>
      </div>
    )}
  {/* Modais */}
  <ModalDevolverMedico isOpen={isModalDevolverMedicoOpen} onClose={toggleModalDevolverMedico} />
  <ModalAgendamento isOpen={isModalAgendamentoOpen} onClose={toggleModalAgendamento} />
  <ModalTransferencia isOpen={isModalTransferenciaOpen} onClose={toggleModalTransferencia} />
  <ModalAltaObito isOpen={isModalAltaObitoOpen} onClose={toggleModalAltaObito} />
  <ModalInternacao isOpen={isModalInternacaoOpen} onClose={toggleModalInternacao} />

      </MDBCol>
  )
}

function HomeRegulacao() {
  const [pacientes, setPacientes] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [activeTab, setActiveTab] = useState('pendentes');
  const [selectedPaciente, setSelectedPaciente] = useState(null);


  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await axios.get('http://localhost:8000/pacientes/lista_regulacao/');
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
      const response = await axios.get(`http://localhost:8000/pacientes/${paciente.id}/historico_atual/`);
      setHistorico(response.data);
      console.log('Histórico do paciente:', response.data);
    } catch (error) {
      console.error('Erro ao buscar o histórico do paciente:', error);
    }
  };

  return (
    <MDBContainer fluid className='p-1 background-radial-gradient overflow-hidden d-flex justify-content-center'  style={{ minHeight: '100vh' }}>
      <MDBCard className='my-5 bg-glass max-width-card' style={{ width: '100%', maxWidth: '1200px' }}>
      <h2 style={{ marginTop: '10px', marginLeft: '10px', marginBottom: '-8px' }}>Acompanhamento</h2>
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

export default HomeRegulacao;