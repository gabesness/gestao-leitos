import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AxiosURL } from '../../axios/Config';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBDropdown,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBDropdownToggle,
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
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './Dashboard.css';

function Dashboard() { 
  const [dados, setDados] = useState({
    histograma_num_sessoes: [],
    histograma_tempo_internacao: [],
    pacientes_novos: [],
    historico_altas: []
  });

  const [dropdownTitle, setDropdownTitle] = useState('Todo o Período'); // Estado para o título do dropdown


  useEffect(() => {
    const fetchDados = async () => {
      try {
        let url = `${AxiosURL}/estatisticas/all/`;

        if (dropdownTitle !== 'Todo o Período') {
          const dias = getDiasByDropdownTitle(dropdownTitle);
          url = `${AxiosURL}/estatisticas/${dias}`;
        }

        const response = await axios.get(url);
        const data = response.data;
  
        // Processar histograma_num_sessoes
        const histograma_num_sessoes = data.histograma_num_sessoes.map(item => {
          const key = Object.keys(item)[0];
          return { name: key, Pacientes: item[key] };
        });
  
        // Processar histograma_tempo_internacao
        const histograma_tempo_internacao = data.histograma_tempo_internacao.map(item => {
          const key = Object.keys(item)[0];
          return { name: key, freq: item[key] };
        });
  
        // Processar pacientes_novos
        const pacientes_novos = Object.entries(data.pacientes_novos).map(([key, value]) => ({
          name: key,
          Pacientes: value
        }));
  
        // Processar historico_altas
        const historico_altas = data.historico_altas.map(item => ({
          name: item.data,
          Alta: item.ALTA_DEFINITIVA,
          Óbito: item.ALTA_OBITO,
          Transferência: item.TRANSFERIDO
        }));
  
        setDados({
          histograma_num_sessoes,
          histograma_tempo_internacao,
          pacientes_novos,
          historico_altas
        });
      } catch (error) {
        console.error("Erro ao buscar estatisticas:", error);
      }
    };
  
    fetchDados();
  }, [dropdownTitle]);
  

  const getDiasByDropdownTitle = (title) => {
    switch (title) {
      case 'Últimos 7 Dias':
        return 7;
      case 'Últimos 30 Dias':
        return 30;
      case 'Últimos 90 Dias':
        return 90;
      case 'Últimos 180 Dias':
        return 180;
      case 'Últimos 360 Dias':
        return 360;
      default:
        return 'all'; // Caso "Todo o Período"
    }
  };


  const handleDropdownSelect = (selected) => {
    setDropdownTitle(selected);
  };

  const handleDownloadPDF = () => {
    const input = document.getElementById('pdf-content');

    // Captura o conteúdo
    html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const heightLeft = imgHeight - 20; // 20 para o cabeçalho
        if (heightLeft > pageHeight) {
            const scaleFactor = (pageHeight - 20) / imgHeight;
            pdf.addImage(imgData, 'PNG', 0, 20, imgWidth, imgHeight * scaleFactor);
        } else {
            pdf.addImage(imgData, 'PNG', 0, 20, imgWidth, imgHeight);
        }

        // Adiciona o cabeçalho
        pdf.setFontSize(16);
        pdf.text('Estatísticas do Oncoleitos', 105, 15, { align: 'center' });

        // Salva o PDF
        pdf.save('dashboard-estatisticas.pdf');
    });
};
  
  return (
    <MDBContainer fluid className='p-1 background-radial-gradient overflow-hidden d-flex justify-content-center' style={{ minHeight: '100vh' }}>
    <MDBCard className='my-5 bg-glass max-width-card' style={{ width: '100%', maxWidth: '1200px', borderRadius: '38px' }}>
      <div className='d-flex justify-content-between align-items-center' style={{ padding: '0px' }}>
        <h2 style={{ marginTop: '15px', marginLeft: '50px', marginBottom: '-22px', fontFamily: 'FiraSans-SemiBold, sans-serif' }}>
          Dashboard
        </h2>
        <div className="d-flex align-items-center justify-content-between" style={{ marginRight: '50px', marginTop: '38px' }}>
       
      
        <MDBBtn 
  className='mx-2' 
  color='secondary'
  rippleColor='light' 
  style={{
    borderRadius: '8px',
    padding: '10px 20px',
    backgroundColor: 'white',
  }}
  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
  onMouseDown={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
  onMouseUp={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
  onClick={handleDownloadPDF}
>
  <MDBIcon fas icon="file-download" className='me-1' />
  Baixar Estatísticas
</MDBBtn>
 
 
        <MDBDropdown style={{ marginTop: '0px', marginRight: '0px', marginBottom: '0' }}>
          <MDBDropdownToggle 
          tag='a' 
          className='btn btn-primary'
          style={{
            borderRadius: '8px',
            padding: '10px 20px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease-in-out'
          }}
          onMouseEnter={e => e.target.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)'}
          onMouseLeave={e => e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)'} 
          >
            {dropdownTitle}
          </MDBDropdownToggle>
          <MDBDropdownMenu
          style={{
            borderRadius: '8px',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
            padding: '10px',
            minWidth: '200px'
          }}>
            <MDBDropdownItem link onClick={() => handleDropdownSelect('Últimos 30 Dias')}>Últimos 30 Dias</MDBDropdownItem>
            <MDBDropdownItem link onClick={() => handleDropdownSelect('Últimos 90 Dias')}>Últimos 90 Dias</MDBDropdownItem>
            <MDBDropdownItem link onClick={() => handleDropdownSelect('Últimos 180 Dias')}>Últimos 180 Dias</MDBDropdownItem>
            <MDBDropdownItem link onClick={() => handleDropdownSelect('Últimos 360 Dias')}>Últimos 360 Dias</MDBDropdownItem>
            <MDBDropdownItem link onClick={() => handleDropdownSelect('Todo o Período')}>Todo o Período</MDBDropdownItem>
          </MDBDropdownMenu>
        </MDBDropdown>

</div>
      </div>

        <MDBCardBody id="pdf-content" className='p-5'>


          {/* Gráfico de Linhas (3 Linhas): historico_altas */}
          <MDBCard className='mb-4' style={{ borderTopLeftRadius: '30px', borderTopRightRadius: '30px', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px' }}>
            <MDBCardBody>
            <h4 style={{ marginBottom: '5px' }}>Relação entre altas</h4>
            <p style={{ marginBottom: "10px", fontSize: "0.9rem", color: "#6c757d" }}>
              Representa a quantidade de pacientes que receberam alta por óbito, alta definitiva e transferência ao longo do período.
            </p>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={dados.historico_altas}
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
                  <Line type="monotone" dataKey="Alta" name="Alta Definitiva" stroke="#8884d8" strokeWidth={3} />
                  <Line type="monotone" dataKey="Óbito" name="Alta Óbito" stroke="#82ca9d" strokeWidth={3} />
                  <Line type="monotone" dataKey="Transferência" name="Transferidos" stroke="#ff7300" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </MDBCardBody>
          </MDBCard>
  


          {/* Histogramas (lado a lado) */}
          <div className="d-flex justify-content-between">


            {/* Histograma 1: histograma_tempo_internacao */}
            <MDBCard className='mb-4' style={{ flex: 1, marginRight: '10px', borderTopLeftRadius: '30px', borderTopRightRadius: '30px', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px' }}>
              <MDBCardBody>
              <h4 style={{ marginBottom: '5px' }}>Tempo médio de internação</h4>
              <p style={{ marginBottom: "10px", fontSize: "0.9rem", color: "#6c757d" }}>
                Representa a distribuição do tempo de internação dos paciente ao longo do período.
              </p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dados.histograma_tempo_internacao}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar name="Pacientes" dataKey="freq" fill="#8884d8" strokeWidth={2} />
                  </BarChart>
                </ResponsiveContainer>
              </MDBCardBody>
            </MDBCard>
  

            {/* Histograma 2: histograma_num_sessoes */}
            <MDBCard className='mb-4' style={{ flex: 1, marginLeft: '10px', borderTopLeftRadius: '30px', borderTopRightRadius: '30px', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px' }}>
              <MDBCardBody>
              <h4 style={{ marginBottom: '5px' }}>Quantidade de sessões</h4>
              <p style={{ marginBottom: "10px", fontSize: "0.9rem", color: "#6c757d" }}>
                Representa a distribuição do número de sessões realizadas pelos pacientes ao longo do período.
              </p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dados.histograma_num_sessoes}>
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
          </div>
  

          {/* Gráfico de Barras: pacientes_novos */}
          <MDBCard className='mb-4' style={{ borderTopLeftRadius: '30px', borderTopRightRadius: '30px', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px' }}>
            <MDBCardBody>
              <h4 style={{ marginBottom: '5px' }}>Novos tratamentos</h4>
              <p style={{ marginBottom: "10px", fontSize: "0.9rem", color: "#6c757d" }}>
              Representa o número de pacientes que iniciaram o tratamento ao longo do período.
            </p>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={dados.pacientes_novos}
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
                  <Line type="monotone" dataKey="Pacientes" stroke="#8884d8" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </MDBCardBody>
          </MDBCard>
  
          {/* Gráfico de Linhas (Linha Simples) */}
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
  
  
}

export default Dashboard;