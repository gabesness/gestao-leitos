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
import { ToastContainer, toast } from 'react-toastify';
import { AxiosURL } from '../../axios/Config';
import 'react-toastify/dist/ReactToastify.css';


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

  const CriarPrescricao = async (event) => {
    event.preventDefault();
    
    try {
      const response = await axios.patch(`${AxiosURL}/prescricoes/${prontuario}/criar_prescricao/`, {
        id_usuario: localStorage.getItem('idUser'),
      });
      if (response.status === 200) {
        toast.success(response.data.OK);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } 

    } catch (error) {
      console.error('Erro ao criar prescrição:', error);
      toast.error(error.response.data.erro);
    }
  };

  return (
    <MDBModal open={isOpen} onClose={handleClose} tabIndex='-1' appendToBody>
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
          <MDBModalTitle style={{ fontFamily: 'FiraSans-Medium, sans-serif' }}>
            Nova Prescrição
          </MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={handleClose}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody style={{ fontFamily: 'FiraSans-Light, sans-serif' }}>

          <MDBInput style={{ fontFamily: 'FiraSans-Light, sans-serif' }} label="Prontuário do Paciente" id="prontuario" type="text" value={prontuario} onChange={handleChange} maxLength="256" />

          </MDBModalBody>
          <MDBModalFooter>
          <MDBBtn onClick={CriarPrescricao}>Criar</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
      <ToastContainer />
    </MDBModal>
  );
}

function ModalEnviarFarmacia({ isOpen, onClose, onSubmit }) {
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
            <MDBModalTitle style={{ fontFamily: 'FiraSans-Medium, sans-serif' }}>Confirmação de encaminhamento</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={handleClose}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody style={{ fontFamily: 'FiraSans-Light, sans-serif' }}>

          A prescrição será encaminhada para a farmácia

          </MDBModalBody>
          <MDBModalFooter>
          <MDBBtn color='danger' onClick={handleClose}>Cancelar</MDBBtn>
          <MDBBtn onClick={onSubmit}>Encaminhar</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
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
            <MDBModalTitle style={{ fontFamily: 'FiraSans-Medium, sans-serif' }}>Confirmação de Alta Óbito</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={handleClose}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody style={{ fontFamily: 'FiraSans-Light, sans-serif' }}>

          Confirme que o paciente está recebendo alta

          </MDBModalBody>
          <MDBModalFooter>
          <MDBBtn color='danger' onClick={handleClose}>Cancelar</MDBBtn>
          <MDBBtn onClick={handleAltaObito} >Confirmar Alta</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
      <ToastContainer />
    </MDBModal>
  );
}

