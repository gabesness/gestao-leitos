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

function QuadroFicha({ username, 
  firstName, 
  lastName, 
  email, 
  setFirstName, 
  setLastName, 
  setEmail, 
  EditarUsuario,  
  senhaAtual,
  senhaNova,
  senhaNova2,
  setSenhaAtual,
  setSenhaNova,
  setSenhaNova2,
  AlterarSenha  }) {
  return (
    <MDBCard style={{ borderRadius: '20px', width: '100%', maxWidth: '600px' }}>
      <CabecalhoMeuUsuario username={username} firstName={firstName} lastName={lastName} />
      <MDBCardBody style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ flex: 1, paddingRight: '10px' }}>
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
          <div style={{ flex: 1, paddingLeft: '10px' }}>
            <h4>Alterar a Senha</h4>
            <MDBInput 
              label="Senha Atual" 
              type='password'
              id="SenhaAtual" 
              className="mb-3" 
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
            />
            <MDBInput 
              label="Nova Senha"
              type='password'
              id="NovaSenha" 
              className="mb-3" 
              value={senhaNova}
              onChange={(e) => setSenhaNova(e.target.value)}
            />
            <MDBInput 
              label="Confirmar Nova Senha" 
              type='password'
              id="ConfirmarNovaSenha" 
              className="mb-3" 
              value={senhaNova2}
              onChange={(e) => setSenhaNova2(e.target.value)}
            />
          </div>
        </div>
        <div style={{ padding: '20px', marginTop: '10px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,.125)' }}>
          <MDBBtn onClick={EditarUsuario}>SALVAR ALTERAÇÕES</MDBBtn>
          <MDBBtn onClick={AlterarSenha}>ALTERAR SENHA</MDBBtn>
        </div>
      </MDBCardBody>
    </MDBCard>
  );
}

function MinhaConta() {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [senhaNova, setSenhaNova] = useState('');
  const [senhaNova2, setSenhaNova2] = useState('');
  const idUser = localStorage.getItem('idUser');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${AxiosURL}/usuarios/${idUser}/info/`);
        const userData = response.data;
        console.log('Dados do usuário:', userData);
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


  const AlterarSenha = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.patch(`${AxiosURL}/usuarios/${idUser}/alterar_senha/`, {
        senha_atual: senhaAtual,
        nova_senha: senhaNova,
        nova_senha2: senhaNova2
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
    <MDBContainer fluid className='p-1 background-radial-gradient overflow-hidden d-flex justify-content-center' style={{ minHeight: '88vh' }}>
      <MDBCard className='my-5 bg-glass max-width-card' style={{ width: '100%', maxWidth: '1200px', borderRadius: '38px' }}>
        <h2 style={{ marginTop: '15px', marginLeft: '50px', marginBottom: '-22px' }}>Minha Conta</h2>
        <MDBCardBody className='p-5'>
          <div className="d-flex justify-content-center">
            <QuadroFicha
              username={username}
              firstName={firstName}
              lastName={lastName}
              email={email}
              setFirstName={setFirstName}
              setLastName={setLastName}
              setEmail={setEmail}
              EditarUsuario={EditarUsuario}
              senhaAtual={senhaAtual}
              senhaNova={senhaNova}
              senhaNova2={senhaNova2}
              setSenhaAtual={setSenhaAtual}
              setSenhaNova={setSenhaNova}
              setSenhaNova2={setSenhaNova2}
              AlterarSenha={AlterarSenha}
            />
          </div>
        </MDBCardBody>
      </MDBCard>
      <ToastContainer />
    </MDBContainer>
  );
}

export default MinhaConta;
