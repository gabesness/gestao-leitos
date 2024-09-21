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
  MDBDropdownToggle
}
from 'mdb-react-ui-kit';
import './HomeAdm.css';
import Pagination from '../../components/Pagination/Pagination';
import UsuarioCard from '../../components/Cards/UsuarioCard';
import HistoricoCard from '../../components/Cards/HistoricoCard';
import CabecalhoUsuario from '../../components/Ficha/CabecalhoUsuario';
import { ToastContainer, toast } from 'react-toastify';
import { AxiosURL } from '../../axios/Config';


function ModalNovoUsuario({ isOpen, onClose }) {
  const [selectedCargo, setSelectedCargo] = useState('Selecione o Cargo');

  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    username: ''
  });

  const handleSelectCargo = (cargo) => {
    setSelectedCargo(cargo);
  };

  const handleClose = () => {
    if (isOpen) {
      onClose();
    }
  };

 const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value
    });
  };

  const cargoMap = {
    'Médico': 1,
    'Farmácia': 2,
    'Administrador': 3,
    'Regulação': 4,
    'Recepcionista': 5,
  };

  const CriarUsuario = async (event) => {
    event.preventDefault();
    
    try {
      const response = await axios.post(`${AxiosURL}/usuarios/criar_usuario/`, {
        username: formData.username,
        first_name: formData.nome,
        last_name: formData.sobrenome,
        email: formData.email,
        groups: [cargoMap[selectedCargo]],
      });
      if (response.status === 204) {
      toast.success(response.data.OK);

      }

    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      toast.error(error.response.data.erro);
    }
  };

  return (
    <MDBModal open={isOpen} onClose={handleClose} tabIndex='-1' appendToBody>
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle style={{ fontFamily: 'FiraSans-Medium, sans-serif' }}>Novo Usuário</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={handleClose}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody style={{ fontFamily: 'FiraSans-Light, sans-serif' }}>
            <div style={{ marginBottom: '15px' }}>
              <MDBInput label="Nome" id="nome" type="text" onChange={handleChange} maxLength="256" />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <MDBInput label="Sobrenome" id="sobrenome" type="text" onChange={handleChange} maxLength="256" />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <MDBInput label="Email" id="email" type="text" onChange={handleChange} maxLength="256" />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <MDBInput label="Username" id="username" type="text" onChange={handleChange} maxLength="256" />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <MDBDropdown>
                <MDBDropdownToggle
                style={{
                  borderRadius: '8px',
                  padding: '10px 20px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease-in-out',
                  width: '100%'
                }}
                >{selectedCargo}</MDBDropdownToggle>
                <MDBDropdownMenu style={{ width: '100%' }}>
                <MDBDropdownItem link onClick={() => handleSelectCargo('Médico')}>Médico</MDBDropdownItem>
                <MDBDropdownItem link onClick={() => handleSelectCargo('Farmácia')}>Farmácia</MDBDropdownItem>
                <MDBDropdownItem link onClick={() => handleSelectCargo('Regulação')}>Regulação</MDBDropdownItem>
                <MDBDropdownItem link onClick={() => handleSelectCargo('Recepcionista')}>Recepcionista</MDBDropdownItem>
                <MDBDropdownItem link onClick={() => handleSelectCargo('Administrador')}>Administrador</MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            </div>
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn onClick={CriarUsuario}
             style={{
              borderRadius: '8px',
              padding: '10px 20px',
            }}
            >Criar</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
      <ToastContainer />
    </MDBModal>
  );
}