function ModalAltaNormal({ isOpen, onClose, selectedPaciente }) {
  
  const handleAltaNormal = async () => {
    if (!selectedPaciente) return;

    try {
      const response = await axios.patch(`${AxiosURL}/prescricoes/${selectedPaciente.id}/dar_alta/0/`, {
        id_usuario: localStorage.getItem('idUser'),
      });
      toast.success(response.data.OK);
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
            <MDBModalTitle style={{ fontFamily: 'FiraSans-Medium, sans-serif' }}>Confirmação de Alta Normal</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={handleClose}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody style={{ fontFamily: 'FiraSans-Light, sans-serif' }}>
            Confirme que o paciente está recebendo alta normal
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color='danger' onClick={handleClose}>Cancelar</MDBBtn>
            <MDBBtn onClick={handleAltaNormal}>Confirmar Alta</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}

function ModalAltaDefinitiva({ isOpen, onClose, selectedPaciente }) {
  
  const handleAltaDefinitiva = async () => {
    try {
      const response = await axios.patch(`${AxiosURL}/prescricoes/${selectedPaciente.id}/dar_alta/1/`, {
        id_usuario: localStorage.getItem('idUser'),
      });
      toast.success(response.data.OK);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Erro ao autorizar transferência:", error);
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
            <MDBModalTitle style={{ fontFamily: 'FiraSans-Medium, sans-serif' }}>Confirmação de Alta Definitiva</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={handleClose}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody style={{ fontFamily: 'FiraSans-Light, sans-serif' }}>

          Confirme que o paciente está recebendo alta definitiva

          </MDBModalBody>
          <MDBModalFooter>
          <MDBBtn color='danger' onClick={handleClose}>Cancelar</MDBBtn>
          <MDBBtn onClick={handleAltaDefinitiva} >Confirmar Alta</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}

function ModalTransferencia({ isOpen, onClose, selectedPaciente, formValue }) {
  
  const handleAuthorizeTransfer = async () => {
    if (!selectedPaciente) return;

    try {
      const response = await axios.patch(`${AxiosURL}/prescricoes/${selectedPaciente.id}/autorizar_transferencia/`, {
        id_usuario: localStorage.getItem('idUser'),
        mensagem: formValue.mensagem  // Incluir a mensagem no corpo da requisição
      });
      toast.success('Autorização de transferência encaminhada à regulação');
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
            <MDBModalTitle style={{ fontFamily: 'FiraSans-Medium, sans-serif' }}>Confirmação de Transferência</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={handleClose}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody style={{ fontFamily: 'FiraSans-Light, sans-serif' }}>

          Autorização para a regulação confirmar transferência

          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color='danger' onClick={handleClose}>Cancelar</MDBBtn>
            <MDBBtn onClick={handleAuthorizeTransfer}>Autorizar transferência</MDBBtn>
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
              boxShadow: 'none', // Remove a sombra
              color: activeTab === 'pendentes' ? '#000000' : '#6c757d', // Texto normal quando ativado, cinza quando desativado
              backgroundColor: activeTab === 'pendentes' ? 'white' : '#D3D3D3', // Ajuste a cor de fundo para corresponder ao estado ativo/desativado
              fontFamily: 'FiraSans-Medium, sans-serif' 

            }}
            color={activeTab === 'pendentes' ? 'white' : 'dark'}
            onClick={() => setActiveTab('pendentes')}
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
              boxShadow: 'none', // Remove a sombra
              color: activeTab === 'internados' ? '#000000' : '#6c757d', // Texto normal quando ativado, cinza quando desativado
              backgroundColor: activeTab === 'internados' ? 'white' : '#D3D3D3', // Ajuste a cor de fundo para corresponder ao estado ativo/desativado
              fontFamily: 'FiraSans-Medium, sans-serif' 
            }}
            color={activeTab === 'internados' ? 'white' : 'dark'}
            onClick={() => setActiveTab('internados')}
          >
            Internados
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
              className="flex-grow-1"
              style={{ height: '40px'}}
              maxLength="256"
            />
            
            <MDBBtn
              onClick={toggleOpen}
              className="ms-2 d-flex justify-content-center align-items-center btn-sm"
              style={{
                minWidth: '40px',
                height: '40px',
                margin: '0',
              }}
              color="primary"
            >
              <MDBIcon fas icon="plus" style={{ fontSize: '16px' }} />
            </MDBBtn>
          </div>
  
          <MDBListGroup light style={{ flex: '1 1 auto', overflowY: 'auto' }}>
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
            <div className="pag text-center d-flex justify-content-center mt-auto">
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

  const [isPrescricaoCriada, setIsPrescricaoCriada] = useState(false);

  useEffect(() => {
    if (selectedPaciente && 
      (selectedPaciente.estagio_atual === 'PRESCRICAO_CRIADA' || 
       selectedPaciente.estagio_atual === 'DEVOLVIDO_PELA_FARMACIA')) {
      setIsPrescricaoCriada(true);
    } else {
      setIsPrescricaoCriada(false);
    }
  }, [selectedPaciente]);


  // Botões da Direita
  const renderButtons = () => {
    switch (selectedPaciente.estagio_atual) {
      case 'PRESCRICAO_CRIADA':
      case 'DEVOLVIDO_PELA_FARMACIA':
        return <MDBBtn style={{ marginLeft: '10px' }} onClick={toggleModalEnviarFarmacia} disabled={!isPrescricaoCriada || !isFormValid()} >ENCAMINHAR À FARMÁCIA</MDBBtn>;
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


  // Envio da prescrição

  const [formValue, setFormValue] = useState({
    sessoes_prescritas: '',
    dias_intervalo: '',
    data_sugerida: '',
    medicamentos: '',
    mensagem: ''
  });

  const isFormValid = () => {
    const sessoesPrescritasValida = formValue.sessoes_prescritas !== '' && !isNaN(Number(formValue.sessoes_prescritas));
    const diasIntervaloValido = formValue.dias_intervalo !== '' && !isNaN(Number(formValue.dias_intervalo));

    return (
      formValue.medicamentos.trim() !== '' &&
      formValue.data_sugerida.trim() !== '' &&
      sessoesPrescritasValida &&
      diasIntervaloValido
    );
  };

  useEffect(() => {
    if (selectedPaciente && selectedPaciente.plano_terapeutico) {
      setFormValue({
        sessoes_prescritas: selectedPaciente.plano_terapeutico.sessoes_prescritas || '',
        dias_intervalo: selectedPaciente.plano_terapeutico.dias_intervalo || '',
        data_sugerida: selectedPaciente.plano_terapeutico.data_sugerida || '',
        medicamentos: selectedPaciente.plano_terapeutico.medicamentos || '',
        mensagem: ''
      });
    }
  }, [selectedPaciente]);


  const onChange = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  async function EncaminharPaciente(event) {
    event.preventDefault();
    
    try {
      const response = await axios.patch(`${AxiosURL}/prescricoes/${selectedPaciente.id}/encaminhar_farmacia/`, {
        plano_terapeutico: {
          sessoes_prescritas: formValue.sessoes_prescritas,
          dias_intervalo: formValue.dias_intervalo,
          data_sugerida: formValue.data_sugerida,
          medicamentos: formValue.medicamentos,
        },
        mensagem: formValue.mensagem,
        id_usuario: localStorage.getItem('idUser'),
      });
      if (response.status === 200) {
        toast.success('Prescrição encaminhada à farmácia');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error('Erro ao encaminhar para farmácia', error);
      toast.error(error.response.data.Erro);

    }
  }

  const CriarSegundaPrescricao = async (event) => {
    event.preventDefault();
  
    try {
      const response = await axios.patch(`${AxiosURL}/prescricoes/${selectedPaciente.prontuario}/criar_prescricao/`, {
        id_usuario: localStorage.getItem('idUser'),
      });
      if (response.status === 200) {
        toast.success(response.data.OK);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error('Erro ao criar prescrição:', error);
      toast.error(error.response.data.erro);
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
      <div style={{ height: '360px', overflowY: 'auto' }}>
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
          <MDBTextArea 
            label="Medicamentos" 
            id="textAreaExample" 
            rows={4} 
            style={{ 
                resize: 'none', 
                fontFamily: 'FiraSans-Light, sans-serif' 
            }}
            className="mb-3"
            name="medicamentos"
            value={formValue.medicamentos} 
            onChange={onChange}
            maxLength="256"
            disabled={!isPrescricaoCriada}  
        />
            
            <MDBInput 
                    label="Data de Entrada" 
                    id="textAreaExample" 
                    type="date" 
                    style={{  
                      fontFamily: 'FiraSans-Light, sans-serif' 
                      }}
                    className="mb-3"
                    name="data_sugerida"
                    value={formValue.data_sugerida} 
                    onChange={onChange}
                    min={new Date().toISOString().split("T")[0]}
                    disabled={!isPrescricaoCriada}  
                    />

            <div className="d-flex align-items-center mb-3">
              <div className="me-2">
              <MDBInput 
                        label="Nº de Sessões" 
                        id="sessoes"
                        name="sessoes_prescritas"
                        type="number" 
                        style={{ 
                          fontFamily: 'FiraSans-Light, sans-serif' 
                      }}
                        value={formValue.sessoes_prescritas} 
                        onChange={onChange}
                        disabled={!isPrescricaoCriada}  
                        maxLength="5"
                        />
              </div>
              <div>
              <MDBInput 
                        label="Dias de intervalo" 
                        id="intervaloDias"
                        name="dias_intervalo"
                        type="number" 
                        style={{ 
                          fontFamily: 'FiraSans-Light, sans-serif' 
                      }}
                        value={formValue.dias_intervalo} 
                        onChange={onChange}
                        disabled={!isPrescricaoCriada}  
                        maxLength="5"
                        />
              </div>
            </div>

            <hr />

            <MDBTextArea 
                    label="Observações" 
                    id="textAreaExample" 
                    rows={4}
                    style={{ 
                      resize: 'none', 
                      fontFamily: 'FiraSans-Light, sans-serif' 
                  }}
                    name="mensagem"
                    value={formValue.mensagem} 
                    onChange={onChange}
                    maxLength="256"
                    disabled={!isPrescricaoCriada}  
                    />
          </div>
        </div>
      </MDBRow>
    </MDBCardBody>

    {/* Botões */}

    <div style={{ padding: '20px', marginTop: '10px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,.125)' }}>
            <div>
              {selectedPaciente.estagio_atual === 'ALTA_NORMAL' && (
                <>
                <MDBBtn color='success' style={{ marginLeft: '10px' }} onClick={CriarSegundaPrescricao}>INICIAR NOVA SESSÃO</MDBBtn>
              </>
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
      <div className="text-center d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <p style={{ fontSize: '1.5rem' }}>Selecione um Paciente</p>
      </div>
    )}

       {/* Modais */}
       <ModalEnviarFarmacia isOpen={isModalEnviarFarmaciaOpen} onClose={toggleModalEnviarFarmacia} onSubmit={EncaminharPaciente} />
       <ModalAltaObito isOpen={isModalAltaObitoOpen} onClose={toggleModalAltaObito} selectedPaciente={selectedPaciente}/>
       <ModalAltaNormal isOpen={isModalAltaNormalOpen} onClose={toggleModalAltaNormal} selectedPaciente={selectedPaciente}/>
       <ModalAltaDefinitiva isOpen={isModalAltaDefinitivaOpen} onClose={toggleModalAltaDefinitiva} selectedPaciente={selectedPaciente}/>
       <ModalTransferencia isOpen={isModalTransferenciaOpen} onClose={toggleModalTransferencia} selectedPaciente={selectedPaciente} formValue={formValue} />

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
        const response = await axios.get(`${AxiosURL}/pacientes/lista_medico/`);
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
      <h2 style={{ 
        marginTop: '15px', 
        marginLeft: '50px', 
        marginBottom: '-22px', 
        fontFamily: 'FiraSans-SemiBold, sans-serif' 
      }}>
        Acompanhamento
      </h2>
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

export default HomeMedico;