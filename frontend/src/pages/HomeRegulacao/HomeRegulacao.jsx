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
  MDBIcon,
  MDBListGroup, 
  MDBTextArea,
  MDBModal,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter,
  MDBModalDialog,
  MDBModalContent,
  MDBModalTitle,
  MDBTooltip,
}
from 'mdb-react-ui-kit';
import './HomeRegulacao.css';
import Pagination from '../../components/Pagination/Pagination';
import PacienteRegulacaoCard from '../../components/Cards/PacienteRegulacaoCard';
import HistoricoCard from '../../components/Cards/HistoricoCard';
import CabecalhoPaciente from '../../components/Ficha/CabecalhoPaciente';
import formatarData from '../../utils/FormatarData';
import { ToastContainer, toast } from 'react-toastify';
import { AxiosURL } from '../../axios/Config';
import 'react-toastify/dist/ReactToastify.css';


function ModalDevolverMedico({ isOpen, onClose, selectedPaciente, formValue }) {

  const handleDevolver = async () => {
    if (!selectedPaciente) return;

    try {
      const response = await axios.patch(`${AxiosURL}/prescricoes/${selectedPaciente.id}/devolver_regulacao_medico/`, {
        id_usuario: localStorage.getItem('idUser'),
        mensagem: formValue.mensagem 
      });
      toast.success('Prescrição devolvida ao médico');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Erro ao devolver a prescrição:", error);
      toast.error(error.response.data.Erro);
    }
  };
 
 
  const handleClose = () => {
    if (isOpen) {
      onClose();
    }
  };

  return (
    <MDBModal open={isOpen} onClose={handleClose} tabIndex='-1' appendToBody>
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle style={{ fontFamily: 'FiraSans-Medium, sans-serif' }}>Devolução ao Médico</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={handleClose}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody style={{ fontFamily: 'FiraSans-Light, sans-serif' }}>

          A prescrição será devolvida ao médico para que possa ser editada.

          </MDBModalBody>
          <MDBModalFooter>
          <MDBBtn color='danger' onClick={handleClose}
           style={{
            borderRadius: '8px',
            padding: '10px 20px',
          }}
          >Cancelar</MDBBtn>
          <MDBBtn onClick={handleDevolver}
           style={{
            borderRadius: '8px',
            padding: '10px 20px',
          }}
          >Devolver</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
      <ToastContainer />
    </MDBModal>
  );
}

function ModalPedirTransferencia({ isOpen, onClose, selectedPaciente, formValue }) {

  const handlePedirTransferencia = async () => {
    if (!selectedPaciente) return;

    try {
      const response = await axios.patch(`${AxiosURL}/prescricoes/${selectedPaciente.id}/devolver_regulacao/`, {
        id_usuario: localStorage.getItem('idUser'),
        mensagem: formValue.mensagem  // Incluir a mensagem no corpo da requisição
      });
      toast.success('Solicitação de transferência enviada ao médico');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Erro ao devolver a prescrição:", error);
      toast.error(error.response.data.Erro);
    }
  };
 
 
  const handleClose = () => {
    if (isOpen) {
      onClose();
    }
  };

  return (
    <MDBModal open={isOpen} onClose={handleClose} tabIndex='-1' appendToBody>
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle style={{ fontFamily: 'FiraSans-Medium, sans-serif' }}>Solicitação de transferência</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={handleClose}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody style={{ fontFamily: 'FiraSans-Light, sans-serif' }}>

          A prescrição será devolvida ao médico para que a transferência do paciente possa ser autorizada.

          </MDBModalBody>
          <MDBModalFooter>
          <MDBBtn color='danger' onClick={handleClose}
           style={{
            borderRadius: '8px',
            padding: '10px 20px',
          }}
          >Cancelar</MDBBtn>
          <MDBBtn onClick={handlePedirTransferencia}
           style={{
            borderRadius: '8px',
            padding: '10px 20px',
          }}
          >Solicitar Transferência</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
      <ToastContainer />
    </MDBModal>
  );
}