function QuadroLista({ usuarios, activeTab, selectedUser, handleUserClick, setActiveTab }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(7); // Quantidade de usuários por página
  const [searchTerm, setSearchTerm] = useState(''); // Estado para o termo de pesquisa

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  const filteredUsuarios = usuarios.filter(usuario => 
    activeTab === 'ativos' ? usuario.is_active === true : usuario.is_active === false
  );

  const searchedUsuarios = filteredUsuarios.filter(usuario => {
    return usuario.first_name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const currentUsuarios = searchedUsuarios
    .filter(usuario => usuario.id !== 1) // Filtra o usuário com id = 1
    .slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
          display: 'flex',
          flexDirection: 'column',
        }}
      >
          {/* Botões Ativos/Inativos */}
          <div className="text-center mb-2">
          <MDBBtn
            className="w-50"
            style={{
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '0px',
              borderBottomRightRadius: '0px',
              borderBottomLeftRadius: '0px',
              boxShadow: 'none',
              color: activeTab === 'ativos' ? '#000000' : '#6c757d',
              backgroundColor: activeTab === 'ativos' ? 'white' : '#D3D3D3',
              fontFamily: 'FiraSans-Medium, sans-serif',
            }}
            color={activeTab === 'ativos' ? 'white' : 'dark'}
            onClick={() => {
              setActiveTab('ativos');
              setCurrentPage(1);
            }}
          >
            <MDBIcon fas icon="user-friends" className="me-2" />
            Ativos
          </MDBBtn>

          <MDBBtn
            className="w-50"
            style={{
              borderTopLeftRadius: '0px',
              borderTopRightRadius: '20px',
              borderBottomLeftRadius: '0px',
              borderBottomRightRadius: '0px',
              boxShadow: 'none',
              color: activeTab === 'inativos' ? '#000000' : '#6c757d',
              backgroundColor: activeTab === 'inativos' ? 'white' : '#D3D3D3',
              fontFamily: 'FiraSans-Medium, sans-serif',
            }}
            color={activeTab === 'inativos' ? 'white' : 'dark'}
            onClick={() => {
              setActiveTab('inativos');
              setCurrentPage(1);
            }}
          >
          <MDBIcon fas icon="user-alt-slash" className="me-2" />
            Inativos
          </MDBBtn>
        </div>
        {/* Conteúdo */}
        <MDBCardBody
          className="d-flex flex-column"
          style={{ flex: '1 1 auto', minHeight: '0' }}
        >          {/* Cabeçalho */}
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
              <MDBIcon fas icon="user-plus" style={{ fontSize: '16px' }} />
            </MDBBtn>
          </div>
  
          {/* Listagem */}
          <MDBListGroup light style={{ flex: '1 1 auto', overflowY: 'auto' }}>
            {currentUsuarios.map((usuario, index) => (
              <UsuarioCard
                key={index}
                user={usuario}
                selectedUser={selectedUser}
                handleUserClick={handleUserClick}
              />
            ))}
          </MDBListGroup>
  
          {/* Paginação */}
          {usuarios.length > postsPerPage && (
            <div className="pag text-center d-flex justify-content-center mt-auto">
              <Pagination
                postsPerPage={postsPerPage}
                totalPosts={searchedUsuarios.length}
                paginate={paginate}
                currentPage={currentPage}
              />
            </div>
          )}
        </MDBCardBody>
      </MDBCard>
      <ModalNovoUsuario isOpen={basicModal} onClose={toggleOpen} />
    </MDBCol>
  );
  
}

