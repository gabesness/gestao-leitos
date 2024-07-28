import React from 'react';
import { MDBListGroupItem } from 'mdb-react-ui-kit';

function PacienteCardMedico({ paciente, selectedPaciente, handlePacienteClick }) {
  let tagContent = '';
  let tagColor = '';

  if (paciente.estagio_atual === 'ENCAMINHADO_PARA_AGENDAMENTO') {
    tagContent = 'Em 3 Dias';
    tagColor = 'primary';
  } else if (paciente.estagio_atual === 'AUTORIZADO_PARA_TRANSFERENCIA') {
    tagContent = 'Transferência';
    tagColor = 'success';
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
        Prontuário: {paciente.prontuario}
      </div>
      {tagContent && (
              <span className={`badge bg-${tagColor} rounded-pill me-2`}>{tagContent}</span>
      )}
    </MDBListGroupItem>
  );
}

export default PacienteCardMedico;
