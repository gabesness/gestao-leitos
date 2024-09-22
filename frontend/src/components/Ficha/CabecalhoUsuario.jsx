import React from 'react';
import { MDBIcon } from 'mdb-react-ui-kit';

const cargoMapping = {
  1: 'Médico',
  2: 'Farmácia',
  3: 'Administrador',
  4: 'Regulação',
  5: 'Recepção'
};
const CabecalhoFicha = ({ selectedUser }) => {
  const cargo = selectedUser && selectedUser.groups && selectedUser.groups.length > 0 
  ? cargoMapping[selectedUser.groups[0]] 
  : 'Cargo não definido';

  return (
    <div
      style={{
        width: '100%',
        padding: '5px',
        background: 'linear-gradient(to top, #2c8fe6, #82c2fa)',
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
      }}
    >
      {selectedUser && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px',
            color: 'black',
          }}
        >
          <MDBIcon
            fas
            icon="id-card-alt"
            style={{ fontSize: '50px', color: 'white', marginRight: '10px' }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                alignItems: 'center',
              }}
            >
              <h3
                style={{
                  marginBottom: '0px',
                  fontSize: '1.5em',
                  fontFamily: 'FiraSans-Medium, sans-serif',
                }}
              >
                <strong>
                  {selectedUser.first_name} {selectedUser.last_name}
                </strong>
              </h3>
              <p
                style={{
                  marginBottom: '0px',
                  textAlign: 'right',
                  fontSize: '1.1em',
                  fontFamily: 'FiraSans-Light, sans-serif',
                }}
              >
                Tipo de conta: {cargo}
              </p>
            </div>
            <p
              style={{
                marginBottom: '0px',
                fontSize: '1.1em',
                fontFamily: 'FiraSans-Light, sans-serif',
              }}
            >
              Username: {selectedUser.username}
            </p>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default CabecalhoFicha;