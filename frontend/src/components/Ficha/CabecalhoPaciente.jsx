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
          <div style={{ padding: '10px', color: 'black', flex: '1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ marginBottom: '0px', fontFamily: 'FiraSans-Medium, sans-serif' }}>{selectedPaciente.nome}</h3>
              <p style={{ marginBottom: '0px', fontFamily: 'FiraSans-Light, sans-serif', fontSize: '1.1rem' }}>
                Prontuário: {selectedPaciente.prontuario}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ marginBottom: '0px', fontFamily: 'FiraSans-Light, sans-serif', fontSize: '1.1rem' }}>
              Sessão:&nbsp; 
                <span style={{ fontFamily: 'FiraSans-LightItalic, sans-serif' }}>
                  {selectedPaciente.numero_sessao_atual ? selectedPaciente.numero_sessao_atual : " A confirmar"}
                </span>
              </p>
              <p style={{ marginBottom: '0px', fontFamily: 'FiraSans-Light, sans-serif', fontSize: '1.1rem' }}>
                Leito:&nbsp; 
                <span style={{ fontFamily: 'FiraSans-LightItalic, sans-serif' }}>
                  {selectedPaciente.leito ? selectedPaciente.leito : " A confirmar"}
                </span>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CabecalhoPaciente;