function ModalAgendamento({ isOpen, onClose, selectedPaciente, selectedLeito, formValue }) {

  const handleAgendar = async () => {
    if (!selectedPaciente) return;

    try {
      const response = await axios.patch(`${AxiosURL}/prescricoes/${selectedPaciente.id}/agendar_paciente/${selectedLeito.id}/`, {
        id_usuario: localStorage.getItem('idUser'),
        mensagem: formValue.mensagem  // Incluir a mensagem no corpo da requisição
      });
      toast.success(response.data.OK);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Erro ao devolver a prescrição:", error);
      toast.error(error.response.data.erro);
    }
  };
  
  
  const handleClose = () => {
    if (isOpen) {
      onClose();
    }
  };

  return (
    <MDBModal open={isOpen} onClose={handleClose} tabIndex='-1' appendToBody>
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle style={{ fontFamily: 'FiraSans-Medium, sans-serif' }}>Confirmar agendamento</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={handleClose}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody style={{ fontFamily: 'FiraSans-Light, sans-serif' }}>

          O paciente {selectedPaciente ? ` ${selectedPaciente.nome}`  : ''} será agendado no leito {selectedLeito ? ` ${selectedLeito.numero}` : ''}

          </MDBModalBody>
          <MDBModalFooter>
          <MDBBtn color='danger' onClick={handleClose}
           style={{
            borderRadius: '8px',
            padding: '10px 20px',
          }}
          >Cancelar</MDBBtn>
          <MDBBtn onClick={handleAgendar} 
           style={{
            borderRadius: '8px',
            padding: '10px 20px',
          }}>Agendar</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
      <ToastContainer />
    </MDBModal>
  );
}

function ModalInternacao({ isOpen, onClose, selectedPaciente }) {
  
  const handleInternar = async () => {
    if (!selectedPaciente) return;

    try {
      const response = await axios.patch(`${AxiosURL}/prescricoes/${selectedPaciente.id}/internar/`, {
        id_usuario: localStorage.getItem('idUser'),
      });
      toast.success(response.data.OK);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Erro ao devolver a prescrição:", error);
      toast.error(error.response.data.erro);
    }
  };

  
  const handleClose = () => {
    if (isOpen) {
      onClose();
    }
  };

  return (
    <MDBModal open={isOpen} onClose={handleClose} tabIndex='-1' appendToBody>
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle style={{ fontFamily: 'FiraSans-Medium, sans-serif' }}>Confirmar internação</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={handleClose}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody style={{ fontFamily: 'FiraSans-Light, sans-serif' }}>

          Confirmar que o paciente foi internado.

          </MDBModalBody>
          <MDBModalFooter>
          <MDBBtn color='danger' onClick={handleClose}
           style={{
            borderRadius: '8px',
            padding: '10px 20px',
          }}
          >Cancelar</MDBBtn>
          <MDBBtn onClick={handleInternar}
           style={{
            borderRadius: '8px',
            padding: '10px 20px',
          }}
          >Internado</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
      <ToastContainer />
    </MDBModal>
  );
}

function ModalTransferencia({ isOpen, onClose, selectedPaciente, formValue }) {
  const handleTransferir = async () => {
    if (!selectedPaciente) return;

    try {
      const response = await axios.patch(`${AxiosURL}/prescricoes/${selectedPaciente.id}/transferir/`, {
        id_usuario: localStorage.getItem('idUser'),
        mensagem: formValue.mensagem  
      });
      toast.success('Paciente registrado como transferido');
      setTimeout(() => {
        window.location.reload();
      }, 2000);    } catch (error) {
      console.error("Erro ao devolver a prescrição:", error);
      toast.error(error.response.data.erro);
    }
  };
  
  const handleClose = () => {
    if (isOpen) {
      onClose();
    }
  };

  return (
    <MDBModal open={isOpen} onClose={handleClose} tabIndex='-1' appendToBody>
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle style={{ fontFamily: 'FiraSans-Medium, sans-serif' }}>Confirmar transferência</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={handleClose}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody style={{ fontFamily: 'FiraSans-Light, sans-serif' }}>

          Confirmar a transferência do paciente.

          </MDBModalBody>
          <MDBModalFooter>
          <MDBBtn color='danger' onClick={handleClose}
           style={{
            borderRadius: '8px',
            padding: '10px 20px',
          }}
          >Cancelar</MDBBtn>
          <MDBBtn onClick={handleTransferir} 
           style={{
            borderRadius: '8px',
            padding: '10px 20px',
          }}
          >Transferido</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
      <ToastContainer />
    </MDBModal>
  );
}

