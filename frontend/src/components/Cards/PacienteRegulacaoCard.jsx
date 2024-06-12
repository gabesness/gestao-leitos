import React from 'react';
import { MDBListGroupItem } from 'mdb-react-ui-kit';

function PacienteRegulacaoCard({ paciente, selectedPaciente, handlePacienteClick }) {
  return (
    <MDBListGroupItem
      className={`list-item d-flex justify-content-between align-items-start ${selectedPaciente === paciente ? 'clicked' : ''}`}
      onClick={() => handlePacienteClick(paciente)}
    >
      <div className='ms-2 me-auto'>
        <div className='fw-bold'>{paciente.nome}</div>
        <div style={{ position: 'absolute', top: 0, right: 0 }}>
          <span className="text-end text-primary" style={{ fontSize: '0.8rem', marginRight: '10px' }}>Em 6 dias</span>
        </div>
        <br />
        Prontuário: {paciente.prontuario}
      </div>
    </MDBListGroupItem>
  );
}

export default PacienteRegulacaoCard;
