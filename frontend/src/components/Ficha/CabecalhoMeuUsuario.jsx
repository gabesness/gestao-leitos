import React from 'react';

const CabecalhoMeuUsuario = () => {
  const nome = localStorage.getItem('nome');
  const sobrenome = localStorage.getItem('sobrenome');
  const username = localStorage.getItem('username');
  const cargo = localStorage.getItem('cargo');

  return (
    <div style={{ width: '100%', padding: '5px', background: 'linear-gradient(to top, #2c8fe6, #82c2fa)', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
    <div style={{ padding: '10px', color: 'black' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', justifyContent: 'space-between' }}>
        <h3 style={{ marginBottom: '0px', fontSize: '1.5em', fontFamily: 'FiraSans-Medium, sans-serif' }}>
          <strong>{nome} {sobrenome}</strong>
        </h3>
        <p style={{ marginBottom: '0px', textAlign: 'right', fontSize: '1.1em', fontFamily: 'FiraSans-Light, sans-serif' }}>
          Tipo de conta: {cargo}
        </p>
      </div>
      <p style={{ marginBottom: '0px', fontSize: '1.1em', fontFamily: 'FiraSans-Light, sans-serif' }}>
        Usuário: {username}
      </p>
    </div>
  </div>
  );
};

export default CabecalhoMeuUsuario;
