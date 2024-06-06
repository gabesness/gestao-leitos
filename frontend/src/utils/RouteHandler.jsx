import { React } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from '../pages/Login/Login';
import AlterarSenha from '../pages/AlterarSenha/AlterarSenha';
import EsqueceuSenha from '../pages/EsqueceuSenha/EsqueceuSenha';
import HomeMedico from '../pages/HomeMedico/HomeMedico';
import HomeFarmacia from '../pages/HomeFarmacia/HomeFarmacia';
import HomeRegulacao from '../pages/HomeRegulacao/HomeRegulacao';
import HomeAdm from '../pages/HomeAdm/HomeAdm';
import Kanban from '../pages/Kanban/Kanban';
import Pacientes from '../pages/Pacientes/Pacientes';
import MinhaConta from '../pages/MinhaConta/MinhaConta';

function RouteHandler() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/AlterarSenha" element={<AlterarSenha />} />
      <Route path="/EsqueceuSenha" element={<EsqueceuSenha />} />
      <Route path="/HomeMedico" element={<HomeMedico />} />
      <Route path="/HomeFarmacia" element={<HomeFarmacia />} />
      <Route path="/HomeRegulacao" element={<HomeRegulacao />} />
      <Route path="/HomeAdm" element={<HomeAdm />} />
      <Route path="/Kanban" element={<Kanban />} />
      <Route path="/Pacientes" element={<Pacientes />} />
      <Route path="/MinhaConta" element={<MinhaConta />} />
    </Routes>
  );
}

export default RouteHandler;