function ModalAltaObito({ isOpen, onClose, selectedPaciente }) {
    
  const handleAltaObito = async () => {
      if (!selectedPaciente) return;
  
      try {
        const response = await axios.patch(`${AxiosURL}/prescricoes/${selectedPaciente.id}/dar_alta/2/`, {
          id_usuario: localStorage.getItem('idUser'),
        });
        toast.success(response.data.OK);
        setTimeout(() => {
          window.location.reload();
        }, 2000);      } catch (error) {
        console.error("Erro ao devolver a prescrição:", error);
        toast.error(error.response.data.erro);
      }
    };
  
  
  const handleClose = () => {
    if (isOpen) {
      onClose();
    }
  };

  return (
    <MDBModal open={isOpen} onClose={handleClose} tabIndex='-1' appendToBody>
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle style={{ fontFamily: 'FiraSans-Medium, sans-serif' }}>Confirmação de Falecimento</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={handleClose}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody style={{ fontFamily: 'FiraSans-Light, sans-serif' }}>

          Confirme que o paciente está recebendo alta por óbito. A sessão do paciente será encerrada, e todos os seus registros poderão ser verificados na página de pacientes.
          </MDBModalBody>
          <MDBModalFooter>
          <MDBBtn color='danger' onClick={handleClose}
           style={{
            borderRadius: '8px',
            padding: '10px 20px',
          }}>Cancelar</MDBBtn>
          <MDBBtn onClick={handleAltaObito}
           style={{
            borderRadius: '8px',
            padding: '10px 20px',
          }}>Confirmar Alta</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
      <ToastContainer />
    </MDBModal>
  );
}

