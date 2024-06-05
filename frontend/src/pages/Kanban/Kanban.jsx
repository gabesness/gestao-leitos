import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCheckbox,
  MDBIcon,
  MDBBadge, 
  MDBListGroup, 
  MDBListGroupItem,
  MDBRipple,
}
from 'mdb-react-ui-kit';
import './Kanban.css';
import PacienteCard from '../../components/Cards/PacienteCard';

function Kanban() {
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get('http://localhost:8000/lista_pacientes/');
        setUsuarios(response.data);
      } catch (error) {
        console.error("Erro ao buscar os usuários:", error);
      }
    };
    fetchUsuarios();
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };



  return (
    <MDBContainer fluid className='p-4 background-radial-gradient overflow-hidden d-flex justify-content-center'  style={{ minHeight: '100vh' }}>
      <MDBCard className='my-5 bg-glass max-width-card' style={{ width: '100%', maxWidth: '1200px' }}>
      <h2 style={{ marginTop: '10px', marginLeft: '10px', marginBottom: '-8px' }}>Acompanhamento</h2>
      <hr style={{ marginBottom: '10px' }} />
        <MDBCardBody className='p-5'>
          <MDBRow>
            <MDBCol md='2'>
              <MDBCard>
                <MDBCardBody>
                {usuarios.map((usuario, index) => (
                    <PacienteCard
                      key={index}
                      user={usuario}
                      selectedUser={selectedUser}
                      handleUserClick={handleUserClick}
                    />
                  ))}
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol md='2'>
              <MDBCard>
                <MDBCardBody>
                  {/* Conteúdo do segundo card */}
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol md='2'>
              <MDBCard>
                <MDBCardBody>
                  {/* Conteúdo do segundo card */}
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol md='2'>
              <MDBCard>
                <MDBCardBody>
                  {/* Conteúdo do segundo card */}
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol md='2'>
              <MDBCard>
                <MDBCardBody>
                  {/* Conteúdo do segundo card */}
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol md='2'>
              <MDBCard>
                <MDBCardBody>
                  {/* Conteúdo do segundo card */}
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}

export default Kanban;