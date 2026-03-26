import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Navbar.css';

function Navbar() {
    const { student, logout } = useAuth();
    const navigate = useNavigate();

    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setShowDropdown(false);
            return;
        }

        const timeout = setTimeout(() => {
            api.get(`/estudiante/search?q=${query}`)
                .then(res => {
                    setResults(res.data);
                    setShowDropdown(true);
                })
                .catch(err => console.error('Error en búsqueda:', err));
        }, 300); // para que no busque a medias

        return () => clearTimeout(timeout);
    }, [query]);

    // Para que se cierre el dropdown
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (id) => {
        setQuery('');
        setResults([]);
        setShowDropdown(false);
        navigate(`/profile/${id}`);
    };



    const handleLogout = () => {
        logout();
        navigate('/');
    };




    return (
        <nav className="navbar sticky-top" >
            <div className="navbar-brand">
                <Link to="/feed">FIUSAC</Link>
            </div>

            {/* para la barra de búsqueda */}
            <div className="navbar-search" ref={searchRef}>
                <input
                    type="text"
                    placeholder="Buscar estudiante..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                />
                {showDropdown && results.length > 0 && (
                    <div className="search-dropdown">
                        {results.map(s => (
                            <div
                                key={s.id}
                                className="search-result"
                                onClick={() => handleSelect(s.id)}
                            >
                                <span className="search-result-name">
                                    {s.nombres} {s.apellidos}
                                </span>
                                <small>ID: {s.id}</small>
                            </div>
                        ))}
                    </div>
                )}
                {showDropdown && results.length === 0 && (
                    <div className="search-dropdown">
                        <p className="search-no-results">No se encontraron resultados.</p>
                    </div>
                )}
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