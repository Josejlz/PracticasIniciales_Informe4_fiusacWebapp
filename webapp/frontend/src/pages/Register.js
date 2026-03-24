import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import './Register.css';

function Register() {
    const [form, setForm] = useState({
        id: '', nombres: '', apellidos: '', email: '', password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/auth/registrar', form);
            setSuccess('¡Cuenta creada! Redirigiendo...');
            setTimeout(() => navigate('/'), 2000); // go to login after 2 seconds
        } catch (err) {

            const idInput = document.getElementById('idInput');
            const nombresInput = document.getElementById('nombresInput');
            const apellidosInput = document.getElementById('apellidosInput');
            const emailInput = document.getElementById('emailInput');
            const passwordInput = document.getElementById('passwordInput');

            idInput.value = '';
            nombresInput.value = '';
            apellidosInput.value = '';
            emailInput.value = '';
            passwordInput.value = '';

            setError('Error al registrar. Intenta de nuevo.');

        }
    };

    return (

        <div className="register-body">

            <div className="container">
                <h2>Crear Cuenta</h2>
                <form onSubmit={handleSubmit}>

                    <div>
                        <input name="id" id="idInput" placeholder="ID" value={form.id} onChange={handleChange} required />
                    </div>

                    <div>
                        <input name="nombres" id="nombresInput" placeholder="Nombres" value={form.nombres} onChange={handleChange} required />
                    </div>

                    <div>
                        <input name="apellidos" id="apellidosInput" placeholder="Apellidos" value={form.apellidos} onChange={handleChange} required />
                    </div>

                    <div>
                        <input name="email" id="emailInput" placeholder="Email" type="email" value={form.email} onChange={handleChange} required />
                    </div>

                    <div>
                        <input name="password" id="passwordInput" placeholder="Contraseña" type="password" value={form.password} onChange={handleChange} required />
                    </div>




                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {success && <p style={{ color: 'green' }}>{success}</p>}
                    <button type="submit">Registrarse</button>
                </form>
                <p>¿Ya tienes cuenta? <Link to="/">Inicia sesión</Link></p>
            </div>

        </div>
    );
}

export default Register;