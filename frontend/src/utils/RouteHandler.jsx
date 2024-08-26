import { React } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from '../pages/Login/Login';
import AlterarSenha from '../pages/AlterarSenha/AlterarSenha';
import EsqueceuSenha from '../pages/EsqueceuSenha/EsqueceuSenha';
import RecuperarSenha from '../pages/EsqueceuSenha/RecuperarSenha';
import HomeMedico from '../pages/HomeMedico/HomeMedico';
import HomeFarmacia from '../pages/HomeFarmacia/HomeFarmacia';
import HomeRegulacao from '../pages/HomeRegulacao/HomeRegulacao';
import HomeAdm from '../pages/HomeAdm/HomeAdm';
import Kanban from '../pages/Kanban/Kanban';
import Pacientes from '../pages/Pacientes/Pacientes';
import MinhaConta from '../pages/MinhaConta/MinhaConta';
import Dashboard from '../pages/Dashboard/Dashboard';
import SemAutorizacao from '../pages/SemAutorizacao/SemAutorizacao';
import PrivateRoute from './PrivateRoute';


function RouteHandler() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/AlterarSenha" element={<AlterarSenha />} />
      <Route path="/EsqueceuSenha" element={<EsqueceuSenha />} />
      <Route path="/RecuperarSenha" element={<RecuperarSenha />} />
      <Route path="/HomeAdm" element={<PrivateRoute element={<HomeAdm />} allowedRoles={['Administrador']} />} />
      <Route path="/HomeMedico" element={<PrivateRoute element={<HomeMedico />} allowedRoles={['Médico']} />} />
      <Route path="/HomeFarmacia" element={<PrivateRoute element={<HomeFarmacia />} allowedRoles={['Farmácia']} />} />
      <Route path="/HomeRegulacao" element={<PrivateRoute element={<HomeRegulacao />} allowedRoles={['Regulação']} />} />
      <Route path="/Kanban" element={<Kanban />} />
      <Route path="/SemAutorizacao" element={<SemAutorizacao />} />
      <Route path="/Pacientes" element={<Pacientes />} />
      <Route path="/MinhaConta" element={<PrivateRoute element={<MinhaConta />} allowedRoles={['Administrador', 'Médico', 'Farmácia', 'Regulação', 'Recepção']} />} />
      <Route path="/Dashboard" element={<Dashboard />} />

    </Routes>
  );
}

export default RouteHandler;