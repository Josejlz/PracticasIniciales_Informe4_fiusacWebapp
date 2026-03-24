import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/auth/login', { email, password });
            login(res.data.estudiante); // guardar al estudiante
            navigate('/feed');           // pa redirigir al login
        } catch (err) {
            setError('Email o contraseña incorrectos');
        }
    };

    return (
        <div className="login-body"> 


            <div className="login-container">
                <h2>Iniciar Sesión</h2>
                <form onSubmit={handleSubmit}>

                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>



                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <button type="submit">Entrar</button>
                </form>
                <p>¿No tienes cuenta? <Link to="/register">Regístrate</Link></p>
            </div>

        </div>
    );
}

export default Login;