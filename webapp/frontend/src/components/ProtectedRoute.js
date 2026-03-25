import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { student } = useAuth();

  if (!student) {
    return <Navigate to="/" replace />; // manda al login
  }

  return children;
}

export default ProtectedRoute;