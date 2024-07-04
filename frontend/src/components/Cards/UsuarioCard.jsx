import React from 'react';
import { MDBListGroupItem } from 'mdb-react-ui-kit';

function UsuarioCard({ user, selectedUser, handleUserClick }) {
  return (
    <MDBListGroupItem
      className={`list-item d-flex justify-content-between align-items-start ${selectedUser === user ? 'clicked' : ''}`}
      onClick={() => handleUserClick(user)}
    >
      <div className='ms-2 me-auto'>
        <div className='fw-bold'>{user.first_name} {user.last_name}</div>
      </div>
    </MDBListGroupItem>
  );
}

export default UsuarioCard;
