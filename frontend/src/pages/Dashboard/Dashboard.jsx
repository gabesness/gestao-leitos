import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AxiosURL } from '../../axios/Config';
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

        // Se o dropdown não estiver em "Todo o Período", ajusta a URL para incluir os dias
        if (dropdownTitle !== 'Todo o Período') {
          const dias = getDiasByDropdownTitle(dropdownTitle); // Função para obter os dias com base no dropdownTitle
          url = `${AxiosURL}/estatisticas/${dias}`;
        }

        const response = await axios.get(url);
        const data = response.data;
  
        // Processar histograma_num_sessoes
        const histograma_num_sessoes = data.histograma_num_sessoes.map(item => {
          const key = Object.keys(item)[0];
          return { name: key, Sessões: item[key] };
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
  }, [dropdownTitle]); // Agora a requisição depende do dropdownTitle
  

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



  const dataLinha = [
    { name: 'Jan', Taxa: 30 },
    { name: 'Fev', Taxa: 20 },
    { name: 'Mar', Taxa: 27 },
    { name: 'Abr', Taxa: 18 },
    { name: 'Mai', Taxa: 23 },
    { name: 'Jun', Taxa: 34 },
  ];

  const handleDropdownSelect = (selected) => {
    setDropdownTitle(selected);
  };

  const handleDownloadPDF = () => {
    const input = document.getElementById('pdf-content');
    const lastChart = input.querySelector('.last-chart');
  
    // Captura a primeira parte do conteúdo (sem o último gráfico)
    html2canvas(input, {
      ignoreElements: element => element === lastChart // Ignora o último gráfico na captura
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
  
      // Adiciona o cabeçalho na primeira página
      pdf.setFontSize(16);
      pdf.text('Estatísticas do Oncoleitos', 105, 15, { align: 'center' }); // Adiciona o texto no topo centralizado
  
      // Adiciona a primeira parte do conteúdo
      pdf.addImage(imgData, 'PNG', 0, 20, imgWidth, imgHeight - 20); // Ajusta a posição para baixo do cabeçalho
      heightLeft -= pageHeight - 20; // Ajusta o comprimento disponível após o cabeçalho
  
      // Adiciona páginas para o conteúdo que excede o comprimento da página
      while (heightLeft >= 0) {
        pdf.addPage();
        pdf.setFontSize(16);
        pdf.text('Estatísticas do Oncoleitos', 105, 15, { align: 'center' });
        pdf.addImage(imgData, 'PNG', 0, 20, imgWidth, imgHeight - 20);
        heightLeft -= pageHeight - 20; // Ajusta o comprimento disponível após o cabeçalho
      }
  
      // Captura o último gráfico separado
      html2canvas(lastChart).then((lastChartCanvas) => {
        const lastChartImgData = lastChartCanvas.toDataURL('image/png');
        
        // Adiciona uma nova página para o último gráfico
        pdf.addPage();
        pdf.setFontSize(16);
        pdf.text('Estatísticas do Oncoleitos', 105, 15, { align: 'center' });
        pdf.addImage(lastChartImgData, 'PNG', 0, 20, imgWidth, lastChartCanvas.height * imgWidth / lastChartCanvas.width);
        
        // Salva o PDF
        pdf.save('dashboard-estatisticas.pdf');
      });
    });
  };
  
  


  return (
    <MDBContainer fluid className='p-1 background-radial-gradient overflow-hidden d-flex justify-content-center' style={{ minHeight: '100vh' }}>
    <MDBCard className='my-5 bg-glass max-width-card' style={{ width: '100%', maxWidth: '1200px', borderRadius: '38px' }}>
      <div className='d-flex justify-content-between align-items-center' style={{ padding: '0px' }}>
        <h2 style={{ marginTop: '15px', marginLeft: '50px', marginBottom: '-22px', fontFamily: 'FiraSans-SemiBold, sans-serif' }}>
          Dashboard
        </h2>
        <div className="d-flex align-items-center" style={{ marginRight: '50px', marginTop: '10px' }}>

          <MDBDropdown style={{ marginTop: '15px', marginRight: '0px', marginBottom: '-22px' }}>
            <MDBDropdownToggle tag='a' className='btn btn-primary'>
              {dropdownTitle}
            </MDBDropdownToggle>
            <MDBDropdownMenu>
              <MDBDropdownItem link onClick={() => handleDropdownSelect('Últimos 30 Dias')}>Últimos 30 Dias</MDBDropdownItem>
              <MDBDropdownItem link onClick={() => handleDropdownSelect('Últimos 90 Dias')}>Últimos 90 Dias</MDBDropdownItem>
              <MDBDropdownItem link onClick={() => handleDropdownSelect('Últimos 180 Dias')}>Últimos 180 Dias</MDBDropdownItem>
              <MDBDropdownItem link onClick={() => handleDropdownSelect('Últimos 360 Dias')}>Últimos 360 Dias</MDBDropdownItem>
              <MDBDropdownItem link onClick={() => handleDropdownSelect('Todo o Período')}>Todo o Período</MDBDropdownItem>
            </MDBDropdownMenu>
          </MDBDropdown>
        </div>
      </div>

      <div className='d-flex justify-content-end' style={{ marginRight: '55px', marginTop: '20px',marginBottom: '-28px' }}>
        <MDBBtn className='mx-2' color='tertiary' rippleColor='light' onClick={handleDownloadPDF}>
          <MDBIcon fas icon="file-download" className='me-1' />
          Baixar Estatísticas
        </MDBBtn>
      </div>
        <MDBCardBody id="pdf-content" className='p-5'>
          {/* Gráfico de Linhas (3 Linhas): historico_altas */}
          <MDBCard className='mb-4' style={{ borderTopLeftRadius: '30px', borderTopRightRadius: '30px', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px' }}>
            <MDBCardBody>
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
                  <Line type="monotone" dataKey="Alta" stroke="#8884d8" strokeWidth={3} />
                  <Line type="monotone" dataKey="Óbito" stroke="#82ca9d" strokeWidth={3} />
                  <Line type="monotone" dataKey="Transferência" stroke="#ff7300" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </MDBCardBody>
          </MDBCard>
  
          {/* Histogramas (lado a lado) */}
          <div className="d-flex justify-content-between">
            {/* Histograma 1: histograma_tempo_internacao */}
            <MDBCard className='mb-4' style={{ flex: 1, marginRight: '10px', borderTopLeftRadius: '30px', borderTopRightRadius: '30px', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px' }}>
              <MDBCardBody>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dados.histograma_tempo_internacao}>
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
  
            {/* Histograma 2: histograma_num_sessoes */}
            <MDBCard className='mb-4' style={{ flex: 1, marginLeft: '10px', borderTopLeftRadius: '30px', borderTopRightRadius: '30px', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px' }}>
              <MDBCardBody>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dados.histograma_num_sessoes}>
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
  
          {/* Gráfico de Barras: pacientes_novos */}
          <MDBCard className='mb-4' style={{ borderTopLeftRadius: '30px', borderTopRightRadius: '30px', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px' }}>
            <MDBCardBody>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
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
                  <Bar dataKey="Pacientes" fill="#8884d8" strokeWidth={2} />
                </BarChart>
              </ResponsiveContainer>
            </MDBCardBody>
          </MDBCard>
  
          {/* Gráfico de Linhas (Linha Simples) */}
          <MDBCard className='mb-4 last-chart' style={{ borderTopLeftRadius: '30px', borderTopRightRadius: '30px', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px' }}>
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