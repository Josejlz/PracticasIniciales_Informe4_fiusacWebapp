import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Profile.css';

function Profile() {
    const { id } = useParams();                  // id del url
    const { student } = useAuth();               // por si estaba logueado
    const navigate = useNavigate();

    const [perfil, setPerfil] = useState(null);
    const [cursos, setCursos] = useState([]);    // cursos disponibles
    const [cursoId, setCursoId] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);

    // ternario para el id del usuario, dependiendo del perfil en el que se está    
    const profileId = id || student?.id;
    const isOwnProfile = student?.id === Number(profileId);

    useEffect(() => {
        if (!profileId) {
            navigate('/');
            return;
        }

        Promise.all([
            api.get(`/estudiante/${profileId}`),
            api.get('/curso/cursos')
        ])
            .then(([perfilRes, cursosRes]) => {
                setPerfil(perfilRes.data);
                setCursos(cursosRes.data);
            })
            .catch(err => {
                setError('No se pudo cargar el perfil.');
                console.error(err);
            })
            .finally(() => setLoading(false));
    }, [profileId]);

    const handleAddCurso = async () => {
        if (!cursoId) return;
        setError('');
        setSuccess('');

        try {
            await api.post(`/estudiante/${profileId}/curso`, { cursoId: Number(cursoId) });
            // refresca si se agrega un curso nuevo
            const res = await api.get(`/estudiante/${profileId}`);
            setPerfil(res.data);
            setSuccess('Curso agregado exitosamente.');
            setCursoId('');
        } catch (err) {
            setError('Error al agregar el curso.');
            console.error(err);
        }
    };

    if (loading) return <div className="profile-page"><Navbar /><p className="profile-loading">Cargando perfil...</p></div>;
    if (!perfil)  return <div className="profile-page"><Navbar /><p className="profile-loading">Estudiante no encontrado.</p></div>;

    // Cursos a los que no se ha inscrito uno
    const cursosDisponibles = cursos.filter(
        c => !perfil.estudiante_curso.some(ec => ec.curso.id === c.id)
    );

    return (
        <div className="profile-page">
            <Navbar />
            <div className="profile-content">

                {/* info del estudiante */}
                <div className="profile-card">
                    <div className="profile-avatar">
                        {perfil.nombres.charAt(0)}{perfil.apellidos.charAt(0)}
                    </div>
                    <div className="profile-info">
                        <h2>{perfil.nombres} {perfil.apellidos}</h2>
                        <p>{perfil.email}</p>
                        <small>ID: {perfil.id}</small>
                    </div>
                </div>

                {/* cursos aprovados */}
                <div className="profile-section">
                    <h3>Cursos aprobados</h3>
                    {perfil.estudiante_curso.length > 0
                        ? <ul className="curso-list">
                            {perfil.estudiante_curso.map(ec => (
                                <li key={ec.curso.id} className="curso-item">
                                    {ec.curso.nombre}
                                </li>
                            ))}
                        </ul>
                        : <p className="profile-empty">No hay cursos aprobados registrados.</p>
                    }
                </div>

                {/* Visibilidad de la sección para ver cursos, dependiendo de si se esta en un nuevo perfil. */}
                {isOwnProfile && (
                    <div className="profile-section">
                        <h3>Agregar curso aprobado</h3>
                        {error   && <p className="profile-error">{error}</p>}
                        {success && <p className="profile-success">{success}</p>}
                        {cursosDisponibles.length > 0
                            ? <div className="add-curso-box">
                                <select
                                    value={cursoId}
                                    onChange={e => setCursoId(e.target.value)}
                                >
                                    <option value="">Selecciona un curso...</option>
                                    {cursosDisponibles.map(c => (
                                        <option key={c.id} value={c.id}>{c.nombre}</option>
                                    ))}
                                </select>
                                <button onClick={handleAddCurso}>Agregar</button>
                            </div>
                            : <p className="profile-empty">Ya tienes todos los cursos agregados.</p>
                        }
                    </div>
                )}

            </div>
        </div>
    );
}

export default Profile;