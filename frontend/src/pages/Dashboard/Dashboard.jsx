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
  const dataHistograma = [
    { name: 'Intervalo 1', freq: 10 },
    { name: 'Intervalo 2', freq: 15 },
    { name: 'Intervalo 3', freq: 20 },
    { name: 'Intervalo 4', freq: 25 },
    { name: 'Intervalo 5', freq: 30 }
  ];

  const data3Linhas = [
    { name: 'Jan', variable1: 30, variable2: 20, variable3: 50 },
    { name: 'Feb', variable1: 20, variable2: 28, variable3: 45 },
    { name: 'Mar', variable1: 27, variable2: 39, variable3: 40 },
    { name: 'Apr', variable1: 18, variable2: 48, variable3: 35 },
    { name: 'May', variable1: 23, variable2: 38, variable3: 30 },
    { name: 'Jun', variable1: 34, variable2: 43, variable3: 25 },
  ];

  const dataBarras = [
    { name: 'Jan', value1: 30, value2: 20, value3: 50 },
    { name: 'Feb', value1: 20, value2: 28, value3: 45 },
    { name: 'Mar', value1: 27, value2: 39, value3: 40 },
    { name: 'Apr', value1: 18, value2: 48, value3: 35 },
    { name: 'May', value1: 23, value2: 38, value3: 30 },
    { name: 'Jun', value1: 34, value2: 43, value3: 25 },
  ];

  const dataLinha = [
    { name: 'Jan', value: 30 },
    { name: 'Feb', value: 20 },
    { name: 'Mar', value: 27 },
    { name: 'Apr', value: 18 },
    { name: 'May', value: 23 },
    { name: 'Jun', value: 34 },
  ];

  return (
    <MDBContainer fluid className='p-1 background-radial-gradient overflow-hidden d-flex justify-content-center'  style={{ minHeight: '100vh' }}>
      <MDBCard className='my-5 bg-glass max-width-card' style={{ width: '100%', maxWidth: '1200px' }}>
      <h2 style={{ marginTop: '10px', marginLeft: '10px', marginBottom: '-8px' }}>Dashboard</h2>
      <hr style={{ marginBottom: '10px' }} />
      <MDBCardBody className='p-5'>
     
      {/* 3 Linhas */}
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
        <Line type="monotone" dataKey="variable1" stroke="#8884d8" />
        <Line type="monotone" dataKey="variable2" stroke="#82ca9d" />
        <Line type="monotone" dataKey="variable3" stroke="#ff7300" />
      </LineChart>
      </ResponsiveContainer>

      {/* Histograma 1 */}
      <ResponsiveContainer width="100%" height={300}>
      <BarChart data={dataHistograma}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="freq" fill="#8884d8" />
      </BarChart>
      </ResponsiveContainer>

      {/* Histograma 2 */}
      <ResponsiveContainer width="100%" height={300}>
      <BarChart data={dataHistograma}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="freq" fill="#8884d8" />
      </BarChart>
      </ResponsiveContainer>

      {/* Gráfico de Barras */}
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
        <Bar dataKey="value1" fill="#8884d8" />
        <Bar dataKey="value2" fill="#82ca9d" />
        <Bar dataKey="value3" fill="#ff7300" />
      </BarChart>
      </ResponsiveContainer>
  
      {/* Gráfico de Linhas */}
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
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
      </LineChart>
      </ResponsiveContainer>


        </MDBCardBody>
      </MDBCard>

    </MDBContainer>
  );
}

export default Dashboard;