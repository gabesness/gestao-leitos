import React from 'react';
import { MDBIcon } from 'mdb-react-ui-kit';

const CabecalhoMeuUsuario = ({ username, firstName, lastName }) => {
  const cargo = localStorage.getItem('cargo');

  return (
    <div
    style={{
      width: '100%',
      padding: '10px',
      background: 'linear-gradient(to top, #2c8fe6, #82c2fa)',
      borderTopLeftRadius: '20px',
      borderTopRightRadius: '20px',
      display: 'flex',
      alignItems: 'center',
    }}
  >
    <MDBIcon
      fas
      icon="id-card-alt"
      style={{ fontSize: '50px', color: 'white', marginRight: '10px' }}
    />
    <div style={{ color: 'black', flex: 1 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h3 style={{ marginBottom: '0px', fontSize: '1.5em', fontFamily: 'FiraSans-Medium, sans-serif' }}>
              <strong>{firstName} {lastName}</strong>
            </h3>
            <p style={{ marginBottom: '0px', fontSize: '1.1em', fontFamily: 'FiraSans-Light, sans-serif' }}>
              Usuário: {username}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ marginBottom: '0px', fontSize: '1.1em', fontFamily: 'FiraSans-Light, sans-serif' }}>
              Tipo de conta: {cargo}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CabecalhoMeuUsuario;
