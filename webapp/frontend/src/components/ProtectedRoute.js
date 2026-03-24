import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { student } = useAuth();

  if (!student) {
    return <Navigate to="/" replace />; // redirect to login if not logged in
  }

  return children;
}

export default ProtectedRoute;