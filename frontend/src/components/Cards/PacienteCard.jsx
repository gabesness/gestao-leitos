import React from 'react';
import { MDBListGroupItem } from 'mdb-react-ui-kit';

function PacienteCard({ user, selectedUser, handleUserClick }) {
  return (
    <MDBListGroupItem
      className={`list-item d-flex justify-content-between align-items-start ${selectedUser === user ? 'clicked' : ''}`}
      onClick={() => handleUserClick(user)}
    >
      <div className='ms-2 me-auto'>
        <div className='fw-bold'>{user.nome}</div>
        Prontuário: {user.prontuario}
      </div>
    </MDBListGroupItem>
  );
}

export default PacienteCard;
