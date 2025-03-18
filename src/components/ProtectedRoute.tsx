import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-white text-center mt-10">Loading...</div>; // Show a loading indicator
  }

  if (!user) {
    return <Navigate to="/tools" replace />;
  }

  return children;
};

export default ProtectedRoute;