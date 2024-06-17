import React from 'react';
import { MDBListGroupItem } from 'mdb-react-ui-kit';

function PacienteCardMedico({ paciente, selectedPaciente, handlePacienteClick }) {
  return (
    <MDBListGroupItem
      className={`list-item d-flex justify-content-between align-items-start ${selectedPaciente === paciente ? 'clicked' : ''}`}
      onClick={() => handlePacienteClick(paciente)}
    >
       <div className='ms-2 me-auto'>
        <div className='fw-bold'>{paciente.nome}</div>
        Prontuário: {paciente.prontuario}
      </div>
      <span className='badge bg-primary me-2'>Retorno: 2 Dias</span>
    </MDBListGroupItem>
  );
}

export default PacienteCardMedico;
