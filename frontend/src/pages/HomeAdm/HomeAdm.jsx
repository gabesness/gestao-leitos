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
        <MDBCardBody className="d-flex flex-column" style={{ flex: '1 1 auto', minHeight: '0' }}>
          {/* Cabeçalho */}
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
            className="flex-grow-1 mb-3"
            style={{ height: '32px' }}
          />
  
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
      <h2 style={{ marginTop: '10px', marginLeft: '10px', marginBottom: '-8px' }}>Gerenciamento de Usuários</h2>
      <hr style={{ marginBottom: '10px' }} />
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