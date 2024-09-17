import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBInput,
  MDBIcon,
  MDBTextArea,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBTooltip,
}
from 'mdb-react-ui-kit';
import './Kanban.css';
import PacienteCard from '../../components/Cards/PacienteCard';
import HistoricoCard from '../../components/Cards/HistoricoCard';
import CabecalhoPacienteModal from '../../components/Ficha/CabecalhoPacienteModal';
import formatarData from '../../utils/FormatarData';
import { AxiosURL } from '../../axios/Config';



function ModalFicha({ isOpen, onClose, selectedPaciente, historico}) {
  const handleClose = () => {
    if (isOpen) {
      onClose();
    }
  };

  const planoTerapeutico = selectedPaciente?.plano_terapeutico || {};
  const { medicamentos = '', data_sugerida = '', sessoes_prescritas = '', dias_intervalo = '' } = planoTerapeutico;

  return (
    <MDBModal open={isOpen} onClose={handleClose} tabIndex='-1' appendToBody> 
      <MDBModalDialog style={{ maxWidth: '55%' }}>  
        <MDBModalContent >
          <MDBCard>
            {/* Cabeçalho */}
            <CabecalhoPacienteModal selectedPaciente={selectedPaciente} />
            {/* Conteúdo */}

            <MDBCardBody style={{ padding: '20px' }}>
              <MDBRow>

              {/* histórico */}

              <div className="col-md-6">
              <h4 style={{ fontFamily: 'FiraSans-Medium, sans-serif' }}>Histórico</h4>
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
                    value={medicamentos}
                    disabled 
                  />                    
                  
                  <MDBInput 
                    label="Data de Entrada" 
                    id="textAreaExample" 
                    type="date" 
                    style={{  
                      fontFamily: 'FiraSans-Light, sans-serif' 
                      }}
                    className="mb-3" 
                    value={data_sugerida}
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
                        value={sessoes_prescritas}
                        disabled 
                      />                      </div>
                      <div>
                      <MDBInput 
                        label="Dias de intervalo" 
                        id="intervaloDias" 
                        style={{ 
                          fontFamily: 'FiraSans-Light, sans-serif' 
                      }}
                        value={dias_intervalo}
                        disabled 
                      />                      </div>
                    </div>
                  </div>
                </div>
              </MDBRow>
            </MDBCardBody>

                </MDBCard>

        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}


function Kanban() {
  const [pacientes, setPacientes] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [selectedPaciente, setSelectedPaciente] = useState(null);

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
    setSelectedPaciente(paciente);
    toggleOpen();
    try {
      const response = await axios.get(`${AxiosURL}/pacientes/${paciente.id}/historico_atual/`);
      setHistorico(response.data);
      console.log('Histórico do paciente:', response.data);
    } catch (error) {
      console.error('Erro ao buscar o histórico do paciente:', error);
    }
  };

  // Modal
  const [basicModal, setBasicModal] = useState(false);

  const toggleOpen = () => setBasicModal(!basicModal);

  return (
    <MDBContainer fluid className='p-1 background-radial-gradient overflow-hidden d-flex justify-content-center'  style={{ minHeight: '100vh' }}>
      <MDBCard className='my-5 bg-glass max-width-card' style={{ width: '100%', maxWidth: '1200px', borderRadius: '38px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 50px 10px 50px' }}>
        <h2 style={{ fontFamily: 'FiraSans-SemiBold, sans-serif' }}>Kanban</h2>
        <MDBTooltip
          placement="left"
          tag="div"
          title="Os dados das colunas Alta e Transferido se referem aos últimos 10 dias."
          >
            <MDBIcon 
              fas 
              icon="info-circle" 
              style={{ fontSize: '1.5em' }} 
            />
          </MDBTooltip>
      </div>
        <MDBCardBody className='p-3'>
          <MDBRow className='g-2'>
            {/* Coluna de Médico */}
            <MDBCol md='2'>
              <MDBCard>
                <MDBCardHeader className="text-center bg-info" style={{ fontSize: "20px", padding: "10px 15px"}}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <MDBIcon fas icon="user-md" className="text-white" style={{ marginRight: "8px" }} />
                    <strong className="text-white">Médico</strong>
                  </div>
                </MDBCardHeader>
                <MDBCardBody className='p-2' style={{ height: '600px', overflowY: 'auto' }}>
                {pacientes.filter(paciente => 
                    paciente.estagio_atual === 'PRESCRICAO_CRIADA' ||
                    paciente.estagio_atual === 'DEVOLVIDO_PELA_FARMACIA' ||
                    paciente.estagio_atual === 'DEVOLVIDO_PELA_REGULACAO'
                  ).map((paciente, index) => (
                    <div key={index} className="clickable">
                      <PacienteCard
                        paciente={paciente}
                        selectedPaciente={selectedPaciente}
                        handlePacienteClick={handlePacienteClick}
                      />
                      {/* Linha separadora */}
                      {index < pacientes.length - 1 && <hr style={{ borderTop: '1px solid #ddd', margin: '10px 0' }} />}
                    </div>
                  ))}
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
  
            {/* Coluna da Farmácia */}
            <MDBCol md='2'>
              <MDBCard>
              <MDBCardHeader className="text-center bg-info" style={{ fontSize: "20px", padding: "10px 15px"}}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <MDBIcon fas icon="pills" className="text-white" style={{ marginRight: "8px" }} />
                    <strong className="text-white">Farmácia</strong>
                  </div>
                </MDBCardHeader>
                <MDBCardBody className='p-2' style={{ height: '600px', overflowY: 'auto' }}>
                {pacientes.filter(paciente => paciente.estagio_atual === 'ENCAMINHADO_PARA_FARMACIA').map((paciente, index) => (
                    <div key={index} className="clickable">
                      <PacienteCard
                        paciente={paciente}
                        selectedPaciente={selectedPaciente}
                        handlePacienteClick={handlePacienteClick}
                      />
                      {/* Linha separadora */}
                      {index < pacientes.length - 1 && <hr style={{ borderTop: '1px solid #ddd', margin: '10px 0' }} />}
                    </div>
                  ))}
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
  
            {/* Coluna da Regulação */}
            <MDBCol md='2'>
              <MDBCard>
              <MDBCardHeader className="text-center bg-info" style={{ fontSize: "20px", padding: "10px 15px"}}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <MDBIcon far icon="calendar-alt" className="text-white" style={{ marginRight: "8px" }} />
                    <strong className="text-white">Regulação</strong>
                  </div>
                </MDBCardHeader>
                <MDBCardBody className='p-2' style={{ height: '600px', overflowY: 'auto' }}>
                  {pacientes.filter(paciente => 
                    paciente.estagio_atual === 'ENCAMINHADO_PARA_AGENDAMENTO' ||
                    paciente.estagio_atual === 'AGENDADO' ||
                    paciente.estagio_atual === 'AUTORIZADO_PARA_TRANSFERENCIA'
                  ).map((paciente, index) => (
                    <div key={index} className="clickable">
                      <PacienteCard
                        paciente={paciente}
                        selectedPaciente={selectedPaciente}
                        handlePacienteClick={handlePacienteClick}
                      />
                      {/* Linha separadora */}
                      {index < pacientes.length - 1 && <hr style={{ borderTop: '1px solid #ddd', margin: '10px 0' }} />}
                    </div>
                  ))}
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
  
            {/* Coluna da Internação */}
            <MDBCol md='2'>
              <MDBCard>
              <MDBCardHeader className="text-center bg-info" style={{ fontSize: "20px", padding: "10px 15px"}}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <MDBIcon fas icon="bed" className="text-white" style={{ marginRight: "8px" }} />
                    <strong className="text-white">Internação</strong>
                  </div>
                </MDBCardHeader>
                <MDBCardBody className='p-2' style={{ height: '600px', overflowY: 'auto' }}>
                  {pacientes.filter(paciente => paciente.estagio_atual === 'INTERNADO').map((paciente, index) => (
                    <div key={index} className="clickable">
                      <PacienteCard
                        paciente={paciente}
                        selectedPaciente={selectedPaciente}
                        handlePacienteClick={handlePacienteClick}
                      />
                      {/* Linha separadora */}
                      {index < pacientes.length - 1 && <hr style={{ borderTop: '1px solid #ddd', margin: '10px 0' }} />}
                    </div>
                  ))}
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
  
            {/* Coluna da Alta */}
            <MDBCol md='2'>
              <MDBCard>
              <MDBCardHeader className="text-center bg-info" style={{ fontSize: "20px", padding: "10px 15px"}}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <MDBIcon fas icon="check-circle" className="text-white" style={{ marginRight: "8px" }} />
                    <strong className="text-white">Alta</strong>
                  </div>
                </MDBCardHeader>
                <MDBCardBody className='p-2' style={{ height: '600px', overflowY: 'auto' }}>
                  {pacientes.filter(paciente => 
                    paciente.estagio_atual === 'ALTA_NORMAL' ||
                    paciente.estagio_atual === 'ALTA_OBITO' ||
                    paciente.estagio_atual === 'ALTA_DEFINITIVA'
                  ).map((paciente, index) => (
                    <div key={index} className="clickable">
                      <PacienteCard
                        paciente={paciente}
                        selectedPaciente={selectedPaciente}
                        handlePacienteClick={handlePacienteClick}
                      />
                      {/* Linha separadora */}
                      {index < pacientes.length - 1 && <hr style={{ borderTop: '1px solid #ddd', margin: '10px 0' }} />}
                    </div>
                  ))}
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
  
            {/* Coluna da Transferência */}
            <MDBCol md='2'>
              <MDBCard>
              <MDBCardHeader className="text-center bg-info" style={{ fontSize: "20px", padding: "10px 15px"}}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <MDBIcon fas icon="hospital-alt" className="text-white" style={{ marginRight: "8px" }} />
                    <strong className="text-white">Transferido</strong>
                  </div>
                </MDBCardHeader>
                <MDBCardBody className='p-2' style={{ height: '600px', overflowY: 'auto' }}>
                  {pacientes.filter(paciente => paciente.estagio_atual === 'TRANSFERIDO').map((paciente, index) => (
                    <div key={index} className="clickable">
                      <PacienteCard
                        paciente={paciente}
                        selectedPaciente={selectedPaciente}
                        handlePacienteClick={handlePacienteClick}
                      />
                      {/* Linha separadora */}
                      {index < pacientes.length - 1 && <hr style={{ borderTop: '1px solid #ddd', margin: '10px 0' }} />}
                    </div>
                  ))}
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBCardBody>
      </MDBCard>
      <ModalFicha isOpen={basicModal} onClose={toggleOpen} selectedPaciente={selectedPaciente} historico={historico}/>
    </MDBContainer>
  );
  
}

export default Kanban;