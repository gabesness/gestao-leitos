import React from 'react';
import { MDBListGroupItem, MDBIcon } from 'mdb-react-ui-kit';

function PacienteCardMedico({ paciente, selectedPaciente, handlePacienteClick }) {
  let tagContent = '';
  let tagColor = '';

  const calculateDaysRemaining = (dataProxSessao) => {
    const today = new Date();
    const sessionDate = new Date(dataProxSessao);
    const timeDifference = sessionDate - today;
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return daysDifference;
  };

  if (paciente.estagio_atual === 'ENCAMINHADO_PARA_AGENDAMENTO' && paciente?.data_prox_sessao) {
    const daysRemaining = calculateDaysRemaining(paciente.data_prox_sessao);
    if (daysRemaining === 1) {
      tagContent = 'Amanhã';
      tagColor = 'success';
    } else if (daysRemaining > 1) {
      tagContent = `Em ${daysRemaining} dias`;
      tagColor = 'info';
    } else {
      tagContent = 'Atrasado';
      tagColor = 'danger';
    }
  } else if (paciente.estagio_atual === 'AUTORIZADO_PARA_TRANSFERENCIA') {
    tagContent = 'Transferência';
    tagColor = 'secondary';
  } else if (paciente.estagio_atual === 'AGENDADO') {
    tagContent = 'Agendado';
    tagColor = 'primary';
  }
  return (
    <MDBListGroupItem
      className={`list-item d-flex justify-content-between align-items-start ${selectedPaciente === paciente ? 'clicked' : ''}`}
      onClick={() => handlePacienteClick(paciente)}
    >
       <div className='ms-2 me-auto'>
        <div className='fw-bold'>{paciente.nome}</div>
        <div style={{ fontFamily: 'FiraSans-Light, sans-serif' }}>
          Prontuário: {paciente.prontuario}
        </div>
      </div>
      {tagContent && (
      <span className={`badge bg-${tagColor} rounded-pill me-2`} style={{ fontFamily: 'FiraSans-Light, sans-serif' }}>
          {tagContent === 'Transferência' && <MDBIcon fas icon="exchange-alt" className="me-1" />}
          {(tagContent.includes('dias') || tagContent === 'Amanhã' || tagContent === 'Atrasado') && <MDBIcon fas icon="clock" className="me-1" />}
          {tagContent === 'Agendado' && <MDBIcon fas icon="bed" className="me-1" />}
          {tagContent}
        </span>
      )}
    </MDBListGroupItem>
  );
}

export default PacienteCardMedico;
