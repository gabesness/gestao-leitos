import React from 'react';
import { MDBListGroupItem } from 'mdb-react-ui-kit';

function PacienteCardMedico({ paciente, selectedPaciente, handlePacienteClick }) {
  let tagContent = '';
  let tagColor = '';

  if (paciente.estagio_atual === 'PRESCRICAO_CRIADA') {
    tagContent = 'Nova';
    tagColor = 'primary';
  } else if (paciente.estagio_atual === 'DEVOLVIDO_PELA_FARMACIA') {
    tagContent = 'Da Farmácia';
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
        Prontuário: {paciente.prontuario}
      </div>
      {tagContent && (
        <span className={`badge bg-${tagColor} me-2`}>{tagContent}</span>
      )}
    </MDBListGroupItem>
  );
}

export default PacienteCardMedico;
