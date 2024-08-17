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
    username: '',
    senha: ''
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
      const response = await axios.patch(`${AxiosURL}/usuarios/criar_usuario/`, {
        username: formData.username,
        password: formData.senha,
        first_name: formData.nome,
        last_name: formData.sobrenome,
        email: formData.email,
        groups: [cargoMap[selectedCargo]],
      });
      if (response.status === 204) {
      toast.success(response.data.message);

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
            <MDBModalTitle>Novo Usuário</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={handleClose}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>
            <div style={{ marginBottom: '15px' }}>
              <MDBInput label="Nome" id="nome" type="text" onChange={handleChange} />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <MDBInput label="Sobrenome" id="sobrenome" type="text" onChange={handleChange} />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <MDBInput label="Email" id="email" type="text" onChange={handleChange} />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <MDBInput label="Username" id="username" type="text" onChange={handleChange} />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <MDBInput label="Senha" id="senha" type="password" onChange={handleChange} />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <MDBDropdown>
                <MDBDropdownToggle style={{ width: '100%' }}>{selectedCargo}</MDBDropdownToggle>
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
            <MDBBtn onClick={CriarUsuario}>Criar</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
      <ToastContainer />
    </MDBModal>
  );
}

function QuadroLista({ usuarios, activeTab, selectedUser, handleUserClick, setActiveTab }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5); // Quantidade de usuários por página
  const [searchTerm, setSearchTerm] = useState(''); // Estado para o termo de pesquisa

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentUsers = usuarios.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const searchedUsuarios = usuarios.filter(usuario => {
    return usuario.first_name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const currentUsuarios = searchedUsuarios.slice(indexOfFirstPost, indexOfLastPost);

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
        {/* Conteúdo */}
        <MDBCardBody
          className="d-flex flex-column"
          style={{ flex: '1 1 auto', minHeight: '0' }}
        >          {/* Cabeçalho */}
          <div className="d-flex align-items-center mb-2" style={{ marginTop: '0px' }}>
            
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
  const [selectedLeito, setSelectedLeito] = useState(null);

  const handleSelectLeito = (index) => {
    setSelectedLeito(index + 1);
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
                <MDBInput label="E-mail" id="email" className="mb-3" value={selectedUser.email} />
                <hr style={{ margin: '20px 0' }} />
                <h4>Alterar Senha</h4>
                <MDBInput label="Senha Atual" id="senha" className="mb-2"/>
                <MDBInput label="Nova Senha" id="senha" className="mb-2"/>
                <MDBInput label="Confirmar Nova Senha" id="senha" className="mb-2"/>
              </div>
            </MDBRow>
          </MDBCardBody>
  
          {/* Botões */}
  
          <div style={{ padding: '20px', marginTop: '10px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,.125)' }}>
            <div>
              <MDBBtn style={{ marginLeft: '10px' }} color='danger' >DESATIVAR USUÁRIO</MDBBtn>
            </div>
            <div>
              <MDBBtn style={{ marginLeft: '10px' }}>SALVAR ALTERAÇÕES</MDBBtn>
            </div>
          </div>
        </MDBCard>
      )}
      {!selectedUser && (
        <div className="text-center d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
          <p style={{ fontSize: '1.5rem' }}>Selecione um Usuário</p>
        </div>
      )}
    </MDBCol>
  )
  
}

function HomeAdm() {
  const [usuarios, setUsuarios] = useState([]);
  const [activeTab, setActiveTab] = useState('pendentes');
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
      <h2 style={{ marginTop: '15px', marginLeft: '50px', marginBottom: '-22px' }}>Gerenciamento de Usuários</h2>
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

    </MDBContainer>
  );
}

export default HomeAdm;