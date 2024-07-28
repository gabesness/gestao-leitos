import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBIcon,
  MDBCollapse,
  MDBDropdown,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBDropdownItem
} from 'mdb-react-ui-kit';

export default function Navbar() {
  const [openNavSecond, setOpenNavSecond] = useState(false);
  const [nome, setNome] = useState('');
  const location = useLocation(); // Use the useLocation hook
  const permittedRoles = ['Administrador', 'Médico', 'Regulação', 'Farmácia'];

  useEffect(() => {
    const nomeArmazenado = localStorage.getItem('nome');
    if (nomeArmazenado) {
      setNome(nomeArmazenado);
    }
  }, []);

  const handleMinhaContaClick = () => {
    window.location.href = '/minhaconta';
  };

  const handleKanbanClick = () => {
    window.location.href = '/kanban';
  };

  const handlePacientesClick = () => {
    window.location.href = '/pacientes';
  };

  const handleDashboardClick = () => {
    window.location.href = '/dashboard';
  };

  const handleHomeClick = () => {
    const cargo = localStorage.getItem('cargo');
    if (permittedRoles.includes(cargo)) {
      switch (cargo) {
        case 'Administrador':
          window.location.href = '/homeadm';
          break;
        case 'Médico':
          window.location.href = '/homemedico';
          break;
        case 'Regulação':
          window.location.href = '/homeregulacao';
          break;
        case 'Farmácia':
          window.location.href = '/homefarmacia';
          break;
        default:
          window.location.href = '/';
          break;
      }
    } else {
      window.location.href = '/';
    }
  };

  const isHomePage = location.pathname === '/';


  const handleSignOutClick = async () => {
    try {
      const response = await axios.post('http://18.230.66.70:8000/usuarios/logout/');
      if (response.status === 200) {
        localStorage.clear();
        window.location.href = '/'; 
      } else {
        console.error('Erro ao fazer logout:', response);
        // Tratar o erro ou exibir mensagem de erro, se necessário
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Tratar o erro ou exibir mensagem de erro, se necessário
    }
  };


  return (
    <MDBNavbar expand='lg' light bgColor='light'>
      <MDBContainer fluid>
      <MDBNavbarBrand href='#'>Sistema</MDBNavbarBrand>
        {!isHomePage && (
          <>
            <MDBNavbarToggler
              aria-expanded='false'
              aria-label='Toggle navigation'
              onClick={() => setOpenNavSecond(!openNavSecond)}
            >
              <MDBIcon icon='bars' fas />
            </MDBNavbarToggler>
            <MDBCollapse navbar show={openNavSecond}>
              <MDBNavbarNav>
                {permittedRoles.includes(localStorage.getItem('cargo')) && (
                  <MDBNavbarLink
                    href='#'
                    onClick={handleHomeClick}
                    className={location.pathname.includes('/home') ? 'active' : ''}
                  >
                    <MDBIcon icon='home' fas style={{ fontSize: '1.2rem' }} />
                  </MDBNavbarLink>
                )}

                <MDBNavbarLink
                  href='#'
                  onClick={handleKanbanClick}
                  className={location.pathname === '/kanban' ? 'active' : ''}
                >
                  <MDBIcon icon='columns' fas style={{ fontSize: '1.2rem' }} />
                </MDBNavbarLink>

                <MDBNavbarLink
                  href='#'
                  onClick={handlePacientesClick}
                  className={location.pathname === '/pacientes' ? 'active' : ''}
                >
                  <MDBIcon icon="user-friends" fas style={{ fontSize: '1.2rem' }} />
                </MDBNavbarLink>

                <MDBNavbarLink
                  href='#'
                  onClick={handleDashboardClick}
                  className={location.pathname === '/dashboard' ? 'active' : ''}
                >
                  <MDBIcon icon='chart-area' fas style={{ fontSize: '1.2rem' }} />
                </MDBNavbarLink>
              </MDBNavbarNav>

              <div className="ms-auto d-flex align-items-center">
                <MDBNavbarNav right className="d-flex align-items-center">
                  <span style={{ fontSize: '1.2rem', marginRight: '5px' }}>{nome}</span>
                  <MDBNavbarLink
                    style={{ cursor: 'pointer' }}
                    onClick={handleMinhaContaClick}
                  >
                    <MDBIcon
                      icon='user-circle'
                      fas
                      style={{ fontSize: '1.5rem' }}
                    />
                  </MDBNavbarLink>
                  <MDBNavbarLink
                    style={{ cursor: 'pointer' }}
                    onClick={handleSignOutClick}
                  >
                    <MDBIcon
                      icon='sign-out-alt'
                      fas
                      style={{ fontSize: '1.2rem' }}
                    />
                  </MDBNavbarLink>
                </MDBNavbarNav>
              </div>
            </MDBCollapse>
          </>
        )}
      </MDBContainer>
    </MDBNavbar>
  );
}
