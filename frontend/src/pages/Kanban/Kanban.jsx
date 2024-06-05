import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
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
        <MDBCardBody className='p-3'>
        <MDBRow className='g-2'>
            <MDBCol md='2'>
              <MDBCard>
              <MDBCardHeader className="text-center" style={{ fontSize: "22px", padding: "5px 15px", backgroundColor: "#b4c5e4" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MDBIcon fas icon="user-md" style={{ marginRight: "8px" }}/>
                  <strong>Médico</strong>
                </div>
              </MDBCardHeader>
                <MDBCardBody className='p-2'>
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
            <MDBCardHeader className="text-center" style={{ fontSize: "22px", padding: "5px 15px", backgroundColor: "#b4c5e4" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MDBIcon fas icon="pills" style={{ marginRight: "8px" }}/>
                  <strong>Farmácia</strong>
                </div>
              </MDBCardHeader>
              <MDBCard>
                <MDBCardBody>
                  {/* Conteúdo do segundo card */}
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol md='2'>
            <MDBCardHeader className="text-center" style={{ fontSize: "22px", padding: "5px 15px", backgroundColor: "#b4c5e4" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MDBIcon far icon="calendar-alt" style={{ marginRight: "8px" }}/>
                  <strong>Regulação</strong>
                </div>
              </MDBCardHeader>
              <MDBCard>
                <MDBCardBody>
                  {/* Conteúdo do segundo card */}
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol md='2'>
              <MDBCard>
              <MDBCardHeader className="text-center" style={{ fontSize: "22px", padding: "5px 15px", backgroundColor: "#b4c5e4" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MDBIcon fas icon="bed" style={{ marginRight: "8px" }}/>
                  <strong>Internação</strong>
                </div>
              </MDBCardHeader>
                <MDBCardBody>
                  {/* Conteúdo do segundo card */}
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol md='2'>
              <MDBCard>
              <MDBCardHeader className="text-center" style={{ fontSize: "22px", padding: "5px 15px", backgroundColor: "#b4c5e4" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MDBIcon fas icon="check-circle" style={{ marginRight: "8px" }}/>
                  <strong>Alta</strong>
                </div>
              </MDBCardHeader>
                <MDBCardBody>
                  {/* Conteúdo do segundo card */}
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol md='2'>
              <MDBCard>
              <MDBCardHeader className="text-center" style={{ fontSize: "22px", padding: "5px 15px", backgroundColor: "#b4c5e4" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MDBIcon fas icon="hospital-alt" style={{ marginRight: "8px" }}/>
                  <strong>Transferido</strong>
                </div>
              </MDBCardHeader>
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