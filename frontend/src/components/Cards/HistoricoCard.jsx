import React from 'react';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText } from 'mdb-react-ui-kit';

function HistoricoCard({ title, date, time, text }) {
  return (
    <MDBCard style={{ marginBottom: '10px' }}>
      <MDBCardBody style={{ padding: '10px' }}>
        <MDBCardTitle style={{ fontSize: '1rem' }}>
          {title}
          <span style={{ float: 'right', fontSize: '0.7rem' }}>{date}</span>
          <br />
          <span style={{ float: 'right', fontSize: '0.7rem' }}>{time}</span>
        </MDBCardTitle>
        <MDBCardText style={{ fontSize: '0.8rem' }}>
          {text}
        </MDBCardText>
      </MDBCardBody>
    </MDBCard>
  );
}

export default HistoricoCard;
