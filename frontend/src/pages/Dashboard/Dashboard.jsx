import React, { useState, useEffect } from 'react';
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
  MDBTextArea,
  MDBModal,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter,
  MDBModalDialog,
  MDBModalContent,
  MDBModalTitle,
  MDBDropdown,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBDropdownToggle,
  MDBCardTitle,
  MDBCardText,
  UserListItem,
}
from 'mdb-react-ui-kit';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import './Dashboard.css';

function Dashboard() {  
  const dataHistograma1 = [
    { name: '5', freq: 1 },
    { name: '8', freq: 2 },
    { name: '12', freq: 3 },
    { name: '30', freq: 4 },
    { name: '4', freq: 5 },
    { name: '4', freq: +6 },
  ];

  const dataHistograma2 = [
    { name: '5', Sessões: 1 },
    { name: '8', Sessões: 2 },
    { name: '12', Sessões: 3 },
    { name: '30', Sessões: 4 },
    { name: '4', Sessões: 5 },
    { name: '4', Sessões: 6 },
  ];

  
  const data3Linhas = [
    { name: 'Jan', Alta: 30, Óbito: 20, Transferência: 50 },
    { name: 'Fev', Alta: 20, Óbito: 28, Transferência: 45 },
    { name: 'Mar', Alta: 27, Óbito: 39, Transferência: 40 },
    { name: 'Abr', Alta: 18, Óbito: 48, Transferência: 35 },
    { name: 'Mai', Alta: 23, Óbito: 38, Transferência: 30 },
    { name: 'Jun', Alta: 34, Óbito: 43, Transferência: 25 },
  ];

  const dataBarras = [
    { name: 'Jan', Pacientes: 30 },
    { name: 'Fev', Pacientes: 20},
    { name: 'Mar', Pacientes: 27},
    { name: 'Abr', Pacientes: 18 },
    { name: 'Mai', Pacientes: 23 },
    { name: 'Jun', Pacientes: 34 },
  ];

  const dataLinha = [
    { name: 'Jan', Taxa: 30 },
    { name: 'Fev', Taxa: 20 },
    { name: 'Mar', Taxa: 27 },
    { name: 'Abr', Taxa: 18 },
    { name: 'Mai', Taxa: 23 },
    { name: 'Jun', Taxa: 34 },
  ];

  return (
    <MDBContainer fluid className='p-1 background-radial-gradient overflow-hidden d-flex justify-content-center' style={{ minHeight: '100vh' }}>
      <MDBCard className='my-5 bg-glass max-width-card' style={{ width: '100%', maxWidth: '1200px' }}>
        <div className='d-flex justify-content-between align-items-center' style={{ padding: '10px' }}>
          <h2 style={{ margin: 0 }}>Dashboard</h2>
          <MDBDropdown>
            <MDBDropdownToggle tag='a' className='btn btn-primary'>
              Últimos 180 dias
            </MDBDropdownToggle>
            <MDBDropdownMenu>
              <MDBDropdownItem link>Últimos 7 Dias</MDBDropdownItem>
              <MDBDropdownItem link>Últimos 30 Dias</MDBDropdownItem>
              <MDBDropdownItem link>Últimos 90 Dias</MDBDropdownItem>
              <MDBDropdownItem link>Últimos 180 Dias</MDBDropdownItem>
              <MDBDropdownItem link>Últimos 360 Dias</MDBDropdownItem>
              <MDBDropdownItem link>Todo o período</MDBDropdownItem>
            </MDBDropdownMenu>
          </MDBDropdown>
        </div>
        <hr style={{ margin: '0 10px' }} />
        <MDBCardBody className='p-5'>
          {/* Gráfico de Linhas (3 Linhas) */}
          <MDBCard className='mb-4' style={{ borderTopLeftRadius: '30px', borderTopRightRadius: '30px', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px' }}>
            <MDBCardBody>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={data3Linhas}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Alta" stroke="#8884d8" strokeWidth={3} />
                  <Line type="monotone" dataKey="Óbito" stroke="#82ca9d" strokeWidth={3} />
                  <Line type="monotone" dataKey="Transferência" stroke="#ff7300" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </MDBCardBody>
          </MDBCard>
  
          {/* Histogramas (lado a lado) */}
          <div className="d-flex justify-content-between">
            {/* Histograma 1 */}
            <MDBCard className='mb-4' style={{ flex: 1, marginRight: '10px', borderTopLeftRadius: '30px', borderTopRightRadius: '30px', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px' }}>
              <MDBCardBody>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dataHistograma1}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="freq" fill="#8884d8" strokeWidth={2} />
                  </BarChart>
                </ResponsiveContainer>
              </MDBCardBody>
            </MDBCard>
  
            {/* Histograma 2 */}
            <MDBCard className='mb-4' style={{ flex: 1, marginLeft: '10px', borderTopLeftRadius: '30px', borderTopRightRadius: '30px', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px' }}>
              <MDBCardBody>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dataHistograma2}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Sessões" fill="#8884d8" strokeWidth={2} />
                  </BarChart>
                </ResponsiveContainer>
              </MDBCardBody>
            </MDBCard>
          </div>
  
          {/* Gráfico de Barras */}
          <MDBCard className='mb-4' style={{ borderTopLeftRadius: '30px', borderTopRightRadius: '30px', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px' }}>
            <MDBCardBody>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={dataBarras}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Pacientes" fill="#8884d8" strokeWidth={2} />
                </BarChart>
              </ResponsiveContainer>
            </MDBCardBody>
          </MDBCard>
  
          {/* Gráfico de Linhas (Linha Simples) */}
          <MDBCard className='mb-4' style={{ borderTopLeftRadius: '30px', borderTopRightRadius: '30px', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px' }}>
            <MDBCardBody>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={dataLinha}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="Taxa" stroke="#8884d8" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </MDBCardBody>
          </MDBCard>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
  
  
  
  
}

export default Dashboard;