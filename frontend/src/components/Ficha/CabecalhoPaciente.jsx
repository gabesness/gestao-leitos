import React from 'react';
import { MDBIcon } from 'mdb-react-ui-kit';


const CabecalhoPaciente = ({ selectedPaciente }) => {
  return (
    <div style={{ padding: '5px', background: 'linear-gradient(to top, #2c8fe6, #82c2fa)', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', display: 'flex', alignItems: 'center' }}>
      {selectedPaciente && (
        <>
          <div style={{ flex: '0 0 50px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '10px' }}>
            <MDBIcon fas icon="notes-medical" style={{ fontSize: '60px', color: 'white' }} />
          </div>
          <div style={{ padding: '10px', color: 'black', flex: '1' }}>
            <h3 style={{ marginBottom: '0px' }}>{selectedPaciente.nome}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', justifyContent: 'space-between' }}>
              <p style={{ marginBottom: '0px' }}><strong>Prontuário:</strong> {selectedPaciente.prontuario}</p>
              <p style={{ marginBottom: '0px', textAlign: 'right' }}>
                <strong>Leito:</strong> {selectedPaciente.leito ? selectedPaciente.leito : "A confirmar"}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};



export default CabecalhoPaciente;