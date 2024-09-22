import React from 'react';
import { MDBDropdown, MDBDropdownMenu, MDBDropdownToggle, MDBDropdownItem, MDBBtn, MDBIcon } from 'mdb-react-ui-kit';

const CabecalhoHistorico = ({ selectedPaciente }) => {
  return (
    <div style={{ padding: '5px', background: 'linear-gradient(to top, #2c8fe6, #82c2fa)', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
    {selectedPaciente && (
      <div style={{ padding: '10px', color: 'black' }}>
        <h3 style={{ marginBottom: '0px', fontFamily: 'FiraSans-Medium, sans-serif' }}>
          {selectedPaciente.nome}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', justifyContent: 'space-between' }}>
          <p style={{ marginBottom: '0px', fontFamily: 'FiraSans-Light, sans-serif' }}>
            Prontuário: {selectedPaciente.prontuario}
          </p>
        </div>
      </div>
    )}
  </div>
  );
};

export default CabecalhoHistorico;