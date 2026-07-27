import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Optional: We can do role-based route protection here later if needed
  // For now, if they are authenticated, let them access the route they requested.
  // The sidebar will naturally restrict their navigation visually.

  return <>{children}</>;
};