function QuadroLista({ pacientes, activeTab, selectedPaciente, handlePacienteClick, setActiveTab }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5); // Quantidade de usuários por página
  const [searchTerm, setSearchTerm] = useState(''); // Estado para o termo de pesquisa

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  const filteredPacientes = pacientes.filter(paciente => 
    activeTab === 'pendentes' ? 
      ['ENCAMINHADO_PARA_AGENDAMENTO', 
      'AUTORIZADO_PARA_TRANSFERENCIA']
      .includes(paciente.estagio_atual) 
      : 
      paciente.estagio_atual === 'AGENDADO'
  );


  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const searchedPacientes = filteredPacientes.filter(paciente => {
    if (/^\d+$/.test(searchTerm)) {
      return paciente.prontuario.includes(searchTerm);
    }
    return paciente.nome.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const currentPacientes = searchedPacientes.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <MDBCol md='4'>
      <MDBCard
        className='mb-4'
        style={{
          borderTopLeftRadius: '30px',
          borderTopRightRadius: '30px',
          borderBottomLeftRadius: '20px',
          borderBottomRightRadius: '20px',
          height: '610px',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Botões das Abas */}
        <div className="text-center mb-2">
          <MDBBtn
            className="w-50"
            style={{
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '0px',
              borderBottomRightRadius: '0px',
              borderBottomLeftRadius: '0px',
              boxShadow: 'none',
              color: activeTab === 'pendentes' ? '#000000' : '#6c757d',
              backgroundColor: activeTab === 'pendentes' ? 'white' : '#D3D3D3',
              fontFamily: 'FiraSans-Medium, sans-serif' 

            }}
            color={activeTab === 'pendentes' ? 'white' : 'dark'}
            onClick={() => {
              setActiveTab('pendentes');
              setCurrentPage(1);
            }}
          >
            Pendentes
          </MDBBtn>
  
          <MDBBtn
            className="w-50"
            style={{
              borderTopLeftRadius: '0px',
              borderTopRightRadius: '20px',
              borderBottomLeftRadius: '0px',
              borderBottomRightRadius: '0px',
              boxShadow: 'none',
              color: activeTab === 'agendados' ? '#000000' : '#6c757d',
              backgroundColor: activeTab === 'agendados' ? 'white' : '#D3D3D3',
              fontFamily: 'FiraSans-Medium, sans-serif' 

            }}
            color={activeTab === 'agendados' ? 'white' : 'dark'}
            onClick={() => {
              setActiveTab('agendados');
              setCurrentPage(1);
            }}         
             >
            Agendados
          </MDBBtn>
        </div>
  
        {/* Conteúdo */}
        <MDBCardBody className="d-flex flex-column" style={{ flex: '1 1 auto', minHeight: '0' }}>
          {/* Cabeçalho */}
          <div className="d-flex align-items-center mb-2" style={{ marginTop: '-12px' }}>

          <MDBInput
            type="text"
            label={
              <div className="d-flex align-items-center">
                <MDBIcon fas icon="search" className="me-2" />
                Pesquisar
              </div>
            }
            value={searchTerm}
            onChange={handleSearchChange}
            className="flex-grow-1 mb-2 mt-0"
            style={{ height: '32px' }}
          />
                    </div>

          {/* Listagem */}
          <MDBListGroup light style={{ flex: '1 1 auto', overflowY: 'auto' }}>
            {currentPacientes.map((paciente, index) => (
              <PacienteRegulacaoCard
                key={index}
                paciente={paciente}
                selectedPaciente={selectedPaciente}
                handlePacienteClick={handlePacienteClick}
              />
            ))}
          </MDBListGroup>
  
          {/* Paginação */}
          {searchedPacientes.length > postsPerPage && (
            <div className="pag text-center d-flex justify-content-center mt-auto">
              <Pagination
                postsPerPage={postsPerPage}
                totalPosts={searchedPacientes.length}
                paginate={paginate}
                currentPage={currentPage}
              />
            </div>
          )}
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
  );
  
}

function QuadroFicha({ selectedPaciente, historico }) {
  const [formValue, setFormValue] = useState({
    mensagem: ''
  });

  const onChange = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  // Modais
  // Modal de devolver ao medico
  const [isModalDevolverMedicoOpen, setIsModalDevolverMedicoOpen] = useState(false);
  const toggleModalDevolverMedico = () => setIsModalDevolverMedicoOpen(!isModalDevolverMedicoOpen);
  
  // Modal Pedir Transferencia
  const [isModalPedirTransferenciaOpen, setIsModalPedirTransferenciaOpen] = useState(false);
  const toggleModalPedirTransferencia = () => setIsModalPedirTransferenciaOpen(!isModalPedirTransferenciaOpen);
  
  // Modal Agendamento
  const [isModalAgendamentoOpen, setIsModalAgendamentoOpen] = useState(false);
  const toggleModalAgendamento = () => {
    if (selectedLeito) {
      setIsModalAgendamentoOpen(!isModalAgendamentoOpen);
    } else {
      alert('Por favor, selecione um leito antes de agendar.');
    }
  };
  // Modal transferência
  const [isModalTransferenciaOpen, setIsModalTransferenciaOpen] = useState(false);
  const toggleModalTransferencia = () => setIsModalTransferenciaOpen(!isModalTransferenciaOpen);
 
  // Modal confirmar Alta Óbito
  const [isModalAltaObitoOpen, setIsModalAltaObitoOpen] = useState(false);
  const toggleModalAltaObito = () => setIsModalAltaObitoOpen(!isModalAltaObitoOpen);

  // Modal Internacao
  const [isModalInternacaoOpen, setIsModalInternacaoOpen] = useState(false);
  const toggleModalInternacao = () => setIsModalInternacaoOpen(!isModalInternacaoOpen);
    

  const [selectedLeito, setSelectedLeito] = useState(null);
  const [leitos, setLeitos] = useState([]);

  const handleSelectLeito = (leito) => {
    // Ignorar seleção se o leito estiver ocupado
    if (leito.ocupado) {
      return;
    }

    // Se o leito clicado já estiver selecionado, desmarque-o
    if (selectedLeito?.numero === leito.numero) {
      setSelectedLeito(null);
    } else {
      // Caso contrário, selecione o leito clicado
      setSelectedLeito(leito);
    }
  };

  useEffect(() => {
    const fetchLeitos = async () => {
      try {
        const response = await axios.get(`${AxiosURL}/leitos/lista/`);
        setLeitos(response.data);
        console.log(response.data);

      } catch (error) {
        console.error("Erro ao buscar os leitos:", error);
      }
    };
    fetchLeitos();
  }, []);

  const calcularDiasRestantes = (data) => {
    const hoje = new Date();
    const dataSessao = new Date(data);
    const diffTime = dataSessao - hoje;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Retorna a diferença em dias
  };

  const { data_prox_sessao = '' } = selectedPaciente || {};
  const formattedDataProxSessao = data_prox_sessao ? data_prox_sessao.split('T')[0] : '';
  const diasRestantes = calcularDiasRestantes(formattedDataProxSessao);


  
    // Botões da Direita
    const renderButtons = () => {
      switch (selectedPaciente.estagio_atual) {
        case 'ENCAMINHADO_PARA_AGENDAMENTO':
          const isDisabled = diasRestantes > 1 || !selectedLeito;
    
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MDBBtn
                onClick={toggleModalAgendamento}
                style={{ borderRadius: '8px', padding: '10px 20px' }}
                disabled={isDisabled} // Desativa se faltar mais de 1 dia ou se nenhum leito estiver selecionado
              >
                <MDBIcon fas icon="check" className="me-2" />
                AGENDAR LEITO
              </MDBBtn>
    
              {isDisabled && diasRestantes > 1 && (
            <MDBTooltip
              placement="right"
              tag="div"
              title="Só é possível agendar um leito com até 1 dia de antecedência."
            >
              <MDBIcon
                fas
                icon="info-circle"
                style={{ fontSize: '1.5em', color: 'grey' }}
              />
            </MDBTooltip>
              )}
            </div>
          );
    
        case 'AUTORIZADO_PARA_TRANSFERENCIA':
          return (
            <MDBBtn
              onClick={toggleModalTransferencia}
              style={{ borderRadius: '8px', padding: '10px 20px' }}
            >
              <MDBIcon fas icon="check" className="me-2" />
              CONFIRMAR TRANSFERÊNCIA
            </MDBBtn>
          );
    
        case 'AGENDADO':
          return (
            <MDBBtn
              color="primary"
              style={{ borderRadius: '8px', padding: '10px 20px' }}
              onClick={toggleModalInternacao}
            >
              <MDBIcon fas icon="check" className="me-2" />
              CONFIRMAR INTERNAÇÃO
            </MDBBtn>
          );
    
        default:
          return null;
      }
    };
    

  return (
  <MDBCol md='8'>
  {selectedPaciente && (
  <MDBCard style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px'}}>

    {/* Cabeçalho */}

    <CabecalhoPaciente selectedPaciente={selectedPaciente} />

    {/* Conteúdo */}

    <MDBCardBody style={{ padding: '20px' }}>
      <MDBRow>

      {/* histórico */}

      <div className="col-md-6">
      <h4 style={{ fontFamily: 'FiraSans-Medium, sans-serif' }}>Histórico</h4>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
      {historico.map((registro, index) => {
                    const { dataFormatada, horaFormatada } = formatarData(registro.criado_em);
                    return (
                      <HistoricoCard
                      key={index}
                      title={registro.estagio_atual}
                      date={dataFormatada} // Data formatada
                      time={horaFormatada} // Horário formatado
                      text={registro.mensagem}
                      first_name={registro.usuario.first_name}
                      last_name={registro.usuario.last_name}
                    />
                    );
                  })}
          
        </div>
        </div>

        {/* Dados da Solicitação */}

        <div className="col-md-6">
          <div>
          <h4 style={{ fontFamily: 'FiraSans-Medium, sans-serif' }}>Dados da Solicitação</h4>
            <MDBInput 
                    label="Próxima Sessão" 
                    id="textAreaExample" 
                    type="date" 
                    style={{  
                      fontFamily: 'FiraSans-Light, sans-serif' 
                      }}
                    className="mb-3" 
                    value={formattedDataProxSessao}
                    disabled 
                  />

            <div className="d-flex align-items-center mb-3">
              <div className="me-2">
              <MDBInput 
                        label="Nº de Sessões" 
                        id="sessoes" 
                        style={{ 
                          fontFamily: 'FiraSans-Light, sans-serif' 
                      }}
                        value={selectedPaciente.plano_terapeutico?.sessoes_prescritas || ''} 
                        disabled 
                      />
              </div>
              <div>
              <MDBInput 
                        label="Dias de intervalo" 
                        id="intervaloDias" 
                        style={{ 
                          fontFamily: 'FiraSans-Light, sans-serif' 
                      }}
                        value={selectedPaciente.plano_terapeutico?.dias_intervalo || ''} 
                        disabled 
                      />
              </div>
            </div>

            {selectedPaciente.estagio_atual === 'ENCAMINHADO_PARA_AGENDAMENTO' && (
          <>
            <h5>Leitos para amanhã</h5>
            <div className="row mt-3">
              {leitos.map((leito, id) => (
                <div key={id} className="col-md-2 mb-1">
                  <MDBIcon
                    fas
                    icon="bed"
                    style={{
                      fontSize: '30px',
                      cursor: leito.ocupado ? 'not-allowed' : 'pointer',
                      color: selectedLeito?.numero === leito.numero ? '#1E90FF' : (leito.ocupado ? '#A9A9A9' : '#14A44D'),
                    }}
                    onClick={() => handleSelectLeito(leito)}
                  />
                  <p style={{ textAlign: 'center', fontSize: '8px' }}> {leito.numero}</p>
                </div>
              ))}
            </div>
            <p>Leito selecionado: {selectedLeito ? `Leito ${selectedLeito.numero}` : ''}</p>
          </>
        )}

            <hr />

            <MDBTextArea 
                    label="Observações" 
                    id="textAreaExample" 
                    rows={2}
                    style={{ 
                      resize: 'none', 
                      fontFamily: 'FiraSans-Light, sans-serif' 
                  }}
                    name="mensagem"
                    value={formValue.mensagem} 
                    onChange={onChange}
                    maxLength="256"
                    />
          </div>
        </div>
      </MDBRow>
    </MDBCardBody>

    {/* Botões */}

    <div style={{ padding: '20px', marginTop: '10px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,.125)' }}>
    <div>
        {selectedPaciente.estagio_atual === 'ENCAMINHADO_PARA_AGENDAMENTO' && (
            <>
                <MDBBtn
                    color='secondary'
                    style={{
                        borderRadius: '8px',
                        padding: '10px 20px',
                        marginRight: '10px', // Margem entre os botões
                    }}
                    onClick={toggleModalDevolverMedico}>
                    <MDBIcon fas icon="undo-alt" className="me-2" />
                    DEVOLVER AO MÉDICO
                </MDBBtn>
                <MDBBtn
                    color='secondary'
                    style={{
                        borderRadius: '8px',
                        padding: '10px 20px',
                    }}
                    onClick={toggleModalPedirTransferencia}>
                    <MDBIcon fas icon="exchange-alt" className="me-2" />
                    SOLICITAR TRANSFERÊNCIA
                </MDBBtn>
            </>
        )}
          {selectedPaciente.estagio_atual === 'AGENDADO' && (
              <MDBBtn 
              color='secondary' 
              style={{
                borderRadius: '8px',
                padding: '10px 20px',
              }}
              onClick={toggleModalAltaObito} >
              <MDBIcon fas icon="exclamation" className="me-2" />
                ALTA ÓBITO
                </MDBBtn>
          )}
        </div>
        <div>
          {renderButtons()}
        </div>
    </div>
        </MDBCard>
 )}
    {!selectedPaciente && (
    <div className="text-center d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
      <p style={{ fontSize: '1.5rem' }}>Selecione um Paciente</p>
    </div>
    )}
  {/* Modais */}
  <ModalDevolverMedico isOpen={isModalDevolverMedicoOpen} onClose={toggleModalDevolverMedico} selectedPaciente={selectedPaciente} formValue={formValue} />
  <ModalPedirTransferencia isOpen={isModalPedirTransferenciaOpen} onClose={toggleModalPedirTransferencia} selectedPaciente={selectedPaciente} formValue={formValue} />
  <ModalAgendamento isOpen={isModalAgendamentoOpen} onClose={toggleModalAgendamento} selectedPaciente={selectedPaciente} selectedLeito={selectedLeito} formValue={formValue}/>
  <ModalTransferencia isOpen={isModalTransferenciaOpen} onClose={toggleModalTransferencia} selectedPaciente={selectedPaciente} formValue={formValue}/>
  <ModalAltaObito isOpen={isModalAltaObitoOpen} onClose={toggleModalAltaObito} selectedPaciente={selectedPaciente}/>
  <ModalInternacao isOpen={isModalInternacaoOpen} onClose={toggleModalInternacao} selectedPaciente={selectedPaciente}/>

      </MDBCol>
  )
}

