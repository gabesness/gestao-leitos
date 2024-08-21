import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
} from 'mdb-react-ui-kit';
import './MinhaConta.css';
import CabecalhoMeuUsuario from '../../components/Ficha/CabecalhoMeuUsuario';
import { ToastContainer, toast } from 'react-toastify';
import { AxiosURL } from '../../axios/Config';

function QuadroFicha() {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const idUser = localStorage.getItem('idUser');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${AxiosURL}/usuarios/${idUser}/info/`);
        const userData = response.data;
        console.log('Dados do usuário:', userData);
        // Atualiza os estados com as informações recebidas
        setUsername(userData.username || '');
        setFirstName(userData.first_name || '');
        setLastName(userData.last_name || '');
        setEmail(userData.email || '');
      } catch (error) {
        console.error("Erro ao buscar informações:", error);
      }
    };

    if (idUser) {
      fetchUser();
    }
  }, [idUser]);

  const EditarUsuario = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.patch(`${AxiosURL}/usuarios/${idUser}/editar_usuario/`, {
        first_name: firstName,
        last_name: lastName,
        email: email,
      });

      if (response.status === 200) {
        toast.success(response.data.message);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
      toast.error(error.response?.data?.erro || 'Erro desconhecido');
    }
  };

  return (
    <MDBCard style={{ borderRadius: '20px', width: '100%', maxWidth: '600px' }}>
      <CabecalhoMeuUsuario />
      <MDBCardBody style={{ padding: '20px' }}>
        <div className="col-md-6">
          <h4>Informações do Usuário</h4>
          <MDBInput
            label="Nome"
            id="nome"
            className="mb-3"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <MDBInput
            label="Sobrenome"
            id="sobrenome"
            className="mb-3"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <MDBInput
            label="E-mail"
            id="email"
            className="mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <div>
            <h4>Alterar a Senha</h4>
            <MDBInput label="Senha Atual" id="SenhaAtual" style={{ marginBottom: '20px' }} />
            <MDBInput label="Nova Senha" id="NovaSenha" style={{ marginBottom: '20px' }} />
            <MDBInput label="Confirmar Nova Senha" id="ConfirmarNovaSenha" style={{ marginBottom: '20px' }} />
          </div>
        </div>
        <div style={{ padding: '20px', marginTop: '10px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,.125)' }}>
          <div>
            <MDBBtn style={{ marginLeft: '10px' }} onClick={EditarUsuario}>SALVAR ALTERAÇÕES</MDBBtn>
          </div>
        </div>
      </MDBCardBody>
    </MDBCard>
  );
}

function MinhaConta() {  
  return (
    <MDBContainer fluid className='p-1 background-radial-gradient overflow-hidden d-flex justify-content-center' style={{ minHeight: '88vh' }}>
      <MDBCard className='my-5 bg-glass max-width-card' style={{ width: '100%', maxWidth: '1200px', borderRadius: '38px' }}>
        <h2 style={{ marginTop: '15px', marginLeft: '50px', marginBottom: '-22px' }}>Minha Conta</h2>
        <MDBCardBody className='p-5'>
          <div className="d-flex justify-content-center">
            <QuadroFicha />
          </div>
        </MDBCardBody>
      </MDBCard>
      <ToastContainer />
    </MDBContainer>
  );
}

export default MinhaConta;
