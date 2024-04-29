import { React } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from '../pages/Login/Login';

function RouteHandler() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
    </Routes>
  );
}

export default RouteHandler;