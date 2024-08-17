import React from 'react';
import { MDBListGroupItem, MDBIcon } from 'mdb-react-ui-kit';

function PacienteCardMedico({ paciente, selectedPaciente, handlePacienteClick }) {
  let tagContent = '';
  let tagColor = '';

  if (paciente.estagio_atual === 'PRESCRICAO_CRIADA') {
    tagContent = 'Nova';
    tagColor = 'primary';
  } else if (paciente.estagio_atual === 'DEVOLVIDO_PELA_FARMACIA') {
    tagContent = 'Farmácia';
    tagColor = 'success';
  } else if (paciente.estagio_atual === 'DEVOLVIDO_PELA_REGULACAO') {
    tagContent = 'Transferência';
    tagColor = 'warning';
  } else if (paciente.estagio_atual === 'INTERNADO') {
    tagContent = 'Internado';
    tagColor = 'primary';
  } else if (paciente.estagio_atual === 'ALTA_NORMAL') {
    tagContent = 'Em 3 Dias';
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
          {tagContent === 'Nova' && <MDBIcon fas icon="plus-circle" className="me-1" />}
          {tagContent === 'Farmácia' && <MDBIcon fas icon="pills" className="me-1" />}
          {tagContent === 'Transferência' && <MDBIcon fas icon="exchange-alt" className="me-1" />}
          {tagContent === 'Internado' && <MDBIcon fas icon="bed" className="me-1" />}
          {tagContent}
        </span>
      )}
    </MDBListGroupItem>
  );
}

export default PacienteCardMedico;
