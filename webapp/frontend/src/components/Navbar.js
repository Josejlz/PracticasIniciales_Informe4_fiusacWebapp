import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { student, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar sticky-top" >
      <div className="navbar-brand">
        <Link to="/feed">MyApp</Link>
      </div>
      <div className="navbar-links">
        <Link to="/feed">Feed</Link>
        <Link to="/profile">Perfil</Link>
      </div>
      <div className="navbar-user">
        {student && <span>Hola, {student.nombres}</span>}
        <button onClick={handleLogout}>Cerrar sesión</button>
      </div>
    </nav>
  );
}

export default Navbar;