function HomeRegulacao() {
  const [pacientes, setPacientes] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [activeTab, setActiveTab] = useState('pendentes');
  const [selectedPaciente, setSelectedPaciente] = useState(null);


  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await axios.get(`${AxiosURL}/pacientes/lista_regulacao/`);
        setPacientes(response.data);
      } catch (error) {
        console.error("Erro ao buscar os usuários:", error);
      }
    };
    fetchPacientes();
  }, []);

  const handlePacienteClick = async (paciente) => {
    setSelectedPaciente(paciente);
    try {
      const response = await axios.get(`${AxiosURL}/pacientes/${paciente.id}/historico_atual/`);
      setHistorico(response.data);
      console.log('Histórico do paciente:', response.data);
    } catch (error) {
      console.error('Erro ao buscar o histórico do paciente:', error);
    }
  };

  return (
    <MDBContainer fluid className='p-1 background-radial-gradient overflow-hidden d-flex justify-content-center'  style={{ minHeight: '100vh' }}>
      <MDBCard className='my-5 bg-glass max-width-card' style={{ width: '100%', maxWidth: '1200px', borderRadius: '38px' }}>
      <h2 style={{ marginTop: '15px', marginLeft: '50px', marginBottom: '-22px', fontFamily: 'FiraSans-SemiBold, sans-serif' 
 }}>Prescrições</h2>
      <MDBCardBody className='p-5'>
          <MDBRow>
          <QuadroLista
              pacientes={pacientes}
              activeTab={activeTab}
              selectedPaciente={selectedPaciente}
              handlePacienteClick={handlePacienteClick}
              setActiveTab={setActiveTab}
            />

          <QuadroFicha 
          selectedPaciente={selectedPaciente} 
          historico={historico}

          />

          </MDBRow>
        </MDBCardBody>
      </MDBCard>
      <ToastContainer />
    </MDBContainer>
  );
}

export default HomeRegulacao;