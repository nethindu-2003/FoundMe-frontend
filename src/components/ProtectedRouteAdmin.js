import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRouteAdmin = ({ children }) => {
  const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';

  return isAdminLoggedIn ? children : <Navigate to="/adminlogin" replace />;
};

export default ProtectedRouteAdmin;
