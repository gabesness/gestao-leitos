import React from 'react';
import { MDBDropdown, MDBDropdownMenu, MDBDropdownToggle, MDBDropdownItem, MDBBtn, MDBIcon } from 'mdb-react-ui-kit';

const CabecalhoHistorico = ({ selectedUser }) => {
  return (
    <div style={{ padding: '5px', background: 'linear-gradient(to top, #2c8fe6, #82c2fa)', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
      {selectedUser && (
        <div style={{ padding: '10px', color: 'black' }}>
          <h3 style={{ marginBottom: '0px' }}> {selectedUser.nome}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', justifyContent: 'space-between' }}>
            <p style={{ marginBottom: '0px' }}><strong>Prontuário:</strong> {selectedUser.prontuario}</p>
       </div>
        </div>
      )}
    </div>
  );
};

export default CabecalhoHistorico;