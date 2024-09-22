import React from 'react';
import { MDBListGroupItem } from 'mdb-react-ui-kit';

function PacienteCard({ paciente, selectedPaciente, handlePacienteClick }) {
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
    </MDBListGroupItem>
  );
}

export default PacienteCard;