function QuadroFicha({ selectedUser }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (selectedUser) {
      setFirstName(selectedUser.first_name || '');
      setLastName(selectedUser.last_name || '');
      setEmail(selectedUser.email || '');
    }
  }, [selectedUser]);

  const GerarSenha = async (event) => {
    event.preventDefault();
    
    try {
      const response = await axios.patch(`${AxiosURL}/usuarios/${selectedUser.id}/gerar_senha/`);
      
      if (response.status === 200) {
        toast.success(response.data.OK);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error('Erro ao criar senha:', error);
      toast.error(error.response?.data?.erro || 'Erro desconhecido');
    }
  };

  const EditarUsuario = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.patch(`${AxiosURL}/usuarios/${selectedUser.id}/editar_usuario/`, {
        first_name: firstName,
        last_name: lastName,
        email: email,
      });

      if (response.status === 200) {
        toast.success(response.data.OK);
        setTimeout(() => {
         window.location.reload();
         }, 2000);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.erro || 'Erro desconhecido');
    }
  };

  const DesativarUsuario = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.patch(`${AxiosURL}/usuarios/${selectedUser.id}/desativar_usuario/`);

      if (response.status === 200) {
        toast.success('Usuário desativado com sucesso!');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error('Erro ao desativar usuário:', error);
      toast.error(error.response?.data?.erro || 'Erro desconhecido');
    }
  };
  

  const ReativarUsuario = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.patch(`${AxiosURL}/usuarios/${selectedUser.id}/reativar_usuario/`);

      if (response.status === 200) {
        toast.success('Usuário reativado com sucesso!');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error('Erro ao reativar usuário:', error);
      toast.error(error.response?.data?.erro || 'Erro desconhecido');
    }
  };


  return (
    <MDBCol md='8'>
      {selectedUser && (
      <MDBCard style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px', height: '610px'}}>
  
          {/* Cabeçalho */}
  
          <CabecalhoUsuario selectedUser={selectedUser} />
  
          {/* Conteúdo */}
  
          <MDBCardBody style={{ padding: '20px' }}>
            <MDBRow>
  
              <div>
                <h4>Informações do Usuário</h4>
                <MDBInput
                  label="Nome"
                  id="nome"
                  className="mb-3"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  maxLength="256"
                />
                <MDBInput
                  label="Sobrenome"
                  id="sobrenome"
                  className="mb-3"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  maxLength="256"
                />
                <MDBInput
                  label="E-mail"
                  id="email"
                  className="mb-3"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength="256"
                />
              </div>
            </MDBRow>
          </MDBCardBody>
  
          {/* Botões */}
  
          <div style={{ padding: '20px', marginTop: '10px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,.125)' }}>
            {selectedUser.is_active ? (
              <>
             <MDBBtn
              style={{
                borderRadius: '8px',
                padding: '10px 20px',
              }}
             color='secondary' 
             onClick={DesativarUsuario}>
                <MDBIcon fas icon="user-times" className="me-2" />
                DESATIVAR USUÁRIO
              </MDBBtn>

                <MDBBtn 
                 style={{
                  borderRadius: '8px',
                  padding: '10px 20px',
                }}
                color='secondary' 
                onClick={GerarSenha}>
                <MDBIcon fas icon="key" className="me-2" />
                  RECUPERAR SENHA
                </MDBBtn>
                
                <MDBBtn 
                 style={{
                  borderRadius: '8px',
                  padding: '10px 20px',
                }}
                color='secondary' 
                onClick={EditarUsuario}>
                <MDBIcon fas icon="check" className="me-2" />
                  SALVAR ALTERAÇÕES
                </MDBBtn>
              </>
            ) : (
              <MDBBtn 
              style={{
                borderRadius: '8px',
                padding: '10px 20px',
              }}
              color='secondary' 
              onClick={ReativarUsuario}>
               <MDBIcon fas icon="user-check" className="me-2" />
                REATIVAR USUÁRIO
              </MDBBtn>
            )}
          </div>
          
        </MDBCard>
      )}
      {!selectedUser && (
        <div className="text-center d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
          <p style={{ fontSize: '1.5rem' }}>Selecione um Usuário</p>
        </div>
      )}
    <ToastContainer />
    </MDBCol>
  )
  
}

function HomeAdm() {
  const [usuarios, setUsuarios] = useState([]);
  const [activeTab, setActiveTab] = useState('ativos');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get(`${AxiosURL}/usuarios/lista/`);

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
    <MDBContainer fluid className='p-1 background-radial-gradient overflow-hidden d-flex justify-content-center'  style={{ minHeight: '100vh' }}>
      <MDBCard className='my-5 bg-glass max-width-card' style={{ width: '100%', maxWidth: '1200px', borderRadius: '38px' }}>
      <h2 style={{ marginTop: '15px', marginLeft: '50px', marginBottom: '-22px',         fontFamily: 'FiraSans-SemiBold, sans-serif' 
 }}>Gerenciamento de Usuários</h2>
      <MDBCardBody className='p-5'>
          <MDBRow>
          <QuadroLista
              usuarios={usuarios}
              activeTab={activeTab}
              selectedUser={selectedUser}
              handleUserClick={handleUserClick}
              setActiveTab={setActiveTab}
            />

          <QuadroFicha 
          selectedUser={selectedUser} 
          />

          </MDBRow>
        </MDBCardBody>
      </MDBCard>
      <ToastContainer />
    </MDBContainer>
  );
}

export default HomeAdm;