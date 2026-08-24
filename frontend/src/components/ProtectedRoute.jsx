import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireAdmin }) {
  const { user } = useContext(AuthContext);

  // If there is no user logged in at all, send them to the home page
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If the route requires an Admin, but the user is NOT an admin, kick them out
  if (requireAdmin && !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  // If they pass the checks, render the page!
  return children;
}