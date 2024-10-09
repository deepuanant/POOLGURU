import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Private = () => {
  const user = useSelector((state) => state.user);

  if (!user || !user.email) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default Private;