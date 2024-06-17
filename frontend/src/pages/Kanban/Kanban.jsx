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
}
from 'mdb-react-ui-kit';
import './Kanban.css';
import PacienteCard from '../../components/Cards/PacienteCard';
import HistoricoCard from '../../components/Cards/HistoricoCard';
import CabecalhoPacienteModal from '../../components/Ficha/CabecalhoPacienteModal';

function ModalFicha({ isOpen, onClose, selectedPaciente}) {
  const handleClose = () => {
    if (isOpen) {
      onClose();
    }
  };

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
                    <MDBTextArea label="Medicamentos" id="textAreaExample" rows={4} className="mb-3" disabled/>
                    <MDBInput label="Data de Entrada" id="textAreaExample" type="date" className="mb-3" disabled/>

                    <div className="d-flex align-items-center mb-3">
                      <div className="me-2">
                        <MDBInput label="Nº de Sessões" id="sessoes" disabled/>
                      </div>
                      <div>
                        <MDBInput label="Dias de intervalo" id="intervaloDias" disabled/>
                      </div>
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
  const [selectedPaciente, setSelectedPaciente] = useState(null);

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

  const handlePacienteClick = (paciente) => {
    setSelectedPaciente(paciente);
    toggleOpen();
  };

  // Modal
  const [basicModal, setBasicModal] = useState(false);

  const toggleOpen = () => setBasicModal(!basicModal);

  return (
    <MDBContainer fluid className='p-4 background-radial-gradient overflow-hidden d-flex justify-content-center'  style={{ minHeight: '100vh' }}>
      <MDBCard className='my-5 bg-glass max-width-card' style={{ width: '100%', maxWidth: '1200px' }}>
      <h2 style={{ marginTop: '10px', marginLeft: '10px', marginBottom: '-8px' }}>Acompanhamento</h2>
      <hr style={{ marginBottom: '10px' }} />
        <MDBCardBody className='p-3'>
        <MDBRow className='g-2'>

            {/* Coluna de Médico */}
            <MDBCol md='2'>
              <MDBCard>
              <MDBCardHeader className="text-center" style={{ fontSize: "22px", padding: "5px 15px", backgroundColor: "#b4c5e4" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MDBIcon fas icon="user-md" style={{ marginRight: "8px" }}/>
                  <strong>Médico</strong>
                </div>
              </MDBCardHeader>
              <MDBCardBody className='p-2'>
                {pacientes.filter(paciente => 
                  paciente.estagio_atual === 'PRESCRICAO_CRIADA' ||
                  paciente.estagio_atual === 'DEVOLVIDA_PELA_FARMACIA' ||
                  paciente.estagio_atual === 'DEVOLVIDA_PELA_REGULACAO'
                ).map((paciente, index) => (
                  <PacienteCard
                    key={index}
                    paciente={paciente}
                    selectedPaciente={selectedPaciente}
                    handlePacienteClick={handlePacienteClick}
                  />
                ))}
              </MDBCardBody>
              </MDBCard>
            </MDBCol>

            {/* Coluna da Farmácia */}
            <MDBCol md='2'>
            <MDBCardHeader className="text-center" style={{ fontSize: "22px", padding: "5px 15px", backgroundColor: "#b4c5e4" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MDBIcon fas icon="pills" style={{ marginRight: "8px" }}/>
                  <strong>Farmácia</strong>
                </div>
              </MDBCardHeader>
              <MDBCard>
                <MDBCardBody>
                  {pacientes.filter(paciente => paciente.estagio_atual === 'ENCAMINHADO_FARMACIA').map((paciente, index) => (
                    <PacienteCard
                      key={index}
                      paciente={paciente}
                      selectedPaciente={selectedPaciente}
                      handlePacienteClick={handlePacienteClick}
                    />
                  ))}
                </MDBCardBody>
              </MDBCard>
            </MDBCol>

            {/* Coluna da Regulação */}
            <MDBCol md='2'>
            <MDBCardHeader className="text-center" style={{ fontSize: "22px", padding: "5px 15px", backgroundColor: "#b4c5e4" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MDBIcon far icon="calendar-alt" style={{ marginRight: "8px" }}/>
                  <strong>Regulação</strong>
                </div>
              </MDBCardHeader>
              <MDBCard>
                  <MDBCardBody>
                    {pacientes.filter(paciente => 
                      paciente.estagio_atual === 'ENCAMINHADO_PARA_AGENDAMENTO' ||
                      paciente.estagio_atual === 'AGENDADO' ||
                      paciente.estagio_atual === 'AUTORIZADO_PARA_TRANSFERENCIA'
                    ).map((paciente, index) => (
                      <PacienteCard
                        key={index}
                        paciente={paciente}
                        selectedPaciente={selectedPaciente}
                        handlePacienteClick={handlePacienteClick}
                      />
                    ))}
                  </MDBCardBody>
              </MDBCard>
            </MDBCol>

            {/* Coluna da Internação */}
            <MDBCol md='2'>
              <MDBCard>
              <MDBCardHeader className="text-center" style={{ fontSize: "22px", padding: "5px 15px", backgroundColor: "#b4c5e4" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MDBIcon fas icon="bed" style={{ marginRight: "8px" }}/>
                  <strong>Internação</strong>
                </div>
              </MDBCardHeader>
               <MDBCardBody>
                  {pacientes.filter(paciente => paciente.estagio_atual === 'INTERNADO').map((paciente, index) => (
                    <PacienteCard
                      key={index}
                      paciente={paciente}
                      selectedPaciente={selectedPaciente}
                      handlePacienteClick={handlePacienteClick}
                    />
                  ))}
                </MDBCardBody>
              </MDBCard>
            </MDBCol>

            {/* Coluna da Alta */}
            <MDBCol md='2'>
              <MDBCard>
              <MDBCardHeader className="text-center" style={{ fontSize: "22px", padding: "5px 15px", backgroundColor: "#b4c5e4" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MDBIcon fas icon="check-circle" style={{ marginRight: "8px" }}/>
                  <strong>Alta</strong>
                </div>
              </MDBCardHeader>
                  <MDBCardBody>
                    {pacientes.filter(paciente => 
                      paciente.estagio_atual === 'ALTA_NORMAL' ||
                      paciente.estagio_atual === 'ALTA_CURADO' ||
                      paciente.estagio_atual === 'FALECIMENTO'
                    ).map((paciente, index) => (
                      <PacienteCard
                        key={index}
                        paciente={paciente}
                        selectedPaciente={selectedPaciente}
                        handlePacienteClick={handlePacienteClick}
                      />
                    ))}
                  </MDBCardBody>
              </MDBCard>
            </MDBCol>

            {/* Coluna da Transferência */}
            <MDBCol md='2'>
              <MDBCard>
              <MDBCardHeader className="text-center" style={{ fontSize: "22px", padding: "5px 15px", backgroundColor: "#b4c5e4" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MDBIcon fas icon="hospital-alt" style={{ marginRight: "8px" }}/>
                  <strong>Transferido</strong>
                </div>
              </MDBCardHeader>
                 <MDBCardBody>
                    {pacientes.filter(paciente => paciente.estagio_atual === 'TRANSFERIDO').map((paciente, index) => (
                      <PacienteCard
                        key={index}
                        paciente={paciente}
                        selectedPaciente={selectedPaciente}
                        handlePacienteClick={handlePacienteClick}
                      />
                    ))}
                  </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBCardBody>
      </MDBCard>
      <ModalFicha isOpen={basicModal} onClose={toggleOpen} selectedPaciente={selectedPaciente} />
    </MDBContainer>
  );
}

export default Kanban;