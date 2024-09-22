import React from 'react';
import { MDBIcon } from 'mdb-react-ui-kit';

const CabecalhoPaciente = ({ selectedPaciente }) => {
  return (
    <div style={{ padding: '5px', background: 'linear-gradient(to top, #2c8fe6, #82c2fa)', borderTopLeftRadius: '6px', borderTopRightRadius: '6px' }}>
      {selectedPaciente && (
              <>
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
                {selectedPaciente.sessao_atual.numero !== null && selectedPaciente.sessao_atual.numero !== undefined
                ? selectedPaciente.sessao_atual.numero
                 : "Sem sessão"}               
                 </span>
              </p>
              <p style={{ marginBottom: '0px', fontFamily: 'FiraSans-Light, sans-serif', fontSize: '1.1rem' }}>
                Leito:&nbsp; 
                <span style={{ fontFamily: 'FiraSans-LightItalic, sans-serif' }}>
                  {selectedPaciente.leito ? selectedPaciente.leito : " Sem Leito"}
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