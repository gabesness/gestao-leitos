import React from 'react';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText } from 'mdb-react-ui-kit';

function HistoricoCardSessao({ title, date, time, text, first_name, last_name, sessao }) {
  return (
    <MDBCard style={{ marginBottom: '10px', backgroundColor: '#bbdefb' }}>
      <MDBCardBody style={{ padding: '10px' }}>
        <div style={{ textAlign: 'left', marginBottom: '5px' }}>
          <span style={{ fontSize: '0.8rem', fontFamily: 'FiraSans-MediumItalic, sans-serif' }}>
            Sessão: {sessao}
          </span>
        </div>
        <MDBCardTitle style={{ fontSize: '1rem', fontFamily: 'FiraSans-Medium, sans-serif' }}>
          {title}
          <br />
          <span style={{ fontSize: '0.7rem' }}>
            {first_name} {last_name}
          </span>
          <span style={{ float: 'right', fontSize: '0.8rem', fontFamily: 'FiraSans-MediumItalic, sans-serif' }}>
            {date}
          </span>
          <br />
          <span style={{ float: 'right', fontSize: '0.8rem', fontFamily: 'FiraSans-LightItalic, sans-serif' }}>
            {time}
          </span>
        </MDBCardTitle>
        <MDBCardText style={{ fontSize: '0.85rem', fontFamily: 'FiraSans-Light, sans-serif' }}>
          {text}
        </MDBCardText>
      </MDBCardBody>
    </MDBCard>
  );
}

export default HistoricoCardSessao;
