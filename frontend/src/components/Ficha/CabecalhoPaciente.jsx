import React from 'react';

const CabecalhoPaciente = ({ selectedPaciente }) => {
  return (
    <div style={{ padding: '5px', background: 'linear-gradient(to top, #2c8fe6, #82c2fa)', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
      {selectedPaciente && (
        <div style={{ padding: '10px', color: 'black' }}>
          <h3 style={{ marginBottom: '0px' }}> {selectedPaciente.nome}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', justifyContent: 'space-between' }}>
            <p style={{ marginBottom: '0px' }}><strong>Prontuário:</strong> {selectedPaciente.prontuario}</p>
            <p style={{ marginBottom: '0px', textAlign: 'right' }}>Leito: a confirmar</p>
        </div>
        </div>
      )}
    </div>
  );
};

export default CabecalhoPaciente;