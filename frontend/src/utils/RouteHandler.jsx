import { React } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from '../pages/Login/Login';
import AlterarSenha from '../pages/AlterarSenha/AlterarSenha';
import EsqueceuSenha from '../pages/EsqueceuSenha/EsqueceuSenha';
import HomeMedico from '../pages/HomeMedico/HomeMedico';
import Kanban from '../pages/Kanban/Kanban';

function RouteHandler() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/AlterarSenha" element={<AlterarSenha />} />
      <Route path="/EsqueceuSenha" element={<EsqueceuSenha />} />
      <Route path="/HomeMedico" element={<HomeMedico />} />
      <Route path="/Kanban" element={<Kanban />} />
    </Routes>
  );
}

export default RouteHandler;