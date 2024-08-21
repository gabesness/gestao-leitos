import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ element, allowedRoles }) => {
  const cargo = localStorage.getItem('cargo');
  const location = useLocation();

  if (!allowedRoles.includes(cargo)) {
    return <Navigate to="/SemAutorizacao" state={{ from: location }} />;
  }

  return element;
};

export default PrivateRoute;
