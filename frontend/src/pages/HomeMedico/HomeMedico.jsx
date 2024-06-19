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
import './HomeMedico.css';
import Pagination from '../../components/Pagination/Pagination';
import PacienteCardMedico from '../../components/Cards/PacienteCardMedico';
import HistoricoCard from '../../components/Cards/HistoricoCard';
import CabecalhoPaciente from '../../components/Ficha/CabecalhoPaciente';
import formatarData from '../../utils/FormatarData';


function ModalNovaPrescricao({ isOpen, onClose }) {
  const [prontuario, setProntuario] = useState('');

  const handleClose = () => {
    if (isOpen) {
      onClose();
    }
  };

  const handleChange = (event) => {
    setProntuario(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('prontuario', prontuario);
    
    try {
      const response = await axios.post('http://localhost:8000/criar_prescricao/', formData);
      if (response.status === 200) {
        window.location.href = '/prescricoes';
      }
    } catch (error) {
      console.error('Erro ao criar prescrição:', error);
    }
  };

  return (
    <MDBModal open={isOpen} onClose={handleClose} tabIndex='-1' appendToBody>
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>Nova Prescrição</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={handleClose}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>

          <MDBInput label="Prontuário do Paciente" id="prontuario" type="text" value={prontuario} onChange={handleChange} />

          </MDBModalBody>
          <MDBModalFooter>
          <MDBBtn onClick={handleSubmit}>Criar</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}

function ModalEnviarFarmacia({ isOpen, onClose }) {
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
            <MDBModalTitle>Confirmação envio para farmácia</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={handleClose}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>

          A prescrição será encaminhada para a farmácia

          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color='danger'>Cancelar</MDBBtn>
            <MDBBtn>Encaminhar</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}

function ModalAltaObito({ isOpen, onClose }) {
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
            <MDBModalTitle>Confirmação de Alta Óbito</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={handleClose}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>

          Confirme que o paciente está recebendo alta

          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color='danger'>Cancelar</MDBBtn>
            <MDBBtn>Confirmar Alta</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}

function ModalAltaNormal({ isOpen, onClose }) {
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
            <MDBModalTitle>Confirmação de Alta Normal</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={handleClose}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>

          Confirme que o paciente está recebendo alta

          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color='danger'>Cancelar</MDBBtn>
            <MDBBtn>Confirmar Alta</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}

function ModalAltaDefinitiva({ isOpen, onClose }) {
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
            <MDBModalTitle>Confirmação de Alta Definitiva</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={handleClose}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>

          Confirme que o paciente está recebendo alta

          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color='danger'>Cancelar</MDBBtn>
            <MDBBtn>Confirmar Alta</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}

function ModalTransferencia({ isOpen, onClose }) {
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
            <MDBModalTitle>Confirmação de Transferência</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={handleClose}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>

          Autorização para a regulação confirmar transferência

          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color='danger'>Cancelar</MDBBtn>
            <MDBBtn>Autorizar transferência</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}


function QuadroLista({ pacientes, activeTab, selectedPaciente, handlePacienteClick, setActiveTab }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5); // Quantidade de usuários por página
  const [searchTerm, setSearchTerm] = useState(''); // Estado para o termo de pesquisa

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  const filteredPacientes = pacientes.filter(paciente => 
    activeTab === 'pendentes' ? 
      ['PRESCRICAO_CRIADA', 
      'DEVOLVIDO_PELA_FARMACIA',
      'ALTA_NORMAL',  
      'DEVOLVIDO_PELA_REGULACAO']
      .includes(paciente.estagio_atual) 
      : 
      paciente.estagio_atual === 'INTERNADO'
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

 const searchedPacientes = filteredPacientes.filter(paciente => {
    if (/^\d+$/.test(searchTerm)) {
      return paciente.prontuario.includes(searchTerm);
    }
    return paciente.nome.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const currentPacientes = searchedPacientes.slice(indexOfFirstPost, indexOfLastPost);


  // Modal
  const [basicModal, setBasicModal] = useState(false);

  const toggleOpen = () => setBasicModal(!basicModal);

  return (
    <MDBCol md='4'>
      <MDBCard className='mb-4' style={{ borderTopLeftRadius: '30px', borderTopRightRadius: '30px', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px'}}>
         {/* Botões das Abas */}
        <div className="text-center mb-4">
          <MDBBtn className="w-50" style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '0px', borderBottomRightRadius: '0px', borderBottomLeftRadius: '0px' }} color={activeTab === 'pendentes' ? 'light' : 'dark'} rippleColor='dark' onClick={() => setActiveTab('pendentes')}>
            Pendentes
          </MDBBtn>
          <MDBBtn className="w-50" style={{ borderTopLeftRadius: '0px', borderTopRightRadius: '20px', borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px' }} color={activeTab === 'internados' ? 'light' : 'dark'} onClick={() => setActiveTab('internados')}>
            Internados
          </MDBBtn>
        </div>

        {/* Conteúdo */}
        <MDBCardBody>
          {/* Cabeçalho */}

          <div className="d-flex align-items-center mb-3">
          <MDBInput type="text" label="Pesquisar" value={searchTerm} onChange={handleSearchChange} className="flex-grow-1" style={{ height: '40px' }} />
          <MDBBtn
              onClick={toggleOpen}
              className="ms-2 d-flex justify-content-center align-items-center btn-sm"
              style={{
                minWidth: '40px',
                height: '40px',
                margin: '0',
              }}
              color="dark"
            >
               <MDBIcon fas icon="plus" />
            </MDBBtn>
          </div>
          
          <MDBListGroup light>

          {/* Listagem */}

          {currentPacientes.map((paciente) => (
              <PacienteCardMedico
                key={paciente.id}
                paciente={paciente}
                selectedPaciente={selectedPaciente}
                handlePacienteClick={handlePacienteClick}
              />
            ))}

          </MDBListGroup>
          {filteredPacientes.length > postsPerPage && (
            <div className="pag">
              <Pagination
                postsPerPage={postsPerPage}
                totalPosts={searchedPacientes.length}
                paginate={paginate}
              />
            </div>
          )}
        </MDBCardBody>
      </MDBCard>
      <ModalNovaPrescricao isOpen={basicModal} onClose={toggleOpen} />
    </MDBCol>
  );
}


function QuadroFicha({ selectedPaciente, historico }) {
  // Modais
  // Modal de Envio para farmácia
  const [isModalEnviarFarmaciaOpen, setIsModalEnviarFarmaciaOpen] = useState(false);
  const toggleModalEnviarFarmacia = () => setIsModalEnviarFarmaciaOpen(!isModalEnviarFarmaciaOpen);
  
  // Modal confirmar Alta Normal
  const [isModalAltaNormalOpen, setIsModalAltaNormalOpen] = useState(false);
  const toggleModalAltaNormal = () => setIsModalAltaNormalOpen(!isModalAltaNormalOpen);

  // Modal confirmar Alta Definitiva
  const [isModalAltaDefinitivaOpen, setIsModalAltaDefinitivaOpen] = useState(false);
  const toggleModalAltaDefinitiva = () => setIsModalAltaDefinitivaOpen(!isModalAltaDefinitivaOpen);

  // Modal confirmar Alta Óbito
  const [isModalAltaObitoOpen, setIsModalAltaObitoOpen] = useState(false);
  const toggleModalAltaObito = () => setIsModalAltaObitoOpen(!isModalAltaObitoOpen);

  // Modal confirmar transferência
  const [isModalTransferenciaOpen, setIsModalTransferenciaOpen] = useState(false);
  const toggleModalTransferencia = () => setIsModalTransferenciaOpen(!isModalTransferenciaOpen);


  // Botões da Direita
  const renderButtons = () => {
    switch (selectedPaciente.estagio_atual) {
      case 'PRESCRICAO_CRIADA':
      case 'DEVOLVIDO_PELA_FARMACIA':
        return <MDBBtn style={{ marginLeft: '10px' }} onClick={toggleModalEnviarFarmacia} >ENVIAR</MDBBtn>;
      case 'ALTA_NORMAL':
        return (
          <>
            <div>
              <MDBBtn style={{ marginLeft: '10px' }} onClick={toggleModalEnviarFarmacia} >ENVIAR</MDBBtn>
            </div>
          </>
        );
      case 'DEVOLVIDO_PELA_REGULACAO':
        return <MDBBtn onClick={toggleModalTransferencia} >AUTORIZAR TRANSFERÊNCIA</MDBBtn>;
      case 'INTERNADO':
        return (
          <>
            <div>
              <MDBBtn color='primary'onClick={toggleModalAltaNormal}>ALTA NORMAL</MDBBtn>
            </div>
          </>
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
      <h4>Histórico</h4>
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
                      />
                    );
                  })}
        </div>
        </div>

        {/* Dados da Solicitação */}

        <div className="col-md-6">
          <div>
            <h4>Dados da Solicitação</h4>
            <MDBTextArea label="Medicamentos" id="textAreaExample" rows={4} className="mb-3" />
            <MDBInput label="Data de Entrada" id="textAreaExample" type="date" className="mb-3"/>

            <div className="d-flex align-items-center mb-3">
              <div className="me-2">
                <MDBInput label="Nº de Sessões" id="sessoes" />
              </div>
              <div>
                <MDBInput label="Dias de intervalo" id="intervaloDias" />
              </div>
            </div>

            <hr />

            <MDBTextArea label="Observações" id="textAreaExample" rows={4}/>
          </div>
        </div>
      </MDBRow>
    </MDBCardBody>

    {/* Botões */}

    <div style={{ padding: '20px', marginTop: '10px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,.125)' }}>
            <div>
              {selectedPaciente.estagio_atual === 'ALTA_NORMAL' && (
                <MDBBtn color='success' style={{ marginLeft: '10px' }}>CRIAR PRESCRIÇÃO</MDBBtn>
              )}
              {selectedPaciente.estagio_atual === 'INTERNADO' && (
                <>
                  <MDBBtn color='warning' style={{ marginLeft: '10px' }}onClick={toggleModalAltaDefinitiva}>ALTA DEFINITIVA</MDBBtn>
                  <MDBBtn color='danger' style={{ marginLeft: '10px' }} onClick={toggleModalAltaObito}>ALTA ÓBITO</MDBBtn>
                </>
              )}
            </div>
            <div>
            {renderButtons()}
            </div>
          </div>

        </MDBCard>
 )}
    {!selectedPaciente && (
      <div className="text-center">
        <p style={{ fontSize: '1.5rem' }}> Selecione um Usuário</p>
      </div>
    )}

       {/* Modais */}
       <ModalEnviarFarmacia isOpen={isModalEnviarFarmaciaOpen} onClose={toggleModalEnviarFarmacia} />
       <ModalAltaObito isOpen={isModalAltaObitoOpen} onClose={toggleModalAltaObito} />
       <ModalAltaNormal isOpen={isModalAltaNormalOpen} onClose={toggleModalAltaNormal} />
       <ModalAltaDefinitiva isOpen={isModalAltaDefinitivaOpen} onClose={toggleModalAltaDefinitiva} />
       <ModalTransferencia isOpen={isModalTransferenciaOpen} onClose={toggleModalTransferencia} />

       </MDBCol>
  )
}

function HomeMedico() {
  const [pacientes, setPacientes] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [activeTab, setActiveTab] = useState('pendentes');
  const [selectedPaciente, setSelectedPaciente] = useState(null);


  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await axios.get('http://localhost:8000/pacientes/lista_medico/');
        setPacientes(response.data);
        console.log("Lista de pacientes:", response.data);
      } catch (error) {
        console.error("Erro ao buscar os usuários:", error);
      }
    };
    fetchPacientes();
  }, []);

  const handlePacienteClick = async (paciente) => {
    setSelectedPaciente(paciente);
    try {
      const response = await axios.get(`http://localhost:8000/pacientes/${paciente.id}/historico_atual/`);
      setHistorico(response.data);
      console.log('Histórico do paciente:', response.data);
    } catch (error) {
      console.error('Erro ao buscar o histórico do paciente:', error);
    }
  };

  return (
    <MDBContainer fluid className='p-1 background-radial-gradient overflow-hidden d-flex justify-content-center'  style={{ minHeight: '100vh' }}>
      <MDBCard className='my-5 bg-glass max-width-card' style={{ width: '100%', maxWidth: '1200px' }}>
      <h2 style={{ marginTop: '10px', marginLeft: '10px', marginBottom: '-8px' }}>Acompanhamento</h2>
      <hr style={{ marginBottom: '10px' }} />
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

    </MDBContainer>
  );
}

export default HomeMedico;